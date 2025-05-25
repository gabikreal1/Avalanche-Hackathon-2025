// Core Wallet Multi-Chain Support for Avalanche
// P-Chain (Platform) for subnet/validator operations + C-Chain (Contract) for EVM operations

// Network configurations
export const AVALANCHE_NETWORKS = {
  MAINNET: {
    networkID: 1,
    hrp: 'avax',
    rpcUrl: 'https://api.avax.network',
    chainID: 43114, // C-Chain
  },
  FUJI: {
    networkID: 5,
    hrp: 'fuji', 
    rpcUrl: 'https://api.avax-test.network',
    chainID: 43113, // C-Chain
  }
} as const

// Chain IDs for Avalanche (P-Chain + C-Chain only)
export const AVALANCHE_CHAIN_IDS = {
  P_CHAIN: 'P',
  C_CHAIN: 'C',
} as const

// Address format interfaces (P-Chain + C-Chain only)
export interface MultiChainAddresses {
  cchain: string;    // 0x... format
  pchain: string;    // P-avax1... or P-fuji1... format
}

// Core Wallet Multi-Chain Manager
export class CoreWalletMultiChain {
  private networkID: number;

  constructor(networkID: number = 5) { // Default to Fuji testnet
    this.networkID = networkID;
  }

  // Check if Core Wallet is available
  private isWalletAvailable(): boolean {
    return typeof window !== 'undefined' && !!window.avalanche?.request;
  }

  // Request wallet connection for P-Chain and C-Chain
  async connectWallet(): Promise<{
    success: boolean;
    addresses?: MultiChainAddresses;
    error?: string;
  }> {
    if (!this.isWalletAvailable()) {
      return { success: false, error: 'Core Wallet not available' };
    }

    try {
      // Request C-Chain access (EVM)
      const accounts = await window.avalanche!.request!({
        method: 'eth_requestAccounts'
      }) as string[];

      const cchainAddress = accounts[0];
      
      // Convert to P-Chain format
      const addresses = await this.getAllChainAddresses(cchainAddress);

      return {
        success: true,
        addresses
      };
    } catch (error) {
      console.error('Error connecting wallet:', error);
      return { success: false, error: 'Failed to connect wallet' };
    }
  }

  // Get addresses for P-Chain and C-Chain from C-Chain address
  private async getAllChainAddresses(cchainAddress: string): Promise<MultiChainAddresses> {
    const networkPrefix = this.networkID === 1 ? 'avax' : 'fuji';
    
    // Mock conversion - in reality, this would use proper Avalanche address conversion
    // or Core Wallet would provide these addresses directly
    const addressHash = cchainAddress.slice(2, 40); // Remove 0x and take 38 chars
    
    return {
      cchain: cchainAddress,
      pchain: `P-${networkPrefix}1${addressHash}`,
    };
  }

  // Get C-Chain balance
  async getCChainBalance(address: string): Promise<string> {
    if (!this.isWalletAvailable()) {
      throw new Error('Core Wallet not available');
    }

    try {
      const balance = await window.avalanche!.request!({
        method: 'eth_getBalance',
        params: [address, 'latest']
      }) as string;
      return balance;
    } catch (error) {
      console.error('Error getting C-Chain balance:', error);
      throw error;
    }
  }

  // Switch to C-Chain
  async switchToCChain(): Promise<void> {
    if (!this.isWalletAvailable()) {
      throw new Error('Core Wallet not available');
    }

    try {
      const chainId = this.networkID === 1 ? 43114 : 43113; // Mainnet or Fuji
      await window.avalanche!.request!({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }]
      });
    } catch (error) {
      console.error('Error switching to C-Chain:', error);
      throw error;
    }
  }

  // P-Chain operations (handled by Core Wallet internally)
  async createSubnet(params: {
    controlKeys: string[];  // Should be P-Chain addresses
    threshold: number;
  }): Promise<string> {
    if (!this.isWalletAvailable()) {
      throw new Error('Core Wallet not available');
    }

    try {
      console.log('Creating subnet on P-Chain with params:', params);
      
      // Validate that control keys are P-Chain addresses
      const invalidKeys = params.controlKeys.filter(key => !key.startsWith('P-'));
      if (invalidKeys.length > 0) {
        console.warn('Some control keys are not P-Chain addresses:', invalidKeys);
      }
      
      // Note: This is a placeholder for actual Core Wallet P-Chain API
      // The actual implementation would depend on Core Wallet's specific methods
      
      // Simulate subnet creation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Return mock transaction ID
      const mockTxId = `subnet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      console.log('Subnet created with transaction ID:', mockTxId);
      
      return mockTxId;
      
      // TODO: Replace with actual Core Wallet P-Chain API call
      // const result = await window.avalanche.request({
      //   method: 'platform.createSubnet',
      //   params: {
      //     controlKeys: params.controlKeys, // P-Chain addresses
      //     threshold: params.threshold
      //   }
      // });
      // return result.txID;
      
    } catch (error) {
      console.error('Error creating subnet:', error);
      throw error;
    }
  }

  // Create blockchain on existing subnet
  async createBlockchain(params: {
    subnetID: string;
    chainName: string;
    vmID: string;
    genesis: string;
  }): Promise<string> {
    if (!this.isWalletAvailable()) {
      throw new Error('Core Wallet not available');
    }

    try {
      console.log('Creating blockchain on P-Chain with params:', params);
      
      // Simulate blockchain creation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Return mock transaction ID
      const mockTxId = `blockchain_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      console.log('Blockchain created with transaction ID:', mockTxId);
      
      return mockTxId;
      
      // TODO: Replace with actual Core Wallet P-Chain API call
      // const result = await window.avalanche.request({
      //   method: 'platform.createBlockchain',
      //   params: {
      //     subnetID: params.subnetID,
      //     chainName: params.chainName,
      //     vmID: params.vmID,
      //     genesis: params.genesis
      //   }
      // });
      // return result.txID;
      
    } catch (error) {
      console.error('Error creating blockchain:', error);
      throw error;
    }
  }

  // Get network info
  getNetworkInfo() {
    return this.networkID === 1 ? AVALANCHE_NETWORKS.MAINNET : AVALANCHE_NETWORKS.FUJI;
  }

  // Validate address format for specific chain (P-Chain or C-Chain only)
  validateAddress(address: string, chain: 'C' | 'P'): boolean {
    switch (chain) {
      case 'C':
        return /^0x[a-fA-F0-9]{40}$/.test(address);
      case 'P':
        return /^P-(avax|fuji)1[a-z0-9]+$/.test(address);
      default:
        return false;
    }
  }
}

// Utility functions
export const formatAVAX = (weiValue: string | number): string => {
  try {
    const wei = typeof weiValue === 'string' ? parseInt(weiValue, 16) : weiValue;
    const avax = wei / Math.pow(10, 18);
    return avax.toFixed(4);
  } catch {
    return '0.0000';
  }
};

export const parseAVAX = (avaxValue: string | number): string => {
  try {
    const avax = typeof avaxValue === 'string' ? parseFloat(avaxValue) : avaxValue;
    const wei = Math.floor(avax * Math.pow(10, 18));
    return `0x${wei.toString(16)}`;
  } catch {
    return '0x0';
  }
};

// Get Core Wallet addresses for P-Chain and C-Chain
export const getCoreWalletAddresses = async (): Promise<MultiChainAddresses | null> => {
  if (typeof window !== 'undefined' && window.avalanche?.request) {
    try {
      const accounts = await window.avalanche.request({
        method: 'eth_requestAccounts'
      }) as string[];
      
      const multiChain = new CoreWalletMultiChain();
      const addresses = await multiChain['getAllChainAddresses'](accounts[0]);
      
      return addresses;
    } catch (error) {
      console.error('Error getting Core Wallet addresses:', error);
      return null;
    }
  }
  return null;
};

// Create a singleton instance
export const coreWalletMultiChain = new CoreWalletMultiChain(5); // Fuji testnet 