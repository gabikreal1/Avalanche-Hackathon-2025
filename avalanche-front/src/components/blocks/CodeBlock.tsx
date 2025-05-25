'use client';

import React from 'react';
import { Block } from '@/types/steps';

interface CodeBlockProps {
  block: Block;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ block }) => {
  const { name, text } = block;

  const parseTextWithVariables = (text: string) => {
    const parts = text.split(/(<[^>]+>)/g);
    return parts.map((part, index) => {
      if (part.match(/^<[^>]+>$/)) {
        const variable = part.slice(1, -1);
        return (
          <span 
            key={index} 
            className="bg-black border border-gray-600 text-white px-2 rounded font-medium mx-1"
          >
            {variable}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="mb-6">
      {Array.isArray(name) ? (
        <ul className="text-white text-xl font-medium mb-3 list-disc list-inside">
          {name.map((line, index) => (
            <li key={index}>{parseTextWithVariables(line)}</li>
          ))}
        </ul>
      ) : (
        name && (
          <h4 className="text-white text-xl font-medium mb-3">
            {parseTextWithVariables(name)}
          </h4>
        )
      )}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 font-mono text-sm overflow-x-auto">
        {text?.map((line, index) => (
          <div key={index} className="flex">
            <span className="text-gray-500 select-none mr-4 text-right w-8 flex-shrink-0">
              {index + 1}
            </span>
            <span className="text-gray-300 whitespace-pre">
              {line || '\u00A0'}
            </span>
          </div>
        ))}
        {(!text || text.length === 0) && (
          <div className="text-gray-500 italic">
            No code to display
          </div>
        )}
      </div>
    </div>
  );
};
