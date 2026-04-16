
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Brain, Zap, RefreshCw, Download, Upload, Eye, Menu, X, HelpCircle } from 'lucide-react';
import { CrossReferenceMatrix as MatrixType, MatrixAnalysis } from '../types';
import { useKnowledge } from '../contexts/KnowledgeContext';
import { createCrossReferenceMatrix, applyForceDirectedLayout } from '../utils/matrixAnalysis';
import { analyzeKnowledgeConnections } from '../utils/googleApi';
import CrossReferenceMatrix from '../components/CrossReferenceMatrix';
import MatrixFilters from '../components/MatrixFilters';
import { HelpTooltip } from '../components/HelpTooltip';
import { useNavigate } from 'react-router-dom';

export default function CrossReferenceMatrixPage() {
  const navigate = useNavigate();
  const { trunks, allEntries, loading } = useKnowledge();
  const [matrix, setMatrix] = useState<MatrixType | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<MatrixAnalysis | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate initial matrix when data is loaded
  useEffect(() => {
    if (!loading && allEntries.length > 0 && !matrix) {
      generateMatrix();
    }
  }, [loading, allEntries, matrix]);

  const generateMatrix = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      console.log('Generating cross-reference matrix...');
      const newMatrix = createCrossReferenceMatrix(allEntries, trunks);
      setMatrix(newMatrix);
      console.log('Matrix generated:', newMatrix.nodes.length, 'nodes,', newMatrix.edges.length, 'edges');
    } catch (error) {
      console.error('Failed to generate matrix:', error);
      setError('Failed to generate knowledge matrix');
    } finally {
      setIsGenerating(false);
    }
  };

  const regenerateLayout = () => {
    if (!matrix) return;
    
    setIsGenerating(true);
    
    setTimeout(() => {
      try {
        let updatedNodes;
        
        switch (matrix.layout) {
          case 'force':
            updatedNodes = applyForceDirectedLayout(matrix.nodes, matrix.edges, 100);
            break;
          case 'circular':
            updatedNodes = applyCircularLayout(matrix.nodes);
            break;
          case 'grid':
            updatedNodes = applyGridLayout(matrix.nodes);
            break;
          case 'hierarchical':
            updatedNodes = applyHierarchicalLayout(matrix.nodes, matrix.edges);
            break;
          default:
            updatedNodes = matrix.nodes;
        }
        
        setMatrix({ ...matrix, nodes: updatedNodes });
      } catch (error) {
        console.error('Failed to regenerate layout:', error);
        setError('Failed to regenerate layout');
      } finally {
        setIsGenerating(false);
      }
    }, 100);
  };

  const analyzeMatrix = async () => {
    if (!matrix) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Get entries for connected nodes
      const connectedEntries = allEntries.filter(entry =>
        matrix.nodes.some(node => node.entryId === entry.id)
      );
      
      const aiAnalysis = await analyzeKnowledgeConnections(
        connectedEntries.slice(0, 20), // Limit for API
        'patterns'
      );
      
      if (aiAnalysis) {
        // Convert AI analysis to matrix analysis format
        const matrixAnalysis: MatrixAnalysis = {
          centralNodes: matrix.nodes
            .map(node => {
              const connections = matrix.edges.filter(edge =>
                edge.sourceId === node.id || edge.targetId === node.id
              ).length;
              return {
                nodeId: node.id,
                centrality: connections / matrix.edges.length,
                influence: connections * node.size
              };
            })
            .sort((a, b) => b.centrality - a.centrality)
            .slice(0, 10),
          
          strongestConnections: matrix.edges
            .sort((a, b) => b.strength - a.strength)
            .slice(0, 10)
            .map(edge => ({
              edgeId: edge.id,
              strength: edge.strength,
              significance: edge.metadata.description
            })),
          
          emergentPatterns: aiAnalysis.patterns.map(pattern => ({
            pattern: pattern.name,
            nodeIds: pattern.nodeIds,
            description: pattern.description,
            novelty: pattern.significance
          })),
          
          recommendations: aiAnalysis.insights.map((insight, index) => ({
            type: index % 3 === 0 ? 'explore' : index % 3 === 1 ? 'connect' : 'synthesize',
            description: insight.content,
            targetNodes: insight.citations,
            priority: insight.confidence
          }))
        };
        
        setAnalysis(matrixAnalysis);
        setShowAnalysis(true);
      }
    } catch (error) {
      console.error('Failed to analyze matrix:', error);
      setError('Failed to analyze matrix patterns');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNodeClick = (nodeId: string) => {
    const node = matrix?.nodes.find(n => n.id === nodeId);
    if (node) {
      navigate(`/entry/${node.entryId}`);
    }
  };

  const handleFiltersChange = (filters: MatrixType['filters']) => {
    if (matrix) {
      setMatrix({ ...matrix, filters });
    }
  };

  const handleLayoutChange = (layout: MatrixType['layout']) => {
    if (matrix) {
      setMatrix({ ...matrix, layout });
      // Regenerate layout after a brief delay
      setTimeout(regenerateLayout, 100);
    }
  };

  const exportMatrix = () => {
    if (!matrix) return;
    
    const dataStr = JSON.stringify(matrix, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `knowledge-matrix-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-void-900 flex items-center justify-center">
        <div className="text-center">
          <div className="consciousness-gradient p-4 rounded-full mb-4 mx-auto w-16 h-16 flex items-center justify-center">
            <Network className="w-8 h-8 text-white animate-pulse" />
          </div>
          <p className="text-void-400">Loading knowledge base...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-void-900 flex relative">
      {/* Mobile Filters Overlay */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setShowFilters(false)}
          />
        )}
      </AnimatePresence>

      {/* Filters Sidebar */}
      {matrix && (
        <div className={`
          fixed lg:relative lg:translate-x-0 z-50 lg:z-auto
          transition-transform duration-300 ease-in-out
          ${showFilters ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <MatrixFilters
            matrix={matrix}
            onFiltersChange={handleFiltersChange}
            onLayoutChange={handleLayoutChange}
            availableTrunks={trunks.map(t => ({ id: t.id, title: t.title, number: t.number }))}
            onClose={() => setShowFilters(false)}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="glass-effect border-b border-void-600/30 p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
              {matrix && (
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden p-2 rounded-lg glass-effect hover:bg-void-700/30 transition-colors flex-shrink-0"
                >
                  <Menu className="w-5 h-5 text-void-300" />
                </button>
              )}
              
              <div className="consciousness-gradient p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                <Network className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-consciousness-300 glow-text truncate">
                  Cross-Reference Matrix
                  <HelpTooltip
                    content="Discover hidden connections between different knowledge areas using advanced cross-reference analysis. This tool visualizes relationships between trunks and entries to reveal unexpected patterns."
                    title="Cross-Reference Matrix"
                    trigger="hover"
                    className="ml-2 inline-block"
                  >
                    <HelpCircle className="w-4 h-4 text-void-500 hover:text-consciousness-400" />
                  </HelpTooltip>
                </h1>
                <p className="text-xs sm:text-sm text-void-400 hidden sm:block">
                  Visual exploration of knowledge connections and patterns
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
              {matrix && (
                <>
                  <button
                    onClick={() => setShowAnalysis(!showAnalysis)}
                    className={`flex items-center space-x-1 glass-effect px-2 sm:px-3 py-2 rounded-lg transition-all duration-200 ${
                      showAnalysis ? 'bg-consciousness-600/20 text-consciousness-300' : 'hover:bg-void-700/30 text-void-400'
                    }`}
                    title="Toggle Analysis Panel"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-sm hidden sm:inline">Analysis</span>
                  </button>
                  
                  <button
                    onClick={analyzeMatrix}
                    disabled={isAnalyzing}
                    className="flex items-center space-x-1 glass-effect px-2 sm:px-3 py-2 rounded-lg hover:bg-purple-600/20 text-purple-400 transition-all duration-200 disabled:opacity-50"
                    title="AI Analysis"
                  >
                    {isAnalyzing ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Brain className="w-4 h-4" />
                    )}
                    <span className="text-sm hidden sm:inline">AI Analyze</span>
                  </button>
                  
                  <button
                    onClick={regenerateLayout}
                    disabled={isGenerating}
                    className="flex items-center space-x-1 glass-effect px-2 sm:px-3 py-2 rounded-lg hover:bg-blue-600/20 text-blue-400 transition-all duration-200 disabled:opacity-50"
                    title="Regenerate Layout"
                  >
                    {isGenerating ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Zap className="w-4 h-4" />
                    )}
                    <span className="text-sm hidden lg:inline">Regenerate</span>
                  </button>
                  
                  <button
                    onClick={exportMatrix}
                    className="flex items-center space-x-1 glass-effect px-2 sm:px-3 py-2 rounded-lg hover:bg-green-600/20 text-green-400 transition-all duration-200"
                    title="Export Matrix"
                  >
                    <Download className="w-4 h-4" />
                    <span className="text-sm hidden lg:inline">Export</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Matrix Visualization */}
          <div className="flex-1 p-3 sm:p-4 min-h-0">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-600/10 border border-red-500/30 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4"
              >
                <p className="text-red-300 text-sm sm:text-base">{error}</p>
              </motion.div>
            )}

            {!matrix ? (
              <div className="h-full flex items-center justify-center px-4">
                <div className="text-center">
                  <div className="consciousness-gradient p-3 sm:p-4 rounded-full mb-4 mx-auto w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center">
                    {isGenerating ? (
                      <RefreshCw className="w-6 h-6 sm:w-8 sm:h-8 text-white animate-spin" />
                    ) : (
                      <Network className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    )}
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-consciousness-300 mb-2">
                    {isGenerating ? 'Generating Matrix...' : 'Knowledge Matrix'}
                  </h2>
                  <p className="text-void-400 mb-4 text-sm sm:text-base">
                    {isGenerating 
                      ? 'Analyzing connections and building visualization...'
                      : 'Generate a visual representation of knowledge connections'
                    }
                  </p>
                  {!isGenerating && (
                    <div className="mb-6 p-3 bg-purple-600/10 border border-purple-500/20 rounded-lg max-w-md mx-auto">
                      <p className="text-xs text-purple-300 mb-2 font-medium">🔍 Matrix Features:</p>
                      <ul className="text-xs text-purple-200 space-y-1">
                        <li>• Interactive network visualization of knowledge connections</li>
                        <li>• AI-powered analysis of relationship patterns</li>
                        <li>• Filter by trunks, themes, or connection strength</li>
                        <li>• Export matrix data for external analysis</li>
                      </ul>
                    </div>
                  )}
                  {!isGenerating && (
                    <button
                      onClick={generateMatrix}
                      className="bg-consciousness-600 hover:bg-consciousness-500 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-all duration-200 flex items-center space-x-2 mx-auto text-sm sm:text-base active:scale-95"
                    >
                      <Network className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Generate Matrix</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full">
                <CrossReferenceMatrix
                  matrix={matrix}
                  onNodeClick={handleNodeClick}
                  onMatrixUpdate={setMatrix}
                />
              </div>
            )}
          </div>

          {/* Analysis Panel */}
          <AnimatePresence>
            {showAnalysis && analysis && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="w-full lg:w-96 glass-effect border-t lg:border-t-0 lg:border-l border-void-600/30 p-3 sm:p-4 overflow-y-auto max-h-96 lg:max-h-none"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-consciousness-300 flex items-center space-x-2">
                    <Brain className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Matrix Analysis</span>
                  </h3>
                  <button
                    onClick={() => setShowAnalysis(false)}
                    className="lg:hidden p-1.5 rounded-lg glass-effect hover:bg-void-700/30 transition-colors"
                  >
                    <X className="w-4 h-4 text-void-300" />
                  </button>
                </div>

                {/* Central Nodes */}
                <div className="mb-4 sm:mb-6">
                  <h4 className="text-xs sm:text-sm font-medium text-void-200 mb-2 sm:mb-3">Most Central Nodes</h4>
                  <div className="space-y-2">
                    {analysis.centralNodes.slice(0, 5).map(node => {
                      const matrixNode = matrix?.nodes.find(n => n.id === node.nodeId);
                      return (
                        <div
                          key={node.nodeId}
                          className="glass-effect p-2.5 sm:p-3 rounded-lg cursor-pointer hover:bg-void-700/30 active:scale-95 transition-all duration-200"
                          onClick={() => handleNodeClick(node.nodeId)}
                        >
                          <div className="text-xs sm:text-sm text-void-200 font-medium truncate">
                            {matrixNode?.title || 'Unknown'}
                          </div>
                          <div className="text-xs text-void-400">
                            Centrality: {(node.centrality * 100).toFixed(1)}%
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Emergent Patterns */}
                <div className="mb-4 sm:mb-6">
                  <h4 className="text-xs sm:text-sm font-medium text-void-200 mb-2 sm:mb-3">Emergent Patterns</h4>
                  <div className="space-y-2 sm:space-y-3">
                    {analysis.emergentPatterns.slice(0, 3).map((pattern, index) => (
                      <div key={index} className="glass-effect p-2.5 sm:p-3 rounded-lg">
                        <div className="text-xs sm:text-sm text-consciousness-300 font-medium mb-1 line-clamp-2">
                          {pattern.pattern}
                        </div>
                        <div className="text-xs text-void-400 mb-2 line-clamp-3">
                          {pattern.description}
                        </div>
                        <div className="text-xs text-void-500">
                          Novelty: {(pattern.novelty * 100).toFixed(0)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <h4 className="text-xs sm:text-sm font-medium text-void-200 mb-2 sm:mb-3">Recommendations</h4>
                  <div className="space-y-2 sm:space-y-3">
                    {analysis.recommendations.slice(0, 3).map((rec, index) => (
                      <div key={index} className="glass-effect p-2.5 sm:p-3 rounded-lg">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-1 gap-1 sm:gap-0">
                          <span className={`text-xs px-2 py-0.5 rounded capitalize w-fit ${
                            rec.type === 'explore' ? 'bg-blue-600/20 text-blue-300' :
                            rec.type === 'connect' ? 'bg-green-600/20 text-green-300' :
                            'bg-purple-600/20 text-purple-300'
                          }`}>
                            {rec.type}
                          </span>
                          <span className="text-xs text-void-500">
                            Priority: {(rec.priority * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="text-xs text-void-300 line-clamp-3">
                          {rec.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Layout algorithms
function applyCircularLayout(nodes: any[]) {
  return nodes.map((node, index) => {
    const angle = (index / nodes.length) * 2 * Math.PI;
    const radius = 250;
    return {
      ...node,
      position: {
        x: 500 + Math.cos(angle) * radius,
        y: 400 + Math.sin(angle) * radius
      }
    };
  });
}

function applyGridLayout(nodes: any[]) {
  const cols = Math.ceil(Math.sqrt(nodes.length));
  const spacing = 100;
  
  return nodes.map((node, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    return {
      ...node,
      position: {
        x: 100 + col * spacing,
        y: 100 + row * spacing
      }
    };
  });
}

function applyHierarchicalLayout(nodes: any[], edges: any[]) {
  // Simple hierarchical layout - can be enhanced
  const levels = new Map();
  const visited = new Set();
  
  // Find root nodes (nodes with no incoming edges)
  const hasIncoming = new Set(edges.map(e => e.targetId));
  const roots = nodes.filter(n => !hasIncoming.has(n.id));
  
  // BFS to assign levels
  const queue = roots.map(n => ({ node: n, level: 0 }));
  
  while (queue.length > 0) {
    const { node, level } = queue.shift()!;
    if (visited.has(node.id)) continue;
    
    visited.add(node.id);
    if (!levels.has(level)) levels.set(level, []);
    levels.get(level).push(node);
    
    // Add children to queue
    edges
      .filter(e => e.sourceId === node.id)
      .forEach(e => {
        const child = nodes.find(n => n.id === e.targetId);
        if (child && !visited.has(child.id)) {
          queue.push({ node: child, level: level + 1 });
        }
      });
  }
  
  // Position nodes by level
  return nodes.map(node => {
    let level = 0;
    let position = 0;
    
    for (const [l, levelNodes] of levels.entries()) {
      const nodeIndex = levelNodes.findIndex(n => n.id === node.id);
      if (nodeIndex !== -1) {
        level = l;
        position = nodeIndex;
        break;
      }
    }
    
    const levelWidth = levels.get(level)?.length || 1;
    const spacing = 800 / (levelWidth + 1);
    
    return {
      ...node,
      position: {
        x: 100 + (position + 1) * spacing,
        y: 100 + level * 120
      }
    };
  });
}
