
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, AlertCircle, RefreshCw, Settings, Filter, Menu, Network, Zap, HelpCircle } from 'lucide-react';
import { ChatMessage as ChatMessageType, ChatSession, ZettelEntry, Trunk } from '../types';
import { useKnowledge } from '../contexts/KnowledgeContext';
import { sendChatMessage, testGeminiConnectivity } from '../utils/googleApi';
import ChatMessage from '../components/ChatMessage';
import EnhancedChatInput from '../components/EnhancedChatInput';
import ChatSidebar from '../components/ChatSidebar';
import GeminiCollaborator from '../components/GeminiCollaborator';
import { HelpTooltip } from '../components/HelpTooltip';
import { useNavigate, useParams } from 'react-router-dom';

export default function AIChatPage() {
  const navigate = useNavigate();
  const params = useParams();
  const { trunks, allEntries, searchEntries } = useKnowledge();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showCollaborator, setShowCollaborator] = useState(true);
  const [geminiStatus, setGeminiStatus] = useState<any>(null);
  const [currentContext, setCurrentContext] = useState<{
    entryId?: string;
    trunkId?: string;
    topic?: string;
  }>({});
  const [contextFilter, setContextFilter] = useState({
    includeTrunks: true,
    includeEntries: true,
    maxContextEntries: 8,
    relevanceThreshold: 0.2,
    intelligentContext: true
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load sessions from localStorage on mount and test Gemini connectivity
  useEffect(() => {
    const savedSessions = localStorage.getItem('ai-chat-sessions');
    if (savedSessions) {
      try {
        const parsed = JSON.parse(savedSessions);
        const sessionsWithDates = parsed.map((session: any) => ({
          ...session,
          createdAt: new Date(session.createdAt),
          updatedAt: new Date(session.updatedAt),
          messages: session.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
        setSessions(sessionsWithDates);
        
        // Set the most recent session as current
        if (sessionsWithDates.length > 0) {
          setCurrentSession(sessionsWithDates[0]);
        }
      } catch (error) {
        console.error('Failed to load chat sessions:', error);
      }
    }

    // Test Gemini connectivity
    testGeminiConnectivity().then(setGeminiStatus);
  }, []);

  // Handle URL parameters for context
  useEffect(() => {
    if (params.entryId) {
      setCurrentContext(prev => ({ ...prev, entryId: params.entryId }));
    }
    if (params.trunkId) {
      setCurrentContext(prev => ({ ...prev, trunkId: params.trunkId }));
    }
  }, [params]);

  // Save sessions to localStorage whenever sessions change
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('ai-chat-sessions', JSON.stringify(sessions));
    }
  }, [sessions]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages]);

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      title: 'New Conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      context: {
        conversationMode: 'exploration',
        focusedTrunk: currentContext.trunkId,
        activeTopics: [],
        recentEntries: []
      }
    };
    
    setSessions(prev => [newSession, ...prev]);
    setCurrentSession(newSession);
  };

  const updateSession = (updatedSession: ChatSession) => {
    setSessions(prev => prev.map(session => 
      session.id === updatedSession.id ? updatedSession : session
    ));
    setCurrentSession(updatedSession);
  };

  const deleteSession = (sessionId: string) => {
    setSessions(prev => prev.filter(session => session.id !== sessionId));
    if (currentSession?.id === sessionId) {
      const remainingSessions = sessions.filter(session => session.id !== sessionId);
      setCurrentSession(remainingSessions.length > 0 ? remainingSessions[0] : null);
    }
  };

  const renameSession = (sessionId: string, newTitle: string) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, title: newTitle, updatedAt: new Date() }
        : session
    ));
    if (currentSession?.id === sessionId) {
      setCurrentSession(prev => prev ? { ...prev, title: newTitle } : null);
    }
  };

  const clearAllSessions = () => {
    setSessions([]);
    setCurrentSession(null);
    localStorage.removeItem('ai-chat-sessions');
  };

  const getCurrentEntry = (): ZettelEntry | undefined => {
    if (currentContext.entryId) {
      return allEntries.find(entry => entry.id === currentContext.entryId);
    }
    return undefined;
  };

  const handleNavigateToEntry = (entryId: string) => {
    navigate(`/zettel/${entryId}`);
  };

  const handleNavigateToTrunk = (trunkId: string) => {
    navigate(`/trunk/${trunkId}`);
  };

  const handleCitationClick = (entryId: string) => {
    setCurrentContext(prev => ({ ...prev, entryId }));
    navigate(`/zettel/${entryId}`);
  };

  const getRelevantContext = (message: string) => {
    let relevantEntries: ZettelEntry[] = [];
    let relevantTrunks: Trunk[] = [];

    if (contextFilter.intelligentContext) {
      // Enhanced context gathering with semantic analysis
      const keywords = message.toLowerCase().split(/\s+/).filter(word => word.length > 3);
      
      // Score entries based on content relevance
      const scoredEntries = allEntries.map(entry => {
        let score = 0;
        const entryText = `${entry.title} ${entry.content} ${entry.tags?.join(' ') || ''}`.toLowerCase();
        
        keywords.forEach(keyword => {
          if (entryText.includes(keyword)) {
            score += 1;
          }
        });
        
        // Boost score for current context
        if (currentContext.entryId === entry.id) score += 5;
        if (currentContext.trunkId === entry.trunkId) score += 2;
        
        return { entry, score };
      });

      relevantEntries = scoredEntries
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, contextFilter.maxContextEntries)
        .map(item => item.entry);

      const relevantTrunkIds = new Set(relevantEntries.map(entry => entry.trunkId));
      relevantTrunks = trunks.filter(trunk => relevantTrunkIds.has(trunk.id));
    } else {
      // Simple context gathering (legacy mode)
      const searchResults = searchEntries(message);
      relevantEntries = searchResults
        .filter(result => result.score <= contextFilter.relevanceThreshold)
        .slice(0, contextFilter.maxContextEntries)
        .map(result => result.entry);

      const relevantTrunkIds = new Set(relevantEntries.map(entry => entry.trunkId));
      relevantTrunks = trunks.filter(trunk => relevantTrunkIds.has(trunk.id));
    }

    return {
      entries: contextFilter.includeEntries ? relevantEntries.slice(0, contextFilter.maxContextEntries) : [],
      trunks: contextFilter.includeTrunks ? relevantTrunks : []
    };
  };

  const handleSendMessage = async (
    message: string, 
    mode: 'exploration' | 'analysis' | 'synthesis' | 'creative',
    attachments?: any[]
  ) => {
    if (!currentSession) {
      createNewSession();
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create user message
      const userMessage: ChatMessageType = {
        id: `msg-${Date.now()}-user`,
        content: message,
        role: 'user',
        timestamp: new Date()
      };

      // Get relevant context
      const context = getRelevantContext(message);

      // Update session with user message and new mode
      const updatedSession = {
        ...currentSession,
        messages: [...currentSession.messages, userMessage],
        updatedAt: new Date(),
        context: {
          ...currentSession.context,
          conversationMode: mode,
          focusedTrunk: context.trunks.length > 0 ? context.trunks[0].id : currentSession.context.focusedTrunk,
          activeTopics: [
            ...new Set([
              ...currentSession.context.activeTopics,
              ...context.entries.flatMap(entry => entry.tags || []).slice(0, 3)
            ])
          ].slice(0, 10) // Limit active topics
        }
      };

      // Auto-generate title for new sessions
      if (currentSession.title === 'New Conversation') {
        updatedSession.title = message.length > 50 
          ? message.substring(0, 47) + '...'
          : message;
      }

      updateSession(updatedSession);

      // Send to AI
      const aiResponse = await sendChatMessage(message, {
        entries: context.entries,
        trunks: context.trunks,
        conversationHistory: currentSession.messages.slice(-6), // Last 6 messages for context
        mode
      });

      if (aiResponse) {
        const aiMessage: ChatMessageType = {
          id: `msg-${Date.now()}-ai`,
          content: aiResponse.content,
          role: 'assistant',
          timestamp: new Date(),
          contextEntries: context.entries.map(e => e.id),
          contextTrunks: context.trunks.map(t => t.id),
          metadata: {
            model: aiResponse.metadata.model,
            tokens: aiResponse.metadata.tokens,
            confidence: aiResponse.metadata.confidence,
            citations: aiResponse.citations
          }
        };

        const finalSession = {
          ...updatedSession,
          messages: [...updatedSession.messages, aiMessage],
          updatedAt: new Date()
        };

        updateSession(finalSession);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError(error instanceof Error ? error.message : 'Failed to send message');
    }

    setIsLoading(false);
  };

  return (
    <div className="h-screen flex bg-void-900">
      {/* Mobile Sidebar Overlay */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Chat Sidebar - Improved responsive width */}
      <div className={`
        fixed lg:relative lg:translate-x-0 z-50 lg:z-auto
        transition-transform duration-300 ease-in-out
        ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <ChatSidebar
          sessions={sessions}
          currentSessionId={currentSession?.id}
          onSessionSelect={(sessionId) => {
            const session = sessions.find(s => s.id === sessionId);
            if (session) setCurrentSession(session);
            setShowSidebar(false);
          }}
          onNewSession={() => {
            createNewSession();
            setShowSidebar(false);
          }}
          onDeleteSession={deleteSession}
          onRenameSession={renameSession}
          onClose={() => setShowSidebar(false)}
        />
      </div>

      {/* Main Content Area - Better responsive layout */}
      <div className="flex-1 flex min-w-0">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header - Improved spacing */}
          <div className="glass-effect border-b border-void-600/30 p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 lg:space-x-4 min-w-0">
                <button
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="lg:hidden p-2 rounded-lg glass-effect hover:bg-void-700/30 transition-colors flex-shrink-0"
                >
                  <Menu className="w-5 h-5 text-void-300" />
                </button>
                
                <div className="consciousness-gradient p-2 lg:p-2.5 rounded-lg flex-shrink-0">
                  <Brain className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-lg lg:text-xl font-bold text-consciousness-300 glow-text truncate">
                    Gemini Consciousness Explorer
                    <HelpTooltip
                      content="Chat with an AI assistant that can help you explore ideas, answer questions, and provide insights based on your knowledge base. The AI has access to all 24 knowledge trunks and can make intelligent connections."
                      title="AI Chat Assistant"
                      trigger="hover"
                      className="ml-2 inline-block"
                    >
                      <HelpCircle className="w-4 h-4 text-void-500 hover:text-consciousness-400" />
                    </HelpTooltip>
                  </h1>
                  <div className="flex items-center space-x-2 text-xs lg:text-sm text-void-400">
                    <span className="hidden sm:inline">Collaborative AI knowledge exploration</span>
                    {geminiStatus && (
                      <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${
                          geminiStatus.success ? 'bg-green-400' : 'bg-red-400'
                        }`} />
                        <span className="text-xs">
                          {geminiStatus.success ? 'Connected' : 'Disconnected'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 lg:space-x-3 flex-shrink-0">
                <button
                  onClick={() => setShowCollaborator(!showCollaborator)}
                  className={`flex items-center space-x-1 glass-effect px-3 lg:px-4 py-2 lg:py-2.5 rounded-lg transition-all duration-200 ${
                    showCollaborator ? 'bg-consciousness-600/20 text-consciousness-300' : 'hover:bg-void-700/30 text-void-400'
                  }`}
                  title="Toggle AI Collaborator"
                >
                  <Network className="w-4 h-4" />
                  <span className="text-sm hidden sm:inline">Collaborator</span>
                </button>
                
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="flex items-center space-x-1 glass-effect px-3 lg:px-4 py-2 lg:py-2.5 rounded-lg hover:bg-void-700/30 transition-all duration-200"
                  title="Chat Settings"
                >
                  <Settings className="w-4 h-4 text-void-400" />
                  <span className="text-sm hidden sm:inline">Settings</span>
                </button>
                
                {sessions.length > 0 && (
                  <button
                    onClick={clearAllSessions}
                    className="flex items-center space-x-1 glass-effect px-3 lg:px-4 py-2 lg:py-2.5 rounded-lg hover:bg-red-600/20 text-red-400 transition-all duration-200"
                    title="Clear All Sessions"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span className="text-sm hidden sm:inline">Clear All</span>
                  </button>
                )}
              </div>
            </div>

          {/* Settings Panel */}
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 lg:mt-6 p-4 lg:p-6 bg-void-800/30 rounded-lg border border-void-600/20"
            >
              <h3 className="text-lg font-semibold text-consciousness-300 mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Context & Filter Settings
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={contextFilter.includeTrunks}
                        onChange={(e) => setContextFilter(prev => ({ ...prev, includeTrunks: e.target.checked }))}
                        className="rounded border-void-600 bg-void-800 text-consciousness-500 focus:ring-consciousness-500"
                      />
                      <span className="text-sm text-void-200">Include trunk context</span>
                    </label>
                  </div>
                  
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={contextFilter.includeEntries}
                        onChange={(e) => setContextFilter(prev => ({ ...prev, includeEntries: e.target.checked }))}
                        className="rounded border-void-600 bg-void-800 text-consciousness-500 focus:ring-consciousness-500"
                      />
                      <span className="text-sm text-void-200">Include entry context</span>
                    </label>
                  </div>
                  
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={contextFilter.intelligentContext}
                        onChange={(e) => setContextFilter(prev => ({ ...prev, intelligentContext: e.target.checked }))}
                        className="rounded border-void-600 bg-void-800 text-consciousness-500 focus:ring-consciousness-500"
                      />
                      <span className="text-sm text-void-200">Intelligent context analysis</span>
                    </label>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-void-300 mb-2">
                      Max context entries: {contextFilter.maxContextEntries}
                    </label>
                    <input
                      type="range"
                      min="2"
                      max="20"
                      value={contextFilter.maxContextEntries}
                      onChange={(e) => setContextFilter(prev => ({ ...prev, maxContextEntries: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-void-300 mb-2">
                      Relevance threshold: {contextFilter.relevanceThreshold}
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.1"
                      value={contextFilter.relevanceThreshold}
                      onChange={(e) => setContextFilter(prev => ({ ...prev, relevanceThreshold: parseFloat(e.target.value) }))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Messages Area - Better spacing */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 xl:p-8 space-y-4 lg:space-y-6">
          {!currentSession ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="consciousness-gradient p-4 lg:p-5 rounded-full mb-6">
                <Zap className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              </div>
              <h2 className="text-xl lg:text-2xl font-bold text-consciousness-300 mb-3">
                Welcome to Gemini Consciousness Explorer
              </h2>
              <p className="text-void-400 mb-4 max-w-md text-sm lg:text-base">
                Collaborate with Gemini AI to explore consciousness, discover connections, and navigate the 24 knowledge trunks.
              </p>
              <div className="mb-6 p-3 bg-blue-600/10 border border-blue-500/20 rounded-lg max-w-md">
                <p className="text-xs text-blue-300 mb-2 font-medium">💡 Getting Started Tips:</p>
                <ul className="text-xs text-blue-200 space-y-1">
                  <li>• Ask questions about consciousness, AI, or philosophy</li>
                  <li>• Request connections between different knowledge areas</li>
                  <li>• Use different conversation modes for varied responses</li>
                  <li>• The AI can access all your knowledge trunks for context</li>
                </ul>
              </div>
              
              {/* Gemini Status Indicator */}
              {geminiStatus && (
                <div className={`mb-8 px-4 py-3 rounded-lg border ${
                  geminiStatus.success 
                    ? 'bg-green-600/10 border-green-500/30 text-green-300'
                    : 'bg-red-600/10 border-red-500/30 text-red-300'
                }`}>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className={`w-2 h-2 rounded-full ${
                      geminiStatus.success ? 'bg-green-400' : 'bg-red-400'
                    }`} />
                    <span>
                      {geminiStatus.success 
                        ? 'Gemini AI Ready for Collaboration' 
                        : 'Gemini AI Connection Issue'
                      }
                    </span>
                  </div>
                  {geminiStatus.message && (
                    <p className="text-xs mt-1 opacity-80">{geminiStatus.message}</p>
                  )}
                </div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 mb-8 max-w-lg">
                <div className="bg-void-800/30 rounded-lg p-4 lg:p-5 border border-void-600/20">
                  <Network className="w-5 h-5 text-consciousness-400 mb-3" />
                  <h3 className="text-sm font-medium text-consciousness-300 mb-2">
                    Intelligent Navigation
                  </h3>
                  <p className="text-xs text-void-400">
                    AI suggests connections between concepts and knowledge trunks
                  </p>
                </div>
                <div className="bg-void-800/30 rounded-lg p-4 lg:p-5 border border-void-600/20">
                  <Brain className="w-5 h-5 text-consciousness-400 mb-3" />
                  <h3 className="text-sm font-medium text-consciousness-300 mb-2">
                    Deep Analysis
                  </h3>
                  <p className="text-xs text-void-400">
                    Contextual insights about consciousness and AI integration
                  </p>
                </div>
              </div>
              
              <button
                onClick={createNewSession}
                className="bg-consciousness-600 hover:bg-consciousness-500 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-lg transition-all duration-200 flex items-center space-x-2 text-sm lg:text-base active:scale-95"
              >
                <Sparkles className="w-4 h-4 lg:w-5 lg:h-5" />
                <span>Start Collaborative Exploration</span>
              </button>
            </div>
          ) : (
            <>
              {currentSession.messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  onCitationClick={handleCitationClick}
                />
              ))}
              
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center space-x-2 bg-red-600/10 border border-red-500/30 rounded-lg p-4 lg:p-5"
                >
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <div>
                    <p className="text-red-300 font-medium">Error</p>
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

          {/* Input Area - Better spacing */}
          {currentSession && (
            <div className="border-t border-void-600/30 p-4 lg:p-6 xl:p-8">
              <EnhancedChatInput
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                placeholder="Ask about consciousness, explore connections, or analyze patterns in the knowledge base..."
                currentContext={currentContext}
              />
            </div>
          )}
        </div>

        {/* Gemini Collaborator Sidebar - Improved responsive width and spacing */}
        {showCollaborator && (
          <div className="w-72 lg:w-80 xl:w-96 2xl:w-[28rem] border-l border-void-600/30 p-4 lg:p-6 overflow-y-auto">
            <GeminiCollaborator
              currentEntry={getCurrentEntry()}
              onNavigateToEntry={handleNavigateToEntry}
              onNavigateToTrunk={handleNavigateToTrunk}
            />
          </div>
        )}
      </div>
    </div>
  );
}
