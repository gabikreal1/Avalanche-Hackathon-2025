'use client';

import React, { useState } from 'react';
import { Copy, Check, ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { avalanche, avalancheFuji } from 'wagmi/chains';

export const WalletButton: React.FC = () => {
  const { 
    isConnected, 
    isConnecting, 
    address,           // C-Chain address
    pchainAddress,     // P-Chain address
    cchainBalance,     // C-Chain balance
    pchainBalance,     // P-Chain balance
    isAvalancheNetwork,
    chainId,
    connect, 
    disconnect, 
    switchToAvalanche
  } = useWallet();
  
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const formatAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Get network name from chainId
  const getNetworkName = () => {
    if (!chainId) return 'Unknown Network';
    if (chainId === avalanche.id) return 'Avalanche Mainnet';
    if (chainId === avalancheFuji.id) return 'Avalanche Fuji';
    return 'Unknown Network';
  };

  // Copy address to clipboard
  const copyToClipboard = async (addr: string, label: string) => {
    try {
      await navigator.clipboard.writeText(addr);
      setCopiedAddress(label);
      setTimeout(() => setCopiedAddress(null), 2000);
    } catch (error) {
      console.error('Failed to copy address:', error);
    }
  };

  if (isConnected && address) {
    return (
      <div className="flex flex-col gap-2">
        {/* Main wallet button */}
        <div className="bg-[#2a2830] border border-[#363540] rounded-lg overflow-hidden">
          {/* Network status */}
          <div className={`p-3 ${isAvalancheNetwork ? 'bg-green-900/20 border-green-700/30' : 'bg-yellow-900/20 border-yellow-700/30'} border-b`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isAvalancheNetwork ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                <span className={`text-sm font-medium ${isAvalancheNetwork ? 'text-green-300' : 'text-yellow-300'}`}>
                  {getNetworkName()}
                </span>
              </div>
              {!isAvalancheNetwork && (
                <button
                  onClick={switchToAvalanche}
                  className="text-xs text-yellow-400 hover:text-yellow-300 underline flex items-center gap-1"
                >
                  <ArrowUpDown className="w-3 h-3" />
                  Switch
                </button>
              )}
            </div>
          </div>

          {/* Wallet info */}
          <div className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-sm font-medium text-white mb-1">Wallet Connected</div>
                <div className="text-xs text-gray-400">
                  C-Chain: {formatAddress(address)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-xs text-blue-400 hover:text-blue-300 underline flex items-center gap-1"
                >
                  Details
                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
                <button
                  onClick={disconnect}
                  className="text-xs text-red-400 hover:text-red-300 underline"
                >
                  Disconnect
                </button>
              </div>
            </div>

            {/* Expanded details */}
            {isExpanded && (
              <div className="mt-3 pt-3 border-t border-[#363540]">
                <div className="grid grid-cols-2 gap-3">
                  {/* C-Chain */}
                  <div className="p-2 bg-blue-900/20 border border-blue-700/30 rounded">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-xs font-medium text-blue-300">C-Chain</span>
                      </div>
                      <span className="text-xs text-blue-400 font-mono">
                        {cchainBalance ? `${cchainBalance} AVAX` : '---'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <code className="flex-1 text-xs font-mono text-gray-300 bg-[#1c1b22] px-1 py-0.5 rounded">
                        {formatAddress(address)}
                      </code>
                      <button
                        onClick={() => copyToClipboard(address, 'C-Chain')}
                        className="p-0.5 hover:bg-blue-800/30 rounded transition-colors"
                        title="Copy C-Chain address"
                      >
                        {copiedAddress === 'C-Chain' ? (
                          <Check className="w-3 h-3 text-green-400" />
                        ) : (
                          <Copy className="w-3 h-3 text-blue-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* P-Chain */}
                  <div className="p-2 bg-purple-900/20 border border-purple-700/30 rounded">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span className="text-xs font-medium text-purple-300">P-Chain</span>
                      </div>
                      <span className="text-xs text-purple-400 font-mono">
                        {pchainBalance ? `${pchainBalance} AVAX` : '---'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <code className="flex-1 text-xs font-mono text-gray-300 bg-[#1c1b22] px-1 py-0.5 rounded">
                        {pchainAddress ? formatAddress(pchainAddress) : 'Generating...'}
                      </code>
                      {pchainAddress && (
                        <button
                          onClick={() => copyToClipboard(pchainAddress, 'P-Chain')}
                          className="p-0.5 hover:bg-purple-800/30 rounded transition-colors"
                          title="Copy P-Chain address"
                        >
                          {copiedAddress === 'P-Chain' ? (
                            <Check className="w-3 h-3 text-green-400" />
                          ) : (
                            <Copy className="w-3 h-3 text-purple-400" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={connect}
        disabled={isConnecting}
        className={`w-full px-4 py-3 text-white font-medium rounded-lg transition-colors ${
          isConnecting
            ? 'bg-gray-600 cursor-not-allowed'
            : 'bg-[#ff394a] hover:bg-[#ff3950] focus:ring-2 focus:ring-[#ff394a]/50 focus:ring-offset-2 focus:ring-offset-[#1c1b22]'
        }`}
      >
        {isConnecting ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Connecting...
          </div>
        ) : (
          'Connect Wallet'
        )}
      </button>
    </div>
  );
}; 