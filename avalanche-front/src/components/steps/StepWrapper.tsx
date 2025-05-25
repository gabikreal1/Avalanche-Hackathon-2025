'use client';

import { Step } from '@/types/steps';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { useChat } from '@/contexts/ChatContext';
import { useButtonHandler } from '@/contexts/ButtonHandlerContext';
import { useBlock } from '@/contexts/BlockContext';

interface StepWrapperProps {
  step: Step;
  stepIndex: number;
}

export const StepWrapper = ({ step, stepIndex }: StepWrapperProps) => {
  const { addTag } = useChat();
  const { handleButtonClick } = useButtonHandler();
  const { setBlockValue, getBlockValue } = useBlock();

  const handleBlockChange = (key: string, value: string) => {
    setBlockValue(key, value);
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
                values={getBlockValue(block.key)}
                onChange={(blockIndex, value) => handleBlockChange(block.key, value)}
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
