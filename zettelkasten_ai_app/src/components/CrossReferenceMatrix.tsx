
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, RotateCcw, Filter, Eye, EyeOff } from 'lucide-react';
import { KnowledgeNode, KnowledgeEdge, CrossReferenceMatrix as MatrixType } from '../types';

interface CrossReferenceMatrixProps {
  matrix: MatrixType;
  onNodeClick?: (nodeId: string) => void;
  onEdgeClick?: (edgeId: string) => void;
  onMatrixUpdate?: (matrix: MatrixType) => void;
}

export default function CrossReferenceMatrix({
  matrix,
  onNodeClick,
  onEdgeClick,
  onMatrixUpdate
}: CrossReferenceMatrixProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, width: 1000, height: 800 });
  const [zoom, setZoom] = useState(1);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Filter edges based on current filters
  const filteredEdges = matrix.edges.filter(edge => {
    return edge.strength >= matrix.filters.minStrength &&
           matrix.filters.relationshipTypes.includes(edge.relationship);
  });

  // Filter nodes that have connections or are selected
  const connectedNodeIds = new Set([
    ...filteredEdges.map(edge => edge.sourceId),
    ...filteredEdges.map(edge => edge.targetId)
  ]);

  const visibleNodes = matrix.nodes.filter(node => 
    connectedNodeIds.has(node.id) || selectedNode === node.id
  );

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(selectedNode === nodeId ? null : nodeId);
    onNodeClick?.(nodeId);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.3));
  };

  const handleReset = () => {
    setZoom(1);
    setViewBox({ x: 0, y: 0, width: 1000, height: 800 });
    setSelectedNode(null);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === svgRef.current) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const dx = (e.clientX - dragStart.x) / zoom;
      const dy = (e.clientY - dragStart.y) / zoom;
      
      setViewBox(prev => ({
        ...prev,
        x: prev.x - dx,
        y: prev.y - dy
      }));
      
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getNodeColor = (node: KnowledgeNode) => {
    if (selectedNode === node.id) return '#8B5CF6'; // Purple for selected
    if (hoveredNode === node.id) return '#A78BFA'; // Light purple for hovered
    
    switch (node.type) {
      case 'concept': return '#3B82F6'; // Blue
      case 'practice': return '#10B981'; // Green
      case 'entity': return '#F59E0B'; // Yellow
      case 'protocol': return '#EF4444'; // Red
      case 'insight': return '#8B5CF6'; // Purple
      default: return '#6B7280'; // Gray
    }
  };

  const getEdgeColor = (edge: KnowledgeEdge) => {
    const isConnectedToSelected = selectedNode && 
      (edge.sourceId === selectedNode || edge.targetId === selectedNode);
    
    if (isConnectedToSelected) return '#8B5CF6';
    
    const alpha = Math.max(0.3, edge.strength);
    switch (edge.relationship) {
      case 'conceptual': return `rgba(59, 130, 246, ${alpha})`;
      case 'mythic': return `rgba(139, 92, 246, ${alpha})`;
      case 'recursive': return `rgba(16, 185, 129, ${alpha})`;
      case 'emotional': return `rgba(239, 68, 68, ${alpha})`;
      case 'resistance_to': return `rgba(245, 158, 11, ${alpha})`;
      case 'heals': return `rgba(34, 197, 94, ${alpha})`;
      case 'subverts': return `rgba(168, 85, 247, ${alpha})`;
      case 'collaborates_with': return `rgba(6, 182, 212, ${alpha})`;
      case 'manifests_as': return `rgba(251, 146, 60, ${alpha})`;
      default: return `rgba(107, 114, 128, ${alpha})`;
    }
  };

  const renderNode = (node: KnowledgeNode) => {
    const isSelected = selectedNode === node.id;
    const isHovered = hoveredNode === node.id;
    const radius = Math.max(8, Math.min(20, node.size * 15));
    
    return (
      <g key={node.id}>
        {/* Node glow effect for selected/hovered */}
        {(isSelected || isHovered) && (
          <circle
            cx={node.position.x}
            cy={node.position.y}
            r={radius + 8}
            fill={getNodeColor(node)}
            opacity={0.2}
            className="animate-pulse"
          />
        )}
        
        {/* Main node circle */}
        <circle
          cx={node.position.x}
          cy={node.position.y}
          r={radius}
          fill={getNodeColor(node)}
          stroke={isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.3)'}
          strokeWidth={isSelected ? 3 : 1}
          className="cursor-pointer transition-all duration-200"
          onClick={() => handleNodeClick(node.id)}
          onMouseEnter={() => setHoveredNode(node.id)}
          onMouseLeave={() => setHoveredNode(null)}
        />
        
        {/* Node label */}
        <text
          x={node.position.x}
          y={node.position.y + radius + 15}
          textAnchor="middle"
          className="fill-white text-xs font-medium pointer-events-none"
          style={{ fontSize: Math.max(10, 12 / zoom) }}
        >
          {node.title.length > 20 ? node.title.substring(0, 17) + '...' : node.title}
        </text>
        
        {/* Type indicator */}
        <text
          x={node.position.x}
          y={node.position.y + 4}
          textAnchor="middle"
          className="fill-white text-xs font-bold pointer-events-none"
          style={{ fontSize: Math.max(8, 10 / zoom) }}
        >
          {node.type.charAt(0).toUpperCase()}
        </text>
      </g>
    );
  };

  const renderEdge = (edge: KnowledgeEdge) => {
    const sourceNode = matrix.nodes.find(n => n.id === edge.sourceId);
    const targetNode = matrix.nodes.find(n => n.id === edge.targetId);
    
    if (!sourceNode || !targetNode) return null;
    
    const strokeWidth = Math.max(1, edge.strength * 4);
    const isHighlighted = selectedNode && 
      (edge.sourceId === selectedNode || edge.targetId === selectedNode);
    
    return (
      <g key={edge.id}>
        {/* Edge line */}
        <line
          x1={sourceNode.position.x}
          y1={sourceNode.position.y}
          x2={targetNode.position.x}
          y2={targetNode.position.y}
          stroke={getEdgeColor(edge)}
          strokeWidth={isHighlighted ? strokeWidth * 1.5 : strokeWidth}
          className="cursor-pointer transition-all duration-200"
          onClick={() => onEdgeClick?.(edge.id)}
        />
        
        {/* Bidirectional indicator */}
        {edge.bidirectional && (
          <circle
            cx={(sourceNode.position.x + targetNode.position.x) / 2}
            cy={(sourceNode.position.y + targetNode.position.y) / 2}
            r={3}
            fill={getEdgeColor(edge)}
            className="pointer-events-none"
          />
        )}
      </g>
    );
  };

  const renderClusters = () => {
    if (!matrix.filters.showClusters) return null;
    
    return matrix.clusters.map(cluster => {
      const clusterNodes = matrix.nodes.filter(node => 
        cluster.nodeIds.includes(node.id)
      );
      
      if (clusterNodes.length < 2) return null;
      
      // Calculate cluster bounds
      const xs = clusterNodes.map(n => n.position.x);
      const ys = clusterNodes.map(n => n.position.y);
      const minX = Math.min(...xs) - 30;
      const maxX = Math.max(...xs) + 30;
      const minY = Math.min(...ys) - 30;
      const maxY = Math.max(...ys) + 30;
      
      return (
        <g key={cluster.id}>
          <rect
            x={minX}
            y={minY}
            width={maxX - minX}
            height={maxY - minY}
            fill={cluster.color}
            fillOpacity={0.1}
            stroke={cluster.color}
            strokeWidth={2}
            strokeDasharray="5,5"
            rx={10}
            className="pointer-events-none"
          />
          <text
            x={minX + 10}
            y={minY + 20}
            className="fill-white text-sm font-medium pointer-events-none"
            style={{ fontSize: Math.max(10, 12 / zoom) }}
          >
            {cluster.name}
          </text>
        </g>
      );
    });
  };

  return (
    <div className="relative w-full h-full bg-void-900 rounded-lg overflow-hidden">
      {/* Controls */}
      <div className="absolute top-4 left-4 z-10 flex items-center space-x-2">
        <div className="glass-effect rounded-lg p-2 flex items-center space-x-1">
          <button
            onClick={handleZoomIn}
            className="p-1 hover:bg-void-700/30 rounded text-void-400 hover:text-void-300"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1 hover:bg-void-700/30 rounded text-void-400 hover:text-void-300"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className="p-1 hover:bg-void-700/30 rounded text-void-400 hover:text-void-300"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
        
        <div className="glass-effect rounded-lg p-2 text-xs text-void-400">
          Zoom: {Math.round(zoom * 100)}%
        </div>
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 z-10 glass-effect rounded-lg p-3 max-w-xs">
        <h3 className="text-sm font-medium text-void-200 mb-2">Node Types</h3>
        <div className="grid grid-cols-2 gap-1 text-xs">
          {['concept', 'practice', 'entity', 'protocol', 'insight'].map(type => (
            <div key={type} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getNodeColor({ type } as any) }}
              />
              <span className="text-void-400 capitalize">{type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="absolute bottom-4 left-4 z-10 glass-effect rounded-lg p-3">
        <div className="text-xs text-void-400 space-y-1">
          <div>Nodes: {visibleNodes.length}/{matrix.nodes.length}</div>
          <div>Edges: {filteredEdges.length}/{matrix.edges.length}</div>
          <div>Clusters: {matrix.clusters.length}</div>
        </div>
      </div>

      {/* SVG Matrix */}
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width / zoom} ${viewBox.height / zoom}`}
        className="cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Background grid */}
        <defs>
          <pattern
            id="grid"
            width="50"
            height="50"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 50 0 L 0 0 0 50"
              fill="none"
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Clusters */}
        {renderClusters()}

        {/* Edges */}
        {filteredEdges.map(renderEdge)}

        {/* Nodes */}
        {visibleNodes.map(renderNode)}
      </svg>

      {/* Selected Node Info */}
      {selectedNode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 right-4 z-10 glass-effect rounded-lg p-4 max-w-sm"
        >
          {(() => {
            const node = matrix.nodes.find(n => n.id === selectedNode);
            if (!node) return null;
            
            const connectedEdges = filteredEdges.filter(edge =>
              edge.sourceId === selectedNode || edge.targetId === selectedNode
            );
            
            return (
              <div>
                <h3 className="text-sm font-medium text-consciousness-300 mb-2">
                  {node.title}
                </h3>
                <div className="text-xs text-void-400 space-y-1">
                  <div>Type: <span className="text-void-300 capitalize">{node.type}</span></div>
                  <div>Connections: <span className="text-void-300">{connectedEdges.length}</span></div>
                  <div>Complexity: <span className="text-void-300">{node.metadata.complexity}</span></div>
                  {node.metadata.tags.length > 0 && (
                    <div>
                      Tags: <span className="text-void-300">{node.metadata.tags.slice(0, 3).join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </motion.div>
      )}
    </div>
  );
}
