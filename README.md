# 🏔️ Avalanche Subnet Creator

A modern, AI-powered web application for creating Avalanche subnets and L1 blockchains with **Core Wallet** integration and intelligent chat assistance.

![Avalanche Hackathon 2025](https://img.shields.io/badge/Avalanche-Hackathon%202025-red?style=for-the-badge&logo=avalanche)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

## 🌟 Features

### 🎯 Core Functionality
- **Multi-Chain Architecture**: Seamless P-Chain and C-Chain integration
- **AI-Powered Chat Assistant**: Real-time guidance with LLM integration
- **Split-Screen Interface**: Control panel + interactive chat
- **Core Wallet Integration**: Native Avalanche wallet support
- **Real-time Configuration**: Dynamic subnet parameter validation
- **Genesis Block Generation**: Automated blockchain configuration

### 🔗 Multi-Chain Support

**P-Chain (Platform Chain)**
- ✅ Subnet creation and management
- ✅ Validator registration and staking
- ✅ Network governance operations
- ✅ Address format: `P-avax1...` / `P-fuji1...`

**C-Chain (Contract Chain)**
- ✅ Smart contract deployment
- ✅ EVM-compatible operations
- ✅ Gas fee management
- ✅ Address format: `0x...`

## 🏗️ Architecture

### Split-Screen Design
```
┌─────────────────┬─────────────────────────────────┐
│   Control Panel │        Chat Interface           │
│      (1/3)      │           (2/3)                 │
│                 │                                 │
│ • Wallet        │ • AI Assistant                  │
│ • Forms         │ • Step-by-step guidance         │
│ • Network       │ • Real-time feedback            │
│ • Configuration │ • Configuration suggestions     │
└─────────────────┴─────────────────────────────────┘
```

### 5-Step Workflow

1. **🔗 Wallet Connection** → Core Wallet integration
2. **🏗️ Subnet Creation** → P-Chain operations
3. **⚙️ Parameter Configuration** → Genesis block setup
4. **🔐 Permissions & Access** → Allow lists and admin controls
5. **💰 Tokenomics & Fees** → Economic model configuration

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS + Custom Components
- **State Management**: React Context API
- **Wallet Integration**: wagmi + viem + Core Wallet

### Blockchain Integration
- **Multi-Chain Library**: Custom Avalanche multi-chain manager
- **Network Support**: Avalanche Mainnet & Fuji Testnet
- **Address Handling**: Automatic P-Chain/C-Chain conversion
- **Transaction Management**: Real-time status tracking

### AI Integration
- **Chat API**: Custom LLM endpoint integration
- **Configuration Restoration**: Automatic JSON structure mapping
- **Real-time Updates**: Dynamic form field updates from AI responses

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ 
- **Core Wallet** browser extension
- **AVAX tokens** (testnet for development)
- **Python 3.8+** (for AI backend, optional)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/avalanche-front.git
cd avalanche-front

# Install dependencies
npm install
# or
yarn install

# Set up environment variables
cp environment.example.txt .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Configuration

Create `.env.local` file:

```bash
# Avalanche RPC URLs (optional - using defaults)
NEXT_PUBLIC_AVALANCHE_RPC=https://api.avax.network/ext/bc/C/rpc
NEXT_PUBLIC_AVALANCHE_FUJI_RPC=https://api.avax-test.network/ext/bc/C/rpc

# Contract Addresses (replace with actual deployed addresses)
NEXT_PUBLIC_SUBNET_FACTORY_FUJI=0x...
NEXT_PUBLIC_SUBNET_FACTORY_MAINNET=0x...

# App Configuration
NEXT_PUBLIC_APP_NAME=Avalanche Subnet Creator
NEXT_PUBLIC_APP_DESCRIPTION=AI-Powered Subnet and L1 Creation Tool

# AI Chat Integration (optional)
NEXT_PUBLIC_CHAT_API_URL=http://localhost:8000/chat
```

## 📱 Core Wallet Integration

### Supported Operations

**P-Chain Operations:**
```typescript
// Subnet creation
await createSubnet({
  controlKeys: ['P-fuji1...'],
  threshold: 1
});

// Blockchain deployment
await createBlockchain({
  subnetID: 'subnet_id',
  chainName: 'MyL1',
  vmID: 'srEXiWaHuhNyGwPUi444Tu47ZEDwxTWrbQiuD7FmgSAQ6X7Dy',
  genesis: genesisData
});
```

**C-Chain Operations:**
```typescript
// Smart contract deployment
await deployContract(contractBytecode, constructorArgs);

// Token interactions
await transferTokens(tokenAddress, recipient, amount);
```

### Address Format Handling

The application automatically handles different address formats:

```typescript
// C-Chain (EVM compatible)
const cchainAddress = "0x1234567890abcdef1234567890abcdef12345678";

// P-Chain (Avalanche native)
const pchainAddress = "P-fuji1xyz...abc123";  // Testnet
const mainnetAddress = "P-avax1xyz...abc123"; // Mainnet

// Automatic conversion
const converted = convertAddress(cchainAddress, 'P');
```

## 🤖 AI Chat Integration

### Features

- **Real-time Assistance**: Get help with subnet configuration
- **Configuration Suggestions**: AI-powered parameter recommendations
- **Error Resolution**: Intelligent troubleshooting guidance
- **Best Practices**: Learn Avalanche development patterns

### API Integration

The chat system integrates with a Python backend:

```python
# Example API usage
import requests

payload = {
    "chat_history": "User: Hi\nBot: Hello! How can I help?",
    "user_config": {
        "gasLimit": 8000000,
        "feeConfig": {"minBaseFee": "25000000000"},
        # ... complete configuration
    },
    "question": "How do I optimize gas fees for my L1?"
}

response = requests.post("http://localhost:8000/chat", json=payload)
data = response.json()

print("AI Reply:", data["reply"])
print("Config Updates:", data["update"])
```

### Setting Up the AI Backend

```bash
# Install Python dependencies
pip install fastapi uvicorn openai

# Run the chat API server
python example_api_usage.py

# The API will be available at http://localhost:8000
```

## 🎯 Usage Guide

### 1. Connect Your Wallet

1. Install the [Core Wallet](https://core.app/) browser extension
2. Create or import your wallet
3. Switch to Avalanche Fuji Testnet
4. Get testnet AVAX from the [faucet](https://faucet.avax.network/)
5. Click "Connect Wallet" in the app

### 2. Create a Subnet

1. Navigate to the "Subnet Creation" step
2. Configure your subnet parameters:
   - **Control Keys**: P-Chain addresses that control the subnet
   - **Threshold**: Minimum signatures required for operations
3. Review the configuration in the chat interface
4. Execute the transaction through Core Wallet

### 3. Deploy Your L1 Blockchain

1. Use the created subnet ID
2. Configure blockchain parameters:
   - **Chain Name**: Your L1 blockchain name
   - **VM ID**: Virtual machine identifier
   - **Genesis Configuration**: Initial blockchain state
3. Set up tokenomics and fee structure
4. Deploy through the P-Chain

### 4. Configure Advanced Features

**Fee Management:**
```json
{
  "feeConfig": {
    "minBaseFee": "25000000000",
    "baseFeeChangeDenominator": 48,
    "targetGas": "15000000"
  }
}
```

**Access Control:**
```json
{
  "contractDeployerAllowListConfig": {
    "enabled": true,
    "admins": ["0xAdmin..."],
    "members": ["0xMember..."]
  }
}
```

## 🔧 Development

### Project Structure

```
src/
├── app/                    # Next.js 15 app directory
│   ├── page.tsx           # Main application page
│   ├── layout.tsx         # Root layout
│   └── test/              # Test pages
├── components/
│   ├── Chat.tsx           # Main chat interface
│   ├── ControlPanel.tsx   # Left panel controls
│   ├── blocks/            # Configuration blocks
│   ├── chat/              # Chat components
│   ├── genesis/           # Genesis configuration
│   ├── steps/             # Workflow steps
│   └── wallet/            # Wallet components
├── contexts/              # React Context providers
│   ├── ChatContext.tsx    # Chat state management
│   ├── StepsContext.tsx   # Workflow steps
│   ├── WalletContext.tsx  # Multi-chain wallet state
│   ├── BlockContext.tsx   # Configuration blocks
│   ├── ButtonHandlerContext.tsx # Action handlers
│   └── GenesisContext.tsx # Genesis block management
├── hooks/                 # Custom React hooks
│   └── useProgress.ts     # Progress tracking
├── lib/                   # Utility libraries
│   ├── wagmi.ts          # wagmi configuration
│   ├── avalanche.ts      # Avalanche utilities
│   ├── avalanche-multichain.ts # Multi-chain operations
│   ├── apiClient.ts      # API client
│   ├── configRestorer.ts # Configuration restoration
│   └── parseMessage.ts   # Message parsing
├── types/                # TypeScript definitions
└── consts/               # Constants and configuration
```

### Key Components

**WalletContext** - Multi-chain state management:
```typescript
interface WalletContextType {
  // C-Chain state
  address?: string;
  cchainBalance?: string;
  
  // P-Chain state  
  pchainAddress?: string;
  pchainBalance?: string;
  
  // Network state
  isAvalancheNetwork: boolean;
  chainId?: number;
  
  // Actions
  connect: () => Promise<void>;
  switchToAvalanche: () => Promise<void>;
  refreshBalances: () => Promise<void>;
}
```

**ChatContext** - AI chat integration:
```typescript
interface ChatContextType {
  messages: ChatMessage[];
  isLoading: boolean;
  sendMessage: (message: string) => Promise<void>;
  clearChat: () => void;
  restoreConfiguration: (config: SubnetConfig) => void;
}
```

### Multi-Chain Library

The `avalanche-multichain.ts` library provides comprehensive blockchain operations:

```typescript
class CoreWalletMultiChain {
  // P-Chain operations
  async createSubnet(params: CreateSubnetParams): Promise<string>;
  async createBlockchain(params: CreateBlockchainParams): Promise<string>;
  async addValidator(params: AddValidatorParams): Promise<string>;
  
  // C-Chain operations
  async deployContract(bytecode: string, args: any[]): Promise<string>;
  async getCChainBalance(address: string): Promise<string>;
  
  // Utility functions
  validateAddress(address: string, chain: 'C' | 'P'): boolean;
  convertAddress(address: string, targetChain: 'C' | 'P'): string;
}
```

### Adding New Features

1. **New Configuration Block:**
```typescript
// 1. Define the interface in src/types/
interface NewConfigBlock {
  enabled: boolean;
  parameters: string[];
}

// 2. Add to BlockContext
const [newConfig, setNewConfig] = useState<NewConfigBlock>({
  enabled: false,
  parameters: []
});

// 3. Create component in src/components/blocks/
export function NewConfigBlock() {
  const { newConfig, setNewConfig } = useBlock();
  // Component implementation
}
```

2. **New Chat Command:**
```typescript
// Add to ButtonHandlerContext
enum ButtonAction {
  NEW_ACTION = 'NEW_ACTION'
}

// Implement handler
const handleNewAction = async () => {
  // Action implementation
};
```

## 🧪 Testing

### Test Networks

- **Avalanche Fuji Testnet** (recommended for development)
  - Chain ID: 43113
  - RPC: https://api.avax-test.network/ext/bc/C/rpc
  - Faucet: https://faucet.avax.network/
  - Explorer: https://testnet.snowtrace.io/

- **Avalanche Mainnet** (production)
  - Chain ID: 43114
  - RPC: https://api.avax.network/ext/bc/C/rpc
  - Explorer: https://snowtrace.io/

### Test Scenarios

1. **Wallet Integration Testing**
   ```bash
   # Test wallet connection
   npm run test:wallet
   
   # Test network switching
   npm run test:network
   ```

2. **Subnet Creation Testing**
   ```bash
   # Test subnet creation flow
   npm run test:subnet
   
   # Test blockchain deployment
   npm run test:blockchain
   ```

3. **Chat Integration Testing**
   ```bash
   # Visit the test page
   http://localhost:3000/test
   
   # Test configuration restoration
   # Test AI responses
   # Test real-time updates
   ```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:components
npm run test:contexts
npm run test:integration

# Run with coverage
npm run test:coverage
```

## 🔍 Troubleshooting

### Common Issues

**1. Core Wallet Not Detected**
```bash
Error: Core Wallet not available

Solutions:
✅ Install Core Wallet extension
✅ Refresh the browser page
✅ Check browser compatibility (Chrome/Firefox/Edge)
✅ Enable developer mode if needed
```

**2. Network Connection Issues**
```bash
Error: Please switch to Avalanche network

Solutions:
✅ App will auto-prompt network switch
✅ Manually switch in Core Wallet settings
✅ Ensure using Fuji testnet for development
✅ Check RPC endpoint connectivity
```

**3. Insufficient Balance**
```bash
Error: Insufficient AVAX for transaction

Solutions:
✅ Get testnet AVAX from faucet
✅ Check P-Chain balance for subnet operations
✅ Verify C-Chain balance for contract deployment
✅ Ensure minimum balance for gas fees
```

**4. Transaction Failures**
```bash
Error: Transaction failed or reverted

Solutions:
✅ Check gas limit settings
✅ Verify contract parameters
✅ Ensure proper address formats
✅ Check network congestion
```

**5. Chat API Issues**
```bash
Error: Chat service unavailable

Solutions:
✅ Start the Python backend server
✅ Check API endpoint configuration
✅ Verify network connectivity
✅ Check CORS settings
```

### Development Tips

**Hot Reload Issues:**
```bash
# Clear Next.js cache
rm -rf .next
npm run dev

# Clear node modules if needed
rm -rf node_modules
npm install
```

**TypeScript Errors:**
```bash
# Check types
npx tsc --noEmit

# Fix wagmi types
npm install @types/node --save-dev
```

**Wallet Connection Debug:**
```typescript
// Enable debug logging
localStorage.setItem('wagmi.debug', 'true');
localStorage.setItem('avalanche.debug', 'true');
```

## 📚 API Reference

### Subnet Configuration API

```typescript
interface SubnetConfig {
  subnetId: string;
  subnetOwner: string;
  vmId: string;
  evmChainId: number;
  gasLimit: number;
  targetBlockRate: number;
  tokenAllocations: TokenAllocation[];
  feeConfig: FeeConfig;
  contractDeployerAllowListConfig: AllowListConfig;
  contractNativeMinterConfig: AllowListConfig;
  txAllowListConfig: AllowListConfig;
  feeManagerEnabled: boolean;
  feeManagerAdmins: string[];
  rewardManagerEnabled: boolean;
  rewardManagerAdmins: string[];
}
```

### Chat API Endpoints

```typescript
// Send chat message
POST /chat
{
  "chat_history": string,
  "user_config": SubnetConfig,
  "question": string
}

// Response
{
  "reply": string,
  "update": Partial<SubnetConfig>
}
```

### Wallet API

```typescript
// Connect wallet
const { connect } = useWallet();
await connect();

// Get balances
const { cchainBalance, pchainBalance } = useWallet();

// Switch networks
const { switchToAvalanche } = useWallet();
await switchToAvalanche();
```

## 🌐 Deployment

### Frontend Deployment

**Vercel (Recommended):**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Docker:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Backend Deployment

**Python Chat API:**
```bash
# Install dependencies
pip install -r requirements.txt

# Run with gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
```

### Environment Variables for Production

```bash
# Production environment
NODE_ENV=production
NEXT_PUBLIC_AVALANCHE_RPC=https://api.avax.network/ext/bc/C/rpc
NEXT_PUBLIC_SUBNET_FACTORY_MAINNET=0x...

# Security
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://your-domain.com

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-...
```

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Follow the configured rules
- **Prettier**: Auto-format on save
- **Testing**: Write tests for new features
- **Documentation**: Update README for new features

### Commit Convention

```bash
feat: add new subnet validation
fix: resolve wallet connection issue
docs: update API documentation
style: format code with prettier
refactor: improve error handling
test: add unit tests for chat integration
```

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Avalanche Team** for the amazing blockchain platform
- **Core Wallet** for seamless wallet integration
- **Next.js Team** for the excellent React framework
- **wagmi Contributors** for Web3 React hooks
- **Tailwind CSS** for the utility-first CSS framework

## 📞 Support

- **Documentation**: [Avalanche Docs](https://docs.avax.network/)
- **Discord**: [Avalanche Community](https://chat.avax.network/)
- **GitHub Issues**: [Report bugs or request features](https://github.com/your-username/avalanche-front/issues)
- **Email**: support@your-domain.com

---

**🏔️ Built for Avalanche Hackathon 2025**

*Empowering developers to create the next generation of L1 blockchains with AI-powered assistance and seamless Web3 integration.*

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/avalanche-front)
[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/your-username/avalanche-front)
