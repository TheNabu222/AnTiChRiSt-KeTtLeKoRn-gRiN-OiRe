
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, Brain, Sparkles, Zap, Eye } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string, mode: 'exploration' | 'analysis' | 'synthesis' | 'creative') => void;
  isLoading: boolean;
  placeholder?: string;
}

export default function ChatInput({ onSendMessage, isLoading, placeholder }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [mode, setMode] = useState<'exploration' | 'analysis' | 'synthesis' | 'creative'>('exploration');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim(), mode);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const modeConfig = {
    exploration: {
      icon: Brain,
      color: 'consciousness',
      description: 'Open-ended discovery and connection-making'
    },
    analysis: {
      icon: Eye,
      color: 'blue',
      description: 'Deep analytical examination of concepts'
    },
    synthesis: {
      icon: Zap,
      color: 'yellow',
      description: 'Combining ideas into new insights'
    },
    creative: {
      icon: Sparkles,
      color: 'purple',
      description: 'Imaginative and speculative exploration'
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect border border-void-600/30 rounded-lg p-4"
    >
      {/* Mode Selection */}
      <div className="flex items-center space-x-2 mb-3">
        <span className="text-sm text-void-400 font-medium">Conversation Mode:</span>
        <div className="flex space-x-1">
          {Object.entries(modeConfig).map(([key, config]) => {
            const Icon = config.icon;
            const isActive = mode === key;
            
            return (
              <button
                key={key}
                onClick={() => setMode(key as any)}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? `bg-${config.color}-600/20 text-${config.color}-300 border border-${config.color}-500/30`
                    : 'bg-void-700/30 text-void-400 hover:text-void-300 border border-transparent'
                }`}
                title={config.description}
              >
                <Icon className="w-3 h-3" />
                <span className="capitalize">{key}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || "Ask about consciousness, AI, or explore connections in the knowledge base..."}
            className="w-full bg-void-800/50 border border-void-600/30 rounded-lg px-4 py-3 text-void-100 placeholder-void-500 focus:outline-none focus:border-consciousness-500/50 focus:ring-1 focus:ring-consciousness-500/20 resize-none min-h-[60px] max-h-[200px]"
            disabled={isLoading}
            rows={1}
          />
          
          {/* Character count */}
          <div className="absolute bottom-2 right-2 text-xs text-void-500">
            {message.length}/2000
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs text-void-500">
            Press <kbd className="bg-void-700/50 px-1.5 py-0.5 rounded text-void-400">Enter</kbd> to send, 
            <kbd className="bg-void-700/50 px-1.5 py-0.5 rounded text-void-400 ml-1">Shift+Enter</kbd> for new line
          </div>
          
          <button
            type="submit"
            disabled={!message.trim() || isLoading || message.length > 2000}
            className="flex items-center space-x-2 bg-consciousness-600 hover:bg-consciousness-500 disabled:bg-void-700 disabled:text-void-500 text-white px-4 py-2 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {isLoading ? 'Thinking...' : 'Send'}
            </span>
          </button>
        </div>
      </form>
    </motion.div>
  );
}
