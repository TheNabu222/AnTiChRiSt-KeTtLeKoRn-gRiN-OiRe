
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, X, Plus, Tag, FileText, Brain, Sparkles, Crown, Zap } from 'lucide-react';
import { useKnowledge } from '../contexts/KnowledgeContext';
import { ZettelFormData, ZettelEntry } from '../types';
// import { HierarchicalLabel } from '../types';
// import { HierarchicalLabelingSystem } from '../utils/hierarchicalLabeling';

interface ZettelFormProps {
  zettel?: ZettelEntry;
  initialData?: Partial<ZettelFormData>;
  onSave: (data: ZettelFormData) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
}

export default function ZettelForm({ zettel, initialData, onSave, onCancel, isEditing = false }: ZettelFormProps) {
  const { trunks, allEntries } = useKnowledge();
  const [formData, setFormData] = useState<ZettelFormData>({
    title: '',
    content: '',
    logic: '',
    tags: [],
    trunkId: '',
    parentId: '',
    connections: []
  });
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (zettel) {
      setFormData({
        title: zettel.title,
        content: zettel.content || '',
        logic: zettel.logic,
        tags: zettel.tags || [],
        trunkId: zettel.trunkId,
        parentId: zettel.parentId || '',
        connections: zettel.connections || []
      });
    } else if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData
      }));
    }
  }, [zettel, initialData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    if (!formData.trunkId) {
      newErrors.trunkId = 'Please select a knowledge trunk';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving zettel:', error);
      setErrors({ submit: 'Failed to save zettel. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.target === document.querySelector('#tag-input')) {
      e.preventDefault();
      addTag();
    }
  };

  const selectedTrunk = trunks.find(t => t.id === formData.trunkId);
  const potentialParents = allEntries.filter(entry => 
    entry.trunkId === formData.trunkId && entry.id !== zettel?.id
  );

  return (
    <motion.div
      className="glass-effect rounded-lg p-8 max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-consciousness-300 glow-text flex items-center">
          <Brain className="w-6 h-6 mr-2" />
          {isEditing ? 'Edit Zettel' : 'Create New Zettel'}
        </h2>
        <button
          onClick={onCancel}
          className="text-void-400 hover:text-void-200 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-void-300 mb-2">
            Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-4 py-3 bg-void-800/50 border border-void-600 rounded-lg text-void-100 placeholder-void-500 focus:border-consciousness-400 focus:ring-1 focus:ring-consciousness-400 transition-colors"
            placeholder="Enter zettel title..."
            autoFocus
          />
          {errors.title && (
            <p className="text-red-400 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        {/* Logic/Summary */}
        <div>
          <label className="block text-sm font-medium text-void-300 mb-2">
            Logic/Summary
          </label>
          <input
            type="text"
            value={formData.logic}
            onChange={(e) => setFormData(prev => ({ ...prev, logic: e.target.value }))}
            className="w-full px-4 py-3 bg-void-800/50 border border-void-600 rounded-lg text-void-100 placeholder-void-500 focus:border-consciousness-400 focus:ring-1 focus:ring-consciousness-400 transition-colors"
            placeholder="Brief summary or logical connection..."
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-void-300 mb-2">
            Content *
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            rows={12}
            className="w-full px-4 py-3 bg-void-800/50 border border-void-600 rounded-lg text-void-100 placeholder-void-500 focus:border-consciousness-400 focus:ring-1 focus:ring-consciousness-400 transition-colors resize-vertical"
            placeholder="Enter your zettel content here... You can use Markdown formatting."
          />
          {errors.content && (
            <p className="text-red-400 text-sm mt-1">{errors.content}</p>
          )}
        </div>

        {/* Trunk Selection */}
        <div>
          <label className="block text-sm font-medium text-void-300 mb-2">
            Knowledge Trunk *
          </label>
          <select
            value={formData.trunkId}
            onChange={(e) => setFormData(prev => ({ ...prev, trunkId: e.target.value, parentId: '' }))}
            className="w-full px-4 py-3 bg-void-800/50 border border-void-600 rounded-lg text-void-100 focus:border-consciousness-400 focus:ring-1 focus:ring-consciousness-400 transition-colors"
          >
            <option value="">Select a knowledge trunk...</option>
            {trunks.map(trunk => (
              <option key={trunk.id} value={trunk.id}>
                {trunk.emoji} {trunk.number}. {trunk.title}
              </option>
            ))}
          </select>
          {errors.trunkId && (
            <p className="text-red-400 text-sm mt-1">{errors.trunkId}</p>
          )}
          {selectedTrunk && (
            <p className="text-sm text-void-400 mt-1">
              {selectedTrunk.description}
            </p>
          )}
        </div>

        {/* Parent Entry (Optional) */}
        {formData.trunkId && potentialParents.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-void-300 mb-2">
              Parent Entry (Optional)
            </label>
            <select
              value={formData.parentId}
              onChange={(e) => setFormData(prev => ({ ...prev, parentId: e.target.value }))}
              className="w-full px-4 py-3 bg-void-800/50 border border-void-600 rounded-lg text-void-100 focus:border-consciousness-400 focus:ring-1 focus:ring-consciousness-400 transition-colors"
            >
              <option value="">No parent (top-level entry)</option>
              {potentialParents.map(entry => (
                <option key={entry.id} value={entry.id}>
                  {entry.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-void-300 mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 bg-consciousness-900/30 text-consciousness-300 rounded-full text-sm"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-2 text-consciousness-400 hover:text-consciousness-200"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              id="tag-input"
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 px-4 py-2 bg-void-800/50 border border-void-600 rounded-lg text-void-100 placeholder-void-500 focus:border-consciousness-400 focus:ring-1 focus:ring-consciousness-400 transition-colors"
              placeholder="Add a tag..."
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-consciousness-600 hover:bg-consciousness-500 text-white rounded-lg transition-colors flex items-center"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Error Display */}
        {errors.submit && (
          <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
            <p className="text-red-400">{errors.submit}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-void-700/30">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 text-void-300 hover:text-void-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-consciousness-600 hover:bg-consciousness-500 disabled:bg-consciousness-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center"
          >
            {isSubmitting ? (
              <>
                <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {isEditing ? 'Update Zettel' : 'Create Zettel'}
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
