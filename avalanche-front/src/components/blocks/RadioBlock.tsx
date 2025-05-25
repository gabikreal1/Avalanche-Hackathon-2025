'use client';

import React from 'react';
import { RadioBlock as RadioBlockType } from '@/types/steps';
import { Tooltip } from './Tooltip';

interface RadioBlockProps {
  block: RadioBlockType;
  selectedOption?: string;
  onChange?: (selectedOption: string) => void;
  onAskAI?: (fieldName: string) => void;
}

export const RadioBlock: React.FC<RadioBlockProps> = ({ 
  block, 
  selectedOption = '', 
  onChange,
  onAskAI 
}) => {
  const handleOptionChange = (option: string) => {
    onChange?.(option);
  };

  return (
    <div className="mb-4">
      <div className="flex items-center mb-2">
        <h4 className="text-white font-medium">Select Option</h4>
        <Tooltip
          description={block.description}
          canAskAI={block.canAskAI}
          fieldName="Select Option"
          onAskAI={onAskAI}
        />
      </div>
      <div className="space-y-2">
        {block.options.map((option, index) => (
          <label key={index} className="flex items-center mb-2 cursor-pointer">
            <input
              type="radio"
              name={`radio-${Math.random()}`}
              value={option}
              checked={selectedOption === option}
              onChange={(e) => onChange?.(e.target.value)}
              className="mr-2 w-4 h-4 text-[#ff394a] bg-gray-800 border-gray-600 focus:ring-[#ff394a]"
            />
            <span className="text-white">{option}</span>
          </label>
        ))}
      </div>
      
      {selectedOption === block.options[1] && block.subfields && (
        <div className="mt-4 pl-6 border-l border-gray-600">
          {block.subfields.map((subfield, index) => (
            <div key={index} className="mb-3">
              <h5 className="text-white font-medium mb-2">{subfield.name}</h5>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
