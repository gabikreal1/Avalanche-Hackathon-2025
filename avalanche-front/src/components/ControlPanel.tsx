'use client';

import { StepWrapper } from '@/components/steps/StepWrapper';
import { useSteps } from '@/contexts/StepsContext';

interface ControlPanelProps {
  progress: number;
  onProgressUpdate?: (newProgress: number) => void;
}

export default function ControlPanel({ progress, onProgressUpdate }: ControlPanelProps) {
  const { steps, currentStepIndex, canGoPrevious, canGoNext, previousStep, nextStep } = useSteps();

  const currentStep = steps[currentStepIndex];

  return (
    <div className="bg-[#1c1b22] border border-[#2a2830] rounded-lg p-6 h-full flex flex-col relative">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-2">Trading Steps</h2>
        <div className="flex justify-between items-center text-sm text-gray-400">
          <span>Current Steps</span>
          <span>{currentStepIndex + 1}/{steps.length}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
        <div 
          className="bg-[#ff394a] h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStepIndex + 1) / steps.length * 100}%` }}
        />
      </div>

      {/* Current Step Display using StepWrapper */}
      <div className="flex-1 overflow-y-auto pr-2 pb-20 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#2a2830] hover:scrollbar-thumb-[#363540]">
        {currentStep && (
          <StepWrapper 
            step={currentStep}
            stepIndex={currentStepIndex}
          />
        )}
      </div>

      {/* Navigation buttons - positioned at bottom */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center p-6 border-t border-gray-700 bg-[#1c1b22]">
        <button
          onClick={previousStep}
          disabled={!canGoPrevious}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            canGoPrevious 
              ? 'bg-gray-700 text-white hover:bg-gray-600' 
              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
          }`}
        >
          Previous
        </button>

        <button
          onClick={nextStep}
          disabled={!canGoNext}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            canGoNext 
              ? 'bg-[#ff394a] text-white hover:bg-[#ff3950]' 
              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
          }`}
        >
          {canGoNext ? 'Next' : 'Complete'}
        </button>
      </div>
    </div>
  );
}
