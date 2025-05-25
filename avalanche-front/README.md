# Avalanche Subnet Creator

A modern web application for creating Avalanche subnets and blockchains with **Core Wallet** integration.

**Multi-Chain Architecture**: Utilizes both **P-Chain** (Platform) for subnet/validator operations and **C-Chain** (Contract) for smart contract interactions.

## 🏗️ Architecture

### Split-Screen Design
- **Control Panel (1/3)**: Input forms, wallet connection, network management
- **Chat Interface (2/3)**: Step-by-step guidance and real-time feedback

### Multi-Chain Support (P-Chain + C-Chain)

The application integrates with **two** Avalanche chains:

1. **P-Chain (Platform Chain)**
   - **Purpose**: Subnet creation, validator management, network governance
   - **Address Format**: `P-avax1...` (mainnet) or `P-fuji1...` (testnet)
   - **Operations**: `createSubnet`, `createBlockchain`, validator registration

2. **C-Chain (Contract Chain)**  
   - **Purpose**: Smart contracts, DeFi, EVM-compatible operations
   - **Address Format**: `0x...` (Ethereum-style)
   - **Operations**: Token deployment, dApp interactions, gas payments

### 5-Step Workflow

1. **Subnet Creation** → P-Chain operations
2. **Parameter Validation** → Cross-chain validation
3. **Permissions** → Access control setup
4. **Tokenomics** → Economic model configuration
5. **Gas & Fees** → Fee structure definition

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Wallet Integration**: wagmi + Core Wallet
- **Multi-Chain**: Custom Avalanche multi-chain library
- **State Management**: React Context (ChatContext, StepsContext, ButtonHandlerContext)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Core Wallet browser extension
- AVAX testnet tokens (for testing)

### Installation

```bash
# Clone repository
git clone <repository-url>
cd avalanche-front

# Install dependencies
npm install
# or
yarn install

# Set up environment variables
cp environment.example.txt .env.local
# Edit .env.local with your values

# Start development server
npm run dev
# or
yarn dev
```

### Environment Configuration

Create `.env.local` file:

```bash
# Wallet Configuration
NEXT_PUBLIC_PROJECT_ID=your_wallet_connect_project_id

# Network Configuration (optional)
NEXT_PUBLIC_DEFAULT_NETWORK=fuji # or 'mainnet'

# API Keys (optional)
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key
NEXT_PUBLIC_INFURA_API_KEY=your_infura_key

# Core Wallet Settings
NEXT_PUBLIC_CORE_WALLET_REQUIRED=true
```

## 📱 Core Wallet Integration

### Supported Operations

**P-Chain Operations:**
- ✅ Subnet creation (`platform.createSubnet`)
- ✅ Blockchain creation (`platform.createBlockchain`)
- ✅ Validator management
- ✅ Network governance

**C-Chain Operations:**
- ✅ Smart contract deployment
- ✅ Token interactions
- ✅ DeFi protocols
- ✅ Gas fee payments

### Address Formats

The application automatically handles different address formats:

```typescript
// C-Chain (EVM compatible)
address: "0x1234567890abcdef1234567890abcdef12345678"

// P-Chain (Avalanche native)
pchainAddress: "P-fuji1xyz...abc123"  // Testnet
pchainAddress: "P-avax1xyz...abc123"  // Mainnet
```

### Network Detection

Automatic network switching and validation:

```typescript
// Supported networks
- Avalanche Mainnet (Chain ID: 43114)
- Avalanche Fuji Testnet (Chain ID: 43113)

// Auto-switches to Fuji testnet for development
```

## 🎯 Usage

### 1. Connect Core Wallet

```bash
1. Install Core Wallet extension
2. Create/import wallet
3. Add AVAX testnet tokens
4. Click "Connect Wallet" in app
```

### 2. Create Subnet

```bash
1. Navigate to "Subnet Creation" step
2. Configure subnet parameters
3. Review P-Chain address
4. Execute transaction
5. Monitor transaction status
```

### 3. Deploy Blockchain

```bash
1. Use created subnet ID
2. Configure blockchain parameters
3. Set VM configuration
4. Deploy on P-Chain
5. Verify deployment
```

## 🔧 Development

### Project Structure

```
src/
├── app/                    # Next.js 15 app directory
├── components/
│   ├── chat/              # Chat interface components
│   ├── control-panel/     # Control panel components
│   └── wallet/            # Wallet integration components
├── contexts/              # React Context providers
│   ├── ChatContext.tsx    # Chat state management
│   ├── StepsContext.tsx   # Workflow steps
│   ├── WalletContext.tsx  # Multi-chain wallet state
│   └── ButtonHandlerContext.tsx # Action handlers
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
│   ├── wagmi.ts          # wagmi configuration
│   └── avalanche-multichain.ts # Multi-chain operations
└── types/                # TypeScript type definitions
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

**ButtonHandlerContext** - Blockchain operations:
```typescript
enum ButtonAction {
  GENERATE_SUBNET = 'GENERATE_SUBNET',    // P-Chain
  CREATE_CHAIN = 'CREATE_CHAIN',          // P-Chain
  VALIDATE_PARAMETERS = 'VALIDATE_PARAMETERS', // Cross-chain
  CONNECT_WALLET = 'CONNECT_WALLET',      // Initial setup
  SWITCH_NETWORK = 'SWITCH_NETWORK'       // Network management
}
```

### Multi-Chain Library

The `avalanche-multichain.ts` library provides:

```typescript
// Core Wallet Multi-Chain Manager
class CoreWalletMultiChain {
  // P-Chain operations
  async createSubnet(params: {
    controlKeys: string[];  // P-Chain addresses
    threshold: number;
  }): Promise<string>;
  
  async createBlockchain(params: {
    subnetID: string;
    chainName: string; 
    vmID: string;
    genesis: string;
  }): Promise<string>;
  
  // C-Chain operations
  async getCChainBalance(address: string): Promise<string>;
  async switchToCChain(): Promise<void>;
  
  // Address validation
  validateAddress(address: string, chain: 'C' | 'P'): boolean;
}
```

## 🔍 Troubleshooting

### Common Issues

**1. Core Wallet Not Detected**
```bash
Error: Core Wallet not available

Solution:
- Install Core Wallet extension
- Refresh the page
- Check browser compatibility
```

**2. Wrong Network**
```bash
Error: Please switch to Avalanche network

Solution:
- App will auto-prompt network switch
- Manually switch in Core Wallet
- Ensure using Fuji testnet for development
```

**3. Insufficient Balance**
```bash
Error: Insufficient AVAX for transaction

Solution:
- Get testnet AVAX from faucet
- Check P-Chain balance for subnet creation
- Verify gas fees on C-Chain
```

**4. Address Format Issues**
```bash
Error: Invalid P-Chain address format

Solution:
- Ensure P-Chain addresses start with "P-"
- Verify network prefix (fuji/avax)
- Check address conversion
```

### Development Tips

**Hot Reload Issues:**
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

**TypeScript Errors:**
```bash
# Check types
npm run type-check

# Fix common wagmi types
npm install @types/node --save-dev
```

**Wallet Connection Debug:**
```typescript
// Enable debug logging
localStorage.setItem('wagmi.debug', 'true');
```

## 🧪 Testing

### Test Networks

- **Fuji Testnet** (recommended for development)
  - Chain ID: 43113
  - Faucet: https://faucet.avax.network/
  - Explorer: https://testnet.snowtrace.io/

### Test Scenarios

1. **Wallet Connection**
   - Connect/disconnect Core Wallet
   - Network switching
   - Address generation

2. **P-Chain Operations**
   - Subnet creation simulation
   - Blockchain deployment
   - Parameter validation

3. **Cross-Chain Interactions**
   - Address format conversion
   - Balance synchronization
   - Multi-chain state management

## 📚 References

### Official Documentation
- [Avalanche Documentation](https://docs.avax.network/)
- [Core Wallet Documentation](https://support.avax.network/en/categories/core-web-extension)
- [Subnet Development](https://docs.avax.network/build/subnet)
- [P-Chain API](https://docs.avax.network/apis/avalanchego/apis/p-chain)

### Libraries Used
- [wagmi](https://wagmi.sh/) - React hooks for Ethereum
- [viem](https://viem.sh/) - TypeScript interface for Ethereum
- [Next.js 15](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/subnet-enhancement`)
3. Commit changes (`git commit -am 'Add subnet validation'`)
4. Push to branch (`git push origin feature/subnet-enhancement`)
5. Create Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built for Avalanche Hackathon 2025** 🏔️

Multi-chain subnet creation with modern Web3 UX
