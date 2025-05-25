import { Address, Hash } from 'viem'

// Avalanche subnet factory contract addresses
export const CONTRACTS = {
  FUJI: {
    SUBNET_FACTORY: '0x...' as Address, // Replace with actual contract address
  },
  MAINNET: {
    SUBNET_FACTORY: '0x...' as Address, // Replace with actual contract address
  }
} as const

// Subnet Factory ABI (simplified for demo)
export const SUBNET_FACTORY_ABI = [
  {
    inputs: [
      { name: 'threshold', type: 'uint32' },
      { name: 'validators', type: 'address[]' }
    ],
    name: 'createSubnet',
    outputs: [{ name: 'subnetID', type: 'bytes32' }],
    stateMutability: 'nonpayable',
    type: 'function'
  }
] as const

// Chain creation types
export interface SubnetConfig {
  owner: Address
  threshold?: number
  validators?: Address[]
}

export interface ChainConfig {
  subnetId: string
  chainName: string
  vmId: string
  evmChainId?: number
}

// Utility functions
export const formatSubnetId = (subnetId: string): string => {
  return subnetId.startsWith('0x') ? subnetId : `0x${subnetId}`
}

export const isValidAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

export const isValidSubnetId = (subnetId: string): boolean => {
  const formatted = formatSubnetId(subnetId)
  return /^0x[a-fA-F0-9]{64}$/.test(formatted)
}

// Network-specific configurations
export const NETWORK_CONFIG = {
  43114: { // Avalanche Mainnet
    name: 'Avalanche',
    explorer: 'https://snowtrace.io',
    rpc: 'https://api.avax.network/ext/bc/C/rpc'
  },
  43113: { // Avalanche Fuji Testnet
    name: 'Avalanche Fuji',
    explorer: 'https://testnet.snowtrace.io',
    rpc: 'https://api.avax-test.network/ext/bc/C/rpc'
  }
} as const

export const getNetworkConfig = (chainId: number) => {
  return NETWORK_CONFIG[chainId as keyof typeof NETWORK_CONFIG]
}

export const getExplorerUrl = (chainId: number, hash: Hash): string => {
  const config = getNetworkConfig(chainId)
  return config ? `${config.explorer}/tx/${hash}` : ''
} 