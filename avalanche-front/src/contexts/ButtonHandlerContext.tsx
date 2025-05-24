'use client';

import React, { createContext, useContext, ReactNode } from 'react';

export enum ButtonAction {
  GENERATE_SUBNET = 'GENERATE_SUBNET',
  CREATE_CHAIN = 'CREATE_CHAIN',
  VALIDATE_PARAMETERS = 'VALIDATE_PARAMETERS'
}

interface ButtonHandlerContextType {
  handleButtonClick: (action: string) => void;
}

const ButtonHandlerContext = createContext<ButtonHandlerContextType | undefined>(undefined);

interface ButtonHandlerProviderProps {
  children: ReactNode;
}

export const ButtonHandlerProvider: React.FC<ButtonHandlerProviderProps> = ({ children }) => {
  const handleButtonClick = (action: ButtonAction) => {
    switch (action) {
      case ButtonAction.GENERATE_SUBNET:
        console.log('Generating subnet...');
        // Add your subnet generation logic here
        break;
        
      case ButtonAction.CREATE_CHAIN:
        console.log('Creating chain...');
        // Add your chain creation logic here
        break;
        
      case ButtonAction.VALIDATE_PARAMETERS:
        console.log('Validating parameters...');
        // Add your parameter validation logic here
        break;
        
      default:
        console.warn(`Unknown button action: ${action}`);
    }
  };

  return (
    <ButtonHandlerContext.Provider value={{ handleButtonClick }}>
      {children}
    </ButtonHandlerContext.Provider>
  );
};

export const useButtonHandler = (): ButtonHandlerContextType => {
  const context = useContext(ButtonHandlerContext);
  if (!context) {
    throw new Error('useButtonHandler must be used within a ButtonHandlerProvider');
  }
  return context;
};
