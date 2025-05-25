'use client';

import React, { useEffect } from 'react';
import { Copy, Download, AlertCircle, Check } from 'lucide-react';
import { useGenesis } from '@/contexts/GenesisContext';
import { useChat } from '@/contexts/ChatContext';
import { ChainParamsSection } from './sections/ChainParamsSection';
import { TokenomicsSection } from './sections/TokenomicsSection';
import { PermissionsSection } from './sections/PermissionsSection';
import { TransactionFeesSection } from './sections/TransactionFeesSection';

export const GenesisBuilder: React.FC = () => {
  const {
    formData,
    setEvmChainId,
    setGasLimit,
    setTargetBlockRate,
    setTokenAllocations,
    setFeeConfig,
    setContractDeployerAllowListConfig,
    setContractNativeMinterConfig,
    setTxAllowListConfig,
    setFeeManagerEnabled,
    setFeeManagerAdmins,
    setRewardManagerEnabled,
    setRewardManagerAdmins,
    activeTab,
    setActiveTab,
    isSectionExpanded,
    toggleSection,
    validationMessages,
    isGenesisReady,
    genesisData,
    copyToClipboard,
    downloadGenesis
  } = useGenesis();

  const { sendMessage } = useChat();

  // Override the sendMessage function to always include genesis data
  useEffect(() => {
    // Store the original sendMessage function
    const originalSendMessage = sendMessage;
    
    // Create a wrapper that always includes genesis data
    window.sendMessageWithGenesis = (content: string) => {
      return originalSendMessage(content, formData);
    };
  }, [sendMessage, formData]);

  return (
    <div className="space-y-6 mb-4">
      {/* Tabs */}
      <div className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex -mb-px">
          {["config", "genesis"].map(tabId => (
            <button
              key={tabId}
              onClick={() => setActiveTab(tabId)}
              disabled={tabId === "genesis" && !isGenesisReady}
              className={`py-2 px-4 font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                activeTab === tabId
                  ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                  : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
              }`}
            >
              {tabId === "config" && "Configuration"}
              {tabId === "genesis" && "Genesis JSON"}
            </button>
          ))}
        </div>
      </div>

      {/* Configuration Tab */}
      {activeTab === "config" && (
        <div className="space-y-6">
          <ChainParamsSection
            evmChainId={formData.evmChainId}
            setEvmChainId={setEvmChainId}
            isExpanded={isSectionExpanded('chainParams')}
            toggleExpand={() => toggleSection('chainParams')}
            validationError={validationMessages.errors.chainId}
          />

          <PermissionsSection
            deployerConfig={formData.contractDeployerAllowListConfig}
            setDeployerConfig={setContractDeployerAllowListConfig}
            txConfig={formData.txAllowListConfig}
            setTxConfig={setTxAllowListConfig}
            isExpanded={isSectionExpanded('permissions')}
            toggleExpand={() => toggleSection('permissions')}
            validationErrors={validationMessages.errors}
          />

          <TokenomicsSection
            tokenAllocations={formData.tokenAllocations}
            setTokenAllocations={setTokenAllocations}
            nativeMinterConfig={formData.contractNativeMinterConfig}
            setNativeMinterConfig={setContractNativeMinterConfig}
            isExpanded={isSectionExpanded('tokenomics')}
            toggleExpand={() => toggleSection('tokenomics')}
            validationErrors={validationMessages.errors}
          />

          <TransactionFeesSection
            gasLimit={formData.gasLimit}
            setGasLimit={setGasLimit}
            targetBlockRate={formData.targetBlockRate}
            setTargetBlockRate={setTargetBlockRate}
            feeConfig={formData.feeConfig}
            setFeeConfig={setFeeConfig}
            feeManagerEnabled={formData.feeManagerEnabled}
            setFeeManagerEnabled={setFeeManagerEnabled}
            feeManagerAdmins={formData.feeManagerAdmins}
            setFeeManagerAdmins={setFeeManagerAdmins}
            rewardManagerEnabled={formData.rewardManagerEnabled}
            setRewardManagerEnabled={setRewardManagerEnabled}
            rewardManagerAdmins={formData.rewardManagerAdmins}
            setRewardManagerAdmins={setRewardManagerAdmins}
            isExpanded={isSectionExpanded('transactionFees')}
            toggleExpand={() => toggleSection('transactionFees')}
            validationMessages={validationMessages}
          />

          {/* Validation Summary & Actions */}
          <div>
            {Object.keys(validationMessages.errors).length > 0 ? (
              <div className="bg-red-50/70 dark:bg-red-900/20 border border-red-200 dark:border-red-800/60 p-4 rounded-md flex items-start mb-4">
                <AlertCircle className="text-red-500 mr-3 h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-800 dark:text-red-300">Please fix the following errors:</h4>
                  <ul className="mt-2 list-disc list-inside text-sm text-red-700 dark:text-red-400">
                    {Object.entries(validationMessages.errors).map(([key, message]) => (
                      <li key={key}>{message}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : isGenesisReady ? (
              <div className="bg-green-50/70 dark:bg-green-900/20 border border-green-200 dark:border-green-800/60 p-4 rounded-md flex items-center mb-4">
                <Check className="text-green-500 mr-3 h-5 w-5" />
                <span className="text-green-800 dark:text-green-300">Genesis configuration is valid and ready!</span>
              </div>
            ) : (
              <div className="bg-blue-50/70 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/60 p-4 rounded-md flex items-center mb-4">
                <Check className="text-blue-500 mr-3 h-5 w-5" />
                <span className="text-blue-800 dark:text-blue-300">Fill in the configuration to generate the genesis file.</span>
              </div>
            )}

            {Object.keys(validationMessages.warnings).length > 0 && (
              <div className="bg-yellow-50/70 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/60 p-4 rounded-md flex items-start mb-4">
                <AlertCircle className="text-yellow-500 mr-3 h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-300">Configuration Warnings:</h4>
                  <ul className="mt-2 list-disc list-inside text-sm text-yellow-700 dark:text-yellow-400">
                    {Object.entries(validationMessages.warnings).map(([key, message]) => (
                      <li key={key}>{message}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {isGenesisReady && (
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  onClick={() => setActiveTab("genesis")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  View Genesis JSON
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Genesis JSON Tab */}
      {activeTab === "genesis" && isGenesisReady && (
        <div className="p-5 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-zinc-800 dark:text-white">Genesis JSON</h3>
            <div className="flex space-x-2">
              <button
                onClick={copyToClipboard}
                className="flex items-center px-3 py-1 text-sm bg-zinc-600 text-white rounded-md hover:bg-zinc-700 transition-colors"
              >
                <Copy className="h-4 w-4 mr-1" /> Copy
              </button>
              <button
                onClick={downloadGenesis}
                className="flex items-center px-3 py-1 text-sm bg-zinc-600 text-white rounded-md hover:bg-zinc-700 transition-colors"
              >
                <Download className="h-4 w-4 mr-1" /> Download
              </button>
            </div>
          </div>

          <pre className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-md overflow-auto text-sm text-zinc-800 dark:text-zinc-200 max-h-96">
            {genesisData}
          </pre>

          <div className="mt-4 flex justify-center space-x-4">
            <button
              onClick={() => setActiveTab("config")}
              className="px-4 py-2 bg-zinc-600 text-white rounded-md hover:bg-zinc-700 transition-colors"
            >
              Back to Configuration
            </button>
          </div>
        </div>
      )}

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Debug: Current Form Data
          </h4>
          <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-auto max-h-32">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}; 