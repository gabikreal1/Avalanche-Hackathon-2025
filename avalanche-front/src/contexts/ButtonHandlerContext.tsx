'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useWallet } from './WalletContext';
import { useWalletValidation } from '@/hooks/useWalletValidation';
import { coreWalletMultiChain } from '@/lib/avalanche-multichain';

export enum ButtonAction {
  GENERATE_SUBNET = 'GENERATE_SUBNET',
  CREATE_CHAIN = 'CREATE_CHAIN',
  VALIDATE_PARAMETERS = 'VALIDATE_PARAMETERS',
  CONNECT_WALLET = 'CONNECT_WALLET',
  SWITCH_NETWORK = 'SWITCH_NETWORK'
}

interface ButtonHandlerContextType {
  handleButtonClick: (action: ButtonAction) => Promise<void>;
  isProcessing: boolean;
}

const ButtonHandlerContext = createContext<ButtonHandlerContextType | undefined>(undefined);

interface ButtonHandlerProviderProps {
  children: ReactNode;
}

export const ButtonHandlerProvider: React.FC<ButtonHandlerProviderProps> = ({ children }) => {
  const { 
    isConnected, 
    isAvalancheNetwork, 
    address,
    pchainAddress,
    connect, 
    switchToAvalanche,
    switchToChain,
    refreshBalances
  } = useWallet();
  const { canProceedWithAction, getValidationForAction } = useWalletValidation();
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleButtonClick = async (action: ButtonAction) => {
    setIsProcessing(true);
    
    try {
      // Handle wallet-specific actions first
      if (action === ButtonAction.CONNECT_WALLET) {
        await connect();
        return;
      }

      if (action === ButtonAction.SWITCH_NETWORK) {
        await switchToAvalanche();
        return;
      }

      // Validate wallet requirements for blockchain operations
      const validation = getValidationForAction(action);
      
      if (!validation.isValid) {
        console.warn(`Cannot proceed with ${action}:`, validation.errors);
        
        // Auto-trigger wallet connection if needed
        if (!isConnected) {
          console.log('Wallet not connected, triggering connection...');
          await connect();
          return;
        }
        
        // Auto-trigger network switch if needed
        if (isConnected && !isAvalancheNetwork) {
          console.log('Wrong network, switching to Avalanche...');
          await switchToAvalanche();
          return;
        }
        
        // If still invalid after auto-fixes, log errors
        validation.errors.forEach(error => console.error(error));
        return;
      }

      // Log any warnings
      validation.warnings.forEach(warning => console.warn(warning));

      // Execute the actual blockchain operation
      switch (action) {
        case ButtonAction.GENERATE_SUBNET:
          console.log('Generating subnet on P-Chain...', { 
            cchainAddress: address,
            pchainAddress, 
            network: isAvalancheNetwork 
          });
          await generateSubnet();
          break;
          
        case ButtonAction.CREATE_CHAIN:
          console.log('Creating chain on P-Chain...', { 
            cchainAddress: address,
            pchainAddress, 
            network: isAvalancheNetwork 
          });
          await createChain();
          break;
          
        case ButtonAction.VALIDATE_PARAMETERS:
          console.log('Validating parameters...');
          await validateParameters();
          break;
          
        default:
          console.warn(`Unknown button action: ${action}`);
      }
    } catch (error) {
      console.error(`Error executing ${action}:`, error);
    } finally {
      setIsProcessing(false);
    }
  };

  // P-Chain subnet generation using Core Wallet Multi-Chain
  const generateSubnet = async () => {
    console.log('Subnet generation initiated on P-Chain...');
    
    try {
      if (!pchainAddress) {
        throw new Error('No P-Chain address available');
      }

      // Validate P-Chain address format
      if (!pchainAddress.startsWith('P-')) {
        throw new Error('Invalid P-Chain address format');
      }

      // Use the multi-chain library for P-Chain operations
      const txId = await coreWalletMultiChain.createSubnet({
        controlKeys: [pchainAddress], // Use proper P-Chain address
        threshold: 1
      });
      
      console.log('Subnet created successfully on P-Chain!', { 
        txId, 
        pchainAddress,
        controlKeys: [pchainAddress]
      });
      
      // Refresh balances after transaction
      await refreshBalances();
      
    } catch (error) {
      console.error('Subnet generation failed:', error);
      throw error;
    }
  };

  // P-Chain chain creation using Core Wallet Multi-Chain
  const createChain = async () => {
    console.log('Chain creation initiated on P-Chain...');
    
    try {
      if (!pchainAddress) {
        throw new Error('No P-Chain address available');
      }

      // Mock subnet ID - in real implementation, this would come from previous subnet creation
      const mockSubnetId = 'subnet_example_id';
      
      // Use the multi-chain library for P-Chain operations
      const txId = await coreWalletMultiChain.createBlockchain({
        subnetID: mockSubnetId,
        chainName: 'MyCustomChain',
        vmID: 'evm', // or custom VM ID
        genesis: '{}' // Genesis configuration
      });
      
      console.log('Chain created successfully on P-Chain!', { 
        txId,
        pchainAddress,
        subnetID: mockSubnetId
      });
      
      // Refresh balances after transaction
      await refreshBalances();
      
    } catch (error) {
      console.error('Chain creation failed:', error);
      throw error;
    }
  };

  // Parameter validation (can be done on any chain)
  const validateParameters = async () => {
    console.log('Parameter validation initiated...');
    
    try {
      // Validate address formats
      if (address && !coreWalletMultiChain.validateAddress(address, 'C')) {
        throw new Error('Invalid C-Chain address format');
      }
      
      if (pchainAddress && !coreWalletMultiChain.validateAddress(pchainAddress, 'P')) {
        throw new Error('Invalid P-Chain address format');
      }
      
      // This doesn't require specific chain operations
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Parameters validated successfully!', {
        cchainAddress: address,
        pchainAddress,
        addressFormatsValid: true
      });
      
    } catch (error) {
      console.error('Parameter validation failed:', error);
      throw error;
    }
  };

  return (
    <ButtonHandlerContext.Provider value={{ handleButtonClick, isProcessing }}>
      {children}
    </ButtonHandlerContext.Provider>
  );
};

export const useButtonHandler = (): ButtonHandlerContextType => {
  const context = useContext(ButtonHandlerContext);
  if (!context) {
    throw new Error('useButtonHandler must be used within a ButtonHandlerProvider');
  }
  return context;
};
