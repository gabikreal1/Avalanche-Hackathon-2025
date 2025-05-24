'use client';

import { ButtonBlock as ButtonBlockType } from '@/types/steps';

interface ButtonBlockProps {
  block: ButtonBlockType;
  onButtonClick: (value: string) => void;
}

export const ButtonBlock = ({ block, onButtonClick }: ButtonBlockProps) => {
  return (
    <div className="space-y-2">
      <button
        onClick={() => onButtonClick(block.value)}
        className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50"
      >
        {block.name}
      </button>
      
      {block.description && (
        <p className="text-sm text-gray-400 mt-2">
          {block.description}
        </p>
      )}
    </div>
  );
};
