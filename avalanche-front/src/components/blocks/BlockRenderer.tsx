'use client';

import React from 'react';
import { Block, BlockType } from '@/types/steps';
import { InputBlock } from './InputBlock';
import { RadioBlock } from './RadioBlock';
import { ButtonBlock } from './ButtonBlock';
import { CodeBlock } from './CodeBlock';

interface BlockRendererProps {
  block: Block;
  values?: any;
  onChange?: (blockIndex: number, value: any) => void;
  blockIndex: number;
  onAskAI?: (fieldName: string) => void;
  onButtonClick?: (value: string) => void;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({ 
  block, 
  values, 
  onChange, 
  blockIndex,
  onAskAI,
  onButtonClick
}) => {
  const handleChange = (value: any) => {
    onChange?.(blockIndex, value);
  };

  const handleButtonAction = (value: string) => {
    onButtonClick?.(value);
  };

  switch (block.type) {
    case BlockType.INPUT:
      return (
        <InputBlock
          block={block}
          value={values || ''}
          onChange={handleChange}
          onAskAI={onAskAI}
        />
      );
    case BlockType.RADIO:
      return (
        <RadioBlock
          block={block}
          selectedOption={values || ''}
          onChange={handleChange}
          onAskAI={onAskAI}
        />
      );
    case BlockType.BUTTON:
      return (
        <ButtonBlock
          block={block}
          onButtonClick={handleButtonAction}
        />
      );
    case BlockType.CODE:
      return (
        <CodeBlock
          block={block}
        />
      );
    default:
      return null;
  }
};
