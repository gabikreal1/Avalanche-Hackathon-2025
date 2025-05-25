'use client';

import { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import { apiClient } from '@/lib/apiClient';
import { useBlock } from './BlockContext';
import parseMessage from '@/lib/parseMessage';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
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
  const { configData, setManyBlockValues } = useBlock();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addTag = (text: string) => {
    const newTag: Tag = {
      text: text.replace(" ", "_"),
    };
    setTags(prev => [...prev, newTag]);
  };

  const removeTag = (tagId: string) => {
    setTags(prev => prev.filter(tag => tag.text !== tagId));
  };

  // Build chat history string from messages
  const buildChatHistory = () => {
    return messages.map(msg => 
      `${msg.isUser ? 'User' : 'Bot'}: ${msg.content}`
    ).join('\n');
  };

  // Convert flat formData to nested user_config structure
  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const message = tags.map(tag => '@' + tag.text).join(' ') + ' ' + content.trim();

    const userMessage: Message = {
      id: Date.now().toString(),
      isUser: true,
      content: message,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setTags([]);

    try {
      // Build the payload according to the API structure
      const payload = {
        chat_history: buildChatHistory(),
        user_config: configData,
        question: message
      };

      console.log('Sending payload to API:', payload);

      // Send request to the chat endpoint
      const response = await apiClient.post<{ reply: string; update: Record<string, any> }>('/chat', payload);

      // Parse and apply the updates to block context
      if (response.update && Object.keys(response.update).length > 0) {
        const parsedMessage = parseMessage(response.update);
        console.log('Parsed message:', parsedMessage);
        setManyBlockValues(parsedMessage);
      }

      // Add bot response to messages
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.reply,
        isUser: false,
        timestamp: new Date(),
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
