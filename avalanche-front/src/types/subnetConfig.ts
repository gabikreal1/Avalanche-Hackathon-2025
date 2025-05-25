export interface TokenAllocation {
  address: string;
  amount: string;
}

export interface FeeConfig {
  minBaseFee: string;
  baseFeeChangeDenominator: number;
  minBlockGasCost: string;
  maxBlockGasCost: string;
  blockGasCostStep: string;
  targetGas: string;
}

export interface AllowListConfig {
  enabled: boolean;
  admins: string[];
  members: string[];
  enabledAddresses: string[];
}

export interface SubnetConfig {
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

export interface ChatMessage {
  text: string;
  isUser: boolean;
}

export interface ChatApiRequest {
  chat_history: string;
  user_config: SubnetConfig;
  question: string;
}

export interface ChatApiResponse {
  reply: string;
  update: Partial<SubnetConfig>;
} 