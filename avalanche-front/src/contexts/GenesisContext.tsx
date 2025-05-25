'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useWallet } from './WalletContext';
import { useChat } from './ChatContext';
import {
  GenesisFormData,
  AllocationEntry,
  AllowlistPrecompileConfig,
  FeeConfigType,
  ValidationMessages,
  SectionId,
  DEFAULT_FEE_CONFIG,
  DEFAULT_WARP_CONFIG,
  generateEmptyAllowlistPrecompileConfig,
  isValidAllowlistPrecompileConfig
} from '@/types/genesis';

interface GenesisContextType {
  // Form Data
  formData: GenesisFormData;
  
  // Setters for individual fields
  setEvmChainId: (id: number) => void;
  setGasLimit: (limit: number) => void;
  setTargetBlockRate: (rate: number) => void;
  setTokenAllocations: (allocations: AllocationEntry[]) => void;
  setFeeConfig: (config: FeeConfigType) => void;
  setContractDeployerAllowListConfig: (config: AllowlistPrecompileConfig) => void;
  setContractNativeMinterConfig: (config: AllowlistPrecompileConfig) => void;
  setTxAllowListConfig: (config: AllowlistPrecompileConfig) => void;
  setFeeManagerEnabled: (enabled: boolean) => void;
  setFeeManagerAdmins: (admins: string[]) => void;
  setRewardManagerEnabled: (enabled: boolean) => void;
  setRewardManagerAdmins: (admins: string[]) => void;
  
  // Bulk update from chat responses
  updateFromChatResponse: (updates: Partial<GenesisFormData>) => void;
  
  // UI State
  activeTab: string;
  setActiveTab: (tab: string) => void;
  expandedSections: Set<SectionId>;
  toggleSection: (sectionId: SectionId) => void;
  isSectionExpanded: (sectionId: SectionId) => boolean;
  
  // Validation
  validationMessages: ValidationMessages;
  isGenesisReady: boolean;
  
  // Genesis JSON
  genesisData: string;
  
  // Actions
  copyToClipboard: () => Promise<void>;
  downloadGenesis: () => void;
  
  // Reset
  resetForm: () => void;
}

const GenesisContext = createContext<GenesisContextType | undefined>(undefined);

interface GenesisProviderProps {
  children: ReactNode;
  initiallyExpandedSections?: SectionId[];
}

// Helper function to convert gwei to wei
const gweiToWei = (gwei: number): number => gwei * 1000000000;

// Helper function to deep merge objects
const deepMerge = (target: any, source: any): any => {
  const result = { ...target };
  
  for (const key in source) {
    if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  
  return result;
};

export const GenesisProvider: React.FC<GenesisProviderProps> = ({ 
  children, 
  initiallyExpandedSections = ["chainParams"] 
}) => {
  const { address } = useWallet();
  const { setGenesisUpdateCallback } = useChat();
  
  // Initialize form data
  const [formData, setFormData] = useState<GenesisFormData>(() => ({
    evmChainId: 10000 + Math.floor(Math.random() * 90000),
    gasLimit: 15000000,
    targetBlockRate: 2,
    tokenAllocations: [],
    feeConfig: DEFAULT_FEE_CONFIG,
    contractDeployerAllowListConfig: generateEmptyAllowlistPrecompileConfig(),
    contractNativeMinterConfig: generateEmptyAllowlistPrecompileConfig(),
    txAllowListConfig: generateEmptyAllowlistPrecompileConfig(),
    feeManagerEnabled: false,
    feeManagerAdmins: [],
    rewardManagerEnabled: false,
    rewardManagerAdmins: [],
    warpConfig: DEFAULT_WARP_CONFIG
  }));
  
  // UI State
  const [activeTab, setActiveTab] = useState<string>("config");
  const [expandedSections, setExpandedSections] = useState<Set<SectionId>>(
    new Set(initiallyExpandedSections || [])
  );
  const [copied, setCopied] = useState(false);
  const [validationMessages, setValidationMessages] = useState<ValidationMessages>({ errors: {}, warnings: {} });
  const [genesisData, setGenesisData] = useState<string>("");
  const [shouldGenerateGenesis, setShouldGenerateGenesis] = useState(false);

  // Register update callback with ChatContext
  useEffect(() => {
    setGenesisUpdateCallback(updateFromChatResponse);
  }, [setGenesisUpdateCallback]);

  // Initialize owner allocation when wallet address is available
  useEffect(() => {
    if (address && formData.tokenAllocations.length === 0) {
      setFormData(prev => ({
        ...prev,
        tokenAllocations: [{ address: address, amount: 1000000 }]
      }));
    }
  }, [address, formData.tokenAllocations.length]);

  // Validation effect
  useEffect(() => {
    const errors: { [key: string]: string } = {};
    const warnings: { [key: string]: string } = {};

    // Chain ID
    if (formData.evmChainId <= 0) errors.chainId = "Chain ID must be positive";

    // Gas Limit
    if (formData.gasLimit < 0) errors.gasLimit = "Gas limit must be non-negative";
    if (formData.gasLimit < 15000000) warnings.gasLimit = "Gas limit below 15M may impact network performance";
    if (formData.gasLimit > 30000000) warnings.gasLimit = "Gas limit above 30M may require significant resources";

    // Block Rate
    if (formData.targetBlockRate <= 0) errors.blockRate = "Block rate must be positive";
    if (formData.targetBlockRate > 10) warnings.blockRate = "Block rates above 10 seconds may impact user experience";

    // Token Allocations
    if (formData.tokenAllocations.length === 0) errors.tokenAllocations = "At least one token allocation is required.";
    formData.tokenAllocations.forEach((alloc, index) => {
      if (!alloc.address || !/^0x[a-fA-F0-9]{40}$/.test(alloc.address)) {
        errors[`alloc_${index}_addr`] = `Allocation ${index + 1}: Invalid address format`;
      }
      if (isNaN(alloc.amount) || alloc.amount < 0) {
        errors[`alloc_${index}_amt`] = `Allocation ${index + 1}: Invalid amount`;
      }
    });

    // Allowlist Precompiles
    if (!isValidAllowlistPrecompileConfig(formData.contractDeployerAllowListConfig)) {
      errors.contractDeployerAllowList = "Contract Deployer Allow List: Configuration is invalid or requires at least one valid address.";
    }
    if (!isValidAllowlistPrecompileConfig(formData.contractNativeMinterConfig)) {
      errors.contractNativeMinter = "Native Minter: Configuration is invalid or requires at least one valid address.";
    }
    if (!isValidAllowlistPrecompileConfig(formData.txAllowListConfig)) {
      errors.txAllowList = "Transaction Allow List: Configuration is invalid or requires at least one valid address.";
    }

    // Fee/Reward Manager
    if (formData.feeManagerEnabled && formData.feeManagerAdmins.length === 0) {
      errors.feeManager = "Fee Manager: At least one admin address is required when enabled.";
    }
    if (formData.rewardManagerEnabled && formData.rewardManagerAdmins.length === 0) {
      errors.rewardManager = "Reward Manager: At least one admin address is required when enabled.";
    }

    // Fee Config Parameters
    if (formData.feeConfig.minBaseFee < 0) errors.minBaseFee = "Min base fee must be non-negative";
    if (formData.feeConfig.minBaseFee < gweiToWei(1)) warnings.minBaseFee = "Min base fee below 1 gwei may cause issues";
    if (formData.feeConfig.minBaseFee > gweiToWei(500)) warnings.minBaseFee = "Min base fee above 500 gwei may be expensive";

    if (formData.feeConfig.targetGas < 0) errors.targetGas = "Target gas must be non-negative";
    if (formData.feeConfig.targetGas < 1000000) warnings.targetGas = "Target gas below 1M may lead to congestion";
    if (formData.feeConfig.targetGas > 50000000) warnings.targetGas = "Target gas above 50M may require significant resources";

    if (formData.feeConfig.baseFeeChangeDenominator < 0) errors.baseFeeChangeDenominator = "Base fee change denominator must be non-negative";
    if (formData.feeConfig.baseFeeChangeDenominator < 8) warnings.baseFeeChangeDenominator = "Low denominator may cause fees to change too rapidly";
    if (formData.feeConfig.baseFeeChangeDenominator > 1000) warnings.baseFeeChangeDenominator = "High denominator may cause fees to react too slowly";

    if (formData.feeConfig.minBlockGasCost < 0) errors.minBlockGasCost = "Min block gas cost must be non-negative";
    if (formData.feeConfig.minBlockGasCost > 1e9) warnings.minBlockGasCost = "Min block gas cost above 1B may impact performance";

    if (formData.feeConfig.maxBlockGasCost < formData.feeConfig.minBlockGasCost) {
      errors.maxBlockGasCost = "Max block gas cost must be >= min block gas cost";
    }
    if (formData.feeConfig.maxBlockGasCost > 1e10) warnings.maxBlockGasCost = "Max block gas cost above 10B may impact performance";

    if (formData.feeConfig.blockGasCostStep < 0) errors.blockGasCostStep = "Block gas cost step must be non-negative";
    if (formData.feeConfig.blockGasCostStep > 5000000) warnings.blockGasCostStep = "Block gas cost step above 5M may cause fees to change too rapidly";

    setValidationMessages({ errors, warnings });
    setShouldGenerateGenesis(Object.keys(errors).length === 0);
  }, [formData]);

  // Generate genesis JSON
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (!shouldGenerateGenesis) {
        setGenesisData("");
        return;
      }

      try {
        if (formData.tokenAllocations.length === 0 || !formData.tokenAllocations[0].address) {
          setGenesisData("Error: Valid first allocation address needed for ownership.");
          return;
        }

        // Create a simplified genesis structure for now
        // In a real implementation, you'd use the generateGenesis function from the example
        const finalGenesisConfig = {
          chainId: formData.evmChainId,
          gasLimit: `0x${formData.gasLimit.toString(16)}`,
          config: {
            feeConfig: {
              ...formData.feeConfig,
              gasLimit: formData.gasLimit,
              targetBlockRate: formData.targetBlockRate,
            },
            warpConfig: {
              blockTimestamp: Math.floor(Date.now() / 1000),
              quorumNumerator: formData.warpConfig.quorumNumerator,
              requirePrimaryNetworkSigners: formData.warpConfig.requirePrimaryNetworkSigners,
            },
            ...(formData.feeManagerEnabled && {
              feeManagerConfig: {
                adminAddresses: [...formData.feeManagerAdmins],
                blockTimestamp: Math.floor(Date.now() / 1000)
              }
            }),
            ...(formData.rewardManagerEnabled && {
              rewardManagerConfig: {
                adminAddresses: [...formData.rewardManagerAdmins],
                blockTimestamp: Math.floor(Date.now() / 1000)
              }
            }),
          },
          alloc: formData.tokenAllocations.reduce((acc, allocation) => {
            acc[allocation.address] = {
              balance: `0x${allocation.amount.toString(16)}`
            };
            return acc;
          }, {} as Record<string, { balance: string }>),
          timestamp: `0x${Math.floor(Date.now() / 1000).toString(16)}`
        };

        setGenesisData(JSON.stringify(finalGenesisConfig, null, 2));
      } catch (error) {
        console.error("Error generating genesis data:", error);
        setGenesisData(`Error generating genesis: ${error instanceof Error ? error.message : String(error)}`);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [shouldGenerateGenesis, formData]);

  // Individual setters
  const setEvmChainId = useCallback((id: number) => {
    setFormData(prev => ({ ...prev, evmChainId: id }));
  }, []);

  const setGasLimit = useCallback((limit: number) => {
    setFormData(prev => ({ ...prev, gasLimit: limit }));
  }, []);

  const setTargetBlockRate = useCallback((rate: number) => {
    setFormData(prev => ({ ...prev, targetBlockRate: rate }));
  }, []);

  const setTokenAllocations = useCallback((allocations: AllocationEntry[]) => {
    setFormData(prev => ({ ...prev, tokenAllocations: allocations }));
  }, []);

  const setFeeConfig = useCallback((config: FeeConfigType) => {
    setFormData(prev => ({ ...prev, feeConfig: config }));
  }, []);

  const setContractDeployerAllowListConfig = useCallback((config: AllowlistPrecompileConfig) => {
    setFormData(prev => ({ ...prev, contractDeployerAllowListConfig: config }));
  }, []);

  const setContractNativeMinterConfig = useCallback((config: AllowlistPrecompileConfig) => {
    setFormData(prev => ({ ...prev, contractNativeMinterConfig: config }));
  }, []);

  const setTxAllowListConfig = useCallback((config: AllowlistPrecompileConfig) => {
    setFormData(prev => ({ ...prev, txAllowListConfig: config }));
  }, []);

  const setFeeManagerEnabled = useCallback((enabled: boolean) => {
    setFormData(prev => ({ ...prev, feeManagerEnabled: enabled }));
  }, []);

  const setFeeManagerAdmins = useCallback((admins: string[]) => {
    setFormData(prev => ({ ...prev, feeManagerAdmins: admins }));
  }, []);

  const setRewardManagerEnabled = useCallback((enabled: boolean) => {
    setFormData(prev => ({ ...prev, rewardManagerEnabled: enabled }));
  }, []);

  const setRewardManagerAdmins = useCallback((admins: string[]) => {
    setFormData(prev => ({ ...prev, rewardManagerAdmins: admins }));
  }, []);

  // Bulk update from chat responses
  const updateFromChatResponse = useCallback((updates: Partial<GenesisFormData>) => {
    console.log('Updating genesis form data with:', updates);
    setFormData(prev => deepMerge(prev, updates));
  }, []);

  // Section management
  const toggleSection = useCallback((sectionId: SectionId) => {
    setExpandedSections(prev => {
      const newState = new Set(prev);
      if (newState.has(sectionId)) {
        newState.delete(sectionId);
      } else {
        newState.add(sectionId);
      }
      return newState;
    });
  }, []);

  const isSectionExpanded = useCallback((sectionId: SectionId) => expandedSections.has(sectionId), [expandedSections]);

  // Actions
  const copyToClipboard = useCallback(async () => {
    if (!genesisData) return;
    try {
      await navigator.clipboard.writeText(genesisData);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy genesis data:", err);
    }
  }, [genesisData]);

  const downloadGenesis = useCallback(() => {
    if (!genesisData) return;
    const blob = new Blob([genesisData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `genesis-${formData.evmChainId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [genesisData, formData.evmChainId]);

  const resetForm = useCallback(() => {
    setFormData({
      evmChainId: 10000 + Math.floor(Math.random() * 90000),
      gasLimit: 15000000,
      targetBlockRate: 2,
      tokenAllocations: address ? [{ address, amount: 1000000 }] : [],
      feeConfig: DEFAULT_FEE_CONFIG,
      contractDeployerAllowListConfig: generateEmptyAllowlistPrecompileConfig(),
      contractNativeMinterConfig: generateEmptyAllowlistPrecompileConfig(),
      txAllowListConfig: generateEmptyAllowlistPrecompileConfig(),
      feeManagerEnabled: false,
      feeManagerAdmins: [],
      rewardManagerEnabled: false,
      rewardManagerAdmins: [],
      warpConfig: DEFAULT_WARP_CONFIG
    });
    setActiveTab("config");
    setExpandedSections(new Set(initiallyExpandedSections || []));
  }, [address, initiallyExpandedSections]);

  const isGenesisReady = genesisData && Object.keys(validationMessages.errors).length === 0;

  const contextValue: GenesisContextType = {
    formData,
    setEvmChainId,
    setGasLimit,
    setTargetBlockRate,
    setTokenAllocations,
    setFeeConfig,
    setContractDeployerAllowListConfig,
    setContractNativeMinterConfig,
    setTxAllowListConfig,
    setFeeManagerEnabled,
    setFeeManagerAdmins,
    setRewardManagerEnabled,
    setRewardManagerAdmins,
    updateFromChatResponse,
    activeTab,
    setActiveTab,
    expandedSections,
    toggleSection,
    isSectionExpanded,
    validationMessages,
    isGenesisReady,
    genesisData,
    copyToClipboard,
    downloadGenesis,
    resetForm
  };

  return (
    <GenesisContext.Provider value={contextValue}>
      {children}
    </GenesisContext.Provider>
  );
};

export const useGenesis = (): GenesisContextType => {
  const context = useContext(GenesisContext);
  if (!context) {
    throw new Error('useGenesis must be used within a GenesisProvider');
  }
  return context;
}; 