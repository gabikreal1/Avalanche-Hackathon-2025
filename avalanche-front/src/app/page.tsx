'use client';

import Chat from '@/components/Chat';
import ControlPanel from '@/components/ControlPanel';
import { steps } from '@/consts/steps';
import { ChatProvider } from '@/contexts/ChatContext';
import { StepsProvider } from '@/contexts/StepsContext';
import { useProgress } from '@/hooks/useProgress';
import { ButtonHandlerProvider } from '@/contexts/ButtonHandlerContext';
import { WalletProvider } from '@/contexts/WalletContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { config } from '@/lib/wagmi';

// Create a client
const queryClient = new QueryClient();
import { BlockProvider } from '@/contexts/BlockContext';

export default function Home() {
  const { progress, updateProgress } = useProgress();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <WalletProvider>
          <BlockProvider>
            <ButtonHandlerProvider>
              <ChatProvider>
                <StepsProvider steps={steps}>
                  <div className="min-h-screen">
                    <div className="flex h-screen">
                      {/* Control Panel - Left 1/3 */}
                      <div className="w-1/3">
                        <ControlPanel progress={progress} onProgressUpdate={updateProgress} />
                      </div>
                      
                      {/* Chat Area - Right 2/3 */}
                      <div className="w-2/3">
                        <Chat />
                      </div>
                    </div>
                  </div>
                </StepsProvider>
              </ChatProvider>
            </ButtonHandlerProvider>
          </BlockProvider>
        </WalletProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
