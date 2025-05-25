'use client';

import React, { useEffect, useState } from 'react';
import { RadioBlock as RadioBlockType } from '@/types/steps';
import { Tooltip } from './Tooltip';
import { useBlock } from '@/contexts/BlockContext';

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
  const { setBlockValue } = useBlock();
  const [subfieldInputs, setSubfieldInputs] = useState<Record<string, string>>({});
  const [subfieldLists, setSubfieldLists] = useState<Record<string, string[] | boolean>>({
    enabled: false,
    admins: [],
    members: [],
    enabledAddresses: [],
  });

  const onUpdate = (value: string) => {
    setBlockValue(block.key, value);
  }

  const handleSubfieldInputChange = (subfieldName: string, value: string) => {
    setSubfieldInputs(prev => ({
      ...prev,
      [subfieldName]: value
    }));
  };

  const handleAddToSubfield = (subfieldName: string) => {
    const inputValue = subfieldInputs[subfieldName];
    if (!inputValue?.trim()) return;

    setSubfieldLists(prev => {
      const currentList = Array.isArray(prev[subfieldName]) ? prev[subfieldName] as string[] : [];
      const newList = [...currentList, inputValue.trim()];
      return { ...prev, [subfieldName]: newList };
    });

    // Clear the input field
    setSubfieldInputs(prev => ({
      ...prev,
      [subfieldName]: ''
    }));

    // onUpdate(JSON.stringify({ [subfieldName]: newList }));
  };

  const handleRemoveFromSubfield = (subfieldName: string, index: number) => {
    const currentList = subfieldLists[subfieldName] || [];
    const newList = (currentList as string[]).filter((_, i) => i !== index);
    setSubfieldLists(prev => ({
      ...prev,
      [subfieldName]: newList
    }));
  };

  const handleOptionChange = (optionValue: string) => {
    const optionIndex = parseInt(optionValue);
    const selectedOptionText = block.options[optionIndex];
    
    // Update enabled based on which option is selected
    const newEnabled = optionIndex === 1; // true for second option (index 1), false for first option (index 0)
    
    setSubfieldLists(prev => ({
      ...prev,
      enabled: newEnabled
    }));
    
    onUpdate(JSON.stringify({ enabled: newEnabled }));
    onChange?.(selectedOptionText);
  };

  return (
    <div className="mb-4">
      <div className="flex items-center mb-2">
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
              value={index}
              checked={selectedOption === option}
              onChange={(e) => handleOptionChange(e.target.value)}
              className="mr-2 w-4 h-4 text-[#ff394a] bg-gray-800 border-gray-600 focus:ring-[#ff394a]"
            />
            <span className="text-white text-lg">{option}</span>
          </label>
        ))}
      </div>
      
      {selectedOption === block.options[1] && block.subfields && (
        <div className="mt-4 pl-6 border-l border-gray-600">
          {block.subfields.map((subfield, index) => (
            <div key={index} className="mb-4">
              <h5 className="text-white font-medium mb-2">{subfield.field}</h5>
              
              {/* Input field with Add button */}
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={subfieldInputs[subfield.field] || ''}
                  onChange={(e) => handleSubfieldInputChange(subfield.field, e.target.value)}
                  placeholder={`Add ${subfield.field.toLowerCase()}`}
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-[#ff394a]"
                />
                <button
                  onClick={() => handleAddToSubfield(subfield.field)}
                  className="px-4 py-2 bg-[#ff394a] text-white rounded hover:bg-[#e6334a] focus:outline-none focus:ring-2 focus:ring-[#ff394a]"
                >
                  Add
                </button>
              </div>

              {/* Display added items */}
              {subfieldLists[subfield.field] && subfieldLists[subfield.field].length > 0 && (
                <div className="space-y-1">
                  {subfieldLists[subfield.field].map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center justify-between bg-gray-700 px-3 py-2 rounded">
                      <span className="text-white">{item}</span>
                      <button
                        onClick={() => handleRemoveFromSubfield(subfield.field, itemIndex)}
                        className="text-red-400 hover:text-red-300 focus:outline-none"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
