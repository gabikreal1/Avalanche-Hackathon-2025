'use client';

import React from 'react';
import { useWallet } from '@/contexts/WalletContext';

interface NetworkInfo {
  id: number;
  name: string;
  color: string;
  bgColor: string;
}

const NETWORKS: Record<number, NetworkInfo> = {
  43114: {
    id: 43114,
    name: 'Avalanche',
    color: 'text-red-600',
    bgColor: 'bg-red-50 border-red-200'
  },
  43113: {
    id: 43113,
    name: 'Avalanche Fuji',
    color: 'text-[#ff394a]',
    bgColor: 'bg-orange-50 border-orange-200'
  }
};

export const NetworkSelector: React.FC = () => {
  const { chainId, isAvalancheNetwork, switchToAvalanche, isConnected } = useWallet();

  if (!isConnected) {
    return null;
  }

  const currentNetwork = chainId ? NETWORKS[chainId] : null;

  return (
    <div className="space-y-2">
      <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">
        Network
      </div>
      
      {currentNetwork ? (
        <div className={`flex items-center justify-between p-2 border rounded-lg ${currentNetwork.bgColor}`}>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              isAvalancheNetwork ? 'bg-green-500' : 'bg-yellow-500'
            }`}></div>
            <span className={`text-sm font-medium ${currentNetwork.color}`}>
              {currentNetwork.name}
            </span>
          </div>
          
          {!isAvalancheNetwork && (
            <button
              onClick={switchToAvalanche}
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              Switch
            </button>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between p-2 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <span className="text-sm text-gray-600">
              Unknown Network (ID: {chainId})
            </span>
          </div>
          
          <button
            onClick={switchToAvalanche}
            className="text-xs text-blue-600 hover:text-blue-800 underline"
          >
            Switch to Avalanche
          </button>
        </div>
      )}

      {!isAvalancheNetwork && (
        <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
          ⚠️ Please switch to Avalanche network to use subnet features
        </div>
      )}
    </div>
  );
}; 