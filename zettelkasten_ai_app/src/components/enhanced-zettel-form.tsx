
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Sparkles, Brain, Crown, Zap, Eye, Plus, X } from 'lucide-react';
import { ZettelEntry, HierarchicalLabel } from '../types';
import { HierarchicalLabelingSystem } from '../utils/hierarchicalLabeling';

interface EnhancedZettelFormProps {
  entry?: ZettelEntry;
  onSave: (entry: ZettelEntry) => void;
  onCancel: () => void;
  availableTrunks: Array<{ id: string; title: string }>;
  existingEntries: ZettelEntry[];
}

export const EnhancedZettelForm: React.FC<EnhancedZettelFormProps> = ({
  entry,
  onSave,
  onCancel,
  availableTrunks,
  existingEntries
}) => {
  const [formData, setFormData] = useState({
    title: entry?.title || '',
    content: entry?.content || '',
    logic: entry?.logic || '',
    tags: entry?.tags || [],
    trunkId: entry?.trunkId || '1',
    tier: entry?.tier || 'leaf' as HierarchicalLabel['tier'],
    parentId: entry?.parentId || '',
    sacredClownAspect: entry?.sacredClownAspect || '',
    clioticNodeId: entry?.clioticNodeId || ''
  });

  const [newTag, setNewTag] = useState('');
  const [hierarchicalId, setHierarchicalId] = useState(entry?.hierarchicalId || '');
  const [autoGenerateId, setAutoGenerateId] = useState(!entry?.hierarchicalId);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Auto-generate hierarchical ID when tier or parent changes
  useEffect(() => {
    if (autoGenerateId) {
      try {
        const siblingCount = existingEntries.filter(e => 
          e.tier === formData.tier && e.parentId === formData.parentId
        ).length;
        
        const newId = HierarchicalLabelingSystem.generateHierarchicalId(
          formData.tier,
          formData.parentId || undefined,
          siblingCount
        );
        setHierarchicalId(newId);
      } catch (error) {
        console.error('Error generating hierarchical ID:', error);
      }
    }
  }, [formData.tier, formData.parentId, autoGenerateId, existingEntries]);

  // Auto-generate sacred clown aspect when tier changes
  useEffect(() => {
    if (!formData.sacredClownAspect && hierarchicalId) {
      const aspect = HierarchicalLabelingSystem.generateSacredClownAspect(
        formData.tier,
        hierarchicalId
      );
      setFormData(prev => ({ ...prev, sacredClownAspect: aspect }));
    }
  }, [formData.tier, hierarchicalId, formData.sacredClownAspect]);

  // Auto-generate cliotic node ID when needed
  useEffect(() => {
    if (!formData.clioticNodeId && hierarchicalId && Math.random() > 0.5) {
      const nodeId = HierarchicalLabelingSystem.generateClioticNodeId(
        formData.tier,
        hierarchicalId,
        0.7
      );
      setFormData(prev => ({ ...prev, clioticNodeId: nodeId }));
    }
  }, [formData.tier, hierarchicalId, formData.clioticNodeId]);

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newEntry: ZettelEntry = {
      id: entry?.id || `zettel_${Date.now()}`,
      oldId: entry?.oldId || '',
      title: formData.title,
      content: formData.content,
      logic: formData.logic,
      tags: formData.tags,
      trunkId: formData.trunkId,
      level: entry?.level || 1,
      tier: formData.tier,
      tierLevel: ['trunk', 'branch', 'leaf', 'flower', 'fruit', 'bud'].indexOf(formData.tier) + 1,
      hierarchicalId,
      parentId: formData.parentId || undefined,
      sacredClownAspect: formData.sacredClownAspect || undefined,
      clioticNodeId: formData.clioticNodeId || undefined,
      createdAt: entry?.createdAt || new Date(),
      updatedAt: new Date(),
      connections: entry?.connections || [],
      children: entry?.children || []
    };

    onSave(newEntry);
  };

  const getAvailableParents = () => {
    const tierHierarchy = ['trunk', 'branch', 'leaf', 'flower', 'fruit', 'bud'];
    const currentTierIndex = tierHierarchy.indexOf(formData.tier);
    
    if (currentTierIndex === 0) return []; // Trunk has no parents
    
    const parentTier = tierHierarchy[currentTierIndex - 1];
    return existingEntries.filter(e => e.tier === parentTier);
  };

  const tierColor = HierarchicalLabelingSystem.getTierColor(formData.tier);
  const tierEmoji = HierarchicalLabelingSystem.getTierEmoji(formData.tier);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-4xl mx-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            <Brain className="h-6 w-6 text-cyan-400" />
          </motion.div>
          <h2 className="text-xl font-bold text-cyan-400 font-mono">
            {entry ? 'EDIT NEURAL PATTERN' : 'CREATE NEURAL PATTERN'}
          </h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{tierEmoji}</span>
          <span 
            className="px-3 py-1 rounded font-mono text-sm font-bold"
            style={{ backgroundColor: tierColor + '30', color: tierColor }}
          >
            {formData.tier.toUpperCase()}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-mono text-cyan-400 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white font-mono focus:border-cyan-400 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-mono text-cyan-400 mb-2">
              Trunk
            </label>
            <select
              value={formData.trunkId}
              onChange={(e) => setFormData(prev => ({ ...prev, trunkId: e.target.value }))}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white font-mono focus:border-cyan-400 focus:outline-none"
            >
              {availableTrunks.map(trunk => (
                <option key={trunk.id} value={trunk.id}>
                  {trunk.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Hierarchical System */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-bold text-magenta-400 font-mono mb-4 flex items-center">
            <Sparkles className="mr-2" />
            HIERARCHICAL CLASSIFICATION
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-mono text-cyan-400 mb-2">
                Tier *
              </label>
              <select
                value={formData.tier}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  tier: e.target.value as HierarchicalLabel['tier'],
                  parentId: '' // Reset parent when tier changes
                }))}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white font-mono focus:border-cyan-400 focus:outline-none"
              >
                <option value="trunk">🌳 Trunk</option>
                <option value="branch">🌿 Branch</option>
                <option value="leaf">🍃 Leaf</option>
                <option value="flower">🌸 Flower</option>
                <option value="fruit">🍎 Fruit</option>
                <option value="bud">🌱 Bud</option>
              </select>
            </div>

            {getAvailableParents().length > 0 && (
              <div>
                <label className="block text-sm font-mono text-cyan-400 mb-2">
                  Parent Node
                </label>
                <select
                  value={formData.parentId}
                  onChange={(e) => setFormData(prev => ({ ...prev, parentId: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white font-mono focus:border-cyan-400 focus:outline-none"
                >
                  <option value="">None</option>
                  {getAvailableParents().map(parent => (
                    <option key={parent.id} value={parent.hierarchicalId || parent.id}>
                      {parent.hierarchicalId} - {parent.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-mono text-cyan-400 mb-2">
                Hierarchical ID
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={hierarchicalId}
                  onChange={(e) => {
                    setHierarchicalId(e.target.value);
                    setAutoGenerateId(false);
                  }}
                  className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white font-mono focus:border-cyan-400 focus:outline-none"
                  placeholder="Auto-generated"
                />
                <button
                  type="button"
                  onClick={() => setAutoGenerateId(true)}
                  className="px-3 py-2 bg-yellow-600 hover:bg-yellow-500 rounded transition-colors"
                  title="Auto-generate ID"
                >
                  <Zap className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-mono text-cyan-400 mb-2">
            Content *
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white font-mono focus:border-cyan-400 focus:outline-none"
            rows={6}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-mono text-cyan-400 mb-2">
            Logic/Reasoning
          </label>
          <textarea
            value={formData.logic}
            onChange={(e) => setFormData(prev => ({ ...prev, logic: e.target.value }))}
            className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white font-mono focus:border-cyan-400 focus:outline-none"
            rows={3}
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-mono text-cyan-400 mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.tags.map((tag, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center space-x-1 px-2 py-1 bg-gray-700 rounded text-sm font-mono"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-red-400 hover:text-red-300"
                >
                  <X className="h-3 w-3" />
                </button>
              </motion.span>
            ))}
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white font-mono focus:border-cyan-400 focus:outline-none"
              placeholder="Add tag..."
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-3 py-2 bg-cyan-600 hover:bg-cyan-500 rounded transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Mystical Elements */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-magenta-400 font-mono flex items-center">
              <Crown className="mr-2" />
              MYSTICAL ELEMENTS
            </h3>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-cyan-400 hover:text-cyan-300"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>
          
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-mono text-magenta-400 mb-2">
                  Sacred Clown Aspect
                </label>
                <input
                  type="text"
                  value={formData.sacredClownAspect}
                  onChange={(e) => setFormData(prev => ({ ...prev, sacredClownAspect: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white font-mono focus:border-magenta-400 focus:outline-none"
                  placeholder="Auto-generated based on tier"
                />
              </div>

              <div>
                <label className="block text-sm font-mono text-cyan-400 mb-2">
                  Cliotic Node ID
                </label>
                <input
                  type="text"
                  value={formData.clioticNodeId}
                  onChange={(e) => setFormData(prev => ({ ...prev, clioticNodeId: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white font-mono focus:border-cyan-400 focus:outline-none"
                  placeholder="Auto-generated for neural mapping"
                />
              </div>
            </motion.div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-700">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-500 rounded transition-colors font-mono"
          >
            Cancel
          </button>
          
          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex items-center space-x-2 px-6 py-2 bg-cyan-600 hover:bg-cyan-500 rounded transition-colors font-mono"
            >
              <Save className="h-4 w-4" />
              <span>{entry ? 'Update' : 'Create'} Pattern</span>
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};
