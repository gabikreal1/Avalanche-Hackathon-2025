# 🏔️ Avalanche Subnet Creator

An AI-powered platform for creating and managing Avalanche subnets and L1 blockchains. This project combines a modern web interface with an intelligent AI assistant that provides real-time guidance and configuration optimization.

![Avalanche Hackathon 2025](https://img.shields.io/badge/Avalanche-Hackathon%202025-red?style=for-the-badge&logo=avalanche)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Python](https://img.shields.io/badge/Python-3.8+-blue?style=for-the-badge&logo=python)

## 🎯 Project Overview

This hackathon project simplifies the complex process of creating Avalanche subnets and L1 blockchains by providing:

- **Intuitive Web Interface**: Step-by-step subnet creation workflow
- **AI-Powered Assistant**: Real-time guidance with Avalanche documentation knowledge
- **Smart Configuration**: Automated parameter validation and optimization
- **Core Wallet Integration**: Seamless blockchain interactions
- **Documentation Embeddings**: AI trained on comprehensive Avalanche docs

## 🏗️ Project Structure

```
Avalanche-Hackathon-2025/
├── avalanche-front/          # Next.js Frontend Application
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── contexts/         # State management
│   │   ├── lib/             # Utilities and API clients
│   │   └── types/           # TypeScript definitions
│   └── package.json
└── Agent/                   # AI Backend Service
    ├── app.py              # FastAPI server
    ├── embeddings/         # Documentation processing
    ├── chroma_db/          # Vector database
    └── requirements.txt
```

## 🌟 Key Features

### Frontend Application
- **Guided Workflow**: 5-step process for subnet creation
- **Real-time Validation**: Instant feedback on configuration parameters
- **Wallet Integration**: Core Wallet support for Avalanche networks
- **Configuration Management**: Save, load, and modify subnet settings
- **Interactive Chat**: AI assistant integrated into the interface

### AI Agent Backend
- **Documentation Embeddings**: Vector database of Avalanche documentation
- **Intelligent Responses**: Context-aware answers about subnet configuration
- **Configuration Optimization**: AI-powered parameter recommendations
- **Real-time Updates**: Dynamic form field updates based on AI suggestions
- **Conversation Memory**: Maintains context across chat sessions

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **Python** 3.8+
- **Core Wallet** browser extension
- **AVAX tokens** (testnet recommended for development)

### 1. Frontend Setup

```bash
cd avalanche-front

# Install dependencies
npm install

# Set up environment
cp environment.example.txt .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

### 2. AI Agent Setup

```bash
cd Agent

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Add Avalanche documentation to embeddings/raw/ folder

# Start the AI server
uvicorn app:app --host 0.0.0.0 --port 8000
```

The AI API will be available at `http://localhost:8000`

## 🤖 AI Agent Features

### Documentation Processing
- **Automatic Embedding Generation**: Processes Markdown documentation files
- **Vector Storage**: Uses ChromaDB for efficient similarity search
- **Content Chunking**: Optimizes text for better retrieval accuracy
- **Persistent Storage**: Embeddings are cached for faster startup

### Intelligent Assistance
- **Context-Aware Responses**: Understands subnet configuration context
- **Parameter Optimization**: Suggests optimal values based on use case
- **Error Resolution**: Helps troubleshoot configuration issues
- **Best Practices**: Provides Avalanche development guidance

### API Integration
```python
# Example API usage
import requests

payload = {
    "chat_history": "Previous conversation...",
    "user_config": {
        "gasLimit": 8000000,
        "feeConfig": {"minBaseFee": "25000000000"},
        # ... complete subnet configuration
    },
    "question": "How should I configure gas fees for a gaming L1?"
}

response = requests.post("http://localhost:8000/chat", json=payload)
data = response.json()

print("AI Response:", data["reply"])
print("Config Updates:", data["update"])
```

## 🛠️ Technology Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **wagmi + viem**: Ethereum/Avalanche wallet integration
- **React Context**: State management

### Backend
- **FastAPI**: High-performance Python API framework
- **ChromaDB**: Vector database for embeddings
- **Ollama**: Local LLM integration
- **Sentence Transformers**: Text embedding generation

### Blockchain
- **Avalanche**: Primary blockchain platform
- **Core Wallet**: Native Avalanche wallet
- **P-Chain & C-Chain**: Multi-chain operations

## 📋 Usage Workflow

### 1. Connect Wallet
- Install and set up Core Wallet
- Connect to Avalanche Fuji testnet
- Ensure sufficient AVAX balance

### 2. Configure Subnet
- Set basic parameters (chain ID, gas limits)
- Configure fee structure
- Set up access controls and permissions
- Define tokenomics

### 3. AI Assistance
- Ask questions about configuration
- Get optimization suggestions
- Receive real-time parameter updates
- Learn best practices

### 4. Deploy Subnet
- Review final configuration
- Execute blockchain transactions
- Monitor deployment status

## 🔧 Configuration

### Environment Variables

**Frontend (.env.local):**
```bash
NEXT_PUBLIC_AVALANCHE_RPC=https://api.avax-test.network/ext/bc/C/rpc
NEXT_PUBLIC_CHAT_API_URL=http://localhost:8000/chat
NEXT_PUBLIC_APP_NAME=Avalanche Subnet Creator
```

**Backend:**
- Place Avalanche documentation files in `Agent/embeddings/raw/`
- Configure Ollama endpoint in `app.py`
- Adjust embedding model settings as needed

## 🧪 Testing

### Frontend Testing
```bash
cd avalanche-front
npm run test
```

### Backend Testing
```bash
cd Agent
python -m pytest
```

### Integration Testing
- Visit `http://localhost:3000/test` for configuration testing
- Test chat integration with sample configurations
- Verify wallet connection and transaction flows

## 📚 API Documentation

### Chat Endpoint
```
POST /chat
Content-Type: application/json

{
  "chat_history": "string",
  "user_config": SubnetConfig,
  "question": "string"
}

Response:
{
  "reply": "string",
  "update": Partial<SubnetConfig>
}
```

### Configuration Structure
The system handles comprehensive subnet configurations including:
- Basic parameters (chain ID, gas limits)
- Fee configuration (base fees, gas costs)
- Access control lists (deployer, minter, transaction)
- Manager configurations (fee, reward)
- Token allocations

## 🚀 Deployment

### Frontend Deployment
```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

### Backend Deployment
```bash
# Install production dependencies
pip install -r requirements.txt

# Run with gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app:app
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Avalanche Team** for the comprehensive blockchain platform
- **Core Wallet** for seamless wallet integration
- **Ollama** for local LLM capabilities
- **ChromaDB** for efficient vector storage

## 📞 Support

- **Documentation**: [Avalanche Docs](https://docs.avax.network/)
- **Discord**: [Avalanche Community](https://chat.avax.network/)
- **GitHub Issues**: [Report bugs or request features](https://github.com/your-username/avalanche-front/issues)

---

**🏔️ Built for Avalanche Hackathon 2025**

*Democratizing L1 blockchain creation through AI-powered assistance and intuitive interfaces.*
