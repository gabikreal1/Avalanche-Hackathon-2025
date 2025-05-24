'use client';

import { useSteps } from '@/contexts/StepsContext';
import { SubStep } from '@/types/steps';

export const useStepsHook = () => {
  const stepsContext = useSteps();

  const getCurrentSubStep = (): SubStep | null => {
    const { steps, currentStepIndex, currentSubStepIndex } = stepsContext;
    
    if (currentStepIndex >= 0 && currentStepIndex < steps.length) {
      const currentStep = steps[currentStepIndex];
      if (currentSubStepIndex >= 0 && currentSubStepIndex < currentStep.substeps.length) {
        return currentStep.substeps[currentSubStepIndex];
      }
    }
    return null;
  };

  const getProgress = () => {
    const { steps, currentStepIndex, currentSubStepIndex, totalSubSteps } = stepsContext;
    
    const currentGlobalIndex = steps
      .slice(0, currentStepIndex)
      .reduce((total, step) => total + step.substeps.length, 0) + currentSubStepIndex;
    
    return {
      current: currentGlobalIndex + 1,
      total: totalSubSteps,
      percentage: Math.round(((currentGlobalIndex + 1) / totalSubSteps) * 100)
    };
  };

  const jumpToSubStep = (stepIndex: number, subStepIndex: number) => {
    stepsContext.goToStep(stepIndex, subStepIndex);
  };

  const isFirstStep = () => {
    return stepsContext.currentStepIndex === 0 && stepsContext.currentSubStepIndex === 0;
  };

  const isLastStep = () => {
    const { steps, currentStepIndex, currentSubStepIndex } = stepsContext;
    const lastStepIndex = steps.length - 1;
    const lastSubStepIndex = steps[lastStepIndex]?.substeps.length - 1 || 0;
    
    return currentStepIndex === lastStepIndex && currentSubStepIndex === lastSubStepIndex;
  };

  return {
    ...stepsContext,
    getCurrentSubStep,
    getProgress,
    jumpToSubStep,
    isFirstStep,
    isLastStep
  };
};
