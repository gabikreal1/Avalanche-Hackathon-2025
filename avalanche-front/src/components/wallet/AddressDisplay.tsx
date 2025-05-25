'use client';

import React, { useState } from 'react';
import { Copy, Check, Wallet, ArrowUpDown } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';

interface AddressDisplayProps {
  className?: string;
}

const AddressDisplay: React.FC<AddressDisplayProps> = ({ className = '' }) => {
  const { 
    address,           // C-Chain address 
    pchainAddress,     // P-Chain address
    cchainBalance,     // C-Chain balance
    pchainBalance,     // P-Chain balance  
    isConnected,
    isAvalancheNetwork 
  } = useWallet();
  
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

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

  // Format address for display (truncate middle)
  const formatAddress = (addr: string): string => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (!isConnected) {
    return (
      <div className={`p-3 border rounded-lg bg-gray-50 ${className}`}>
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <Wallet className="w-4 h-4" />
          <span>Wallet not connected</span>
        </div>
      </div>
    );
  }

  if (!isAvalancheNetwork) {
    return (
      <div className={`p-3 border rounded-lg bg-yellow-50 border-yellow-200 ${className}`}>
        <div className="flex items-center gap-2 text-yellow-700 text-sm">
          <ArrowUpDown className="w-4 h-4" />
          <span>Please switch to Avalanche network</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 gap-3 ${className}`}>
      {/* C-Chain (Contract Chain) */}
      <div className="p-3 border rounded-lg bg-blue-50 border-blue-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="font-medium text-blue-900 text-sm">C-Chain</span>
          </div>
          <span className="text-xs text-blue-700 font-mono">
            {cchainBalance ? `${cchainBalance} AVAX` : '---'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <code className="flex-1 px-2 py-1 bg-white rounded text-xs font-mono text-gray-700">
            {address ? formatAddress(address) : 'Not available'}
          </code>
          {address && (
            <button
              onClick={() => copyToClipboard(address, 'C-Chain')}
              className="p-1 hover:bg-blue-100 rounded transition-colors"
              title="Copy C-Chain address"
            >
              {copiedAddress === 'C-Chain' ? (
                <Check className="w-3 h-3 text-green-600" />
              ) : (
                <Copy className="w-3 h-3 text-blue-600" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* P-Chain (Platform Chain) */}
      <div className="p-3 border rounded-lg bg-purple-50 border-purple-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="font-medium text-purple-900 text-sm">P-Chain</span>
          </div>
          <span className="text-xs text-purple-700 font-mono">
            {pchainBalance ? `${pchainBalance} AVAX` : '---'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <code className="flex-1 px-2 py-1 bg-white rounded text-xs font-mono text-gray-700">
            {pchainAddress ? formatAddress(pchainAddress) : 'Generating...'}
          </code>
          {pchainAddress && (
            <button
              onClick={() => copyToClipboard(pchainAddress, 'P-Chain')}
              className="p-1 hover:bg-purple-100 rounded transition-colors"
              title="Copy P-Chain address"
            >
              {copiedAddress === 'P-Chain' ? (
                <Check className="w-3 h-3 text-green-600" />
              ) : (
                <Copy className="w-3 h-3 text-purple-600" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressDisplay;
export { AddressDisplay }; 