'use client';

import React, { useEffect } from 'react';
import { InputBlock as InputBlockType } from '@/types/steps';
import { Tooltip } from './Tooltip';
import { useWallet } from '@/contexts/WalletContext';

interface InputBlockProps {
  block: InputBlockType;
  value?: string;
  onChange?: (value: string) => void;
  onAskAI?: (fieldName: string) => void;
}

export const InputBlock: React.FC<InputBlockProps> = ({ 
  block, 
  value = '', 
  onChange,
  onAskAI 
}) => {
  const { address, isConnected } = useWallet();

  // Auto-populate subnet owner field with connected wallet address
  useEffect(() => {
    if (
      block.heading === 'Subnet Owner' && 
      isConnected && 
      address && 
      !value && 
      onChange
    ) {
      onChange(address);
    }
  }, [block.heading, isConnected, address, value, onChange]);

  const isSubnetOwnerField = block.heading === 'Subnet Owner';
  const shouldShowWalletHelper = isSubnetOwnerField && !isConnected;

  return (
    <div className="mb-4">
      <div className="flex items-center mb-2">
        <h4 className="text-white text-xl font-medium">{block.heading}</h4>
        <Tooltip
          description={block.description}
          canAskAI={block.canAskAI}
          fieldName={block.heading}
          onAskAI={onAskAI}
        />
      </div>
      
      <input
        type="text"
        placeholder={block.placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={`w-full px-3 py-2 bg-gray-800 text-lg border rounded-lg text-white placeholder-gray-400 focus:outline-none transition-colors ${
          isSubnetOwnerField && isConnected && address === value
            ? 'border-green-500 focus:border-green-400'
            : 'border-gray-600 focus:border-[#ff394a]'
        }`}
      />
      
      {/* Wallet Helper for Subnet Owner */}
      {shouldShowWalletHelper && (
        <div className="mt-2 text-xs text-blue-400 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Connect your wallet to auto-populate this field
        </div>
      )}
      
      {/* Address Confirmation for Subnet Owner */}
      {isSubnetOwnerField && isConnected && address === value && (
        <div className="mt-2 text-xs text-green-400 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Using connected wallet address
        </div>
      )}
    </div>
  );
};
