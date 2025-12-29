'use client';

import { useState, useRef, useEffect, FormEvent, KeyboardEvent } from 'react';
import { Send, Trash2, BookOpen, Globe, Sparkles } from 'lucide-react';
import ChatMessage from './ChatMessage';
import LoadingDots from './LoadingDots';
import clsx from 'clsx';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'error';
  content: string;
  timestamp: Date;
}

const STORAGE_KEY = 'deepseek-chat-history';

// Welcome message
const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content: `Hello! I'm your **DeepSeek Chatbot** assistant. I'm here to help you with:

**Pochy Books** - Ask me anything about Pochy books, their content, themes, and teachings.

**General Knowledge** - I can also answer questions on any topic, from science to history to technology.

How can I help you today?`,
  timestamp: new Date(),
};

// Suggested prompts
const SUGGESTED_PROMPTS = [
  { icon: BookOpen, text: 'Tell me about Pochy books', category: 'pochy' },
  { icon: Sparkles, text: 'What does Pochy teach about learning?', category: 'pochy' },
  { icon: Globe, text: 'Explain quantum computing', category: 'general' },
  { icon: Globe, text: 'What is machine learning?', category: 'general' },
];

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load chat history from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const restored = parsed.map((m: Message) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        }));
        if (restored.length > 0) {
          setMessages(restored);
        }
      } catch (e) {
        console.error('Failed to parse chat history:', e);
      }
    }
  }, []);

  // Save chat history to localStorage
  useEffect(() => {
    if (messages.length > 1) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Clear chat history
  const clearHistory = () => {
    setMessages([WELCOME_MESSAGE]);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Send message
  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare messages for API (exclude welcome message and errors)
      const apiMessages = [...messages, userMessage]
        .filter((m) => m.id !== 'welcome' && m.role !== 'error')
        .map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: apiMessages,
          includeReasoning: false,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'error',
        content: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // Handle suggested prompt click
  const handleSuggestedPrompt = (prompt: string) => {
    sendMessage(prompt);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] glass rounded-2xl overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-300">Chat Session</span>
          <span className="text-xs text-slate-500">
            {messages.filter((m) => m.role === 'user').length} messages
          </span>
        </div>
        <button
          onClick={clearHistory}
          className="flex items-center gap-1 px-3 py-1.5 text-xs text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          title="Clear chat history"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            role={message.role}
            content={message.content}
            timestamp={message.timestamp}
          />
        ))}

        {isLoading && (
          <div className="mr-auto bg-slate-800/80 rounded-2xl border border-slate-700/50">
            <LoadingDots />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts (show when no user messages) */}
      {messages.filter((m) => m.role === 'user').length === 0 && !isLoading && (
        <div className="px-4 pb-2">
          <p className="text-xs text-slate-500 mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestedPrompt(prompt.text)}
                className={clsx(
                  'flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all',
                  'hover:scale-105 active:scale-95',
                  prompt.category === 'pochy'
                    ? 'bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 border border-purple-500/30'
                    : 'bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 border border-blue-500/30'
                )}
              >
                <prompt.icon className="w-3.5 h-3.5" />
                {prompt.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-white/10">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about Pochy books or anything else..."
              disabled={isLoading}
              rows={1}
              className={clsx(
                'w-full px-4 py-3 pr-12 rounded-xl resize-none',
                'bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500',
                'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'transition-all duration-200'
              )}
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
            <div className="absolute right-3 bottom-3 text-xs text-slate-500">
              {input.length > 0 && `${input.length}/4000`}
            </div>
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={clsx(
              'px-4 py-3 rounded-xl font-medium transition-all duration-200',
              'bg-gradient-to-r from-indigo-600 to-purple-600',
              'hover:from-indigo-500 hover:to-purple-500',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'active:scale-95',
              'flex items-center gap-2'
            )}
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-500 text-center">
          Press Enter to send, Shift+Enter for new line
        </p>
      </form>
    </div>
  );
}
