export interface AllocationEntry {
  address: string;
  amount: number;
}

export interface AllowlistAddressEntry {
  address: string;
  blockTimestamp?: number;
}

export interface AllowlistPrecompileConfig {
  activated: boolean;
  addresses: {
    Admin: AllowlistAddressEntry[];
    Manager: AllowlistAddressEntry[];
    Enabled: AllowlistAddressEntry[];
  };
}

export interface FeeConfigType {
  baseFeeChangeDenominator: number;
  blockGasCostStep: number;
  maxBlockGasCost: number;
  minBaseFee: number;
  minBlockGasCost: number;
  targetGas: number;
}

export interface WarpConfig {
  enabled: boolean;
  quorumNumerator: number;
  requirePrimaryNetworkSigners: boolean;
}

export interface ValidationMessages {
  errors: { [key: string]: string };
  warnings: { [key: string]: string };
}

export type SectionId = 'chainParams' | 'permissions' | 'tokenomics' | 'transactionFees';

export interface GenesisFormData {
  // Chain Parameters
  evmChainId: number;
  
  // Gas and Block Settings
  gasLimit: number;
  targetBlockRate: number;
  
  // Token Allocations
  tokenAllocations: AllocationEntry[];
  
  // Fee Configuration
  feeConfig: FeeConfigType;
  
  // Precompile Configurations
  contractDeployerAllowListConfig: AllowlistPrecompileConfig;
  contractNativeMinterConfig: AllowlistPrecompileConfig;
  txAllowListConfig: AllowlistPrecompileConfig;
  
  // Fee and Reward Managers
  feeManagerEnabled: boolean;
  feeManagerAdmins: string[];
  rewardManagerEnabled: boolean;
  rewardManagerAdmins: string[];
  
  // Warp Configuration
  warpConfig: WarpConfig;
}

export const generateEmptyAllowlistPrecompileConfig = (): AllowlistPrecompileConfig => ({
  activated: false,
  addresses: {
    Admin: [],
    Manager: [],
    Enabled: []
  }
});

export const isValidAllowlistPrecompileConfig = (config: AllowlistPrecompileConfig): boolean => {
  if (!config.activated) return true;
  
  const totalAddresses = config.addresses.Admin.length + 
                        config.addresses.Manager.length + 
                        config.addresses.Enabled.length;
  
  return totalAddresses > 0;
};

export const DEFAULT_FEE_CONFIG: FeeConfigType = {
  baseFeeChangeDenominator: 48,
  blockGasCostStep: 200000,
  maxBlockGasCost: 1000000,
  minBaseFee: 25000000000, // 25 gwei
  minBlockGasCost: 0,
  targetGas: 15000000
};

export const DEFAULT_WARP_CONFIG: WarpConfig = {
  enabled: true,
  quorumNumerator: 67,
  requirePrimaryNetworkSigners: true
}; 