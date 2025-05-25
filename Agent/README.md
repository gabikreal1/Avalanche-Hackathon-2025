# Avalanche-GPT Backend

This folder contains the backend server for Avalanche-GPT, an assistant that answers developer questions about Avalanche infrastructure and helps them edit their configurations.

## Features

- Automatically builds and loads embeddings from documentation
- Vector-based information retrieval using Chroma DB
- Conversational AI using the Ollama API 
- FastAPI-based REST API for frontend integration

## Setup and Installation

### Environment Setup

1. Clone the repository
2. Create and activate a virtual environment:

```powershell
# Create a virtual environment
python -m venv venv

# Activate the virtual environment (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# Or for Windows Command Prompt
# .\venv\Scripts\activate.bat

# Or for Linux/Mac
# source venv/bin/activate
```

3. Install dependencies:

```powershell
pip install -r requirements.txt
```

### Documentation Files

Place all your Avalanche documentation Markdown files in the `embeddings/raw` folder. When you start the system it will:
- Automatically process these files
- Remove images and other non-text content
- Split them into chunks
- Create embeddings for efficient retrieval

### Running the Server

Start the server with:

```powershell
uvicorn app:app --host 0.0.0.0 --port 8000
```

This will:
1. Load all the documentation from `embeddings/raw` directory
2. Create embeddings if they don't already exist
3. Start the FastAPI server on port 8001

## Data Persistence

- Embeddings are stored in the `chroma_db` directory
- If embeddings already exist, they will be loaded automatically on startup
- To reset the embeddings, simply delete the `chroma_db` folder and restart the server

## API Usage

The server exposes a `/chat` endpoint that accepts POST requests with the following JSON structure:

```json
{
  "chat_history": "Previous conversation history",
  "user_config": {
    "key": "value"
  },
  "question": "User's current question"
}
```

The response will be a JSON object with two fields:
- `reply`: The conversational answer to the user's question
- `update`: A JSON merge-patch for the config (empty if no changes are needed)

## Development Notes

- The default Ollama base URL is set to `192.168.86.9`. You may need to update this in the code to match your environment.
- The project uses Python 3.11+
- To generate a comprehensive requirements file from your environment, run:

```powershell
pip freeze > requirements-full.txt
```