import os, re, json
from pathlib import Path
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from langchain.document_loaders import DirectoryLoader, UnstructuredMarkdownLoader
from langchain.text_splitter  import RecursiveCharacterTextSplitter
from langchain_ollama.embeddings import OllamaEmbeddings
from langchain.vectorstores import Chroma

from langchain.output_parsers import StructuredOutputParser, ResponseSchema
from langchain_ollama.llms import OllamaLLM
from langchain.chains import RetrievalQA
from langchain.prompts import (
    ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate
)

# ── config ────────────────────────────────────────────────────────────────
BASE_URL        = "192.168.86.9"
PERSIST_DIR     = "chroma_db"
COLLECTION_NAME = "avax_docs"
DOCS_PATH       = Path("embeddings/raw")

# ── FastAPI app ────────────────────────────────────────────────────────────
app = FastAPI(title="Avalanche-GPT backend")

class ChatRequest(BaseModel):
    chat_history: str
    user_config:  dict
    question:     str

# Global objects filled at startup
vectordb = qa_chain = parser = None           # type: ignore

# ── startup: build vector store + chain once ───────────────────────────────
@app.on_event("startup")
def build_chain() -> None:
    global vectordb, qa_chain, parser

    # 1. Load & clean docs
    loader = DirectoryLoader(str(DOCS_PATH), glob="**/*.md*", loader_cls=UnstructuredMarkdownLoader)
    raw_docs = loader.load()
    clean_docs = []
    for d in raw_docs:
        text = re.sub(r"!\[.*?\]\(.*?\)", "", d.page_content)
        text = re.sub(r"^---.*?---\s*", "", text, flags=re.S)
        clean_docs.append(d.copy(update={"page_content": text}))

    docs = RecursiveCharacterTextSplitter(chunk_size=1500, chunk_overlap=200)\
           .split_documents(clean_docs)

    # 2. Embeddings + Chroma (idempotent)
    embeddings = OllamaEmbeddings(model="nomic-embed-text:v1.5", base_url=BASE_URL)
    vectordb   = Chroma(collection_name=COLLECTION_NAME,
                        embedding_function=embeddings,
                        persist_directory=PERSIST_DIR)
    if not os.path.exists(PERSIST_DIR):
        vectordb.add_documents(docs)
        vectordb.persist()

    # 3. Structured-output parser
    schemas = [
        ResponseSchema(name="reply",  description="Conversational answer."),
        ResponseSchema(name="update", description="JSON merge-patch for the config (empty if none)."),
    ]
    parser = StructuredOutputParser.from_response_schemas(schemas)
    fmt    = parser.get_format_instructions()

    # 4. Prompt templates
    json_structure = "<your subnet-config schema here>"
    system_msg = SystemMessagePromptTemplate.from_template(
        "You are Avalanche-GPT. Return ONLY JSON with keys `reply` and `update`.\n"
        "Allowed fields/types:\n{json_structure}\n\n{format_instructions}"
    )
    human_msg  = HumanMessagePromptTemplate.from_template(
        "Context:\n{context}\n\n-----\n{question}"
    )
    prompt = (ChatPromptTemplate.from_messages([system_msg, human_msg])
              .partial(json_structure=json_structure, format_instructions=fmt))

    # 5. LLM + RetrievalQA chain
    llm = OllamaLLM(model="qwen2.5-coder:3b-instruct-q8_0",
                    temperature=0.2,
                    base_url=BASE_URL,
                    num_ctx=16384)
    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=vectordb.as_retriever(search_kwargs={"k": 4}),
        return_source_documents=False,
        chain_type_kwargs={"prompt": prompt},
    )

# ── POST /chat ─────────────────────────────────────────────────────────────
@app.post("/chat")
def chat(req: ChatRequest):
    global qa_chain, parser
    if qa_chain is None:
        raise HTTPException(503, detail="LLM pipeline not ready")

    # Compose the single string RetrievalQA expects
    query = (
        f"Previous chat history:\n{req.chat_history}\n\n"
        f"Current user config JSON:\n{json.dumps(req.user_config, indent=2)}\n\n"
        f"Current question:\n{req.question}"
    )

    try:
        llm_text = qa_chain.invoke({"query": query})["result"]
        result   = parser.parse(llm_text)
        return result                      # => {"reply": "...", "update": {...}}
    except Exception as e:
        raise HTTPException(500, detail=str(e))
