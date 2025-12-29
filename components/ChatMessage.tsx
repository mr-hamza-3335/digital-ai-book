'use client';

import { Bot, User, AlertCircle, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

interface ChatMessageProps {
  role: 'user' | 'assistant' | 'error';
  content: string;
  timestamp?: Date;
}

export default function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);

  const isUser = role === 'user';
  const isError = role === 'error';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple markdown-like formatting
  const formatContent = (text: string) => {
    return text
      .split('\n')
      .map((line, i) => {
        // Bold text
        let formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Italic text
        formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
        // Inline code
        formatted = formatted.replace(/`(.*?)`/g, '<code>$1</code>');

        return (
          <span key={i}>
            <span dangerouslySetInnerHTML={{ __html: formatted }} />
            {i < text.split('\n').length - 1 && <br />}
          </span>
        );
      });
  };

  return (
    <div
      className={clsx(
        'message-animation flex gap-3 p-4 rounded-2xl max-w-[85%]',
        isUser && 'ml-auto bg-gradient-to-br from-indigo-600 to-purple-600 text-white',
        !isUser && !isError && 'mr-auto bg-slate-800/80 text-slate-100 border border-slate-700/50',
        isError && 'mr-auto bg-red-900/30 text-red-200 border border-red-700/50'
      )}
    >
      {/* Avatar */}
      <div
        className={clsx(
          'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center',
          isUser && 'bg-white/20',
          !isUser && !isError && 'bg-purple-600/30',
          isError && 'bg-red-600/30'
        )}
      >
        {isUser ? (
          <User className="w-4 h-4" />
        ) : isError ? (
          <AlertCircle className="w-4 h-4 text-red-400" />
        ) : (
          <Bot className="w-4 h-4 text-purple-400" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <span className={clsx(
            'text-xs font-medium',
            isUser && 'text-white/80',
            !isUser && 'text-slate-400'
          )}>
            {isUser ? 'You' : isError ? 'Error' : 'DeepSeek'}
          </span>
          {timestamp && (
            <span className="text-xs text-slate-500">
              {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>

        {/* Message Content */}
        <div className={clsx(
          'chat-content text-sm leading-relaxed',
          isUser && 'text-white',
          !isUser && !isError && 'text-slate-200',
          isError && 'text-red-200'
        )}>
          {formatContent(content)}
        </div>

        {/* Copy Button (for assistant messages) */}
        {!isUser && !isError && (
          <button
            onClick={handleCopy}
            className="mt-2 flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                Copy
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
