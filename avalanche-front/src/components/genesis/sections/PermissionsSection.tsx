'use client';

import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { AllowlistPrecompileConfig } from '@/types/genesis';

interface PermissionsSectionProps {
  deployerConfig: AllowlistPrecompileConfig;
  setDeployerConfig: (config: AllowlistPrecompileConfig) => void;
  txConfig: AllowlistPrecompileConfig;
  setTxConfig: (config: AllowlistPrecompileConfig) => void;
  isExpanded: boolean;
  toggleExpand: () => void;
  validationErrors: { [key: string]: string };
}

export const PermissionsSection: React.FC<PermissionsSectionProps> = ({
  deployerConfig,
  setDeployerConfig,
  txConfig,
  setTxConfig,
  isExpanded,
  toggleExpand,
  validationErrors
}) => {
  const toggleDeployerAllowlist = () => {
    setDeployerConfig({
      ...deployerConfig,
      activated: !deployerConfig.activated
    });
  };

  const toggleTxAllowlist = () => {
    setTxConfig({
      ...txConfig,
      activated: !txConfig.activated
    });
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm overflow-hidden">
      <button
        onClick={toggleExpand}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
      >
        <div>
          <h3 className="text-lg font-medium text-zinc-800 dark:text-white">Permissions</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Configure who can deploy contracts and send transactions
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
            {/* Contract Deployment Permissions */}
            <div>
              <h4 className="text-md font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                Contract Deployment
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id="deployerOpen"
                    name="deployerPermission"
                    checked={!deployerConfig.activated}
                    onChange={() => setDeployerConfig({ ...deployerConfig, activated: false })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-zinc-300"
                  />
                  <label htmlFor="deployerOpen" className="text-sm text-zinc-700 dark:text-zinc-300">
                    Anyone can deploy contracts
                  </label>
                </div>
                
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id="deployerRestricted"
                    name="deployerPermission"
                    checked={deployerConfig.activated}
                    onChange={toggleDeployerAllowlist}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-zinc-300"
                  />
                  <label htmlFor="deployerRestricted" className="text-sm text-zinc-700 dark:text-zinc-300">
                    Only approved addresses can deploy contracts
                  </label>
                </div>
              </div>

              {validationErrors.contractDeployerAllowList && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {validationErrors.contractDeployerAllowList}
                </p>
              )}

              {deployerConfig.activated && (
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    When enabled, you'll need to configure admin addresses in the detailed configuration.
                  </p>
                </div>
              )}
            </div>

            {/* Transaction Permissions */}
            <div>
              <h4 className="text-md font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                Transaction Permissions
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id="txOpen"
                    name="txPermission"
                    checked={!txConfig.activated}
                    onChange={() => setTxConfig({ ...txConfig, activated: false })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-zinc-300"
                  />
                  <label htmlFor="txOpen" className="text-sm text-zinc-700 dark:text-zinc-300">
                    Anyone can send transactions
                  </label>
                </div>
                
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id="txRestricted"
                    name="txPermission"
                    checked={txConfig.activated}
                    onChange={toggleTxAllowlist}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-zinc-300"
                  />
                  <label htmlFor="txRestricted" className="text-sm text-zinc-700 dark:text-zinc-300">
                    Only approved addresses can send transactions
                  </label>
                </div>
              </div>

              {validationErrors.txAllowList && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {validationErrors.txAllowList}
                </p>
              )}

              {txConfig.activated && (
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    When enabled, you'll need to configure admin addresses in the detailed configuration.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 