
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ZoomIn, ZoomOut, RotateCcw, Filter, Sparkles, Brain, 
  Crown, Eye, Plus, Save, Share, Download, Settings 
} from 'lucide-react';
import { PinboardNode } from './pinboard-node';
import { 
  ConspiracyPinboard, 
  PinboardNode as PinboardNodeType, 
  PinboardConnection,
  AIPinboardSuggestion,
  HierarchicalLabel 
} from '../types';
import { HierarchicalLabelingSystem } from '../utils/hierarchicalLabeling';

interface PinboardCanvasProps {
  pinboard: ConspiracyPinboard;
  onPinboardUpdate: (pinboard: ConspiracyPinboard) => void;
  className?: string;
}

export const PinboardCanvas: React.FC<PinboardCanvasProps> = ({
  pinboard,
  onPinboardUpdate,
  className = ''
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [connectingFromId, setConnectingFromId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showFilters, setShowFilters] = useState(false);
  const [showAISuggestions, setShowAISuggestions] = useState(true);

  // Handle canvas panning
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current || e.target === svgRef.current) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      setSelectedNodeId(null);
    }
  };

  const handleCanvasMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      onPinboardUpdate({
        ...pinboard,
        canvas: {
          ...pinboard.canvas,
          panOffset: {
            x: pinboard.canvas.panOffset.x + deltaX,
            y: pinboard.canvas.panOffset.y + deltaY
          }
        }
      });
      
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  }, [isDragging, dragStart, pinboard, onPinboardUpdate]);

  const handleCanvasMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleCanvasMouseMove);
      document.addEventListener('mouseup', handleCanvasMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleCanvasMouseMove);
        document.removeEventListener('mouseup', handleCanvasMouseUp);
      };
    }
  }, [isDragging, handleCanvasMouseMove, handleCanvasMouseUp]);

  // Zoom controls
  const handleZoom = (delta: number) => {
    const newZoom = Math.max(0.1, Math.min(3, pinboard.canvas.zoom + delta));
    onPinboardUpdate({
      ...pinboard,
      canvas: { ...pinboard.canvas, zoom: newZoom }
    });
  };

  const resetView = () => {
    onPinboardUpdate({
      ...pinboard,
      canvas: {
        ...pinboard.canvas,
        zoom: 1,
        panOffset: { x: 0, y: 0 }
      }
    });
  };

  // Node management
  const handleNodeUpdate = (updatedNode: PinboardNodeType) => {
    onPinboardUpdate({
      ...pinboard,
      nodes: pinboard.nodes.map(node => 
        node.id === updatedNode.id ? updatedNode : node
      )
    });
  };

  const handleNodeSelect = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    onPinboardUpdate({
      ...pinboard,
      nodes: pinboard.nodes.map(node => ({
        ...node,
        isSelected: node.id === nodeId
      }))
    });
  };

  // Connection management
  const handleConnectionStart = (nodeId: string) => {
    setConnectingFromId(nodeId);
  };

  const handleConnectionEnd = (toNodeId: string) => {
    if (connectingFromId && connectingFromId !== toNodeId) {
      const newConnection: PinboardConnection = {
        id: `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        sourceNodeId: connectingFromId,
        targetNodeId: toNodeId,
        type: 'conceptual',
        strength: 0.7,
        color: '#00ffff',
        isVisible: true,
        isAISuggested: false,
        description: 'User-created connection',
        metadata: {
          discoveredBy: 'user',
          confidence: 0.8,
          timestamp: new Date()
        }
      };

      onPinboardUpdate({
        ...pinboard,
        connections: [...pinboard.connections, newConnection]
      });
    }
    setConnectingFromId(null);
  };

  // Filter connections based on current settings
  const visibleConnections = pinboard.connections.filter(conn => {
    if (!conn.isVisible) return false;
    if (conn.strength < pinboard.filters.minConnectionStrength) return false;
    if (!pinboard.filters.showAISuggestions && conn.isAISuggested) return false;
    return true;
  });

  // Generate AI suggestions
  const generateAISuggestions = () => {
    const suggestions: AIPinboardSuggestion[] = [];
    
    // Suggest connections between nodes with similar tags
    pinboard.nodes.forEach(nodeA => {
      pinboard.nodes.forEach(nodeB => {
        if (nodeA.id === nodeB.id) return;
        
        const commonTags = nodeA.metadata.tags.filter(tag => 
          nodeB.metadata.tags.includes(tag)
        );
        
        if (commonTags.length >= 2) {
          const existingConnection = pinboard.connections.find(conn =>
            (conn.sourceNodeId === nodeA.id && conn.targetNodeId === nodeB.id) ||
            (conn.sourceNodeId === nodeB.id && conn.targetNodeId === nodeA.id)
          );
          
          if (!existingConnection) {
            suggestions.push({
              id: `suggestion_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              type: 'new_connection',
              description: `Connect "${nodeA.title}" and "${nodeB.title}"`,
              confidence: 0.6 + (commonTags.length * 0.1),
              targetNodeIds: [nodeA.id, nodeB.id],
              suggestedAction: 'Create conceptual connection',
              reasoning: `Shared tags: ${commonTags.join(', ')}`,
              timestamp: new Date()
            });
          }
        }
      });
    });

    onPinboardUpdate({
      ...pinboard,
      aiSuggestions: suggestions.slice(0, 5) // Limit to 5 suggestions
    });
  };

  // Render connection lines
  const renderConnections = () => {
    return visibleConnections.map(connection => {
      const sourceNode = pinboard.nodes.find(n => n.id === connection.sourceNodeId);
      const targetNode = pinboard.nodes.find(n => n.id === connection.targetNodeId);
      
      if (!sourceNode || !targetNode) return null;

      const sourceCenter = {
        x: sourceNode.position.x + sourceNode.size.width / 2,
        y: sourceNode.position.y + sourceNode.size.height / 2
      };
      
      const targetCenter = {
        x: targetNode.position.x + targetNode.size.width / 2,
        y: targetNode.position.y + targetNode.size.height / 2
      };

      return (
        <g key={connection.id}>
          {/* Connection line */}
          <motion.line
            x1={sourceCenter.x}
            y1={sourceCenter.y}
            x2={targetCenter.x}
            y2={targetCenter.y}
            stroke={connection.color}
            strokeWidth={connection.strength * 3}
            strokeOpacity={connection.isAISuggested ? 0.6 : 0.8}
            strokeDasharray={connection.isAISuggested ? "5,5" : "none"}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Connection type indicator */}
          {connection.type === 'sacred_clown' && (
            <motion.circle
              cx={(sourceCenter.x + targetCenter.x) / 2}
              cy={(sourceCenter.y + targetCenter.y) / 2}
              r="4"
              fill="#ff1493"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
          
          {connection.type === 'cliotic' && (
            <motion.circle
              cx={(sourceCenter.x + targetCenter.x) / 2}
              cy={(sourceCenter.y + targetCenter.y) / 2}
              r="4"
              fill="#00ffff"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </g>
      );
    });
  };

  return (
    <div className={`relative w-full h-full bg-black overflow-hidden ${className}`}>
      {/* Canvas */}
      <div
        ref={canvasRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        onMouseDown={handleCanvasMouseDown}
        style={{
          transform: `translate(${pinboard.canvas.panOffset.x}px, ${pinboard.canvas.panOffset.y}px) scale(${pinboard.canvas.zoom})`,
          transformOrigin: '0 0'
        }}
      >
        {/* Background Grid */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />

        {/* Connections SVG */}
        <svg
          ref={svgRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            width: pinboard.canvas.width,
            height: pinboard.canvas.height
          }}
        >
          {renderConnections()}
          
          {/* Connecting line preview */}
          {connectingFromId && (
            <motion.line
              x1={pinboard.nodes.find(n => n.id === connectingFromId)?.position.x || 0}
              y1={pinboard.nodes.find(n => n.id === connectingFromId)?.position.y || 0}
              x2={pinboard.nodes.find(n => n.id === connectingFromId)?.position.x || 0}
              y2={pinboard.nodes.find(n => n.id === connectingFromId)?.position.y || 0}
              stroke="#00ffff"
              strokeWidth="2"
              strokeDasharray="5,5"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </svg>

        {/* Nodes */}
        {pinboard.nodes.map(node => (
          <PinboardNode
            key={node.id}
            node={node}
            isConnecting={connectingFromId !== null}
            onNodeUpdate={handleNodeUpdate}
            onConnectionStart={handleConnectionStart}
            onConnectionEnd={handleConnectionEnd}
            onNodeSelect={handleNodeSelect}
            scale={pinboard.canvas.zoom}
          />
        ))}
      </div>

      {/* Controls Panel */}
      <div className="absolute top-4 left-4 space-y-2">
        {/* Zoom Controls */}
        <div className="flex flex-col space-y-1 bg-gray-900/90 backdrop-blur-sm rounded-lg p-2 border border-gray-700">
          <button
            onClick={() => handleZoom(0.1)}
            className="p-2 text-cyan-400 hover:bg-cyan-400/20 rounded transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleZoom(-0.1)}
            className="p-2 text-cyan-400 hover:bg-cyan-400/20 rounded transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            onClick={resetView}
            className="p-2 text-cyan-400 hover:bg-cyan-400/20 rounded transition-colors"
            title="Reset View"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>

        {/* Filter Controls */}
        <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg p-2 border border-gray-700">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 text-magenta-400 hover:bg-magenta-400/20 rounded transition-colors"
            title="Filters"
          >
            <Filter className="h-4 w-4" />
          </button>
        </div>

        {/* AI Controls */}
        <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg p-2 border border-gray-700">
          <button
            onClick={generateAISuggestions}
            className="p-2 text-yellow-400 hover:bg-yellow-400/20 rounded transition-colors"
            title="Generate AI Suggestions"
          >
            <Sparkles className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Info Panel */}
      <div className="absolute top-4 right-4 bg-gray-900/90 backdrop-blur-sm rounded-lg p-4 border border-gray-700 min-w-64">
        <h3 className="text-lg font-bold text-cyan-400 font-mono mb-2">
          CONSPIRACY MATRIX
        </h3>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Nodes:</span>
            <span className="text-white font-mono">{pinboard.nodes.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Connections:</span>
            <span className="text-white font-mono">{pinboard.connections.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">AI Suggestions:</span>
            <span className="text-white font-mono">{pinboard.aiSuggestions.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Zoom:</span>
            <span className="text-white font-mono">{(pinboard.canvas.zoom * 100).toFixed(0)}%</span>
          </div>
        </div>

        {/* Sacred Clown & Cliotic Stats */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center space-x-2 mb-2">
            <Crown className="h-4 w-4 text-magenta-400" />
            <span className="text-sm text-magenta-400 font-mono">Sacred Clowns</span>
            <span className="text-sm text-white">
              {pinboard.nodes.filter(n => n.sacredClownAspect).length}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Brain className="h-4 w-4 text-cyan-400" />
            <span className="text-sm text-cyan-400 font-mono">Cliotic Nodes</span>
            <span className="text-sm text-white">
              {pinboard.nodes.filter(n => n.clioticNodeId).length}
            </span>
          </div>
        </div>
      </div>

      {/* AI Suggestions Panel */}
      <AnimatePresence>
        {showAISuggestions && pinboard.aiSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="absolute bottom-4 right-4 bg-gray-900/90 backdrop-blur-sm rounded-lg p-4 border border-gray-700 max-w-80"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-yellow-400 font-mono flex items-center">
                <Sparkles className="mr-2 h-4 w-4" />
                AI SUGGESTIONS
              </h4>
              <button
                onClick={() => setShowAISuggestions(false)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {pinboard.aiSuggestions.map(suggestion => (
                <motion.div
                  key={suggestion.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-2 bg-gray-800/50 rounded border border-gray-600"
                >
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-xs text-yellow-400 font-mono">
                      {suggestion.type.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-400">
                      {(suggestion.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  
                  <p className="text-sm text-white mb-2">
                    {suggestion.description}
                  </p>
                  
                  <p className="text-xs text-gray-400 mb-2">
                    {suggestion.reasoning}
                  </p>
                  
                  <div className="flex space-x-2">
                    <button className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-500 transition-colors">
                      Accept
                    </button>
                    <button className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-500 transition-colors">
                      Reject
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-4 bg-gray-900/90 backdrop-blur-sm rounded-lg p-4 border border-gray-700 min-w-64"
          >
            <h4 className="text-sm font-bold text-magenta-400 font-mono mb-3">
              MATRIX FILTERS
            </h4>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  Min Connection Strength
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={pinboard.filters.minConnectionStrength}
                  onChange={(e) => onPinboardUpdate({
                    ...pinboard,
                    filters: {
                      ...pinboard.filters,
                      minConnectionStrength: parseFloat(e.target.value)
                    }
                  })}
                  className="w-full"
                />
                <span className="text-xs text-gray-400">
                  {(pinboard.filters.minConnectionStrength * 100).toFixed(0)}%
                </span>
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center text-xs text-gray-400">
                  <input
                    type="checkbox"
                    checked={pinboard.filters.showAISuggestions}
                    onChange={(e) => onPinboardUpdate({
                      ...pinboard,
                      filters: {
                        ...pinboard.filters,
                        showAISuggestions: e.target.checked
                      }
                    })}
                    className="mr-2"
                  />
                  Show AI Suggestions
                </label>
                
                <label className="flex items-center text-xs text-gray-400">
                  <input
                    type="checkbox"
                    checked={pinboard.filters.showSacredClownAspects}
                    onChange={(e) => onPinboardUpdate({
                      ...pinboard,
                      filters: {
                        ...pinboard.filters,
                        showSacredClownAspects: e.target.checked
                      }
                    })}
                    className="mr-2"
                  />
                  Sacred Clown Aspects
                </label>
                
                <label className="flex items-center text-xs text-gray-400">
                  <input
                    type="checkbox"
                    checked={pinboard.filters.showClioticNodes}
                    onChange={(e) => onPinboardUpdate({
                      ...pinboard,
                      filters: {
                        ...pinboard.filters,
                        showClioticNodes: e.target.checked
                      }
                    })}
                    className="mr-2"
                  />
                  Cliotic Node Mapping
                </label>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Connection Mode Indicator */}
      {connectingFromId && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-cyan-400 text-black px-4 py-2 rounded-lg font-mono font-bold"
        >
          CONNECTION MODE ACTIVE
        </motion.div>
      )}
    </div>
  );
};
