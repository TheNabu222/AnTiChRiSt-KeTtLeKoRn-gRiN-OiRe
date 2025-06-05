
import React, { useState, useRef } from 'react';
import { motion, PanInfo, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, Eye, Link, Zap, Crown } from 'lucide-react';
import { PinboardNode as PinboardNodeType, HierarchicalLabel } from '../types';
import { HierarchicalLabelingSystem } from '../utils/hierarchicalLabeling';

interface PinboardNodeProps {
  node: PinboardNodeType;
  isConnecting: boolean;
  onNodeUpdate: (node: PinboardNodeType) => void;
  onConnectionStart: (nodeId: string) => void;
  onConnectionEnd: (nodeId: string) => void;
  onNodeSelect: (nodeId: string) => void;
  scale: number;
}

export const PinboardNode: React.FC<PinboardNodeProps> = ({
  node,
  isConnecting,
  onNodeUpdate,
  onConnectionStart,
  onConnectionEnd,
  onNodeSelect,
  scale
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);

  const handleDragStart = () => {
    setIsDragging(true);
    onNodeUpdate({ ...node, isDragging: true });
  };

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const newPosition = {
      x: node.position.x + info.delta.x / scale,
      y: node.position.y + info.delta.y / scale
    };
    
    onNodeUpdate({
      ...node,
      position: newPosition
    });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    onNodeUpdate({ ...node, isDragging: false });
  };

  const handleConnectionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isConnecting) {
      onConnectionEnd(node.id);
    } else {
      onConnectionStart(node.id);
    }
  };

  const handleNodeClick = () => {
    onNodeSelect(node.id);
  };

  const tierColor = HierarchicalLabelingSystem.getTierColor(node.tier);
  const tierEmoji = HierarchicalLabelingSystem.getTierEmoji(node.tier);

  return (
    <motion.div
      ref={nodeRef}
      className={`
        absolute cursor-pointer select-none
        ${node.isSelected ? 'z-50' : 'z-10'}
        ${isDragging ? 'z-50' : ''}
      `}
      style={{
        left: node.position.x,
        top: node.position.y,
        width: node.size.width,
        height: node.size.height
      }}
      drag
      dragMomentum={false}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleNodeClick}
      whileHover={{ scale: 1.05 }}
      whileDrag={{ scale: 1.1 }}
      animate={{
        scale: node.isSelected ? 1.1 : 1,
        boxShadow: node.isSelected 
          ? `0 0 20px ${tierColor}80, 0 0 40px ${tierColor}40`
          : `0 0 10px ${tierColor}40`
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Main Node Body */}
      <div
        className={`
          relative w-full h-full rounded-lg border-2 backdrop-blur-sm
          ${node.isSelected 
            ? 'border-white shadow-lg' 
            : 'border-gray-600 hover:border-gray-400'
          }
          ${isConnecting ? 'ring-2 ring-cyan-400 ring-opacity-50' : ''}
        `}
        style={{
          backgroundColor: `${tierColor}20`,
          borderColor: node.isSelected ? tierColor : undefined
        }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-2 rounded-t-lg"
          style={{ backgroundColor: `${tierColor}30` }}
        >
          <div className="flex items-center space-x-1">
            <span className="text-lg">{tierEmoji}</span>
            <span className="text-xs font-mono text-white">
              {node.tier.toUpperCase()}
            </span>
          </div>
          
          <div className="flex items-center space-x-1">
            {node.sacredClownAspect && (
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                title={`Sacred Clown: ${node.sacredClownAspect}`}
              >
                <Crown className="h-3 w-3 text-magenta-400" />
              </motion.div>
            )}
            
            {node.clioticNodeId && (
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                title={`Cliotic Node: ${node.clioticNodeId}`}
              >
                <Brain className="h-3 w-3 text-cyan-400" />
              </motion.div>
            )}
            
            {node.metadata.aiSuggestionScore && node.metadata.aiSuggestionScore > 0.8 && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                title="High AI Suggestion Score"
              >
                <Sparkles className="h-3 w-3 text-yellow-400" />
              </motion.div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-2 space-y-1">
          <h4 className="text-sm font-bold text-white truncate" title={node.title}>
            {node.title}
          </h4>
          
          {/* Tags */}
          {node.metadata.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {node.metadata.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="text-xs px-1 py-0.5 rounded bg-gray-700 text-gray-300 font-mono"
                >
                  {tag}
                </span>
              ))}
              {node.metadata.tags.length > 3 && (
                <span className="text-xs text-gray-400">
                  +{node.metadata.tags.length - 3}
                </span>
              )}
            </div>
          )}
          
          {/* Emotional Weight Indicator */}
          <div className="flex items-center space-x-1">
            <div className="flex-1 h-1 bg-gray-700 rounded">
              <div
                className="h-full rounded transition-all duration-300"
                style={{
                  width: `${node.metadata.emotionalWeight * 100}%`,
                  backgroundColor: tierColor
                }}
              />
            </div>
            <span className="text-xs text-gray-400 font-mono">
              {(node.metadata.emotionalWeight * 100).toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Connection Controls */}
        <AnimatePresence>
          {(isHovered || isConnecting) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute -top-2 -right-2 flex space-x-1"
            >
              <button
                onClick={handleConnectionClick}
                className={`
                  p-1 rounded-full border-2 backdrop-blur-sm transition-all
                  ${isConnecting 
                    ? 'bg-cyan-400 border-cyan-400 text-black' 
                    : 'bg-gray-800 border-gray-600 text-cyan-400 hover:border-cyan-400'
                  }
                `}
                title={isConnecting ? "End Connection" : "Start Connection"}
              >
                <Link className="h-3 w-3" />
              </button>
              
              <button
                className="p-1 rounded-full border-2 bg-gray-800 border-gray-600 text-yellow-400 hover:border-yellow-400 backdrop-blur-sm transition-all"
                title="View Details"
              >
                <Eye className="h-3 w-3" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Suggestion Glow */}
        {node.metadata.aiSuggestionScore && node.metadata.aiSuggestionScore > 0.7 && (
          <motion.div
            className="absolute inset-0 rounded-lg pointer-events-none"
            animate={{
              boxShadow: [
                `0 0 5px ${tierColor}40`,
                `0 0 15px ${tierColor}60`,
                `0 0 5px ${tierColor}40`
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        {/* Sacred Clown Aura */}
        {node.sacredClownAspect && (
          <motion.div
            className="absolute inset-0 rounded-lg pointer-events-none"
            animate={{
              background: [
                'radial-gradient(circle, transparent 70%, #ff149340 100%)',
                'radial-gradient(circle, transparent 70%, #ff149360 100%)',
                'radial-gradient(circle, transparent 70%, #ff149340 100%)'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        )}

        {/* Cliotic Node Pulse */}
        {node.clioticNodeId && (
          <motion.div
            className="absolute inset-0 rounded-lg pointer-events-none border-2 border-cyan-400"
            animate={{
              opacity: [0, 0.5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </div>

      {/* Connection Points */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top */}
        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        {/* Right */}
        <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-2 h-2 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        {/* Bottom */}
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        {/* Left */}
        <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-2 h-2 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </motion.div>
  );
};
