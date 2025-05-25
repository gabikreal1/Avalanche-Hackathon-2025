import { SubnetConfig, TokenAllocation, FeeConfig, AllowListConfig } from '@/types/subnetConfig';

/**
 * Default configuration template that matches the user's required structure
 */
export const DEFAULT_SUBNET_CONFIG: SubnetConfig = {
  subnetId: "subnet_1735689600000_abc123def",
  subnetOwner: "P-fuji1x7rz8ef5r3qjh0qzx8z9x7rz8ef5r3qjh0qzx8",
  vmId: "srEXiWaHuhNyGwPUi444Tu47ZEDwxTWrbQiuD7FmgSAQ6X7Dy",
  evmChainId: 43114,
  gasLimit: 8000000,
  targetBlockRate: 2,
  tokenAllocations: [],
  feeConfig: {
    minBaseFee: "25000000000",
    baseFeeChangeDenominator: 48,
    minBlockGasCost: "0",
    maxBlockGasCost: "1000000",
    blockGasCostStep: "200000",
    targetGas: "15000000"
  },
  contractDeployerAllowListConfig: {
    enabled: false,
    admins: [],
    members: [],
    enabledAddresses: []
  },
  contractNativeMinterConfig: {
    enabled: false,
    admins: [],
    members: [],
    enabledAddresses: []
  },
  txAllowListConfig: {
    enabled: false,
    admins: [],
    members: [],
    enabledAddresses: []
  },
  feeManagerEnabled: false,
  feeManagerAdmins: [],
  rewardManagerEnabled: false,
  rewardManagerAdmins: []
};

/**
 * Restores the complete subnet configuration from flattened form data
 * @param formData - Flattened form data from BlockContext
 * @returns Complete SubnetConfig object
 */
export function restoreSubnetConfig(formData: Record<string, any>): SubnetConfig {
  // Start with default configuration
  const config: SubnetConfig = JSON.parse(JSON.stringify(DEFAULT_SUBNET_CONFIG));

  // Map flattened fields to the structured configuration
  // Basic fields
  if (formData.subnetId !== undefined) config.subnetId = String(formData.subnetId);
  if (formData.subnetOwner !== undefined) config.subnetOwner = String(formData.subnetOwner);
  if (formData.vmId !== undefined) config.vmId = String(formData.vmId);
  if (formData.evmChainId !== undefined) config.evmChainId = Number(formData.evmChainId);
  if (formData.gasLimit !== undefined) config.gasLimit = Number(formData.gasLimit);
  if (formData.targetBlockRate !== undefined) config.targetBlockRate = Number(formData.targetBlockRate);

  // Token allocations - handle array data
  if (formData.tokenAllocations && Array.isArray(formData.tokenAllocations)) {
    config.tokenAllocations = formData.tokenAllocations.map((allocation: any) => ({
      address: String(allocation.address || ""),
      amount: String(allocation.amount || "0")
    }));
  }

  // Fee configuration
  if (formData.minBaseFee !== undefined) config.feeConfig.minBaseFee = String(formData.minBaseFee);
  if (formData.baseFeeChangeDenominator !== undefined) config.feeConfig.baseFeeChangeDenominator = Number(formData.baseFeeChangeDenominator);
  if (formData.minBlockGasCost !== undefined) config.feeConfig.minBlockGasCost = String(formData.minBlockGasCost);
  if (formData.maxBlockGasCost !== undefined) config.feeConfig.maxBlockGasCost = String(formData.maxBlockGasCost);
  if (formData.blockGasCostStep !== undefined) config.feeConfig.blockGasCostStep = String(formData.blockGasCostStep);
  if (formData.targetGas !== undefined) config.feeConfig.targetGas = String(formData.targetGas);

  // Contract deployer allow list config
  if (formData.contractDeployerAllowListEnabled !== undefined) {
    config.contractDeployerAllowListConfig.enabled = Boolean(formData.contractDeployerAllowListEnabled);
  }
  if (formData.contractDeployerAllowListAdmins && Array.isArray(formData.contractDeployerAllowListAdmins)) {
    config.contractDeployerAllowListConfig.admins = formData.contractDeployerAllowListAdmins.map(String);
  }
  if (formData.contractDeployerAllowListMembers && Array.isArray(formData.contractDeployerAllowListMembers)) {
    config.contractDeployerAllowListConfig.members = formData.contractDeployerAllowListMembers.map(String);
  }
  if (formData.contractDeployerAllowListEnabledAddresses && Array.isArray(formData.contractDeployerAllowListEnabledAddresses)) {
    config.contractDeployerAllowListConfig.enabledAddresses = formData.contractDeployerAllowListEnabledAddresses.map(String);
  }

  // Contract native minter config
  if (formData.contractNativeMinterEnabled !== undefined) {
    config.contractNativeMinterConfig.enabled = Boolean(formData.contractNativeMinterEnabled);
  }
  if (formData.contractNativeMinterAdmins && Array.isArray(formData.contractNativeMinterAdmins)) {
    config.contractNativeMinterConfig.admins = formData.contractNativeMinterAdmins.map(String);
  }
  if (formData.contractNativeMinterMembers && Array.isArray(formData.contractNativeMinterMembers)) {
    config.contractNativeMinterConfig.members = formData.contractNativeMinterMembers.map(String);
  }
  if (formData.contractNativeMinterEnabledAddresses && Array.isArray(formData.contractNativeMinterEnabledAddresses)) {
    config.contractNativeMinterConfig.enabledAddresses = formData.contractNativeMinterEnabledAddresses.map(String);
  }

  // Transaction allow list config
  if (formData.txAllowListEnabled !== undefined) {
    config.txAllowListConfig.enabled = Boolean(formData.txAllowListEnabled);
  }
  if (formData.txAllowListAdmins && Array.isArray(formData.txAllowListAdmins)) {
    config.txAllowListConfig.admins = formData.txAllowListAdmins.map(String);
  }
  if (formData.txAllowListMembers && Array.isArray(formData.txAllowListMembers)) {
    config.txAllowListConfig.members = formData.txAllowListMembers.map(String);
  }
  if (formData.txAllowListEnabledAddresses && Array.isArray(formData.txAllowListEnabledAddresses)) {
    config.txAllowListConfig.enabledAddresses = formData.txAllowListEnabledAddresses.map(String);
  }

  // Fee and reward managers
  if (formData.feeManagerEnabled !== undefined) config.feeManagerEnabled = Boolean(formData.feeManagerEnabled);
  if (formData.feeManagerAdmins && Array.isArray(formData.feeManagerAdmins)) {
    config.feeManagerAdmins = formData.feeManagerAdmins.map(String);
  }
  if (formData.rewardManagerEnabled !== undefined) config.rewardManagerEnabled = Boolean(formData.rewardManagerEnabled);
  if (formData.rewardManagerAdmins && Array.isArray(formData.rewardManagerAdmins)) {
    config.rewardManagerAdmins = formData.rewardManagerAdmins.map(String);
  }

  return config;
}

/**
 * Converts chat messages to the format expected by the API
 * @param messages - Array of Message objects from ChatContext
 * @returns Formatted chat history string
 */
export function formatChatHistory(messages: Array<{ content: string; isUser: boolean }>): string {
  return messages
    .map(msg => `${msg.isUser ? 'User' : 'Bot'}: ${msg.content}`)
    .join('\n');
} 