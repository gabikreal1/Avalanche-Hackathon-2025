'use client';

import { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useChat } from '@/contexts/ChatContext';
import { useGenesis } from '@/contexts/GenesisContext';

export function ChatInput() {
  const [input, setInput] = useState('');
  const { sendMessage, isLoading } = useChat();
  const { formData } = useGenesis();

  // Listen for suggested questions
  useEffect(() => {
    const handleSuggestedQuestion = (event: CustomEvent) => {
      const question = event.detail;
      sendMessage(question, formData);
    };

    window.addEventListener('sendSuggestedQuestion', handleSuggestedQuestion as EventListener);
    
    return () => {
      window.removeEventListener('sendSuggestedQuestion', handleSuggestedQuestion as EventListener);
    };
  }, [sendMessage, formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input.trim();
    setInput('');
    
    // Send message with current genesis form data
    await sendMessage(message, formData);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask about your blockchain configuration..."
        className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={!input.trim() || isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
      >
        <Send className="h-4 w-4" />
        {isLoading ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
} 