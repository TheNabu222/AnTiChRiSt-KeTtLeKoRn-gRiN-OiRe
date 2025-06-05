
import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Clock, MessageCircle, Plus, Trash2, Edit3, X } from 'lucide-react';
import { ChatSession } from '../types';

interface ChatSidebarProps {
  sessions: ChatSession[];
  currentSessionId?: string;
  onSessionSelect: (sessionId: string) => void;
  onNewSession: () => void;
  onDeleteSession: (sessionId: string) => void;
  onRenameSession: (sessionId: string, newTitle: string) => void;
  onClose?: () => void;
}

export default function ChatSidebar({
  sessions,
  currentSessionId,
  onSessionSelect,
  onNewSession,
  onDeleteSession,
  onRenameSession,
  onClose
}: ChatSidebarProps) {
  const [editingSession, setEditingSession] = React.useState<string | null>(null);
  const [editTitle, setEditTitle] = React.useState('');

  const handleRename = (sessionId: string, currentTitle: string) => {
    setEditingSession(sessionId);
    setEditTitle(currentTitle);
  };

  const handleSaveRename = (sessionId: string) => {
    if (editTitle.trim()) {
      onRenameSession(sessionId, editTitle.trim());
    }
    setEditingSession(null);
    setEditTitle('');
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'exploration': return 'text-consciousness-400';
      case 'analysis': return 'text-blue-400';
      case 'synthesis': return 'text-yellow-400';
      case 'creative': return 'text-purple-400';
      default: return 'text-void-400';
    }
  };

  return (
    <div className="w-72 sm:w-80 glass-effect border-r border-void-600/30 flex flex-col h-screen">
      {/* Header */}
      <div className="p-3 sm:p-4 border-b border-void-600/30">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center space-x-2 min-w-0">
            <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-consciousness-400 flex-shrink-0" />
            <h2 className="text-base sm:text-lg font-semibold text-consciousness-300 truncate">AI Chat</h2>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            <button
              onClick={onNewSession}
              className="flex items-center space-x-1 bg-consciousness-600/20 hover:bg-consciousness-600/30 text-consciousness-300 px-2 sm:px-3 py-1.5 rounded-lg transition-all duration-200 active:scale-95"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm">New</span>
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="lg:hidden p-1.5 rounded-lg glass-effect hover:bg-void-700/30 transition-colors"
              >
                <X className="w-4 h-4 text-void-300" />
              </button>
            )}
          </div>
        </div>
        
        <div className="text-xs text-void-400 hidden sm:block">
          Explore consciousness and AI with context-aware conversations
        </div>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto p-1.5 sm:p-2 space-y-1">
        {sessions.length === 0 ? (
          <div className="text-center py-6 sm:py-8 text-void-500">
            <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs sm:text-sm">No conversations yet</p>
            <p className="text-xs mt-1 hidden sm:block">Start a new chat to explore</p>
          </div>
        ) : (
          sessions.map((session) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`group relative p-2.5 sm:p-3 rounded-lg cursor-pointer transition-all duration-200 active:scale-95 ${
                currentSessionId === session.id
                  ? 'bg-consciousness-600/20 border border-consciousness-500/30'
                  : 'hover:bg-void-700/30 border border-transparent'
              }`}
              onClick={() => onSessionSelect(session.id)}
            >
              {/* Session Title */}
              <div className="flex items-start justify-between">
                {editingSession === session.id ? (
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onBlur={() => handleSaveRename(session.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveRename(session.id);
                      if (e.key === 'Escape') setEditingSession(null);
                    }}
                    className="flex-1 bg-void-800/50 border border-void-600/30 rounded px-2 py-1 text-xs sm:text-sm text-void-100 focus:outline-none focus:border-consciousness-500/50"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <h3 className="text-xs sm:text-sm font-medium text-void-100 truncate pr-2">
                    {session.title}
                  </h3>
                )}
                
                {/* Actions */}
                <div className="flex items-center space-x-0.5 sm:space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRename(session.id, session.title);
                    }}
                    className="p-1 hover:bg-void-600/30 rounded text-void-400 hover:text-void-300"
                    title="Rename"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                    className="p-1 hover:bg-red-600/20 rounded text-void-400 hover:text-red-400"
                    title="Delete"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Session Info */}
              <div className="flex items-center justify-between mt-1.5 sm:mt-2 text-xs">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Clock className="w-3 h-3 text-void-500" />
                  <span className="text-void-500 text-xs">{formatDate(session.updatedAt)}</span>
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <span className="text-void-500 text-xs">{session.messages.length} msgs</span>
                  <span className={`capitalize text-xs ${getModeColor(session.context.conversationMode)}`}>
                    {session.context.conversationMode}
                  </span>
                </div>
              </div>

              {/* Context Info */}
              {(session.context.focusedTrunk || session.context.activeTopics.length > 0) && (
                <div className="mt-1.5 sm:mt-2 pt-1.5 sm:pt-2 border-t border-void-700/30">
                  {session.context.focusedTrunk && (
                    <div className="text-xs text-consciousness-400 mb-1">
                      📚 Trunk {session.context.focusedTrunk}
                    </div>
                  )}
                  {session.context.activeTopics.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {session.context.activeTopics.slice(0, 2).map((topic, index) => (
                        <span
                          key={index}
                          className="text-xs bg-void-700/30 text-void-400 px-1.5 py-0.5 rounded truncate max-w-20"
                        >
                          {topic}
                        </span>
                      ))}
                      {session.context.activeTopics.length > 2 && (
                        <span className="text-xs text-void-500">
                          +{session.context.activeTopics.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
