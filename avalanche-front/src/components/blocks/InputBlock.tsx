'use client';

import React from 'react';
import { InputBlock as InputBlockType } from '@/types/steps';
import { Tooltip } from './Tooltip';

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
  return (
    <div className="mb-4">
      <div className="flex items-center mb-2">
        <h4 className="text-white font-medium">{block.heading}</h4>
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
        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
      />
    </div>
  );
};
