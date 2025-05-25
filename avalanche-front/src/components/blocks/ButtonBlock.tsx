'use client';

import { ButtonBlock as ButtonBlockType } from '@/types/steps';
import { useWallet } from '@/contexts/WalletContext';
import { useWalletValidation } from '@/hooks/useWalletValidation';
import { useButtonHandler } from '@/contexts/ButtonHandlerContext';

interface ButtonBlockProps {
  block: ButtonBlockType;
  onButtonClick: (value: string) => void;
}

export const ButtonBlock = ({ block, onButtonClick }: ButtonBlockProps) => {
  const { isConnected, isAvalancheNetwork } = useWallet();
  const { getValidationForAction, canProceedWithAction } = useWalletValidation();
  const { isProcessing } = useButtonHandler();
  
  const validation = getValidationForAction(block.value);
  const requiresWallet = ['GENERATE_SUBNET', 'CREATE_CHAIN'].includes(block.value);
  const isValidForAction = canProceedWithAction(block.value);
  
  const getButtonText = () => {
    if (isProcessing) return 'Processing...';
    
    if (requiresWallet && !isConnected) {
      return `Connect Wallet to ${block.name}`;
    }
    
    if (requiresWallet && isConnected && !isAvalancheNetwork) {
      return `Switch to Avalanche to ${block.name}`;
    }
    
    return block.name;
  };

  const getButtonStyle = () => {
    if (isProcessing) {
      return 'bg-gray-400 cursor-not-allowed';
    }
    
    if (requiresWallet && (!isConnected || !isAvalancheNetwork)) {
      return 'bg-blue-500 hover:bg-blue-600';
    }
    
    if (validation.errors.length > 0) {
      return 'bg-red-500 hover:bg-red-600';
    }
    
    return 'bg-[#ff394a] hover:bg-[#ff394a]';
  };

  return (
    <div className="space-y-2">
      <button
        onClick={() => onButtonClick(block.value)}
        disabled={isProcessing}
        className={`px-6 py-3 text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 w-full ${getButtonStyle()}`}
      >
        {isProcessing ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            {getButtonText()}
          </div>
        ) : (
          getButtonText()
        )}
      </button>
      
      {/* Validation Messages */}
      {validation.errors.length > 0 && (
        <div className="text-xs text-red-400 space-y-1">
          {validation.errors.map((error, index) => (
            <div key={index}>• {error}</div>
          ))}
        </div>
      )}
      
      {validation.warnings.length > 0 && (
        <div className="text-xs text-yellow-400 space-y-1">
          {validation.warnings.map((warning, index) => (
            <div key={index}>⚠ {warning}</div>
          ))}
        </div>
      )}
      
      {block.description && (
        <p className="text-sm text-gray-400 mt-2">
          {block.description}
        </p>
      )}
    </div>
  );
};
