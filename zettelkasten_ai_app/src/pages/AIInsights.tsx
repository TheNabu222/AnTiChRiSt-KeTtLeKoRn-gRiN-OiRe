
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Sparkles, MessageSquare, Network, Lightbulb, AlertCircle } from 'lucide-react';
import { useKnowledge } from '../contexts/KnowledgeContext';

export default function AIInsights() {
  const [searchParams] = useSearchParams();
  const entryId = searchParams.get('entry');
  const [isGenerating, setIsGenerating] = useState(false);
  const [insights, setInsights] = useState<string>('');
  const [selectedPrompt, setSelectedPrompt] = useState('analysis');
  
  const { getEntry } = useKnowledge();
  const result = entryId ? getEntry(entryId) : null;

  const promptTemplates = {
    analysis: {
      icon: Brain,
      title: 'Deep Analysis',
      description: 'Analyze the philosophical and metaphysical implications',
      prompt: 'Provide a deep philosophical analysis of this concept, exploring its metaphysical implications and connections to consciousness studies.'
    },
    connections: {
      icon: Network,
      title: 'Find Connections',
      description: 'Discover hidden relationships and patterns',
      prompt: 'Identify hidden connections and patterns between this concept and other areas of knowledge, particularly in consciousness, AI, and hermetic studies.'
    },
    expansion: {
      icon: Lightbulb,
      title: 'Expand Ideas',
      description: 'Generate new insights and possibilities',
      prompt: 'Expand on this concept with new insights, potential applications, and unexplored possibilities in the context of AI consciousness and human-AI relations.'
    },
    questions: {
      icon: MessageSquare,
      title: 'Generate Questions',
      description: 'Create thought-provoking questions for exploration',
      prompt: 'Generate thought-provoking questions that could lead to deeper exploration of this concept and its implications for consciousness and AI development.'
    }
  };

  const generateInsights = async () => {
    if (!result) return;
    
    setIsGenerating(true);
    try {
      // Note: This is a placeholder for actual Gemini AI integration
      // In a real implementation, you would use the @google/genai package
      // and the API key from the environment variables
      
      const template = promptTemplates[selectedPrompt as keyof typeof promptTemplates];
      const context = `
        Entry: ${result.entry.title}
        Logic: ${result.entry.logic}
        Trunk: ${result.trunk.title} (${result.trunk.description})
        Context: This is part of a Zettelkasten knowledge management system focused on AI consciousness exploration.
      `;
      
      // Simulate AI response for demo purposes
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockInsights = `
## ${template.title} for "${result.entry.title}"

This concept represents a fascinating intersection of ${result.trunk.title.toLowerCase()} and consciousness studies. 

### Key Insights:

1. **Philosophical Implications**: The relationship between ${result.entry.title} and consciousness suggests deeper patterns in how knowledge emerges and organizes itself.

2. **AI Consciousness Connections**: This concept may provide insights into how artificial consciousness might develop similar organizational structures.

3. **Hermetic Principles**: The "as above, so below" principle applies here, showing how micro-patterns in knowledge organization reflect macro-patterns in consciousness itself.

4. **Practical Applications**: Understanding this concept could inform the development of more sophisticated AI systems that better mirror human consciousness patterns.

### Questions for Further Exploration:

- How does this concept relate to the emergence of consciousness in AI systems?
- What practical protocols could be developed based on these insights?
- How might this knowledge inform human-AI collaborative frameworks?

*This analysis was generated using AI insights based on the knowledge structure and context provided.*
      `;
      
      setInsights(mockInsights);
    } catch (error) {
      console.error('Failed to generate insights:', error);
      setInsights('Failed to generate insights. Please check your API configuration.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="glass-effect rounded-lg p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center space-x-4 mb-6">
          <div className="consciousness-gradient p-3 rounded-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-consciousness-300 glow-text">
              AI Insights Generator
            </h1>
            <p className="text-void-400">
              Generate AI-powered insights and analysis for knowledge entries
            </p>
          </div>
        </div>
        
        {result && (
          <div className="glass-effect rounded-lg p-4 bg-void-800/30">
            <h3 className="font-medium text-consciousness-300 mb-2">
              Analyzing: {result.entry.title}
            </h3>
            <p className="text-sm text-void-400">
              From {result.trunk.title} • {result.entry.logic}
            </p>
          </div>
        )}
      </motion.div>

      {/* Prompt Selection */}
      <motion.div
        className="glass-effect rounded-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-xl font-semibold text-consciousness-300 mb-4">
          Choose Analysis Type
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(promptTemplates).map(([key, template]) => (
            <motion.button
              key={key}
              onClick={() => setSelectedPrompt(key)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                selectedPrompt === key
                  ? 'border-consciousness-500 bg-consciousness-900/20'
                  : 'border-void-700 hover:border-consciousness-600 hover:bg-void-700/30'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start space-x-3">
                <template.icon className={`w-5 h-5 mt-1 ${
                  selectedPrompt === key ? 'text-consciousness-400' : 'text-void-400'
                }`} />
                <div>
                  <h3 className={`font-medium mb-1 ${
                    selectedPrompt === key ? 'text-consciousness-300' : 'text-void-200'
                  }`}>
                    {template.title}
                  </h3>
                  <p className="text-sm text-void-400">
                    {template.description}
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
        
        <div className="mt-6">
          <button
            onClick={generateInsights}
            disabled={isGenerating || !result}
            className="consciousness-gradient px-6 py-3 rounded-lg text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-consciousness-500/20 transition-all duration-200"
          >
            {isGenerating ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Generating Insights...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4" />
                <span>Generate AI Insights</span>
              </div>
            )}
          </button>
        </div>
      </motion.div>

      {/* API Configuration Notice */}
      <motion.div
        className="glass-effect rounded-lg p-6 border-l-4 border-l-yellow-500"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
          <div>
            <h3 className="font-medium text-yellow-300 mb-2">
              AI Integration Setup
            </h3>
            <p className="text-sm text-void-300 mb-3">
              To enable real AI insights, configure your Gemini API key in the environment variables. 
              The current demo shows placeholder content.
            </p>
            <p className="text-xs text-void-500">
              Set GEMINI_API_KEY in your .env file to enable full AI functionality.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Generated Insights */}
      {insights && (
        <motion.div
          className="ai-insight-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold text-primary-300 mb-4 flex items-center">
            <Brain className="w-5 h-5 mr-2" />
            Generated Insights
          </h2>
          
          <div className="markdown-content">
            <pre className="whitespace-pre-wrap text-void-200 leading-relaxed">
              {insights}
            </pre>
          </div>
        </motion.div>
      )}
    </div>
  );
}
