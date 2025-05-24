'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Step, StepsContextType } from '@/types/steps';

const StepsContext = createContext<StepsContextType | undefined>(undefined);

interface StepsProviderProps {
  children: ReactNode;
  steps: Step[];
}

export const StepsProvider: React.FC<StepsProviderProps> = ({ children, steps }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentSubStepIndex, setCurrentSubStepIndex] = useState(0);

  const totalSteps = steps.length;
  const totalSubSteps = steps.reduce((total, step) => total + step.substeps.length, 0);

  const getCurrentSubStepGlobalIndex = () => {
    return steps.slice(0, currentStepIndex).reduce((total, step) => total + step.substeps.length, 0) + currentSubStepIndex;
  };

  const getStepAndSubStepFromGlobalIndex = (globalIndex: number) => {
    let remainingIndex = globalIndex;
    for (let stepIndex = 0; stepIndex < steps.length; stepIndex++) {
      const stepSubStepsCount = steps[stepIndex].substeps.length;
      if (remainingIndex < stepSubStepsCount) {
        return { stepIndex, subStepIndex: remainingIndex };
      }
      remainingIndex -= stepSubStepsCount;
    }
    return { stepIndex: steps.length - 1, subStepIndex: steps[steps.length - 1].substeps.length - 1 };
  };

  const nextStep = () => {
    const currentGlobalIndex = getCurrentSubStepGlobalIndex();
    if (currentGlobalIndex < totalSubSteps - 1) {
      const nextGlobalIndex = currentGlobalIndex + 1;
      const { stepIndex, subStepIndex } = getStepAndSubStepFromGlobalIndex(nextGlobalIndex);
      setCurrentStepIndex(stepIndex);
      setCurrentSubStepIndex(subStepIndex);
    }
  };

  const previousStep = () => {
    const currentGlobalIndex = getCurrentSubStepGlobalIndex();
    if (currentGlobalIndex > 0) {
      const prevGlobalIndex = currentGlobalIndex - 1;
      const { stepIndex, subStepIndex } = getStepAndSubStepFromGlobalIndex(prevGlobalIndex);
      setCurrentStepIndex(stepIndex);
      setCurrentSubStepIndex(subStepIndex);
    }
  };

  const goToStep = (stepIndex: number, subStepIndex: number = 0) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      const maxSubStepIndex = steps[stepIndex].substeps.length - 1;
      setCurrentStepIndex(stepIndex);
      setCurrentSubStepIndex(Math.min(Math.max(0, subStepIndex), maxSubStepIndex));
    }
  };

  const canGoNext = getCurrentSubStepGlobalIndex() < totalSubSteps - 1;
  const canGoPrevious = getCurrentSubStepGlobalIndex() > 0;

  const contextValue: StepsContextType = {
    steps,
    currentStepIndex,
    currentSubStepIndex,
    nextStep,
    previousStep,
    goToStep,
    canGoNext,
    canGoPrevious,
    totalSteps,
    totalSubSteps
  };

  return (
    <StepsContext.Provider value={contextValue}>
      {children}
    </StepsContext.Provider>
  );
};

export const useSteps = (): StepsContextType => {
  const context = useContext(StepsContext);
  if (!context) {
    throw new Error('useSteps must be used within a StepsProvider');
  }
  return context;
};
