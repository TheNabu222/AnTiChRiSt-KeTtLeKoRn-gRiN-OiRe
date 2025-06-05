
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Check } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ThemeToggleProps {
  compact?: boolean;
  showLabel?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ compact = false, showLabel = true }) => {
  const { currentTheme, setTheme, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 p-2 bg-y2k-bg-medium border-2 border-y2k-cyan/30 rounded hover:border-y2k-cyan hover:shadow-cyan-glow transition-all duration-300 ${
          compact ? 'text-sm' : ''
        }`}
      >
        <Palette className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} text-y2k-cyan`} />
        {showLabel && (
          <span className="font-vt323 text-y2k-white">
            {compact ? currentTheme.name.split(' ')[0] : currentTheme.name}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`absolute top-full mt-2 ${compact ? 'w-48' : 'w-64'} panel-y2k p-3 z-50 ${
              compact ? 'right-0' : 'left-0'
            }`}
          >
            <div className="space-y-2">
              <div className="font-vt323 text-y2k-yellow text-xs uppercase tracking-wider mb-2">
                Select Theme
              </div>
              {availableThemes.map((theme) => (
                <motion.button
                  key={theme.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setTheme(theme.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded border transition-all duration-300 ${
                    currentTheme.id === theme.id
                      ? 'border-y2k-magenta bg-y2k-bg-light text-y2k-magenta'
                      : 'border-y2k-cyan/30 bg-y2k-bg-dark text-y2k-white hover:border-y2k-cyan'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded border border-y2k-white/20"
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                    <span className={`font-vt323 ${compact ? 'text-xs' : 'text-sm'}`}>
                      {theme.name}
                    </span>
                  </div>
                  {currentTheme.id === theme.id && (
                    <Check className="w-3 h-3 text-y2k-magenta" />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ThemeToggle;
