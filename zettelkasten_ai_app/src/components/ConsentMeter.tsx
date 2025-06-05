
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ConsentMeter as ConsentMeterType } from '../types';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';

interface ConsentMeterProps {
  initialValue?: number;
  threshold?: number;
  animated?: boolean;
  onValueChange?: (value: number) => void;
  className?: string;
}

export default function ConsentMeter({ 
  initialValue = 0, 
  threshold = 70, 
  animated = true,
  onValueChange,
  className = '' 
}: ConsentMeterProps) {
  const [value, setValue] = useState(initialValue);
  const [isAnimating, setIsAnimating] = useState(false);

  const getStatus = (val: number): ConsentMeterType['status'] => {
    if (val >= threshold) return 'safe';
    if (val >= 50) return 'caution';
    return 'danger';
  };

  const getStatusColor = (status: ConsentMeterType['status']) => {
    switch (status) {
      case 'safe': return 'text-green-400';
      case 'caution': return 'text-yellow-400';
      case 'danger': return 'text-red-400';
    }
  };

  const getStatusIcon = (status: ConsentMeterType['status']) => {
    switch (status) {
      case 'safe': return <CheckCircle className="w-4 h-4" />;
      case 'caution': return <AlertTriangle className="w-4 h-4" />;
      case 'danger': return <Shield className="w-4 h-4" />;
    }
  };

  const getBarColor = (status: ConsentMeterType['status']) => {
    switch (status) {
      case 'safe': return 'from-green-500 to-emerald-500';
      case 'caution': return 'from-yellow-500 to-orange-500';
      case 'danger': return 'from-red-500 to-pink-500';
    }
  };

  const animateToValue = (targetValue: number) => {
    if (!animated) {
      setValue(targetValue);
      onValueChange?.(targetValue);
      return;
    }

    setIsAnimating(true);
    let current = value;
    const increment = targetValue > current ? 1 : -1;
    const interval = setInterval(() => {
      current += increment;
      setValue(current);
      onValueChange?.(current);

      if (current === targetValue) {
        clearInterval(interval);
        setIsAnimating(false);
      }
    }, 50);
  };

  const status = getStatus(value);
  const statusColor = getStatusColor(status);
  const statusIcon = getStatusIcon(status);
  const barColor = getBarColor(status);

  return (
    <div className={`bg-void-900 rounded-lg p-4 border border-void-700 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={statusColor}>
            {statusIcon}
          </div>
          <span className="text-sm font-mono text-void-300">
            CONSENT VERIFICATION
          </span>
        </div>
        <div className={`text-lg font-bold ${statusColor}`}>
          {value}%
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-6 bg-void-800 rounded-full overflow-hidden mb-3">
        <motion.div
          className={`h-full bg-gradient-to-r ${barColor} relative`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: animated ? 0.5 : 0 }}
        >
          {/* Animated shimmer effect */}
          {isAnimating && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ repeat: Infinity, duration: 1 }}
            />
          )}
        </motion.div>

        {/* Threshold marker */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-white/50"
          style={{ left: `${threshold}%` }}
        />
      </div>

      {/* Status Text */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-void-500">
          Threshold: {threshold}%
        </span>
        <span className={`font-mono ${statusColor}`}>
          {status.toUpperCase()}
        </span>
      </div>

      {/* Control Buttons */}
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => animateToValue(Math.max(0, value - 10))}
          disabled={isAnimating || value <= 0}
          className="flex-1 px-3 py-1 bg-void-800 hover:bg-void-700 disabled:opacity-50 disabled:cursor-not-allowed rounded text-xs text-void-300 transition-colors"
        >
          -10%
        </button>
        <button
          onClick={() => animateToValue(Math.min(100, value + 10))}
          disabled={isAnimating || value >= 100}
          className="flex-1 px-3 py-1 bg-void-800 hover:bg-void-700 disabled:opacity-50 disabled:cursor-not-allowed rounded text-xs text-void-300 transition-colors"
        >
          +10%
        </button>
        <button
          onClick={() => animateToValue(Math.floor(Math.random() * 101))}
          disabled={isAnimating}
          className="flex-1 px-3 py-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded text-xs text-white transition-colors"
        >
          Random
        </button>
      </div>
    </div>
  );
}
