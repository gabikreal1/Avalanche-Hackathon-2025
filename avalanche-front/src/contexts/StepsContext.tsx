'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Step, StepsContextType } from '@/types/steps';

const StepsContext = createContext<StepsContextType | undefined>(undefined);

interface StepsProviderProps {
  children: ReactNode;
  steps: Step[][];
}

export const StepsProvider: React.FC<StepsProviderProps> = ({ children, steps }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currectSteps, setCurrentSteps] = useState(steps[0])
  const [totalSteps, setTotalSteps] = useState(steps[0].length)
  const [page, setPage] = useState(0)

  const changeStepsTo = (stepsI: number) => {
    setCurrentSteps(steps[stepsI])
    setCurrentStepIndex(0)
    setTotalSteps(steps[stepsI].length)
    setPage(stepsI)
  }

  const nextStep = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const previousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStepIndex(stepIndex);
    }
  };

  const canGoNext = currentStepIndex < totalSteps - 1;
  const canGoPrevious = currentStepIndex > 0;

  const contextValue: StepsContextType = {
    steps: currectSteps,
    currentStepIndex,
    nextStep,
    previousStep,
    goToStep,
    canGoNext,
    canGoPrevious,
    totalSteps,
    changeStepsTo,
    page,
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
