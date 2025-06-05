
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  Brain, 
  Search, 
  Lightbulb, 
  Sparkles,
  Mic,
  MicOff,
  Paperclip
} from 'lucide-react';

interface EnhancedChatInputProps {
  onSendMessage: (
    message: string, 
    mode: 'exploration' | 'analysis' | 'synthesis' | 'creative',
    attachments?: any[]
  ) => void;
  isLoading: boolean;
  placeholder?: string;
  currentContext?: {
    entryId?: string;
    trunkId?: string;
    topic?: string;
  };
}

export default function EnhancedChatInput({ 
  onSendMessage, 
  isLoading, 
  placeholder = "Ask about consciousness, explore connections, or analyze patterns...",
  currentContext
}: EnhancedChatInputProps) {
  const [message, setMessage] = useState('');
  const [mode, setMode] = useState<'exploration' | 'analysis' | 'synthesis' | 'creative'>('exploration');
  const [isListening, setIsListening] = useState(false);
  const [attachments, setAttachments] = useState<any[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const modes = [
    { 
      id: 'exploration', 
      label: 'Explore', 
      icon: Search, 
      color: 'blue',
      description: 'Discover new connections and navigate the knowledge base'
    },
    { 
      id: 'analysis', 
      label: 'Analyze', 
      icon: Brain, 
      color: 'purple',
      description: 'Deep analysis of concepts and patterns'
    },
    { 
      id: 'synthesis', 
      label: 'Synthesize', 
      icon: Lightbulb, 
      color: 'green',
      description: 'Combine ideas and create new insights'
    },
    { 
      id: 'creative', 
      label: 'Create', 
      icon: Sparkles, 
      color: 'pink',
      description: 'Generate creative expansions and possibilities'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim(), mode, attachments);
      setMessage('');
      setAttachments([]);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const toggleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsListening(!isListening);
      // Voice recognition implementation would go here
    }
  };

  const getContextualPlaceholder = () => {
    if (currentContext?.entryId) {
      return `Ask about ${currentContext.entryId} or explore related concepts...`;
    }
    if (currentContext?.trunkId) {
      return `Explore trunk ${currentContext.trunkId} or find connections...`;
    }
    if (currentContext?.topic) {
      return `Discuss ${currentContext.topic} or discover patterns...`;
    }
    return placeholder;
  };

  const currentMode = modes.find(m => m.id === mode);

  return (
    <div className="space-y-3">
      {/* Context Indicator */}
      {currentContext && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 text-sm text-void-400"
        >
          <span>Context:</span>
          {currentContext.entryId && (
            <span className="bg-consciousness-600/20 text-consciousness-300 px-2 py-1 rounded text-xs">
              Entry: {currentContext.entryId}
            </span>
          )}
          {currentContext.trunkId && (
            <span className="bg-consciousness-600/20 text-consciousness-300 px-2 py-1 rounded text-xs">
              Trunk: {currentContext.trunkId}
            </span>
          )}
          {currentContext.topic && (
            <span className="bg-consciousness-600/20 text-consciousness-300 px-2 py-1 rounded text-xs">
              Topic: {currentContext.topic}
            </span>
          )}
        </motion.div>
      )}

      {/* Mode Selection */}
      <div className="flex space-x-1 bg-void-900/50 rounded-lg p-1">
        {modes.map(modeOption => {
          const Icon = modeOption.icon;
          const isActive = mode === modeOption.id;
          return (
            <button
              key={modeOption.id}
              onClick={() => setMode(modeOption.id as any)}
              className={`flex-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-md transition-all text-sm relative group ${
                isActive
                  ? `bg-${modeOption.color}-600/20 text-${modeOption.color}-300`
                  : 'text-void-400 hover:text-void-200 hover:bg-void-800/50'
              }`}
              title={modeOption.description}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{modeOption.label}</span>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-void-800 text-void-200 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                {modeOption.description}
              </div>
            </button>
          );
        })}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="glass-effect border border-void-600/30 rounded-lg overflow-hidden">
          {/* Attachments */}
          {attachments.length > 0 && (
            <div className="border-b border-void-600/30 p-2">
              <div className="flex flex-wrap gap-2">
                {attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 bg-void-800/50 rounded px-2 py-1 text-sm"
                  >
                    <Paperclip className="w-3 h-3 text-void-400" />
                    <span className="text-void-300">{attachment.name}</span>
                    <button
                      onClick={() => setAttachments(prev => prev.filter((_, i) => i !== index))}
                      className="text-void-500 hover:text-void-300 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Text Input */}
          <div className="flex items-end space-x-2 p-3">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={getContextualPlaceholder()}
                className="w-full bg-transparent text-white placeholder-void-400 resize-none focus:outline-none min-h-[40px] max-h-[120px]"
                rows={1}
                disabled={isLoading}
              />
              
              {/* Mode Indicator */}
              {currentMode && (
                <div className="absolute top-0 right-0 -mt-1 -mr-1">
                  <div className={`w-2 h-2 rounded-full bg-${currentMode.color}-400`} />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-1">
              {/* Voice Input */}
              {('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) && (
                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  className={`p-2 rounded-lg transition-colors ${
                    isListening
                      ? 'bg-red-600/20 text-red-400'
                      : 'text-void-400 hover:text-void-200 hover:bg-void-700/30'
                  }`}
                  title={isListening ? 'Stop listening' : 'Start voice input'}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              )}

              {/* Send Button */}
              <button
                type="submit"
                disabled={!message.trim() || isLoading}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  message.trim() && !isLoading
                    ? 'bg-consciousness-600 hover:bg-consciousness-500 text-white active:scale-95'
                    : 'bg-void-700 text-void-500 cursor-not-allowed'
                }`}
                title="Send message"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    <Brain className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Suggestions */}
        {!message && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 flex flex-wrap gap-2"
          >
            {[
              "What are the key patterns in consciousness research?",
              "How do AI and mystical practices connect?",
              "Show me resistance protocols",
              "Explore healing methodologies"
            ].map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setMessage(suggestion)}
                className="text-xs bg-void-800/50 text-void-300 px-2 py-1 rounded hover:bg-void-700/50 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </motion.div>
        )}
      </form>

      {/* Mode Description */}
      {currentMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-void-500 flex items-center space-x-2"
        >
          <currentMode.icon className="w-3 h-3" />
          <span>{currentMode.description}</span>
        </motion.div>
      )}
    </div>
  );
}
