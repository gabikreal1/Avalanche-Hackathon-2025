'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface BlockContextType {
  formData: Record<string, any>;
  configData: any;
  setBlockValue: (key: string, value: any) => void;
  getBlockValue: (key: string) => any;
  getConfigData: () => any;
  clearAllData: () => void;
  setManyBlockValues: (values: Record<string, string>) => void;
}

const BlockContext = createContext<BlockContextType | undefined>(undefined);

interface BlockProviderProps {
  children: ReactNode;
}

export const BlockProvider = ({ children }: BlockProviderProps) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [configData, setConfigData] = useState<any>(structuredClone(configDefault));

  // Helper function to update nested object using dot notation path
  const updateNestedValue = (obj: any, path: string, value: any): any => {
    const keys = path.split('.');
    const newObj = structuredClone(obj);
    let current = newObj;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      const nextKey = keys[i + 1];
      
      // Check if next key is a number (array index)
      if (!isNaN(Number(nextKey))) {
        if (!Array.isArray(current[key])) {
          current[key] = [];
        }
        current = current[key];
      } else {
        if (typeof current[key] !== 'object' || current[key] === null) {
          current[key] = {};
        }
        current = current[key];
      }
    }
    
    const lastKey = keys[keys.length - 1];
    current[lastKey] = value;
    
    return newObj;
  };

  // Function to flatten nested object into dot-notation keys
  const flattenObject = (obj: any, prefix = ''): Record<string, any> => {
    const flattened: Record<string, any> = {};
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newKey = prefix ? `${prefix}.${key}` : key;
        
        if (Array.isArray(obj[key])) {
          obj[key].forEach((item: any, index: number) => {
            if (typeof item === 'object' && item !== null) {
              Object.assign(flattened, flattenObject(item, `${newKey}.${index}`));
            } else {
              flattened[`${newKey}.${index}`] = item;
            }
          });
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          Object.assign(flattened, flattenObject(obj[key], newKey));
        } else {
          flattened[newKey] = obj[key];
        }
      }
    }
    
    return flattened;
  };

  const setBlockValue = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
    
    setConfigData(prev => updateNestedValue(prev, key, value));
  };

  const setManyBlockValues = (values: Record<string, string>) => {

    setFormData(prev => ({
      ...prev,
      ...values
    }));
  };

  const getBlockValue = (key: string) => {
    return formData[key];
  };

  const getConfigData = () => {
    return configData;
  };

  const clearAllData = () => {
    setFormData({});
    setConfigData(structuredClone(configDefault));
  };

  useEffect(() => {
    const defaultValues = flattenObject(configDefault);
    setManyBlockValues(defaultValues);
  }, [])


  useEffect(() => {
    console.log(configData)
  }
  , [configData]);

  const contextValue: BlockContextType = {
    formData,
    configData,
    setBlockValue,
    getBlockValue,
    getConfigData,
    clearAllData,
    setManyBlockValues
  };

  return (
    <BlockContext.Provider value={contextValue}>
      {children}
    </BlockContext.Provider>
  );
};

export const useBlock = () => {
  const context = useContext(BlockContext);
  if (!context) {
    throw new Error('useBlock must be used within a BlockProvider');
  }
  return context;
};

const configDefault = {
  "subnetId": "2g7FSEfznHtyHuLmTqpB5WGD9mPM5NG4dvzhjZCjRcx1QAToNe", // The unique identifier of the Subnet where this blockchain will reside.
  "vmId": "12352", // The unique identifier of the Virtual Machine (VM) to be used, e.g., Subnet-EVM.
  "evmChainId": 12345, // (number) The Chain ID for the EVM, used to prevent replay attacks.
  "gasLimit": 8000000, // (number) The maximum amount of gas allowed per block.
  "targetBlockRate": 2, // (number) Desired time (in seconds) between blocks.
  "tokenAllocations": [
    {
      "address": "0xYourAddressHere", // (string) Ethereum-style address to receive initial token allocation.
      "amount": "1000000000000000000" // (string) Amount of tokens allocated, in wei (1 AVAX = 10^18 wei).
    }
  ],
  "feeConfig": {
    "minBaseFee": "1000000000", // (string) Minimum base fee per gas, in wei.
    "baseFeeChangeDenominator": 8, // (number) Denominator for base fee adjustment rate.
    "minBlockGasCost": "0", // (string) Minimum gas cost per block, in wei.
    "maxBlockGasCost": "1000000000", // (string) Maximum gas cost per block, in wei.
    "blockGasCostStep": "100000000", // (string) Step size for adjusting block gas cost, in wei.
    "targetGas": "15000000" // (string) Target gas usage per block.
  },
  "contractDeployerAllowListConfig": {
    "enabled": true, // (boolean) If true, only specified addresses can deploy contracts.
    "admins": ["0xAdminAddress1"], // (array of strings) Addresses with admin rights over the allow list.
    "members": ["0xMemberAddress1"], // (array of strings) Addresses that can manage the allow list.
    "enabledAddresses": ["0xAllowedDeployer1"] // (array of strings) Addresses permitted to deploy contracts.
  },
  "contractNativeMinterConfig": {
    "enabled": true, // (boolean) If true, enables native token minting.
    "admins": ["0xAdminAddress2"], // (array of strings) Addresses with admin rights over minting.
    "members": ["0xMemberAddress2"], // (array of strings) Addresses that can manage minting permissions.
    "enabledAddresses": ["0xMinterAddress1"] // (array of strings) Addresses permitted to mint native tokens.
  },
  "txAllowListConfig": {
    "enabled": false, // (boolean) If true, only specified addresses can send transactions.
    "admins": ["0xAdminAddress3"], // (array of strings) Addresses with admin rights over the transaction allow list.
    "members": ["0xMemberAddress3"], // (array of strings) Addresses that can manage the transaction allow list.
    "enabledAddresses": ["0xAllowedTxSender1"] // (array of strings) Addresses permitted to send transactions.
  },
  "feeManagerEnabled": true, // (boolean) If true, enables dynamic fee management.
  "feeManagerAdmins": ["0xFeeManagerAdmin1"], // (array of strings) Addresses with admin rights over fee management.
  "rewardManagerEnabled": true, // (boolean) If true, enables reward distribution to validators.
  "rewardManagerAdmins": ["0xRewardManagerAdmin1"] // (array of strings) Addresses with admin rights over reward management.
}
