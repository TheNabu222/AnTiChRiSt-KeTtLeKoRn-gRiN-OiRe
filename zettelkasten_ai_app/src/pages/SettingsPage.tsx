
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Palette, 
  Volume2, 
  VolumeX, 
  Eye, 
  Zap, 
  Monitor, 
  Smartphone, 
  Save,
  RotateCcw,
  Download,
  Upload,
  Trash2,
  Info
} from 'lucide-react';
import { useTheme, themes } from '../contexts/ThemeContext';

const SettingsPage: React.FC = () => {
  const { currentTheme, setTheme, availableThemes, settings, updateSettings } = useTheme();
  const [activeTab, setActiveTab] = useState<'appearance' | 'accessibility' | 'performance' | 'data'>('appearance');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleExportSettings = () => {
    const exportData = {
      theme: currentTheme.id,
      settings,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zettelkasten-settings-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target?.result as string);
        if (importData.theme && themes[importData.theme]) {
          setTheme(importData.theme);
        }
        if (importData.settings) {
          updateSettings(importData.settings);
        }
        alert('Settings imported successfully!');
      } catch (error) {
        alert('Failed to import settings. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetSettings = () => {
    if (showResetConfirm) {
      setTheme('y2k');
      updateSettings({
        reducedMotion: false,
        highContrast: false,
        fontSize: 'medium',
        soundEffects: true,
      });
      localStorage.removeItem('zettelkasten-theme');
      localStorage.removeItem('zettelkasten-settings');
      setShowResetConfirm(false);
      alert('Settings reset to defaults!');
    } else {
      setShowResetConfirm(true);
      setTimeout(() => setShowResetConfirm(false), 3000);
    }
  };

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'accessibility', label: 'Accessibility', icon: Eye },
    { id: 'performance', label: 'Performance', icon: Zap },
    { id: 'data', label: 'Data', icon: Save },
  ] as const;

  return (
    <div className="min-h-screen bg-y2k-black p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-y2k-bg-medium border-2 border-y2k-cyan rounded-lg">
              <Settings className="w-8 h-8 text-y2k-cyan" />
            </div>
            <div>
              <h1 className="text-4xl font-vt323 text-y2k-magenta">SYSTEM.SETTINGS</h1>
              <p className="text-y2k-cyan font-tahoma">Configure your neural interface preferences</p>
            </div>
          </div>
          
          <div className="panel-y2k p-4">
            <div className="flex items-center space-x-4 text-sm font-vt323">
              <span className="text-y2k-yellow">CURRENT.THEME:</span>
              <span className="text-y2k-white">{currentTheme.name}</span>
              <span className="text-y2k-cyan">|</span>
              <span className="text-y2k-yellow">STATUS:</span>
              <span className="text-y2k-lime animate-pulse">ONLINE</span>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <div className="flex space-x-2 bg-y2k-bg-medium p-2 rounded-lg border-2 border-y2k-cyan/30">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded font-vt323 transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-y2k-cyan text-y2k-black shadow-cyan-glow'
                    : 'text-y2k-cyan hover:bg-y2k-bg-light hover:text-y2k-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              {/* Theme Selection */}
              <div className="panel-y2k p-6">
                <h2 className="text-2xl font-vt323 text-y2k-cyan mb-4">VISUAL.THEMES</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableThemes.map((theme) => (
                    <motion.div
                      key={theme.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                        currentTheme.id === theme.id
                          ? 'border-y2k-magenta bg-y2k-bg-light shadow-y2k'
                          : 'border-y2k-cyan/30 bg-y2k-bg-dark hover:border-y2k-cyan hover:shadow-cyan-glow'
                      }`}
                      onClick={() => setTheme(theme.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-vt323 text-lg text-y2k-white">{theme.name}</h3>
                        {currentTheme.id === theme.id && (
                          <div className="w-3 h-3 bg-y2k-magenta rounded-full animate-pulse" />
                        )}
                      </div>
                      <p className="text-sm text-y2k-cyan/70 mb-3 font-tahoma">{theme.description}</p>
                      
                      {/* Color Preview */}
                      <div className="flex space-x-2 mb-3">
                        <div 
                          className="w-6 h-6 rounded border border-y2k-white/20"
                          style={{ backgroundColor: theme.colors.primary }}
                        />
                        <div 
                          className="w-6 h-6 rounded border border-y2k-white/20"
                          style={{ backgroundColor: theme.colors.secondary }}
                        />
                        <div 
                          className="w-6 h-6 rounded border border-y2k-white/20"
                          style={{ backgroundColor: theme.colors.accent }}
                        />
                      </div>
                      
                      {/* Effects Preview */}
                      <div className="flex flex-wrap gap-1">
                        {theme.effects.glow && (
                          <span className="text-xs px-2 py-1 bg-y2k-cyan/20 text-y2k-cyan rounded">GLOW</span>
                        )}
                        {theme.effects.animations && (
                          <span className="text-xs px-2 py-1 bg-y2k-magenta/20 text-y2k-magenta rounded">ANIM</span>
                        )}
                        {theme.effects.matrixRain && (
                          <span className="text-xs px-2 py-1 bg-y2k-lime/20 text-y2k-lime rounded">MATRIX</span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'accessibility' && (
            <div className="space-y-6">
              <div className="panel-y2k p-6">
                <h2 className="text-2xl font-vt323 text-y2k-cyan mb-4">ACCESSIBILITY.OPTIONS</h2>
                
                <div className="space-y-6">
                  {/* Reduced Motion */}
                  <div className="flex items-center justify-between p-4 bg-y2k-bg-dark rounded border border-y2k-cyan/30">
                    <div>
                      <h3 className="font-vt323 text-lg text-y2k-white">REDUCED.MOTION</h3>
                      <p className="text-sm text-y2k-cyan/70 font-tahoma">Disable animations and effects</p>
                    </div>
                    <button
                      onClick={() => updateSettings({ reducedMotion: !settings.reducedMotion })}
                      className={`w-12 h-6 rounded-full transition-all duration-300 ${
                        settings.reducedMotion ? 'bg-y2k-cyan' : 'bg-y2k-bg-medium border border-y2k-cyan/50'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-y2k-white rounded-full transition-transform duration-300 ${
                        settings.reducedMotion ? 'translate-x-7' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  {/* High Contrast */}
                  <div className="flex items-center justify-between p-4 bg-y2k-bg-dark rounded border border-y2k-cyan/30">
                    <div>
                      <h3 className="font-vt323 text-lg text-y2k-white">HIGH.CONTRAST</h3>
                      <p className="text-sm text-y2k-cyan/70 font-tahoma">Increase color contrast for better visibility</p>
                    </div>
                    <button
                      onClick={() => updateSettings({ highContrast: !settings.highContrast })}
                      className={`w-12 h-6 rounded-full transition-all duration-300 ${
                        settings.highContrast ? 'bg-y2k-cyan' : 'bg-y2k-bg-medium border border-y2k-cyan/50'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-y2k-white rounded-full transition-transform duration-300 ${
                        settings.highContrast ? 'translate-x-7' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  {/* Font Size */}
                  <div className="p-4 bg-y2k-bg-dark rounded border border-y2k-cyan/30">
                    <h3 className="font-vt323 text-lg text-y2k-white mb-3">FONT.SIZE</h3>
                    <div className="flex space-x-2">
                      {(['small', 'medium', 'large'] as const).map((size) => (
                        <button
                          key={size}
                          onClick={() => updateSettings({ fontSize: size })}
                          className={`px-4 py-2 rounded font-vt323 transition-all duration-300 ${
                            settings.fontSize === size
                              ? 'bg-y2k-cyan text-y2k-black'
                              : 'bg-y2k-bg-medium text-y2k-cyan border border-y2k-cyan/50 hover:bg-y2k-bg-light'
                          }`}
                        >
                          {size.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-6">
              <div className="panel-y2k p-6">
                <h2 className="text-2xl font-vt323 text-y2k-cyan mb-4">PERFORMANCE.SETTINGS</h2>
                
                <div className="space-y-6">
                  {/* Sound Effects */}
                  <div className="flex items-center justify-between p-4 bg-y2k-bg-dark rounded border border-y2k-cyan/30">
                    <div className="flex items-center space-x-3">
                      {settings.soundEffects ? (
                        <Volume2 className="w-6 h-6 text-y2k-cyan" />
                      ) : (
                        <VolumeX className="w-6 h-6 text-y2k-cyan/50" />
                      )}
                      <div>
                        <h3 className="font-vt323 text-lg text-y2k-white">SOUND.EFFECTS</h3>
                        <p className="text-sm text-y2k-cyan/70 font-tahoma">Enable audio feedback and effects</p>
                      </div>
                    </div>
                    <button
                      onClick={() => updateSettings({ soundEffects: !settings.soundEffects })}
                      className={`w-12 h-6 rounded-full transition-all duration-300 ${
                        settings.soundEffects ? 'bg-y2k-cyan' : 'bg-y2k-bg-medium border border-y2k-cyan/50'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-y2k-white rounded-full transition-transform duration-300 ${
                        settings.soundEffects ? 'translate-x-7' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  {/* Performance Info */}
                  <div className="p-4 bg-y2k-bg-dark rounded border border-y2k-cyan/30">
                    <div className="flex items-center space-x-3 mb-3">
                      <Info className="w-6 h-6 text-y2k-yellow" />
                      <h3 className="font-vt323 text-lg text-y2k-white">SYSTEM.INFO</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm font-vt323">
                      <div>
                        <span className="text-y2k-cyan">THEME.EFFECTS:</span>
                        <span className="text-y2k-white ml-2">
                          {Object.values(currentTheme.effects).filter(Boolean).length}/5
                        </span>
                      </div>
                      <div>
                        <span className="text-y2k-cyan">ANIMATIONS:</span>
                        <span className="text-y2k-white ml-2">
                          {settings.reducedMotion ? 'DISABLED' : 'ENABLED'}
                        </span>
                      </div>
                      <div>
                        <span className="text-y2k-cyan">FONT.SIZE:</span>
                        <span className="text-y2k-white ml-2">{settings.fontSize.toUpperCase()}</span>
                      </div>
                      <div>
                        <span className="text-y2k-cyan">CONTRAST:</span>
                        <span className="text-y2k-white ml-2">
                          {settings.highContrast ? 'HIGH' : 'NORMAL'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-6">
              <div className="panel-y2k p-6">
                <h2 className="text-2xl font-vt323 text-y2k-cyan mb-4">DATA.MANAGEMENT</h2>
                
                <div className="space-y-4">
                  {/* Export Settings */}
                  <button
                    onClick={handleExportSettings}
                    className="w-full flex items-center justify-center space-x-3 p-4 bg-y2k-bg-dark rounded border border-y2k-cyan/30 hover:border-y2k-cyan hover:shadow-cyan-glow transition-all duration-300"
                  >
                    <Download className="w-5 h-5 text-y2k-cyan" />
                    <span className="font-vt323 text-y2k-white">EXPORT.SETTINGS</span>
                  </button>

                  {/* Import Settings */}
                  <label className="w-full flex items-center justify-center space-x-3 p-4 bg-y2k-bg-dark rounded border border-y2k-cyan/30 hover:border-y2k-cyan hover:shadow-cyan-glow transition-all duration-300 cursor-pointer">
                    <Upload className="w-5 h-5 text-y2k-cyan" />
                    <span className="font-vt323 text-y2k-white">IMPORT.SETTINGS</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportSettings}
                      className="hidden"
                    />
                  </label>

                  {/* Reset Settings */}
                  <button
                    onClick={handleResetSettings}
                    className={`w-full flex items-center justify-center space-x-3 p-4 rounded border transition-all duration-300 ${
                      showResetConfirm
                        ? 'bg-y2k-red/20 border-y2k-red text-y2k-red animate-pulse'
                        : 'bg-y2k-bg-dark border-y2k-cyan/30 hover:border-y2k-red hover:text-y2k-red'
                    }`}
                  >
                    {showResetConfirm ? (
                      <Trash2 className="w-5 h-5" />
                    ) : (
                      <RotateCcw className="w-5 h-5" />
                    )}
                    <span className="font-vt323">
                      {showResetConfirm ? 'CONFIRM.RESET' : 'RESET.TO.DEFAULTS'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage;
