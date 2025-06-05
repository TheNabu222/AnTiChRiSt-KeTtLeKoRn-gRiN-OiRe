
import React from 'react';
import { motion } from 'framer-motion';
import { OracleCard as OracleCardType } from '../types';
import { Sparkles, Heart, Zap } from 'lucide-react';

interface OracleCardProps {
  card: OracleCardType;
  isRevealed?: boolean;
  onReveal?: () => void;
  className?: string;
}

export default function OracleCard({ card, isRevealed = true, onReveal, className = '' }: OracleCardProps) {
  const getEmotionalIcon = (weight: number) => {
    if (weight >= 8) return <Heart className="w-4 h-4 text-pink-400" />;
    if (weight >= 6) return <Zap className="w-4 h-4 text-purple-400" />;
    return <Sparkles className="w-4 h-4 text-blue-400" />;
  };

  const getIntensityColor = (weight: number) => {
    if (weight >= 8) return 'from-pink-500/20 to-red-500/20';
    if (weight >= 6) return 'from-purple-500/20 to-indigo-500/20';
    return 'from-blue-500/20 to-cyan-500/20';
  };

  if (!isRevealed) {
    return (
      <motion.div
        className={`relative w-full h-64 cursor-pointer ${className}`}
        onClick={onReveal}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="w-full h-full bg-gradient-to-br from-void-800 to-void-900 rounded-lg border border-void-600 flex items-center justify-center">
          <div className="text-center">
            <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <p className="text-void-300 text-sm">Click to reveal</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`relative w-full h-64 ${className}`}
      initial={{ rotateY: 180, opacity: 0 }}
      animate={{ rotateY: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div 
        className={`w-full h-full bg-gradient-to-br ${getIntensityColor(card.emotionalWeight)} rounded-lg border border-void-600 p-4 flex flex-col justify-between relative overflow-hidden`}
        style={{ backgroundColor: `${card.hexColor}15` }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-gradient-to-br from-transparent via-white/5 to-transparent" />
        </div>

        {/* Header */}
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {getEmotionalIcon(card.emotionalWeight)}
              <span className="text-xs text-void-400 font-mono">
                {card.deckId.toUpperCase()}
              </span>
            </div>
            <div 
              className="w-3 h-3 rounded-full border border-white/30"
              style={{ backgroundColor: card.hexColor }}
            />
          </div>
          
          <h3 className="text-lg font-bold text-white mb-1 leading-tight">
            {card.name}
          </h3>
          
          <p className="text-sm text-void-300 leading-relaxed">
            {card.description}
          </p>
        </div>

        {/* Logic */}
        <div className="relative z-10">
          <div className="bg-void-900/50 rounded p-3 border border-void-700">
            <p className="text-xs text-void-400 mb-1 font-mono">LOGIC:</p>
            <p className="text-sm text-void-200 italic">
              "{card.logic}"
            </p>
          </div>
        </div>

        {/* Symbolism */}
        <div className="relative z-10">
          <p className="text-xs text-void-500 text-center">
            {card.symbolism}
          </p>
        </div>

        {/* Emotional weight indicator */}
        <div className="absolute bottom-2 right-2">
          <div className="flex gap-1">
            {Array.from({ length: 10 }, (_, i) => (
              <div
                key={i}
                className={`w-1 h-1 rounded-full ${
                  i < card.emotionalWeight 
                    ? 'bg-white/60' 
                    : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
