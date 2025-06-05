
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Tag, ExternalLink, Brain, Zap, Network, Star, Crown } from 'lucide-react';
import { ZettelEntry } from '../types';
// import { HierarchicalLabelingSystem } from '../utils/hierarchicalLabeling';

interface ZettelListItemProps {
  entry: ZettelEntry;
  showTrunk?: boolean;
  rainbowMode?: boolean;
}

const ZettelListItem: React.FC<ZettelListItemProps> = ({ 
  entry, 
  showTrunk = false,
  rainbowMode = false 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getKastenTier = (entryId: string): number => {
    // Determine Kasten tier based on entry ID or trunk association
    const id = parseInt(entryId);
    if (id >= 1000 && id < 7000) return 1; // Foundational concepts
    if (id >= 7000 && id < 13000) return 2; // Developing ideas
    if (id >= 13000 && id < 19000) return 3; // Complex connections
    if (id >= 19000 && id < 25000) return 4; // Mastery level
    return 1; // Default
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

  // Hierarchical system support (temporarily disabled)
  // const hierarchicalTier = entry.tier || 'leaf';
  // const hierarchicalColor = entry.tier ? HierarchicalLabelingSystem.getTierColor(entry.tier) : '#00ffff';
  // const hierarchicalEmoji = entry.tier ? HierarchicalLabelingSystem.getTierEmoji(entry.tier) : '🍃';

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div
      className={`zettel-card zettel-card-kasten-${tier} group relative ${rainbowMode ? 'rainbow-bg' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tier Indicator */}
      <div className="absolute top-2 right-2 flex items-center space-x-1">
        <ComplexityIcon className={`w-4 h-4 text-${kastenColor} group-hover:animate-glitch`} />
        <span className={`text-xs font-vt323 text-${kastenColor} uppercase tracking-wider`}>
          T{tier}
        </span>
      </div>

      {/* Hierarchical Tier Indicator - Temporarily disabled */}
      {/* <div className="absolute top-2 left-2 flex items-center space-x-1">
        <span className="text-lg">{hierarchicalEmoji}</span>
        {entry.hierarchicalId && (
          <span className="text-xs font-vt323 text-y2k-cyan uppercase tracking-wider">
            {entry.hierarchicalId}
          </span>
        )}
      </div> */}

      {/* Mystical Elements - Temporarily disabled */}
      {/* <div className="absolute top-8 right-2 flex flex-col items-end space-y-1">
        {entry.sacredClownAspect && (
          <div className="flex items-center space-x-1" title={`Sacred Clown: ${entry.sacredClownAspect}`}>
            <Crown className="w-3 h-3 text-y2k-magenta animate-pulse" />
            <span className="text-xs font-vt323 text-y2k-magenta">SC</span>
          </div>
        )}
        {entry.clioticNodeId && (
          <div className="flex items-center space-x-1" title={`Cliotic Node: ${entry.clioticNodeId}`}>
            <Brain className="w-3 h-3 text-y2k-cyan animate-pulse" />
            <span className="text-xs font-vt323 text-y2k-cyan">CN</span>
          </div>
        )}
      </div> */}

      {/* Header */}
      <div className="flex items-start justify-between mb-3 pr-12">
        <div className="flex-1">
          <Link
            to={`/zettel/${entry.id}`}
            className={`block font-vt323 text-lg font-bold text-y2k-white group-hover:text-${kastenColor} transition-all duration-300 hover:text-shadow-glow line-clamp-2`}
          >
            {entry.title}
          </Link>
          <div className="flex items-center space-x-2 mt-1">
            <span className={`text-xs font-vt323 text-${kastenColor} uppercase tracking-wider`}>
              {kastenLabel}
            </span>
            <span className="text-xs font-vt323 text-y2k-cyan">
              #{entry.id}
            </span>
          </div>
        </div>
      </div>

      {/* Content Preview */}
      <div className="mb-4">
        <p className="text-sm text-y2k-white/80 font-tahoma line-clamp-3 group-hover:text-y2k-white transition-colors duration-300">
          {entry.content}
        </p>
      </div>

      {/* Tags */}
      {entry.tags && entry.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {entry.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className={`inline-flex items-center space-x-1 px-2 py-1 bg-${kastenColor}/20 border border-${kastenColor}/30 rounded text-xs font-vt323 text-${kastenColor} hover:bg-${kastenColor}/30 transition-all duration-300`}
            >
              <Tag className="w-3 h-3" />
              <span>{tag}</span>
            </span>
          ))}
          {entry.tags.length > 3 && (
            <span className={`px-2 py-1 bg-y2k-bg-dark border border-y2k-cyan/30 rounded text-xs font-vt323 text-y2k-cyan`}>
              +{entry.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Trunk Info */}
      {showTrunk && entry.trunkId && (
        <div className="mb-3">
          <Link
            to={`/trunk/${entry.trunkId}`}
            className={`inline-flex items-center space-x-1 text-xs font-vt323 text-${kastenColor} hover:text-y2k-magenta transition-colors duration-300`}
          >
            <Brain className="w-3 h-3" />
            <span>TRUNK #{entry.trunkId}</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-y2k-cyan">
            <Calendar className="w-3 h-3" />
            <span className="font-vt323">{formatDate(entry.createdAt)}</span>
          </div>
          {entry.connections && entry.connections.length > 0 && (
            <div className={`flex items-center space-x-1 text-${kastenColor}`}>
              <Network className="w-3 h-3" />
              <span className="font-vt323">{entry.connections.length} LINKS</span>
            </div>
          )}
        </div>
        
        <Link
          to={`/zettel/${entry.id}`}
          className={`inline-flex items-center space-x-1 px-2 py-1 bg-${kastenColor}/20 border border-${kastenColor}/30 rounded font-vt323 text-${kastenColor} hover:bg-${kastenColor}/30 hover:scale-105 transition-all duration-300`}
        >
          <span>VIEW</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {/* Hover Effect Overlay */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none">
          <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-${kastenColor} to-transparent animate-data-stream`} />
          <div className={`absolute bottom-0 right-0 w-full h-1 bg-gradient-to-l from-${kastenColor} to-transparent animate-data-stream`} />
        </div>
      )}

      {/* Neural Activity Indicator */}
      <div className="absolute bottom-2 left-2">
        <div className={`w-2 h-2 rounded-full bg-${kastenColor} animate-pulse`} />
      </div>

      {/* Data Stream Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-${kastenColor}/30 to-transparent transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      </div>
    </div>
  );
};

export default ZettelListItem;
