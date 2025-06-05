
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Sparkles, 
  Network, 
  Search, 
  BookOpen, 
  Lightbulb,
  ArrowRight,
  ExternalLink,
  Zap
} from 'lucide-react';
import { ZettelEntry, Trunk } from '../types';
import { useKnowledge } from '../contexts/KnowledgeContext';
import { 
  suggestNavigationPaths, 
  discoverKnowledgeConnections,
  generateContextualInsights 
} from '../utils/googleApi';

interface GeminiCollaboratorProps {
  currentEntry?: ZettelEntry;
  onNavigateToEntry: (entryId: string) => void;
  onNavigateToTrunk: (trunkId: string) => void;
}

export default function GeminiCollaborator({ 
  currentEntry, 
  onNavigateToEntry, 
  onNavigateToTrunk 
}: GeminiCollaboratorProps) {
  const { trunks, allEntries } = useKnowledge();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [navigationSuggestions, setNavigationSuggestions] = useState<any>(null);
  const [knowledgeConnections, setKnowledgeConnections] = useState<any>(null);
  const [contextualInsights, setContextualInsights] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'navigation' | 'connections' | 'insights'>('navigation');

  useEffect(() => {
    if (currentEntry) {
      generateSuggestions();
    } else {
      generateOverallInsights();
    }
  }, [currentEntry]);

  const generateSuggestions = async () => {
    if (!currentEntry) return;
    
    setIsAnalyzing(true);
    try {
      // Get navigation suggestions
      const navSuggestions = await suggestNavigationPaths(
        currentEntry,
        allEntries,
        trunks
      );
      setNavigationSuggestions(navSuggestions);

      // Get related entries for connection analysis
      const relatedEntries = allEntries.filter(entry => {
        if (entry.id === currentEntry.id) return false;
        
        const tagOverlap = currentEntry.tags?.some(tag => 
          entry.tags?.includes(tag)
        ) || false;
        
        const hasConnection = currentEntry.connections?.includes(entry.id) ||
                             entry.connections?.includes(currentEntry.id) ||
                             false;
        
        return tagOverlap || hasConnection;
      }).slice(0, 8);

      // Analyze connections
      const connections = await discoverKnowledgeConnections(
        [currentEntry, ...relatedEntries],
        'connections'
      );
      setKnowledgeConnections(connections);

    } catch (error) {
      console.error('Error generating AI suggestions:', error);
    }
    setIsAnalyzing(false);
  };

  const generateOverallInsights = async () => {
    setIsAnalyzing(true);
    try {
      const insights = await generateContextualInsights(
        'consciousness and AI integration',
        allEntries.slice(0, 20), // Sample of entries
        trunks
      );
      setContextualInsights(insights);
    } catch (error) {
      console.error('Error generating contextual insights:', error);
    }
    setIsAnalyzing(false);
  };

  const tabs = [
    { id: 'navigation', label: 'Navigation', icon: ArrowRight },
    { id: 'connections', label: 'Connections', icon: Network },
    { id: 'insights', label: 'Insights', icon: Lightbulb }
  ];

  return (
    <div className="bg-void-800/50 backdrop-blur-sm border border-void-600/30 rounded-lg p-4 lg:p-6 space-y-4 lg:space-y-6 h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="consciousness-gradient p-2 rounded-lg">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-consciousness-300 glow-text">
            Gemini Collaborator
          </h3>
          <p className="text-sm text-void-400">
            AI-powered knowledge exploration assistant
          </p>
        </div>
        {isAnalyzing && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="ml-auto flex-shrink-0"
          >
            <Sparkles className="w-5 h-5 text-consciousness-400" />
          </motion.div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-void-900/50 rounded-lg p-1">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-2 lg:px-3 rounded-md transition-all text-xs lg:text-sm ${
                activeTab === tab.id
                  ? 'bg-consciousness-600/20 text-consciousness-300'
                  : 'text-void-400 hover:text-void-200 hover:bg-void-800/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden lg:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="space-y-4 lg:space-y-6 flex-1 overflow-y-auto">
        {activeTab === 'navigation' && navigationSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 lg:space-y-6"
          >
            {/* Suggested Paths */}
            {navigationSuggestions.suggestedPaths?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-consciousness-300 mb-3 flex items-center space-x-2">
                  <ArrowRight className="w-4 h-4" />
                  <span>Suggested Exploration Paths</span>
                </h4>
                <div className="space-y-3">
                  {navigationSuggestions.suggestedPaths.slice(0, 3).map((path: any, index: number) => (
                    <div
                      key={index}
                      className="bg-void-900/30 rounded-lg p-4 border border-void-600/20"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-consciousness-300">
                          {path.theme}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          path.difficulty === 'beginner' ? 'bg-green-600/20 text-green-300' :
                          path.difficulty === 'intermediate' ? 'bg-yellow-600/20 text-yellow-300' :
                          'bg-red-600/20 text-red-300'
                        }`}>
                          {path.difficulty}
                        </span>
                      </div>
                      <p className="text-xs text-void-300 mb-3">{path.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {path.path.slice(0, 3).map((entryId: string) => (
                          <button
                            key={entryId}
                            onClick={() => onNavigateToEntry(entryId)}
                            className="text-xs bg-consciousness-600/20 text-consciousness-300 px-2 py-1 rounded hover:bg-consciousness-600/30 transition-colors"
                          >
                            {entryId}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Concepts */}
            {navigationSuggestions.relatedConcepts?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-consciousness-300 mb-3 flex items-center space-x-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Related Concepts</span>
                </h4>
                <div className="space-y-3">
                  {navigationSuggestions.relatedConcepts.slice(0, 4).map((concept: any, index: number) => (
                    <div
                      key={index}
                      className="bg-void-900/30 rounded-lg p-4 border border-void-600/20"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <button
                          onClick={() => onNavigateToEntry(concept.entryId)}
                          className="text-sm font-medium text-consciousness-300 hover:text-consciousness-200 transition-colors flex items-center space-x-1"
                        >
                          <span>{concept.entryId}</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                        <span className="text-xs text-void-500 capitalize">
                          {concept.relationship}
                        </span>
                      </div>
                      <p className="text-xs text-void-300">{concept.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'connections' && knowledgeConnections && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 lg:space-y-6"
          >
            {/* Insights */}
            {knowledgeConnections.insights?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-consciousness-300 mb-3 flex items-center space-x-2">
                  <Lightbulb className="w-4 h-4" />
                  <span>AI Insights</span>
                </h4>
                <div className="space-y-3">
                  {knowledgeConnections.insights.slice(0, 3).map((insight: any, index: number) => (
                    <div
                      key={index}
                      className="bg-void-900/30 rounded-lg p-4 border border-void-600/20"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-void-500 capitalize">
                          {insight.category}
                        </span>
                        <span className="text-xs text-consciousness-400">
                          {Math.round(insight.confidence * 100)}% confidence
                        </span>
                      </div>
                      <p className="text-sm text-void-200">{insight.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Discovered Connections */}
            {knowledgeConnections.connections?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-consciousness-300 mb-3 flex items-center space-x-2">
                  <Network className="w-4 h-4" />
                  <span>Discovered Connections</span>
                </h4>
                <div className="space-y-3">
                  {knowledgeConnections.connections.slice(0, 4).map((connection: any, index: number) => (
                    <div
                      key={index}
                      className="bg-void-900/30 rounded-lg p-4 border border-void-600/20"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2 text-sm">
                          <button
                            onClick={() => onNavigateToEntry(connection.fromId)}
                            className="text-consciousness-300 hover:text-consciousness-200 transition-colors"
                          >
                            {connection.fromId}
                          </button>
                          <ArrowRight className="w-3 h-3 text-void-500" />
                          <button
                            onClick={() => onNavigateToEntry(connection.toId)}
                            className="text-consciousness-300 hover:text-consciousness-200 transition-colors"
                          >
                            {connection.toId}
                          </button>
                        </div>
                        <span className="text-xs text-void-500 capitalize">
                          {connection.relationship}
                        </span>
                      </div>
                      <p className="text-xs text-void-300 mb-3">{connection.explanation}</p>
                      <div className="mt-2">
                        <div className="w-full bg-void-700 rounded-full h-1">
                          <div
                            className="bg-consciousness-500 h-1 rounded-full"
                            style={{ width: `${connection.strength * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'insights' && contextualInsights && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 lg:space-y-6"
          >
            {/* Overview */}
            {contextualInsights.overview && (
              <div>
                <h4 className="text-sm font-medium text-consciousness-300 mb-3">
                  Knowledge Base Overview
                </h4>
                <div className="bg-void-900/30 rounded-lg p-4 border border-void-600/20">
                  <p className="text-sm text-void-200">{contextualInsights.overview}</p>
                </div>
              </div>
            )}

            {/* Key Themes */}
            {contextualInsights.keyThemes?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-consciousness-300 mb-3">
                  Key Themes
                </h4>
                <div className="flex flex-wrap gap-2">
                  {contextualInsights.keyThemes.map((theme: string, index: number) => (
                    <span
                      key={index}
                      className="text-xs bg-consciousness-600/20 text-consciousness-300 px-2 py-1 rounded"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Exploration */}
            {contextualInsights.recommendedExploration?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-consciousness-300 mb-3 flex items-center space-x-2">
                  <Search className="w-4 h-4" />
                  <span>Recommended Exploration</span>
                </h4>
                <div className="space-y-3">
                  {contextualInsights.recommendedExploration.slice(0, 3).map((rec: any, index: number) => (
                    <div
                      key={index}
                      className="bg-void-900/30 rounded-lg p-4 border border-void-600/20"
                    >
                      <h5 className="text-sm font-medium text-consciousness-300 mb-2">
                        {rec.area}
                      </h5>
                      <p className="text-xs text-void-300 mb-3">{rec.rationale}</p>
                      <div className="flex flex-wrap gap-2">
                        {rec.entryIds.map((entryId: string) => (
                          <button
                            key={entryId}
                            onClick={() => onNavigateToEntry(entryId)}
                            className="text-xs bg-consciousness-600/20 text-consciousness-300 px-2 py-1 rounded hover:bg-consciousness-600/30 transition-colors"
                          >
                            {entryId}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Loading State */}
        {isAnalyzing && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Zap className="w-6 h-6 text-consciousness-400" />
              </motion.div>
              <span className="text-sm text-void-400">
                Analyzing knowledge patterns...
              </span>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isAnalyzing && !navigationSuggestions && !knowledgeConnections && !contextualInsights && (
          <div className="text-center py-8">
            <Brain className="w-12 h-12 text-void-600 mx-auto mb-3" />
            <p className="text-sm text-void-400">
              Select an entry to get AI-powered exploration suggestions
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
