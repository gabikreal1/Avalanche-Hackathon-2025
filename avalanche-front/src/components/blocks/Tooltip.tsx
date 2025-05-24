'use client';

import React, { useState, useRef } from 'react';

interface TooltipProps {
  description?: string;
  canAskAI?: boolean;
  fieldName: string;
  onAskAI?: (fieldName: string) => void;
}

export const Tooltip: React.FC<TooltipProps> = ({ 
  description, 
  canAskAI, 
  fieldName, 
  onAskAI 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  if (!description && !canAskAI) return null;

  const handleAskAI = () => {
    onAskAI?.(fieldName);
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 100);
  };

  return (
    <div className="relative inline-block ml-2">
      <button
        className="w-4 h-4 rounded-full border border-gray-400 text-gray-400 text-xs flex items-center justify-center hover:border-orange-500 hover:text-orange-500 transition-colors"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        ?
      </button>
      
      {isVisible && (
        <div 
          className="absolute bottom-full left-0 mb-2 bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg z-50"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {description && (
            <p className="text-sm text-gray-300 mb-2">{description}</p>
          )}
          {canAskAI && (
            <div className="flex justify-end">
              <button
                onClick={handleAskAI}
                className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white text-xs rounded transition-colors"
              >
                Ask AI
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
