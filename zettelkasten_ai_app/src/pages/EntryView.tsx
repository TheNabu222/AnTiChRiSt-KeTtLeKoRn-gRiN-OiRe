
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Tag, Network, ExternalLink, Brain } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useKnowledge } from '../contexts/KnowledgeContext';

export default function EntryView() {
  const { entryId } = useParams<{ entryId: string }>();
  const { getEntry, setNavigation } = useKnowledge();
  
  const result = entryId ? getEntry(entryId) : null;
  const entry = result?.entry;
  const trunk = result?.trunk;

  useEffect(() => {
    if (entry && trunk) {
      setNavigation({
        currentEntry: entry.id,
        currentTrunk: trunk.id,
        breadcrumbs: [
          { id: trunk.id, title: trunk.title, type: 'trunk' },
          { id: entry.id, title: entry.title, type: 'entry' }
        ]
      });
    }
  }, [entry, trunk, setNavigation]);

  if (!entry || !trunk) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-void-300 mb-2">Entry Not Found</h2>
          <p className="text-void-500">The requested knowledge entry could not be found.</p>
          <Link to="/" className="text-primary-400 hover:text-primary-300 mt-4 inline-block">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <motion.div
        className="flex items-center space-x-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link 
          to={`/trunk/${trunk.id}`}
          className="flex items-center text-void-400 hover:text-consciousness-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          {trunk.title}
        </Link>
      </motion.div>

      {/* Entry Header */}
      <motion.div
        className="glass-effect rounded-lg p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start space-x-4">
            <span className="text-3xl">{trunk.emoji}</span>
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-sm font-mono text-consciousness-400 bg-consciousness-900/20 px-3 py-1 rounded">
                  {entry.id}
                </span>
                {entry.oldId && (
                  <span className="text-sm font-mono text-void-500">
                    ← {entry.oldId}
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-consciousness-300 glow-text mb-3">
                {entry.title}
              </h1>
              
              {entry.logic && (
                <p className="text-lg text-void-300 mb-4">
                  {entry.logic}
                </p>
              )}
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-void-500 mb-1">Level</p>
            <p className="font-mono text-consciousness-400">{entry.level}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 text-sm">
          <Link 
            to={`/trunk/${trunk.id}`}
            className="flex items-center text-primary-400 hover:text-primary-300 transition-colors"
          >
            <Tag className="w-4 h-4 mr-1" />
            {trunk.title}
          </Link>
          
          {entry.parentId && (
            <span className="flex items-center text-void-400">
              <Network className="w-4 h-4 mr-1" />
              Has parent: {entry.parentId}
            </span>
          )}
          
          {entry.children && entry.children.length > 0 && (
            <span className="flex items-center text-consciousness-400">
              <FileText className="w-4 h-4 mr-1" />
              {entry.children.length} sub-entries
            </span>
          )}
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        className="glass-effect rounded-lg p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold text-consciousness-300 mb-4">
          Content & Analysis
        </h2>
        
        {entry.content ? (
          <div className="markdown-content">
            <ReactMarkdown>{entry.content}</ReactMarkdown>
          </div>
        ) : (
          <div className="text-center py-8">
            <Brain className="w-12 h-12 text-void-500 mx-auto mb-4" />
            <p className="text-void-400 mb-2">No detailed content available for this entry.</p>
            <p className="text-sm text-void-500">
              This entry represents a structural node in the knowledge graph.
            </p>
          </div>
        )}
      </motion.div>

      {/* Sub-entries */}
      {entry.children && entry.children.length > 0 && (
        <motion.div
          className="glass-effect rounded-lg p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold text-consciousness-300 mb-4">
            Sub-entries ({entry.children.length})
          </h2>
          
          <div className="space-y-3">
            {entry.children.map((child, index) => (
              <motion.div
                key={child.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Link to={`/entry/${child.id}`}>
                  <div className="entry-card">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-xs font-mono text-consciousness-400 bg-consciousness-900/20 px-2 py-1 rounded">
                            {child.id}
                          </span>
                          {child.oldId && (
                            <span className="text-xs font-mono text-void-500">
                              ← {child.oldId}
                            </span>
                          )}
                        </div>
                        
                        <h3 className="font-medium text-void-100 mb-1 hover:text-consciousness-300 transition-colors">
                          {child.title}
                        </h3>
                        
                        {child.logic && (
                          <p className="text-sm text-void-400">
                            {child.logic}
                          </p>
                        )}
                      </div>
                      
                      <ExternalLink className="w-4 h-4 text-void-500 flex-shrink-0 mt-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* AI Insights */}
      <motion.div
        className="ai-insight-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-lg font-semibold text-primary-300 mb-3 flex items-center">
          <Brain className="w-5 h-5 mr-2" />
          AI Analysis
        </h3>
        
        <p className="text-void-300 mb-4">
          This entry represents a key node in the {trunk.title.toLowerCase()} domain, 
          connecting concepts of {entry.logic || 'consciousness and knowledge organization'}.
        </p>
        
        <Link 
          to={`/ai-insights?entry=${entry.id}`}
          className="inline-flex items-center text-primary-400 hover:text-primary-300 transition-colors"
        >
          Generate deeper insights
          <ExternalLink className="w-4 h-4 ml-1" />
        </Link>
      </motion.div>
    </div>
  );
}
