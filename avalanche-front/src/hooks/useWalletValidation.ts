'use client';

import { useWallet } from '@/contexts/WalletContext';
import { useMemo } from 'react';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export const useWalletValidation = () => {
  const { isConnected, isAvalancheNetwork, address, chainId } = useWallet();

  const validateForSubnetCreation = useMemo((): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!isConnected) {
      errors.push('Wallet not connected');
    }

    if (!address) {
      errors.push('No wallet address available');
    }

    if (!isAvalancheNetwork) {
      errors.push('Must be connected to Avalanche network');
    }

    if (chainId === 43114) {
      warnings.push('You are on Avalanche Mainnet. Consider using Fuji testnet for testing');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }, [isConnected, isAvalancheNetwork, address, chainId]);

  const validateForChainCreation = useMemo((): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!isConnected) {
      errors.push('Wallet not connected');
    }

    if (!address) {
      errors.push('No wallet address available');
    }

    if (!isAvalancheNetwork) {
      errors.push('Must be connected to Avalanche network');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }, [isConnected, isAvalancheNetwork, address]);

  const validateForParameterValidation = useMemo((): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!isConnected) {
      warnings.push('Wallet connection recommended for parameter validation');
    }

    if (isConnected && !isAvalancheNetwork) {
      warnings.push('Connected to non-Avalanche network');
    }

    return {
      isValid: true, // Parameter validation doesn't require wallet
      errors,
      warnings
    };
  }, [isConnected, isAvalancheNetwork]);

  const getValidationForAction = (action: string): ValidationResult => {
    switch (action) {
      case 'GENERATE_SUBNET':
        return validateForSubnetCreation;
      case 'CREATE_CHAIN':
        return validateForChainCreation;
      case 'VALIDATE_PARAMETERS':
        return validateForParameterValidation;
      default:
        return { isValid: true, errors: [], warnings: [] };
    }
  };

  const canProceedWithAction = (action: string): boolean => {
    return getValidationForAction(action).isValid;
  };

  const getActionRequirements = (action: string): string[] => {
    const requirements: string[] = [];
    
    switch (action) {
      case 'GENERATE_SUBNET':
      case 'CREATE_CHAIN':
        requirements.push('Wallet connection required');
        requirements.push('Avalanche network required');
        requirements.push('Sufficient AVAX balance for gas fees');
        break;
      case 'VALIDATE_PARAMETERS':
        requirements.push('No wallet connection required');
        break;
    }

    return requirements;
  };

  return {
    validateForSubnetCreation,
    validateForChainCreation,
    validateForParameterValidation,
    getValidationForAction,
    canProceedWithAction,
    getActionRequirements,
    isWalletReady: isConnected && isAvalancheNetwork
  };
}; 