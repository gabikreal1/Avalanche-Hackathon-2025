'use client';

import React from 'react';
import { RadioBlock as RadioBlockType } from '@/types/steps';

interface RadioBlockProps {
  block: RadioBlockType;
  selectedOption?: string;
  onChange?: (selectedOption: string) => void;
}

export const RadioBlock: React.FC<RadioBlockProps> = ({ 
  block, 
  selectedOption = '', 
  onChange 
}) => {
  const handleOptionChange = (option: string) => {
    onChange?.(option);
  };

  return (
    <div className="mb-4">
      <div className="space-y-2">
        {block.options.map((option, index) => (
          <label key={index} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name={`radio-${Math.random()}`}
              checked={selectedOption === option}
              onChange={() => handleOptionChange(option)}
              className="w-4 h-4 text-orange-500 bg-gray-800 border-gray-600 focus:ring-orange-500"
            />
            <span className="text-white">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};
