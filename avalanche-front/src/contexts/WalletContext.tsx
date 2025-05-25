'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { avalanche, avalancheFuji } from 'wagmi/chains';
import { coreWalletMultiChain, formatAVAX } from '@/lib/avalanche-multichain';

interface WalletContextType {
  // Connection state
  address?: string;
  isConnected: boolean;
  isConnecting: boolean;
  
  // Multi-chain state (P-Chain + C-Chain only)
  pchainAddress?: string;
  cchainBalance?: string;
  pchainBalance?: string;
  
  // Network state
  chainId?: number;
  isAvalancheNetwork: boolean;
  
  // Actions
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  switchToAvalanche: () => Promise<void>;
  switchToChain: (chainId: number) => Promise<void>;
  refreshBalances: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const { address, isConnected, isConnecting, chainId } = useAccount();
  const { connect: wagmiConnect } = useConnect();
  const { disconnect: wagmiDisconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  
  // Multi-chain state (P-Chain + C-Chain only)
  const [pchainAddress, setPchainAddress] = useState<string>();
  const [cchainBalance, setCchainBalance] = useState<string>();
  const [pchainBalance, setPchainBalance] = useState<string>();

  // Check if connected to Avalanche network (mainnet or testnet)
  const isAvalancheNetwork = chainId === avalanche.id || chainId === avalancheFuji.id;

  // Connect to Core Wallet
  const connect = async () => {
    try {
      console.log('Connecting to Core Wallet...');
      await wagmiConnect({ connector: injected() });
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  // Disconnect wallet
  const disconnect = async () => {
    try {
      await wagmiDisconnect();
      // Clear multi-chain state
      setPchainAddress(undefined);
      setCchainBalance(undefined);
      setPchainBalance(undefined);
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  // Switch to Avalanche network (default to Fuji testnet)
  const switchToAvalanche = async () => {
    try {
      await switchChain({ chainId: avalancheFuji.id });
    } catch (error) {
      console.error('Failed to switch to Avalanche network:', error);
    }
  };

  // Switch to specific chain
  const switchToChain = async (targetChainId: number) => {
    try {
      await switchChain({ chainId: targetChainId });
    } catch (error) {
      console.error(`Failed to switch to chain ${targetChainId}:`, error);
    }
  };

  // Refresh balances for P-Chain and C-Chain
  const refreshBalances = async () => {
    if (!address) return;

    try {
      // Get C-Chain balance
      if (isAvalancheNetwork) {
        const cBalance = await coreWalletMultiChain.getCChainBalance(address);
        setCchainBalance(formatAVAX(cBalance));
      }

      // Mock P-Chain balance (since P-Chain balance requires special API calls)
      // In real implementation, this would query P-Chain balance
      setPchainBalance('0.0000');
      
      console.log('Balances refreshed for P-Chain and C-Chain');
    } catch (error) {
      console.error('Failed to refresh balances:', error);
      setCchainBalance('0.0000');
      setPchainBalance('0.0000');
    }
  };

  // Initialize multi-chain addresses when wallet connects
  useEffect(() => {
    const initializeMultiChainAddresses = async () => {
      if (isConnected && address && isAvalancheNetwork) {
        try {
          // Connect to multi-chain wallet and get addresses
          const result = await coreWalletMultiChain.connectWallet();
          
          if (result.success && result.addresses) {
            console.log('Multi-chain addresses initialized:', result.addresses);
            
            // Set P-Chain address (converted from C-Chain address)
            setPchainAddress(result.addresses.pchain);
            
            // Refresh balances
            await refreshBalances();
          } else {
            console.warn('Failed to get multi-chain addresses:', result.error);
          }
        } catch (error) {
          console.error('Error initializing multi-chain addresses:', error);
        }
      } else {
        // Clear addresses if not connected or not on Avalanche
        setPchainAddress(undefined);
        setCchainBalance(undefined);
        setPchainBalance(undefined);
      }
    };

    initializeMultiChainAddresses();
  }, [isConnected, address, isAvalancheNetwork]);

  // Auto-refresh balances when chain changes
  useEffect(() => {
    if (isConnected && address && isAvalancheNetwork) {
      refreshBalances();
    }
  }, [chainId, isConnected, address, isAvalancheNetwork]);

  const value: WalletContextType = {
    // Connection state
    address,
    isConnected,
    isConnecting,
    
    // Multi-chain state (P-Chain + C-Chain only)
    pchainAddress,
    cchainBalance,
    pchainBalance,
    
    // Network state
    chainId,
    isAvalancheNetwork,
    
    // Actions
    connect,
    disconnect,
    switchToAvalanche,
    switchToChain,
    refreshBalances,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}; 