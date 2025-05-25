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
from langchain.output_parsers.fix import OutputFixingParser
from langchain_core.runnables import RunnableSequence   # correct path
from langchain.chat_models import ChatOpenAI

from langchain.prompts import (
    ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate
)
from fastapi.middleware.cors import CORSMiddleware

from langchain.output_parsers.fix import OutputFixingParser
from langchain.chains.llm import LLMChain

# ── config ────────────────────────────────────────────────────────────────
BASE_URL        = "192.168.86.9"
PERSIST_DIR     = "chroma_db"
COLLECTION_NAME = "avax_docs"
DOCS_PATH       = Path("embeddings/raw")

# ── FastAPI app ────────────────────────────────────────────────────────────
app = FastAPI(title="Avalanche-GPT backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],       # allow any origin
    allow_methods=["*"],       # allow all HTTP methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],       # allow any request headers
    allow_credentials=True,    # allow cookies/auth (optional)
)

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
    

    # 4. Prompt templates
    json_structure = '''{
        "subnetId":"string,
        "vmId": "string",
        "evmChainId": "number",
        "gasLimit": "number", 
        "targetBlockRate": "number",
        "tokenAllocations": [
            {
            "address": "string",
            "amount": "string"
            }
        ],
        "feeConfig": {
            "minBaseFee": "string",
            "baseFeeChangeDenominator": "number",
            "minBlockGasCost": "string", 
            "maxBlockGasCost": "string",
            "blockGasCostStep": "string",
            "targetGas": "string"
        },
        "contractDeployerAllowListConfig": {
            "enabled": "boolean",
            "admins": ["string"],
            "members": ["string"],
            "enabledAddresses": ["string"]
        },
        "contractNativeMinterConfig": {
            "enabled": "boolean", 
            "admins": ["string"],
            "members": ["string"],
            "enabledAddresses": ["string"],
        },
        "txAllowListConfig": {
            "enabled": "boolean",
            "admins": ["string"], 
            "members": ["string"],
            "enabledAddresses": ["string"]
        },
        "feeManagerEnabled": "boolean",
        "feeManagerAdmins": ["string"],
        "rewardManagerEnabled": "boolean", 
        "rewardManagerAdmins": ["string"]
        }'''
    system_msg = SystemMessagePromptTemplate.from_template(
        "You are Avalanche-GPT, an assistant that answers developer questions about Avalanche infrastructure "
        "and helps them edit their Avalanche network configuration.\n\n"
        "You output should be in JSON, 2 objects: 'reply' (a human-friendly answer) and 'update'"
        "(a JSON merge-patch for the config; empty object if no change is needed).\n\n"
        # "Allowed JSON fields/types:\n{json_structure}\n\n"
        '⚠️ OUTPUT FORMAT:\nRespond **only** with a JSON object containing reply and update like so {{ "reply": "Reply text", "update": "update JSON" }}.'

        "{format_instructions}"
    )
    human_msg  = HumanMessagePromptTemplate.from_template(
        "Context from docs:\n{context}\n"
        "Question:\n{question}"    # <-- must be {query}, not {question}
    )
    
    
    global base_parser
    base_parser = StructuredOutputParser.from_response_schemas(schemas)
    # llm = OllamaLLM(model="qwen2.5-coder:3b-instruct-q8_0",
    # llm = OllamaLLM(model="qwen3:14b-q4_K_M",
    #                 temperature=0.25,
    #                 base_url=BASE_URL,
    #                 num_ctx=16384)

    llm = ChatOpenAI(
        model_name="gpt-3.5-turbo",        # or any other supported model
        # temperature=0.25,
        openai_api_key="<your key>",
    )
    
    base_parser = StructuredOutputParser.from_response_schemas(schemas)
    fmt         = base_parser.get_format_instructions()
    prompt      = (ChatPromptTemplate.from_messages([system_msg, human_msg])
                .partial(json_structure=json_structure, format_instructions=fmt))
    llm         = OllamaLLM(model="qwen2.5-coder:3b-instruct-q8_0", base_url=BASE_URL, num_ctx=16384)
    qa_chain    = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=vectordb.as_retriever(search_kwargs={"k": 5}),
        return_source_documents=False,
        chain_type_kwargs={"prompt": prompt},
    )  



# ── POST /chat ─────────────────────────────────────────────────────────────
# ── POST /chat, now with manual retry loop ───────────────────────────────────
@app.post("/chat")
def chat(req: ChatRequest):
    if qa_chain is None:
        raise HTTPException(503, detail="LLM pipeline not ready")

    # Build the single query string
    query = (
        f"Previous chat history:\n{req.chat_history}\n\n"
        f"Current user config JSON:\n{json.dumps(req.user_config, indent=2)}\n\n"
        f"Current question:\n{req.question}"
    )

    raw = None
    result = None
    max_retries = 10

    for attempt in range(1, max_retries + 1):
        raw = qa_chain.invoke({"query": query})["result"]
        try:
            # Try to parse the LLM’s output
            result = base_parser.parse(raw)
            break  # success!
        except:
            raw = qa_chain.invoke({"query": query})["result"]

    return result  # {"reply": "...", "update": {...}}