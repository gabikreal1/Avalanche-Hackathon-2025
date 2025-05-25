'use client';

import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { FeeConfigType, ValidationMessages } from '@/types/genesis';

interface TransactionFeesSectionProps {
  gasLimit: number;
  setGasLimit: (limit: number) => void;
  targetBlockRate: number;
  setTargetBlockRate: (rate: number) => void;
  feeConfig: FeeConfigType;
  setFeeConfig: (config: FeeConfigType) => void;
  feeManagerEnabled: boolean;
  setFeeManagerEnabled: (enabled: boolean) => void;
  feeManagerAdmins: string[];
  setFeeManagerAdmins: (admins: string[]) => void;
  rewardManagerEnabled: boolean;
  setRewardManagerEnabled: (enabled: boolean) => void;
  rewardManagerAdmins: string[];
  setRewardManagerAdmins: (admins: string[]) => void;
  isExpanded: boolean;
  toggleExpand: () => void;
  validationMessages: ValidationMessages;
}

export const TransactionFeesSection: React.FC<TransactionFeesSectionProps> = ({
  gasLimit,
  setGasLimit,
  targetBlockRate,
  setTargetBlockRate,
  feeConfig,
  setFeeConfig,
  feeManagerEnabled,
  setFeeManagerEnabled,
  feeManagerAdmins,
  setFeeManagerAdmins,
  rewardManagerEnabled,
  setRewardManagerEnabled,
  rewardManagerAdmins,
  setRewardManagerAdmins,
  isExpanded,
  toggleExpand,
  validationMessages
}) => {
  const updateFeeConfig = (field: keyof FeeConfigType, value: number) => {
    setFeeConfig({ ...feeConfig, [field]: value });
  };

  // Helper to convert wei to gwei for display
  const weiToGwei = (wei: number): number => wei / 1000000000;
  const gweiToWei = (gwei: number): number => gwei * 1000000000;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm overflow-hidden">
      <button
        onClick={toggleExpand}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
      >
        <div>
          <h3 className="text-lg font-medium text-zinc-800 dark:text-white">Transaction Fees & Gas</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Configure gas limits, block timing, and fee parameters
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
            {/* Basic Gas Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Gas Limit
                </label>
                <input
                  type="number"
                  value={gasLimit}
                  onChange={(e) => setGasLimit(parseInt(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white ${
                    validationMessages.errors.gasLimit 
                      ? 'border-red-300 dark:border-red-600' 
                      : 'border-zinc-300 dark:border-zinc-600'
                  }`}
                  placeholder="15000000"
                />
                {validationMessages.errors.gasLimit && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {validationMessages.errors.gasLimit}
                  </p>
                )}
                {validationMessages.warnings.gasLimit && (
                  <p className="mt-1 text-sm text-yellow-600 dark:text-yellow-400">
                    {validationMessages.warnings.gasLimit}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Target Block Rate (seconds)
                </label>
                <input
                  type="number"
                  value={targetBlockRate}
                  onChange={(e) => setTargetBlockRate(parseInt(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white ${
                    validationMessages.errors.blockRate 
                      ? 'border-red-300 dark:border-red-600' 
                      : 'border-zinc-300 dark:border-zinc-600'
                  }`}
                  placeholder="2"
                />
                {validationMessages.errors.blockRate && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {validationMessages.errors.blockRate}
                  </p>
                )}
                {validationMessages.warnings.blockRate && (
                  <p className="mt-1 text-sm text-yellow-600 dark:text-yellow-400">
                    {validationMessages.warnings.blockRate}
                  </p>
                )}
              </div>
            </div>

            {/* Fee Configuration */}
            <div>
              <h4 className="text-md font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                Fee Configuration
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Min Base Fee (gwei)
                  </label>
                  <input
                    type="number"
                    value={weiToGwei(feeConfig.minBaseFee)}
                    onChange={(e) => updateFeeConfig('minBaseFee', gweiToWei(parseFloat(e.target.value) || 0))}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white ${
                      validationMessages.errors.minBaseFee 
                        ? 'border-red-300 dark:border-red-600' 
                        : 'border-zinc-300 dark:border-zinc-600'
                    }`}
                    placeholder="25"
                    step="0.1"
                  />
                  {validationMessages.errors.minBaseFee && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {validationMessages.errors.minBaseFee}
                    </p>
                  )}
                  {validationMessages.warnings.minBaseFee && (
                    <p className="mt-1 text-sm text-yellow-600 dark:text-yellow-400">
                      {validationMessages.warnings.minBaseFee}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Target Gas
                  </label>
                  <input
                    type="number"
                    value={feeConfig.targetGas}
                    onChange={(e) => updateFeeConfig('targetGas', parseInt(e.target.value) || 0)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white ${
                      validationMessages.errors.targetGas 
                        ? 'border-red-300 dark:border-red-600' 
                        : 'border-zinc-300 dark:border-zinc-600'
                    }`}
                    placeholder="15000000"
                  />
                  {validationMessages.errors.targetGas && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {validationMessages.errors.targetGas}
                    </p>
                  )}
                  {validationMessages.warnings.targetGas && (
                    <p className="mt-1 text-sm text-yellow-600 dark:text-yellow-400">
                      {validationMessages.warnings.targetGas}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Base Fee Change Denominator
                  </label>
                  <input
                    type="number"
                    value={feeConfig.baseFeeChangeDenominator}
                    onChange={(e) => updateFeeConfig('baseFeeChangeDenominator', parseInt(e.target.value) || 0)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white ${
                      validationMessages.errors.baseFeeChangeDenominator 
                        ? 'border-red-300 dark:border-red-600' 
                        : 'border-zinc-300 dark:border-zinc-600'
                    }`}
                    placeholder="48"
                  />
                  {validationMessages.errors.baseFeeChangeDenominator && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {validationMessages.errors.baseFeeChangeDenominator}
                    </p>
                  )}
                  {validationMessages.warnings.baseFeeChangeDenominator && (
                    <p className="mt-1 text-sm text-yellow-600 dark:text-yellow-400">
                      {validationMessages.warnings.baseFeeChangeDenominator}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Block Gas Cost Step
                  </label>
                  <input
                    type="number"
                    value={feeConfig.blockGasCostStep}
                    onChange={(e) => updateFeeConfig('blockGasCostStep', parseInt(e.target.value) || 0)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white ${
                      validationMessages.errors.blockGasCostStep 
                        ? 'border-red-300 dark:border-red-600' 
                        : 'border-zinc-300 dark:border-zinc-600'
                    }`}
                    placeholder="200000"
                  />
                  {validationMessages.errors.blockGasCostStep && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {validationMessages.errors.blockGasCostStep}
                    </p>
                  )}
                  {validationMessages.warnings.blockGasCostStep && (
                    <p className="mt-1 text-sm text-yellow-600 dark:text-yellow-400">
                      {validationMessages.warnings.blockGasCostStep}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Fee Manager */}
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <input
                  type="checkbox"
                  id="feeManager"
                  checked={feeManagerEnabled}
                  onChange={(e) => setFeeManagerEnabled(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-zinc-300 rounded"
                />
                <label htmlFor="feeManager" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Enable Fee Manager Precompile
                </label>
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Allows designated addresses to modify fee configuration after deployment.
              </p>
              {validationMessages.errors.feeManager && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {validationMessages.errors.feeManager}
                </p>
              )}
            </div>

            {/* Reward Manager */}
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <input
                  type="checkbox"
                  id="rewardManager"
                  checked={rewardManagerEnabled}
                  onChange={(e) => setRewardManagerEnabled(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-zinc-300 rounded"
                />
                <label htmlFor="rewardManager" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Enable Reward Manager Precompile
                </label>
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Allows designated addresses to configure block rewards after deployment.
              </p>
              {validationMessages.errors.rewardManager && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {validationMessages.errors.rewardManager}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 