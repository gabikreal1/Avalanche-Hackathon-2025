'use client';

import React from 'react';
import { InputBlock as InputBlockType } from '@/types/steps';

interface InputBlockProps {
  block: InputBlockType;
  value?: string;
  onChange?: (value: string) => void;
}

export const InputBlock: React.FC<InputBlockProps> = ({ block, value = '', onChange }) => {
  return (
    <div className="mb-4">
      <h4 className="text-white font-medium mb-2">{block.heading}</h4>
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
