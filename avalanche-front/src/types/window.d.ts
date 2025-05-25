interface Window {
  avalanche?: {
    isAvalanche?: boolean;
    isMetaMask?: boolean;
    request?: (args: { method: string; params?: any[] }) => Promise<any>;
    on?: (event: string, handler: (...args: any[]) => void) => void;
    removeListener?: (event: string, handler: (...args: any[]) => void) => void;
    selectedAddress?: string;
    chainId?: string;
  };
}

declare global {
  interface Window {
    avalanche?: {
      isAvalanche?: boolean;
      isMetaMask?: boolean;
      request?: (args: { method: string; params?: any[] }) => Promise<any>;
      on?: (event: string, handler: (...args: any[]) => void) => void;
      removeListener?: (event: string, handler: (...args: any[]) => void) => void;
      selectedAddress?: string;
      chainId?: string;
    };
  }
}

export {}; 