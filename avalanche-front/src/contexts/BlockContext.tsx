'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface BlockContextType {
  formData: Record<string, any>;
  setBlockValue: (key: string, value: any) => void;
  getBlockValue: (key: string) => any;
  clearAllData: () => void;
  setManyBlockValues: (values: Record<string, string>) => void;
}

const BlockContext = createContext<BlockContextType | undefined>(undefined);

interface BlockProviderProps {
  children: ReactNode;
}

export const BlockProvider = ({ children }: BlockProviderProps) => {
  const [formData, setFormData] = useState<Record<string, any>>({});

  const setBlockValue = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const setManyBlockValues = (values: Record<string, string>) => {

    setFormData(prev => ({
      ...prev,
      ...values
    }));
  };

  const getBlockValue = (key: string) => {
    return formData[key];
  };

  const clearAllData = () => {
    setFormData({});
  };

  const contextValue: BlockContextType = {
    formData,
    setBlockValue,
    getBlockValue,
    clearAllData,
    setManyBlockValues
  };

  return (
    <BlockContext.Provider value={contextValue}>
      {children}
    </BlockContext.Provider>
  );
};

export const useBlock = () => {
  const context = useContext(BlockContext);
  if (!context) {
    throw new Error('useBlock must be used within a BlockProvider');
  }
  return context;
};
