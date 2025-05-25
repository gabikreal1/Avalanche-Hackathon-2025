'use client';

import Chat from '@/components/Chat';
import ControlPanel from '@/components/ControlPanel';
import { steps } from '@/consts/steps';
import { ChatProvider } from '@/contexts/ChatContext';
import { StepsProvider } from '@/contexts/StepsContext';
import { useProgress } from '@/hooks/useProgress';
import { ButtonHandlerProvider } from '@/contexts/ButtonHandlerContext';
import { BlockProvider } from '@/contexts/BlockContext';

export default function Home() {
  const { progress, updateProgress } = useProgress();

  return (
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
                  <Chat onProgressUpdate={updateProgress} />
                </div>
              </div>
            </div>
          </StepsProvider>
        </ChatProvider>
      </ButtonHandlerProvider>
    </BlockProvider>
  );
}
