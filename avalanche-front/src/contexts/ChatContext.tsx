'use client';

import { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import { apiClient } from '@/lib/apiClient';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
}

interface Tag {
  text: string;
}

interface ChatContextType {
  messages: Message[];
  isLoading: boolean;
  tags: Tag[];
  sendMessage: (content: string) => Promise<void>;
  addTag: (text: string) => void;
  removeTag: (tagId: string) => void;
  scrollToBottom: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addTag = (text: string) => {
    const newTag: Tag = {
      text,
    };
    setTags(prev => [...prev, newTag]);
  };

  const removeTag = (tagId: string) => {
    setTags(prev => prev.filter(tag => tag.id !== tagId));
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      isUser: true,
      content: tags.map(tag => '@' + tag.text).join(' ') + ' ' + content.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setTags([]);

    try {
      const response = await apiClient.post('/api/chat', {
        message: content.trim(),
        history: messages,
      });

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.message,
        isUser: false,
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, something went wrong. Please try again.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    messages,
    isLoading,
    tags,
    sendMessage,
    addTag,
    removeTag,
    scrollToBottom,
    messagesEndRef,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
