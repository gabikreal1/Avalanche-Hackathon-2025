'use client';

import { useState } from 'react';
import { useBlock } from '@/contexts/BlockContext';
import { restoreSubnetConfig } from '@/lib/configRestorer';
import { SubnetConfig } from '@/types/subnetConfig';

export function ConfigurationTest() {
  const { formData, setBlockValue } = useBlock();
  const [showConfig, setShowConfig] = useState(false);

  // Restore the current configuration
  const currentConfig: SubnetConfig = restoreSubnetConfig(formData);

  // Sample function to set some test values
  const setTestValues = () => {
    setBlockValue('subnetId', 'subnet_1735689600000_abc123def');
    setBlockValue('subnetOwner', 'P-fuji1x7rz8ef5r3qjh0qzx8z9x7rz8ef5r3qjh0qzx8');
    setBlockValue('vmId', 'srEXiWaHuhNyGwPUi444Tu47ZEDwxTWrbQiuD7FmgSAQ6X7Dy');
    setBlockValue('evmChainId', 43114);
    setBlockValue('gasLimit', 8000000);
    setBlockValue('targetBlockRate', 2);
    setBlockValue('minBaseFee', '1000000000');
    setBlockValue('baseFeeChangeDenominator', 48);
    setBlockValue('feeManagerEnabled', true);
    setBlockValue('feeManagerAdmins', ['0x1234567890123456789012345678901234567890']);
    setBlockValue('contractDeployerAllowListEnabled', true);
    setBlockValue('contractDeployerAllowListAdmins', ['0xabcdefabcdefabcdefabcdefabcdefabcdefabcd']);
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Configuration Test
      </h2>
      
      <div className="space-y-4">
        <button
          onClick={setTestValues}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Set Test Values
        </button>
        
        <button
          onClick={() => setShowConfig(!showConfig)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ml-2"
        >
          {showConfig ? 'Hide' : 'Show'} Current Configuration
        </button>
      </div>

      {showConfig && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
            Flattened Form Data:
          </h3>
          <pre className="bg-gray-200 dark:bg-gray-700 p-4 rounded text-sm overflow-auto max-h-40">
            {JSON.stringify(formData, null, 2)}
          </pre>
          
          <h3 className="text-lg font-semibold mb-2 mt-4 text-gray-900 dark:text-white">
            Restored Configuration (sent to API):
          </h3>
          <pre className="bg-gray-200 dark:bg-gray-700 p-4 rounded text-sm overflow-auto max-h-60">
            {JSON.stringify(currentConfig, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 