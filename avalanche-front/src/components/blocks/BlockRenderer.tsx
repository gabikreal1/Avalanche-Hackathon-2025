'use client';

import React from 'react';
import { Block, BlockType } from '@/types/steps';
import { InputBlock } from './InputBlock';
import { RadioBlock } from './RadioBlock';

interface BlockRendererProps {
  block: Block;
  values?: any;
  onChange?: (blockIndex: number, value: any) => void;
  blockIndex: number;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({ 
  block, 
  values, 
  onChange, 
  blockIndex 
}) => {
  const handleChange = (value: any) => {
    onChange?.(blockIndex, value);
  };

  switch (block.type) {
    case BlockType.INPUT:
      return (
        <InputBlock
          block={block}
          value={values || ''}
          onChange={handleChange}
        />
      );
    case BlockType.RADIO:
      return (
        <RadioBlock
          block={block}
          selectedOption={values || ''}
          onChange={handleChange}
        />
      );
    default:
      return null;
  }
};
