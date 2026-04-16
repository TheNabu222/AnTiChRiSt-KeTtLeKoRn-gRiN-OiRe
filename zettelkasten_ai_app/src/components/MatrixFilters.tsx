
import React from 'react';
import { motion } from 'framer-motion';
import { Filter, Sliders, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { CrossReferenceMatrix, SemanticConnection } from '../types';

interface MatrixFiltersProps {
  matrix: CrossReferenceMatrix;
  onFiltersChange: (filters: CrossReferenceMatrix['filters']) => void;
  onLayoutChange: (layout: CrossReferenceMatrix['layout']) => void;
  availableTrunks: Array<{ id: string; title: string; number: number }>;
}

export default function MatrixFilters({
  matrix,
  onFiltersChange,
  onLayoutChange,
  availableTrunks
}: MatrixFiltersProps) {
  const relationshipTypes: Array<{ type: SemanticConnection['type']; label: string; color: string }> = [
    { type: 'conceptual', label: 'Conceptual', color: 'blue' },
    { type: 'mythic', label: 'Mythic', color: 'purple' },
    { type: 'recursive', label: 'Recursive', color: 'green' },
    { type: 'emotional', label: 'Emotional', color: 'red' },
    { type: 'resistance_to', label: 'Resistance', color: 'yellow' },
    { type: 'heals', label: 'Healing', color: 'emerald' },
    { type: 'subverts', label: 'Subversion', color: 'violet' },
    { type: 'collaborates_with', label: 'Collaboration', color: 'cyan' },
    { type: 'manifests_as', label: 'Manifestation', color: 'orange' }
  ];

  const layouts: Array<{ type: CrossReferenceMatrix['layout']; label: string; description: string }> = [
    { type: 'force', label: 'Force-Directed', description: 'Physics-based natural clustering' },
    { type: 'hierarchical', label: 'Hierarchical', description: 'Tree-like structure' },
    { type: 'circular', label: 'Circular', description: 'Nodes arranged in circles' },
    { type: 'grid', label: 'Grid', description: 'Regular grid layout' }
  ];

  const updateFilters = (updates: Partial<CrossReferenceMatrix['filters']>) => {
    onFiltersChange({ ...matrix.filters, ...updates });
  };

  const toggleRelationshipType = (type: SemanticConnection['type']) => {
    const currentTypes = matrix.filters.relationshipTypes;
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    updateFilters({ relationshipTypes: newTypes });
  };

  const toggleTrunk = (trunkId: string) => {
    const currentTrunks = matrix.filters.trunkIds;
    const newTrunks = currentTrunks.includes(trunkId)
      ? currentTrunks.filter(id => id !== trunkId)
      : [...currentTrunks, trunkId];
    updateFilters({ trunkIds: newTrunks });
  };

  const resetFilters = () => {
    onFiltersChange({
      minStrength: 0.1,
      relationshipTypes: relationshipTypes.map(r => r.type),
      trunkIds: [],
      showClusters: true
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-80 glass-effect border-r border-void-600/30 p-4 space-y-6 overflow-y-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-consciousness-400" />
          <h2 className="text-lg font-semibold text-consciousness-300">Matrix Filters</h2>
        </div>
        <button
          onClick={resetFilters}
          className="p-1 hover:bg-void-700/30 rounded text-void-400 hover:text-void-300"
          title="Reset Filters"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Layout Selection */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-void-200 flex items-center space-x-2">
          <Sliders className="w-4 h-4" />
          <span>Layout Algorithm</span>
        </h3>
        <div className="space-y-2">
          {layouts.map(layout => (
            <button
              key={layout.type}
              onClick={() => onLayoutChange(layout.type)}
              className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                matrix.layout === layout.type
                  ? 'bg-consciousness-600/20 border border-consciousness-500/30'
                  : 'bg-void-700/30 hover:bg-void-700/50 border border-transparent'
              }`}
            >
              <div className="text-sm font-medium text-void-200">{layout.label}</div>
              <div className="text-xs text-void-400 mt-1">{layout.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Connection Strength */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-void-200">Connection Strength</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-void-400">
            <span>Minimum: {matrix.filters.minStrength.toFixed(1)}</span>
            <span>Maximum: 1.0</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={matrix.filters.minStrength}
            onChange={(e) => updateFilters({ minStrength: parseFloat(e.target.value) })}
            className="w-full h-2 bg-void-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>

      {/* Relationship Types */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-void-200">Relationship Types</h3>
          <div className="text-xs text-void-400">
            {matrix.filters.relationshipTypes.length}/{relationshipTypes.length}
          </div>
        </div>
        <div className="space-y-2">
          {relationshipTypes.map(({ type, label, color }) => (
            <label
              key={type}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-void-700/30 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={matrix.filters.relationshipTypes.includes(type)}
                onChange={() => toggleRelationshipType(type)}
                className="rounded border-void-600 bg-void-800 text-consciousness-500 focus:ring-consciousness-500/20"
              />
              <div className={`w-3 h-3 rounded-full bg-${color}-500`} />
              <span className="text-sm text-void-300 flex-1">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Trunk Filter */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-void-200">Knowledge Trunks</h3>
          <div className="text-xs text-void-400">
            {matrix.filters.trunkIds.length === 0 ? 'All' : matrix.filters.trunkIds.length}
          </div>
        </div>
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {availableTrunks.map(trunk => (
            <label
              key={trunk.id}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-void-700/30 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={matrix.filters.trunkIds.includes(trunk.id)}
                onChange={() => toggleTrunk(trunk.id)}
                className="rounded border-void-600 bg-void-800 text-consciousness-500 focus:ring-consciousness-500/20"
              />
              <span className="text-sm text-void-300 flex-1">
                {trunk.number}: {trunk.title}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Display Options */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-void-200">Display Options</h3>
        <label className="flex items-center space-x-3 p-2 rounded-lg hover:bg-void-700/30 cursor-pointer">
          <input
            type="checkbox"
            checked={matrix.filters.showClusters}
            onChange={(e) => updateFilters({ showClusters: e.target.checked })}
            className="rounded border-void-600 bg-void-800 text-consciousness-500 focus:ring-consciousness-500/20"
          />
          {matrix.filters.showClusters ? (
            <Eye className="w-4 h-4 text-consciousness-400" />
          ) : (
            <EyeOff className="w-4 h-4 text-void-400" />
          )}
          <span className="text-sm text-void-300">Show Clusters</span>
        </label>
      </div>

      {/* Statistics */}
      <div className="space-y-3 pt-4 border-t border-void-600/30">
        <h3 className="text-sm font-medium text-void-200">Matrix Statistics</h3>
        <div className="space-y-2 text-xs text-void-400">
          <div className="flex justify-between">
            <span>Total Nodes:</span>
            <span className="text-void-300">{matrix.nodes.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Edges:</span>
            <span className="text-void-300">{matrix.edges.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Clusters:</span>
            <span className="text-void-300">{matrix.clusters.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Avg. Connections:</span>
            <span className="text-void-300">
              {matrix.nodes.length > 0 ? (matrix.edges.length * 2 / matrix.nodes.length).toFixed(1) : '0'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
