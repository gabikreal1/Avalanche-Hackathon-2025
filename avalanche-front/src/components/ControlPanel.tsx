'use client';

import { logoSuzaku } from '@/assets/assets';
import { StepWrapper } from '@/components/steps/StepWrapper';
import { WalletButton } from '@/components/wallet/WalletButton';
import { useSteps } from '@/contexts/StepsContext';


export default function ControlPanel() {
  const { steps, currentStepIndex, totalSteps, canGoPrevious, canGoNext, previousStep, nextStep, changeStepsTo, page } = useSteps();

  const currentStep = steps[currentStepIndex];

  return (
    <div className="bg-[#1c1b22] border border-[#2a2830] rounded-lg p-6 h-full flex flex-col">
      {/* Wallet Button */}
      <div className="mb-6">
        <WalletButton />
      </div>

      {/* Header */}
      <div className="mb-6">
        <div className='flex text-xl justify-center'>
            <button 
            onClick={() => changeStepsTo(0)} 
            className={`px-3 py-2 rounded-l-lg ${page === 0 ? 'bg-[#ff394a] text-white' : 'bg-black text-gray-300'}`}
            >
            Avalanche L1
            </button>
            <button 
            onClick={() => changeStepsTo(1)} 
            className={`px-2 py-1 flex items-center rounded-r-lg ${page === 1 ? 'bg-[#ff394a] text-white' : 'bg-black text-gray-300'}`}
            >
              <p>Suzaku</p>
              <img className='w-6' src={logoSuzaku.src} alt="" />
            </button>
          </div>
        <div className="flex justify-between items-center text-sm text-gray-400">
          <span>Current Steps</span>
          <span>{currentStepIndex + 1}/{totalSteps}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
        <div 
          className="bg-[#ff394a] h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStepIndex + 1) / totalSteps * 100}%` }}
        />
      </div>

      {/* Current Step Display using StepWrapper */}
      <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#2a2830] hover:scrollbar-thumb-[#363540] mb-4">
        {currentStep && (
          <StepWrapper 
            step={currentStep}
            stepIndex={currentStepIndex}
          />
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-700">
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
