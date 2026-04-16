
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Save, 
  X, 
  Brain, 
  Tag, 
  Link as LinkIcon, 
  Zap,
  Network,
  Star,
  Activity,
  Cpu,
  Database
} from 'lucide-react';
import { useKnowledge } from '../contexts/KnowledgeContext';

const ZettelCreate: React.FC = () => {
  const navigate = useNavigate();
  const { trunks, entries, addEntry } = useKnowledge();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    trunkId: '',
    connections: [] as string[]
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [neuralActivity, setNeuralActivity] = useState(0);
  const [selectedConnections, setSelectedConnections] = useState<string[]>([]);
  const [connectionSearch, setConnectionSearch] = useState('');

  // Simulate neural activity
  useEffect(() => {
    const timer = setInterval(() => {
      setNeuralActivity(Math.floor(Math.random() * 100));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const getKastenTier = (id: string): number => {
    const numId = parseInt(id);
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

  const selectedTrunk = trunks.find(t => t.id === formData.trunkId);
  const trunkTier = selectedTrunk ? getKastenTier(selectedTrunk.id) : 1;
  const kastenColor = getKastenColor(trunkTier);
  const kastenLabel = getKastenLabel(trunkTier);
  const ComplexityIcon = getComplexityIcon(trunkTier);

  const filteredEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(connectionSearch.toLowerCase()) ||
    entry.content.toLowerCase().includes(connectionSearch.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('NEURAL.ERROR: Title and content are required for neural node creation.');
      return;
    }

    setIsSubmitting(true);

    try {
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const newEntry = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        tags: tags.length > 0 ? tags : undefined,
        trunkId: formData.trunkId || undefined,
        connections: selectedConnections.length > 0 ? selectedConnections : undefined,
      };

      const createdEntry = await addEntry(newEntry);
      
      // Show success notification
      const notification = document.createElement('div');
      notification.textContent = 'NEURAL.NODE.CREATED.SUCCESSFULLY';
      notification.className = 'fixed top-4 right-4 bg-y2k-cyan text-y2k-black px-4 py-2 font-vt323 text-xl z-50 animate-pulse-glow';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);

      navigate(`/zettel/${createdEntry.id}`);
    } catch (error) {
      console.error('Error creating entry:', error);
      alert('NEURAL.ERROR: Failed to create neural node. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleConnectionToggle = (entryId: string) => {
    setSelectedConnections(prev =>
      prev.includes(entryId)
        ? prev.filter(id => id !== entryId)
        : [...prev, entryId]
    );
  };

  const handleCancel = () => {
    if (formData.title || formData.content || formData.tags) {
      if (window.confirm('NEURAL.WARNING: Discard neural node creation? All data will be lost.')) {
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-vt323 text-y2k-magenta text-shadow-y2k mb-2">
            CREATE.NEURAL.NODE
          </h1>
          <p className="text-y2k-cyan font-tahoma">
            Initialize a new consciousness node in the neural matrix
          </p>
        </div>
        
        <div className="flex items-center space-x-2 text-sm font-vt323">
          <Activity className="w-4 h-4 text-y2k-magenta animate-pulse" />
          <span className="text-y2k-magenta">NEURAL.ACTIVITY: {neuralActivity}%</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="panel-y2k p-6">
              <label className="block font-vt323 text-y2k-cyan text-sm mb-3 uppercase tracking-wider">
                NEURAL.NODE.TITLE
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter neural node title..."
                className="input-y2k w-full py-3 px-4 rounded font-tahoma text-lg"
                required
              />
            </div>

            {/* Content */}
            <div className="panel-y2k p-6">
              <label className="block font-vt323 text-y2k-cyan text-sm mb-3 uppercase tracking-wider">
                NEURAL.CONTENT.MATRIX
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Enter neural content and consciousness data..."
                rows={12}
                className="input-y2k w-full py-3 px-4 rounded font-tahoma resize-none"
                required
              />
              <div className="mt-2 text-xs font-vt323 text-y2k-cyan/70">
                CHARACTERS: {formData.content.length} | WORDS: {formData.content.split(/\s+/).filter(w => w).length}
              </div>
            </div>

            {/* Tags */}
            <div className="panel-y2k p-6">
              <label className="block font-vt323 text-y2k-cyan text-sm mb-3 uppercase tracking-wider">
                <Tag className="inline w-4 h-4 mr-2" />
                NEURAL.TAGS
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="consciousness, ai, neural-network, philosophy..."
                className="input-y2k w-full py-3 px-4 rounded font-tahoma"
              />
              <div className="mt-2 text-xs font-vt323 text-y2k-cyan/70">
                SEPARATE.TAGS.WITH.COMMAS
              </div>
            </div>

            {/* Neural Connections */}
            <div className="panel-y2k p-6">
              <label className="block font-vt323 text-y2k-cyan text-sm mb-3 uppercase tracking-wider">
                <LinkIcon className="inline w-4 h-4 mr-2" />
                NEURAL.CONNECTIONS
              </label>
              
              <input
                type="text"
                value={connectionSearch}
                onChange={(e) => setConnectionSearch(e.target.value)}
                placeholder="Search existing neural nodes..."
                className="input-y2k w-full py-2 px-4 rounded font-tahoma mb-4"
              />

              <div className="max-h-64 overflow-y-auto space-y-2">
                {filteredEntries.map((entry) => {
                  const entryTier = getKastenTier(entry.id);
                  const entryColor = getKastenColor(entryTier);
                  const isSelected = selectedConnections.includes(entry.id);
                  
                  return (
                    <div
                      key={entry.id}
                      onClick={() => handleConnectionToggle(entry.id)}
                      className={`p-3 rounded border cursor-pointer transition-all duration-300 ${
                        isSelected
                          ? `border-${entryColor} bg-${entryColor}/20 shadow-kasten-glow`
                          : `border-${entryColor}/30 hover:border-${entryColor} hover:bg-y2k-bg-medium`
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className={`font-vt323 text-sm text-y2k-white ${isSelected ? `text-${entryColor}` : ''} line-clamp-1`}>
                            {entry.title}
                          </h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`text-xs font-vt323 text-${entryColor} uppercase tracking-wider`}>
                              TIER.{entryTier}
                            </span>
                            <span className="text-xs font-vt323 text-y2k-cyan">
                              #{entry.id}
                            </span>
                          </div>
                        </div>
                        <div className={`w-4 h-4 rounded border-2 ${
                          isSelected 
                            ? `border-${entryColor} bg-${entryColor}` 
                            : `border-${entryColor}/30`
                        }`}>
                          {isSelected && (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-y2k-black rounded-full" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedConnections.length > 0 && (
                <div className="mt-4 pt-4 border-t border-y2k-cyan/30">
                  <div className="font-vt323 text-xs text-y2k-cyan mb-2 uppercase tracking-wider">
                    SELECTED.CONNECTIONS: {selectedConnections.length}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedConnections.map(connectionId => {
                      const connectedEntry = entries.find(e => e.id === connectionId);
                      if (!connectedEntry) return null;
                      
                      const entryTier = getKastenTier(connectedEntry.id);
                      const entryColor = getKastenColor(entryTier);
                      
                      return (
                        <span
                          key={connectionId}
                          className={`inline-flex items-center space-x-1 px-2 py-1 bg-${entryColor}/20 border border-${entryColor}/30 rounded text-xs font-vt323 text-${entryColor}`}
                        >
                          <span>#{connectionId}</span>
                          <button
                            type="button"
                            onClick={() => handleConnectionToggle(connectionId)}
                            className="hover:text-y2k-white"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trunk Selection */}
            <div className="panel-y2k p-6">
              <label className="block font-vt323 text-y2k-cyan text-sm mb-3 uppercase tracking-wider">
                <Brain className="inline w-4 h-4 mr-2" />
                KNOWLEDGE.TRUNK
              </label>
              <select
                value={formData.trunkId}
                onChange={(e) => setFormData({ ...formData, trunkId: e.target.value })}
                className="input-y2k w-full py-2 px-3 rounded font-vt323"
              >
                <option value="">SELECT.TRUNK.OPTIONAL</option>
                {trunks.map(trunk => {
                  const tier = getKastenTier(trunk.id);
                  const label = getKastenLabel(tier);
                  return (
                    <option key={trunk.id} value={trunk.id}>
                      T{tier} - {trunk.title.substring(0, 30)}...
                    </option>
                  );
                })}
              </select>
              
              {selectedTrunk && (
                <div className={`mt-4 p-3 bg-y2k-bg-dark rounded border border-${kastenColor}/30`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <ComplexityIcon className={`w-4 h-4 text-${kastenColor}`} />
                    <span className={`font-vt323 text-xs text-${kastenColor} uppercase tracking-wider`}>
                      {kastenLabel} • TIER.{trunkTier}
                    </span>
                  </div>
                  <div className={`font-tahoma text-sm text-y2k-white line-clamp-2`}>
                    {selectedTrunk.title}
                  </div>
                </div>
              )}
            </div>

            {/* Neural Stats */}
            <div className="panel-y2k p-6">
              <h3 className="font-vt323 text-y2k-cyan mb-4 uppercase tracking-wider">
                NEURAL.STATISTICS
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="font-vt323 text-y2k-cyan">TITLE.LENGTH:</span>
                  <span className="font-vt323 text-y2k-white">{formData.title.length}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="font-vt323 text-y2k-cyan">CONTENT.WORDS:</span>
                  <span className="font-vt323 text-y2k-white">
                    {formData.content.split(/\s+/).filter(w => w).length}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="font-vt323 text-y2k-cyan">TAGS.COUNT:</span>
                  <span className="font-vt323 text-y2k-white">
                    {formData.tags.split(',').filter(t => t.trim()).length}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="font-vt323 text-y2k-cyan">CONNECTIONS:</span>
                  <span className="font-vt323 text-y2k-white">{selectedConnections.length}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="font-vt323 text-y2k-cyan">COMPLEXITY:</span>
                  <span className={`font-vt323 text-${kastenColor}`}>
                    TIER.{selectedTrunk ? trunkTier : 1}
                  </span>
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
                    className="bg-gradient-to-r from-y2k-cyan to-y2k-magenta h-full rounded-full transition-all duration-1000 animate-pulse-glow"
                    style={{ width: `${neuralActivity}%` }}
                  />
                </div>
              </div>
            </div>

            {/* System Info */}
            <div className="panel-y2k p-6">
              <h3 className="font-vt323 text-y2k-cyan mb-4 uppercase tracking-wider">
                SYSTEM.INFO
              </h3>
              
              <div className="space-y-2 text-xs font-vt323">
                <div className="flex items-center space-x-2 text-y2k-cyan">
                  <Database className="w-3 h-3" />
                  <span>TOTAL.NODES: {entries.length}</span>
                </div>
                <div className="flex items-center space-x-2 text-y2k-cyan">
                  <Brain className="w-3 h-3" />
                  <span>TRUNKS: {trunks.length}</span>
                </div>
                <div className="flex items-center space-x-2 text-y2k-cyan">
                  <Cpu className="w-3 h-3" />
                  <span>STATUS: ACTIVE</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="panel-y2k p-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="btn-kasten-4 px-6 py-3 font-vt323 border-2 rounded transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
            >
              <X className="w-5 h-5" />
              <span>CANCEL.OPERATION</span>
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting || !formData.title.trim() || !formData.content.trim()}
              className="btn-y2k px-6 py-3 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              <span>{isSubmitting ? 'CREATING.NODE...' : 'CREATE.NEURAL.NODE'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ZettelCreate;
