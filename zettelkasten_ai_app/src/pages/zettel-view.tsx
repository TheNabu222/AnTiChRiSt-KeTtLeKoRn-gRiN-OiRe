
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Calendar, 
  Tag, 
  ExternalLink, 
  Brain, 
  Network, 
  Zap,
  Star,
  Copy,
  Share,
  Eye,
  Activity,
  GitBranch
} from 'lucide-react';
import { useKnowledge } from '../contexts/KnowledgeContext';
import ZettelListItem from '../components/zettel-list-item';

const ZettelView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { entries, trunks, deleteEntry } = useKnowledge();
  const [isDeleting, setIsDeleting] = useState(false);
  const [neuralActivity, setNeuralActivity] = useState(0);
  const [viewCount, setViewCount] = useState(0);

  // Simulate neural activity
  useEffect(() => {
    const timer = setInterval(() => {
      setNeuralActivity(Math.floor(Math.random() * 100));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // Simulate view tracking
  useEffect(() => {
    setViewCount(Math.floor(Math.random() * 50) + 1);
  }, [id]);

  const entry = entries.find(e => e.id === id);
  const trunk = entry?.trunkId ? trunks.find(t => t.id === entry.trunkId) : null;

  if (!entry) {
    return (
      <div className="panel-y2k p-8 text-center">
        <Brain className="w-16 h-16 text-y2k-cyan/30 mx-auto mb-4" />
        <h2 className="text-2xl font-vt323 text-y2k-magenta mb-4">NEURAL.NODE.NOT.FOUND</h2>
        <p className="text-y2k-cyan font-tahoma mb-6">
          The requested Zettel does not exist in the neural matrix.
        </p>
        <Link to="/zettel-manager" className="btn-y2k">
          RETURN.TO.MATRIX
        </Link>
      </div>
    );
  }

  const getKastenTier = (entryId: string): number => {
    const numId = parseInt(entryId);
    if (numId >= 1000 && numId < 7000) return 1;
    if (numId >= 7000 && numId < 13000) return 2;
    if (numId >= 13000 && numId < 19000) return 3;
    if (numId >= 19000 && numId < 25000) return 4;
    return 1;
  };

  const getKastenColor = (tier: number): string => {
    switch (tier) {
      case 1: return 'kasten-1';
      case 2: return 'kasten-2';
      case 3: return 'kasten-3';
      case 4: return 'kasten-4';
      default: return 'kasten-1';
    }
  };

  const getKastenLabel = (tier: number): string => {
    switch (tier) {
      case 1: return 'FOUNDATION';
      case 2: return 'DEVELOPMENT';
      case 3: return 'COMPLEX';
      case 4: return 'MASTERY';
      default: return 'FOUNDATION';
    }
  };

  const getComplexityIcon = (tier: number) => {
    switch (tier) {
      case 1: return Brain;
      case 2: return Zap;
      case 3: return Network;
      case 4: return Star;
      default: return Brain;
    }
  };

  const tier = getKastenTier(entry.id);
  const kastenColor = getKastenColor(tier);
  const kastenLabel = getKastenLabel(tier);
  const ComplexityIcon = getComplexityIcon(tier);

  const connectedEntries = entry.connections 
    ? entries.filter(e => entry.connections!.includes(e.id))
    : [];

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this Zettel? This action cannot be undone.')) {
      setIsDeleting(true);
      try {
        await deleteEntry(entry.id);
        navigate('/zettel-manager');
      } catch (error) {
        console.error('Error deleting entry:', error);
        setIsDeleting(false);
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    // Show notification
    const notification = document.createElement('div');
    notification.textContent = 'NEURAL.LINK.COPIED';
    notification.className = 'fixed top-4 right-4 bg-y2k-cyan text-y2k-black px-4 py-2 font-vt323 text-xl z-50 animate-pulse-glow';
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link 
          to="/zettel-manager" 
          className="flex items-center space-x-2 text-y2k-cyan hover:text-y2k-magenta transition-colors duration-300 font-vt323"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>RETURN.TO.MATRIX</span>
        </Link>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleCopy}
            className="btn-kasten-2 px-3 py-2 font-vt323 border-2 rounded transition-all duration-300 hover:scale-105 flex items-center space-x-2"
          >
            <Copy className="w-4 h-4" />
            <span>COPY.LINK</span>
          </button>
          
          <Link 
            to={`/zettel-edit/${entry.id}`}
            className="btn-kasten-3 px-3 py-2 font-vt323 border-2 rounded transition-all duration-300 hover:scale-105 flex items-center space-x-2"
          >
            <Edit className="w-4 h-4" />
            <span>EDIT</span>
          </Link>
          
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="btn-kasten-4 px-3 py-2 font-vt323 border-2 rounded transition-all duration-300 hover:scale-105 flex items-center space-x-2 disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isDeleting ? 'DELETING...' : 'DELETE'}</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Entry Content */}
          <div className={`panel-y2k p-6 border-2 border-${kastenColor}`}>
            {/* Header with Tier Info */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <ComplexityIcon className={`w-6 h-6 text-${kastenColor} animate-pulse`} />
                  <span className={`font-vt323 text-sm text-${kastenColor} uppercase tracking-wider`}>
                    {kastenLabel} • TIER.{tier}
                  </span>
                </div>
                <h1 className={`text-3xl font-vt323 text-y2k-white text-shadow-glow mb-2`}>
                  {entry.title}
                </h1>
                <div className="flex items-center space-x-4 text-sm">
                  <span className={`font-vt323 text-${kastenColor}`}>
                    NEURAL.ID: #{entry.id}
                  </span>
                  <div className="flex items-center space-x-1 text-y2k-cyan">
                    <Eye className="w-4 h-4" />
                    <span className="font-vt323">{viewCount} VIEWS</span>
                  </div>
                  <div className="flex items-center space-x-1 text-y2k-magenta">
                    <Activity className="w-4 h-4 animate-pulse" />
                    <span className="font-vt323">{neuralActivity}% ACTIVITY</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-invert max-w-none">
              <div className="text-y2k-white font-tahoma leading-relaxed whitespace-pre-wrap">
                {entry.content}
              </div>
            </div>

            {/* Tags */}
            {entry.tags && entry.tags.length > 0 && (
              <div className="mt-6 pt-6 border-t border-y2k-cyan/30">
                <div className="flex items-center space-x-2 mb-3">
                  <Tag className="w-4 h-4 text-y2k-cyan" />
                  <span className="font-vt323 text-y2k-cyan uppercase tracking-wider">NEURAL.TAGS</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {entry.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`inline-flex items-center space-x-1 px-3 py-1 bg-${kastenColor}/20 border border-${kastenColor}/30 rounded text-sm font-vt323 text-${kastenColor} hover:bg-${kastenColor}/30 transition-all duration-300`}
                    >
                      <Tag className="w-3 h-3" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="mt-6 pt-6 border-t border-y2k-cyan/30">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-y2k-cyan" />
                  <span className="font-vt323 text-y2k-cyan">CREATED:</span>
                  <span className="font-tahoma text-y2k-white">{formatDate(entry.createdAt)}</span>
                </div>
                
                {entry.updatedAt && entry.updatedAt !== entry.createdAt && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-y2k-magenta" />
                    <span className="font-vt323 text-y2k-magenta">UPDATED:</span>
                    <span className="font-tahoma text-y2k-white">{formatDate(entry.updatedAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Connected Entries */}
          {connectedEntries.length > 0 && (
            <div className="panel-y2k p-6">
              <div className="flex items-center space-x-2 mb-6">
                <GitBranch className="w-5 h-5 text-y2k-cyan" />
                <h2 className="text-xl font-vt323 text-y2k-cyan">NEURAL.CONNECTIONS</h2>
                <span className={`text-sm font-vt323 text-${kastenColor}`}>
                  {connectedEntries.length} LINKS
                </span>
              </div>
              
              <div className="space-y-4">
                {connectedEntries.map((connectedEntry) => (
                  <ZettelListItem 
                    key={connectedEntry.id} 
                    entry={connectedEntry} 
                    showTrunk 
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Trunk Info */}
          {trunk && (
            <div className="panel-y2k p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Brain className={`w-5 h-5 text-${kastenColor}`} />
                <h3 className="font-vt323 text-y2k-cyan">KNOWLEDGE.TRUNK</h3>
              </div>
              
              <Link
                to={`/trunk/${trunk.id}`}
                className={`block p-3 bg-y2k-bg-dark rounded border border-${kastenColor}/30 hover:border-${kastenColor} hover:shadow-kasten-glow transition-all duration-300 group`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-vt323 text-xs text-${kastenColor} uppercase tracking-wider`}>
                    TRUNK.#{trunk.id}
                  </span>
                  <ExternalLink className={`w-3 h-3 text-${kastenColor}`} />
                </div>
                <div className={`font-tahoma text-sm text-y2k-white group-hover:text-${kastenColor} transition-colors duration-300`}>
                  {trunk.title}
                </div>
              </Link>
            </div>
          )}

          {/* Neural Stats */}
          <div className="panel-y2k p-4">
            <h3 className="font-vt323 text-y2k-cyan mb-4">NEURAL.ANALYTICS</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-vt323 text-y2k-cyan text-sm">COMPLEXITY:</span>
                <span className={`font-vt323 text-${kastenColor}`}>TIER.{tier}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-vt323 text-y2k-cyan text-sm">CONNECTIONS:</span>
                <span className="font-vt323 text-y2k-white">{entry.connections?.length || 0}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-vt323 text-y2k-cyan text-sm">TAGS:</span>
                <span className="font-vt323 text-y2k-white">{entry.tags?.length || 0}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-vt323 text-y2k-cyan text-sm">VIEWS:</span>
                <span className="font-vt323 text-y2k-white">{viewCount}</span>
              </div>
            </div>

            {/* Activity Meter */}
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-vt323 text-y2k-cyan text-sm">ACTIVITY:</span>
                <span className="font-vt323 text-y2k-magenta">{neuralActivity}%</span>
              </div>
              <div className="w-full bg-y2k-bg-dark rounded-full h-2 border border-y2k-cyan/30">
                <div 
                  className={`bg-gradient-to-r from-${kastenColor} to-y2k-magenta h-full rounded-full transition-all duration-1000 animate-pulse-glow`}
                  style={{ width: `${neuralActivity}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="panel-y2k p-4">
            <h3 className="font-vt323 text-y2k-cyan mb-4">QUICK.ACTIONS</h3>
            
            <div className="space-y-2">
              <Link
                to={`/zettel-edit/${entry.id}`}
                className="w-full btn-kasten-2 px-3 py-2 font-vt323 border-2 rounded transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>EDIT.NEURAL.NODE</span>
              </Link>
              
              <Link
                to="/zettel-create"
                className="w-full btn-kasten-1 px-3 py-2 font-vt323 border-2 rounded transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
              >
                <Brain className="w-4 h-4" />
                <span>CREATE.NEW.NODE</span>
              </Link>
              
              <button
                onClick={handleCopy}
                className="w-full btn-kasten-3 px-3 py-2 font-vt323 border-2 rounded transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
              >
                <Share className="w-4 h-4" />
                <span>SHARE.NEURAL.LINK</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZettelView;
