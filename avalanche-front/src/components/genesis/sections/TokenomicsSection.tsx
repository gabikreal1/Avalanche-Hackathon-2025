'use client';

import React from 'react';
import { ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { AllocationEntry, AllowlistPrecompileConfig } from '@/types/genesis';

interface TokenomicsSectionProps {
  tokenAllocations: AllocationEntry[];
  setTokenAllocations: (allocations: AllocationEntry[]) => void;
  nativeMinterConfig: AllowlistPrecompileConfig;
  setNativeMinterConfig: (config: AllowlistPrecompileConfig) => void;
  isExpanded: boolean;
  toggleExpand: () => void;
  validationErrors: { [key: string]: string };
}

export const TokenomicsSection: React.FC<TokenomicsSectionProps> = ({
  tokenAllocations,
  setTokenAllocations,
  nativeMinterConfig,
  setNativeMinterConfig,
  isExpanded,
  toggleExpand,
  validationErrors
}) => {
  const addAllocation = () => {
    setTokenAllocations([...tokenAllocations, { address: '', amount: 0 }]);
  };

  const removeAllocation = (index: number) => {
    setTokenAllocations(tokenAllocations.filter((_, i) => i !== index));
  };

  const updateAllocation = (index: number, field: 'address' | 'amount', value: string | number) => {
    const updated = [...tokenAllocations];
    updated[index] = { ...updated[index], [field]: value };
    setTokenAllocations(updated);
  };

  const toggleNativeMinter = () => {
    setNativeMinterConfig({
      ...nativeMinterConfig,
      activated: !nativeMinterConfig.activated
    });
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm overflow-hidden">
      <button
        onClick={toggleExpand}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
      >
        <div>
          <h3 className="text-lg font-medium text-zinc-800 dark:text-white">Tokenomics</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Configure initial token distribution and native minting
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
          <div className="pt-4 space-y-6">
            {/* Token Allocations */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Initial Token Allocations
                </label>
                <button
                  onClick={addAllocation}
                  className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Allocation
                </button>
              </div>

              <div className="space-y-3">
                {tokenAllocations.map((allocation, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={allocation.address}
                        onChange={(e) => updateAllocation(index, 'address', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white ${
                          validationErrors[`alloc_${index}_addr`] 
                            ? 'border-red-300 dark:border-red-600' 
                            : 'border-zinc-300 dark:border-zinc-600'
                        }`}
                        placeholder="0x..."
                      />
                      {validationErrors[`alloc_${index}_addr`] && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {validationErrors[`alloc_${index}_addr`]}
                        </p>
                      )}
                    </div>
                    <div className="w-32">
                      <input
                        type="number"
                        value={allocation.amount}
                        onChange={(e) => updateAllocation(index, 'amount', parseInt(e.target.value) || 0)}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white ${
                          validationErrors[`alloc_${index}_amt`] 
                            ? 'border-red-300 dark:border-red-600' 
                            : 'border-zinc-300 dark:border-zinc-600'
                        }`}
                        placeholder="Amount"
                      />
                      {validationErrors[`alloc_${index}_amt`] && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {validationErrors[`alloc_${index}_amt`]}
                        </p>
                      )}
                    </div>
                    {tokenAllocations.length > 1 && (
                      <button
                        onClick={() => removeAllocation(index)}
                        className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {validationErrors.tokenAllocations && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {validationErrors.tokenAllocations}
                </p>
              )}
            </div>

            {/* Native Minter */}
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <input
                  type="checkbox"
                  id="nativeMinter"
                  checked={nativeMinterConfig.activated}
                  onChange={toggleNativeMinter}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-zinc-300 rounded"
                />
                <label htmlFor="nativeMinter" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Enable Native Minter Precompile
                </label>
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Allows designated addresses to mint native tokens after deployment.
              </p>
              {validationErrors.contractNativeMinter && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {validationErrors.contractNativeMinter}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 