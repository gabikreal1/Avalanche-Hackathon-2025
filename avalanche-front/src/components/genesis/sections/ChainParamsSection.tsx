'use client';

import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface ChainParamsSectionProps {
  evmChainId: number;
  setEvmChainId: (id: number) => void;
  isExpanded: boolean;
  toggleExpand: () => void;
  validationError?: string;
}

export const ChainParamsSection: React.FC<ChainParamsSectionProps> = ({
  evmChainId,
  setEvmChainId,
  isExpanded,
  toggleExpand,
  validationError
}) => {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm overflow-hidden">
      <button
        onClick={toggleExpand}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
      >
        <div>
          <h3 className="text-lg font-medium text-zinc-800 dark:text-white">Chain Parameters</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Configure basic chain settings
          </p>
        </div>
        {isExpanded ? (
          <ChevronDown className="h-5 w-5 text-zinc-500" />
        ) : (
          <ChevronRight className="h-5 w-5 text-zinc-500" />
        )}
      </button>

      {isExpanded && (
        <div className="px-5 pb-5 border-t border-zinc-200 dark:border-zinc-800">
          <div className="pt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                EVM Chain ID
              </label>
              <input
                type="number"
                value={evmChainId}
                onChange={(e) => setEvmChainId(parseInt(e.target.value) || 0)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white ${
                  validationError 
                    ? 'border-red-300 dark:border-red-600' 
                    : 'border-zinc-300 dark:border-zinc-600'
                }`}
                placeholder="e.g., 34257"
              />
              {validationError && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {validationError}
                </p>
              )}
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                A unique identifier for your blockchain network. Must be different from existing networks.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 