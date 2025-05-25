'use client';

import { useState } from 'react';
import { useChat } from '@/contexts/ChatContext';
import SuggestedQuestions from './SuggestedQuestions';
import ChatMessage from './ChatMessage';

export default function Chat() {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const { messages, isLoading, tags, sendMessage, removeTag, messagesEndRef } = useChat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    sendMessage(question);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) {
        sendMessage(input);
        setInput('');
      }
    }
  };


  return (
    <div className="flex flex-col h-full bg-black">
      {/* Header */}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
            <h2 className="text-3xl font-semibold mb-4 text-[#ff394a]">Welcome to Trading Academy</h2>
            <p>Start learning by asking a question or selecting from suggestions below.</p>
          </div>
        )}
        
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4">
        {messages.length === 0 && <SuggestedQuestions onQuestionSelect={handleSuggestedQuestion} />}
        
        <form onSubmit={handleSubmit} className="relative p-4 ">
          <div className={`flex items-center border rounded-3xl px-4 py-2 transition-colors duration-200 ${
            isFocused ? 'border-[#ff394a]' : 'border-gray-300'
          }`}>
            <div className="flex gap-2 mr-2">
              {tags.map((tag) => (
                <Tag 
                  key={tag.id}
                  text={tag.text} 
                  onRemove={() => removeTag(tag.id)} 
                />
              ))}
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about trading..."
              className="flex-1 bg-transparent border-none placeholder:pl-1 outline-none text-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 px-2 py-4"
              disabled={isLoading}
            />
            
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="ml-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center w-10 h-10"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const Tag = ({text, onRemove}: {text: string, onRemove: () => void}) => {
  return (
    <span className="relative inline-flex items-center px-2.5 py-0.5 rounded-lg text-lg font-medium bg-[#ff394a] text-white">
      {text}
      <button 
        onClick={onRemove} 
        className="ml-2 w-4 h-4 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-200"
      >
        ×
      </button>
    </span>
  )
}