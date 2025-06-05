
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Tag, Plus } from 'lucide-react';
import { useKnowledge } from '../contexts/KnowledgeContext';
import ZettelListItem from '../components/zettel-list-item';
import { ZettelEntry } from '../types';

export default function TrunkView() {
  const { trunkId } = useParams<{ trunkId: string }>();
  const { getTrunk, setNavigation } = useKnowledge();
  
  const trunk = trunkId ? getTrunk(trunkId) : undefined;

  useEffect(() => {
    if (trunk) {
      setNavigation({
        currentTrunk: trunk.id,
        breadcrumbs: [
          { id: trunk.id, title: trunk.title, type: 'trunk' }
        ]
      });
    }
  }, [trunk, setNavigation]);

  if (!trunk) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-void-300 mb-2">Trunk Not Found</h2>
          <p className="text-void-500">The requested knowledge trunk could not be found.</p>
          <Link to="/" className="text-primary-400 hover:text-primary-300 mt-4 inline-block">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const renderEntry = (entry: ZettelEntry, level: number = 0) => (
    <div key={entry.id} className={`ml-${level * 4}`}>
      <ZettelListItem
        zettel={entry}
        trunk={trunk}
        index={level}
      />
      {entry.children && entry.children.map(child => renderEntry(child, level + 1))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="flex items-center space-x-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link 
          to="/"
          className="flex items-center text-void-400 hover:text-consciousness-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Dashboard
        </Link>
      </motion.div>

      {/* Trunk Header */}
      <motion.div
        className="glass-effect rounded-lg p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <span className="text-4xl">{trunk.emoji}</span>
            <div>
              <h1 className="text-3xl font-bold text-consciousness-300 glow-text mb-2">
                {trunk.number}. {trunk.title}
              </h1>
              <p className="text-lg text-void-300 mb-4">
                {trunk.description}
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="flex items-center text-consciousness-400">
                  <Tag className="w-4 h-4 mr-1" />
                  {trunk.astrological} | {trunk.planet}
                </span>
                <span className="flex items-center text-primary-400">
                  <FileText className="w-4 h-4 mr-1" />
                  {trunk.totalEntries} entries
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-void-500 mb-1">Trunk ID</p>
            <p className="font-mono text-consciousness-400">{trunk.id}</p>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-void-700/30">
          <h3 className="text-sm font-medium text-void-300 mb-2">Core Themes</h3>
          <p className="text-void-400">{trunk.themes}</p>
        </div>
      </motion.div>

      {/* Entries */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-consciousness-300">
            Knowledge Entries
          </h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-void-500">
              {trunk.totalEntries} total entries
            </span>
            <Link
              to={`/zettel/new?trunk=${trunk.id}`}
              className="flex items-center px-4 py-2 bg-consciousness-600 hover:bg-consciousness-500 text-white rounded-lg transition-colors text-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Zettel
            </Link>
          </div>
        </div>
        
        <div className="space-y-2">
          {trunk.entries.map(entry => renderEntry(entry))}
        </div>
      </motion.div>
    </div>
  );
}
