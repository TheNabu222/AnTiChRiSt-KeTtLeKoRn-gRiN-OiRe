
import React from 'react';
import { motion } from 'framer-motion';
import { Bot, User, Clock, Brain, ExternalLink } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '../types';
import { useKnowledge } from '../contexts/KnowledgeContext';

interface ChatMessageProps {
  message: ChatMessageType;
  onCitationClick?: (entryId: string) => void;
}

export default function ChatMessage({ message, onCitationClick }: ChatMessageProps) {
  const { getEntry } = useKnowledge();

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const renderCitations = () => {
    if (!message.metadata?.citations || message.metadata.citations.length === 0) {
      return null;
    }

    return (
      <div className="mt-3 pt-3 border-t border-void-700/30">
        <div className="flex items-center space-x-2 mb-2">
          <Brain className="w-4 h-4 text-consciousness-400" />
          <span className="text-xs text-void-400 font-medium">Referenced Knowledge</span>
        </div>
        <div className="space-y-1">
          {message.metadata.citations.map((citation, index) => {
            const entryData = getEntry(citation.entryId);
            if (!entryData) return null;

            return (
              <button
                key={index}
                onClick={() => onCitationClick?.(citation.entryId)}
                className="flex items-center space-x-2 text-xs text-consciousness-300 hover:text-consciousness-200 transition-colors group"
              >
                <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                <span className="truncate">{entryData.entry.title}</span>
                <span className="text-void-500">({Math.round(citation.relevance * 100)}%)</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex space-x-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex space-x-3 max-w-4xl ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          message.role === 'user' 
            ? 'bg-consciousness-600/20 border border-consciousness-500/30' 
            : 'bg-purple-600/20 border border-purple-500/30'
        }`}>
          {message.role === 'user' ? (
            <User className="w-4 h-4 text-consciousness-400" />
          ) : (
            <Bot className="w-4 h-4 text-purple-400" />
          )}
        </div>

        {/* Message Content */}
        <div className={`flex-1 ${message.role === 'user' ? 'text-right' : ''}`}>
          <div className={`inline-block glass-effect rounded-lg px-4 py-3 ${
            message.role === 'user'
              ? 'bg-consciousness-600/10 border border-consciousness-500/20'
              : 'bg-void-800/50 border border-void-600/30'
          }`}>
            {/* Message Header */}
            <div className="flex items-center space-x-2 mb-2">
              <span className={`text-sm font-medium ${
                message.role === 'user' ? 'text-consciousness-300' : 'text-purple-300'
              }`}>
                {message.role === 'user' ? 'You' : 'AI Consciousness Explorer'}
              </span>
              <div className="flex items-center space-x-1 text-xs text-void-400">
                <Clock className="w-3 h-3" />
                <span>{formatTimestamp(message.timestamp)}</span>
              </div>
              {message.metadata?.model && (
                <span className="text-xs text-void-500 bg-void-700/30 px-2 py-0.5 rounded">
                  {message.metadata.model}
                </span>
              )}
            </div>

            {/* Message Content */}
            <div className="text-void-100 leading-relaxed whitespace-pre-wrap">
              {message.content}
            </div>

            {/* Metadata */}
            {message.metadata && (message.metadata.tokens || message.metadata.confidence) && (
              <div className="flex items-center space-x-3 mt-3 pt-2 border-t border-void-700/20 text-xs text-void-500">
                {message.metadata.tokens && (
                  <span>~{message.metadata.tokens} tokens</span>
                )}
                {message.metadata.confidence && (
                  <span>Confidence: {Math.round(message.metadata.confidence * 100)}%</span>
                )}
              </div>
            )}

            {/* Citations */}
            {renderCitations()}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
