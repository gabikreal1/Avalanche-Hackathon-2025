'use client';

import { ChatProvider } from '@/contexts/ChatContext';
import { BlockProvider } from '@/contexts/BlockContext';
import { ConfigurationTest } from '@/components/ConfigurationTest';
import Chat from '@/components/Chat';

export default function TestPage() {
  return (
    <BlockProvider>
      <ChatProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
              Subnet Configuration Chat Test
            </h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Configuration Test Panel */}
              <div>
                <ConfigurationTest />
              </div>
              
              {/* Chat Panel */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <Chat />
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-blue-900 dark:text-blue-100">
                How to Test:
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-blue-800 dark:text-blue-200">
                <li>Click "Set Test Values" to populate some configuration fields</li>
                <li>Click "Show Current Configuration" to see both the flattened form data and the restored JSON structure</li>
                <li>Use the chat to ask questions about subnet configuration (e.g., "How do I set up a custom gas fee?")</li>
                <li>The chat will send a payload with chat_history, user_config (from block context), and question to the API at http://192.168.86.9:8000/chat</li>
                <li>Check the browser console to see the API requests and responses</li>
                <li>The API response will update the block context with any configuration changes returned in the 'update' field</li>
              </ol>
            </div>
          </div>
        </div>
      </ChatProvider>
    </BlockProvider>
  );
} 