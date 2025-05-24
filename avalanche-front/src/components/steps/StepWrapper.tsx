'use client';

import { useState } from 'react';
import { Step } from '@/types/steps';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { useChat } from '@/contexts/ChatContext';
import { useButtonHandler } from '@/contexts/ButtonHandlerContext';

interface StepWrapperProps {
  step: Step;
  stepIndex: number;
}

export const StepWrapper = ({ step, stepIndex }: StepWrapperProps) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const { addTag } = useChat();
  const { handleButtonClick } = useButtonHandler();

  const handleBlockChange = (subStepIndex: number, blockIndex: number, value: any) => {
    const key = `${stepIndex}-${subStepIndex}-${blockIndex}`;
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getBlockValue = (subStepIndex: number, blockIndex: number) => {
    const key = `${stepIndex}-${subStepIndex}-${blockIndex}`;
    return formData[key];
  };

  const onAskAI = (fieldName: string) => {
    addTag(fieldName);
  };

  return (
    <div className="text-white">
      {step.substeps.map((subStep, subStepIndex) => (
        <div key={`${stepIndex}-${subStepIndex}`} className="mb-6">
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-white mb-2">
              Step {subStepIndex + 1}: {subStep.name}
            </h3>
          </div>
          
          <div className="space-y-4">
            {subStep.blocks.map((block, blockIndex) => (
              <BlockRenderer
                key={blockIndex}
                block={block}
                blockIndex={blockIndex}
                values={getBlockValue(subStepIndex, blockIndex)}
                onChange={(blockIndex, value) => handleBlockChange(subStepIndex, blockIndex, value)}
                onAskAI={onAskAI}
                onButtonClick={handleButtonClick}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
