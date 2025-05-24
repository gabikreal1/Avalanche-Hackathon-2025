'use client';

import React from 'react';
import { CheckboxBlock as CheckboxBlockType } from '@/types/steps';

interface CheckboxBlockProps {
  block: CheckboxBlockType;
  selectedOptions?: string[];
  onChange?: (selectedOptions: string[]) => void;
}

export const CheckboxBlock: React.FC<CheckboxBlockProps> = ({ 
  block, 
  selectedOptions = [], 
  onChange 
}) => {
  const handleOptionChange = (option: string, isChecked: boolean) => {
    const newSelection = isChecked
      ? [...selectedOptions, option]
      : selectedOptions.filter(item => item !== option);
    onChange?.(newSelection);
  };

  return (
    <div className="mb-4">
      <div className="space-y-2">
        {block.options.map((option, index) => (
          <label key={index} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedOptions.includes(option)}
              onChange={(e) => handleOptionChange(option, e.target.checked)}
              className="w-4 h-4 text-orange-500 bg-gray-800 border-gray-600 rounded focus:ring-orange-500"
            />
            <span className="text-white">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};
