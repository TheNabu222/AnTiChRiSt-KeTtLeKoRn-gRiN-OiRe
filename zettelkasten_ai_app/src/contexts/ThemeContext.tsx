
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Theme {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    border: string;
  };
  fonts: {
    primary: string;
    secondary: string;
    mono: string;
  };
  effects: {
    glow: boolean;
    animations: boolean;
    scanlines: boolean;
    matrixRain: boolean;
    glitch: boolean;
  };
}

export const themes: Record<string, Theme> = {
  y2k: {
    id: 'y2k',
    name: 'Y2K Classic',
    description: 'Original retro-futuristic aesthetic with neon colors and cyber effects',
    colors: {
      primary: '#f312af',
      secondary: '#00ffcc',
      accent: '#fffb01',
      background: '#000000',
      surface: '#1a1a1a',
      text: '#ffffff',
      border: '#00ffcc',
    },
    fonts: {
      primary: 'VT323',
      secondary: 'Tahoma',
      mono: 'VT323',
    },
    effects: {
      glow: true,
      animations: true,
      scanlines: true,
      matrixRain: true,
      glitch: true,
    },
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk 2077',
    description: 'Dark cyberpunk theme with electric blues and hot pinks',
    colors: {
      primary: '#ff0080',
      secondary: '#00d4ff',
      accent: '#ffff00',
      background: '#0a0a0a',
      surface: '#1a1a2e',
      text: '#eee',
      border: '#00d4ff',
    },
    fonts: {
      primary: 'VT323',
      secondary: 'Tahoma',
      mono: 'VT323',
    },
    effects: {
      glow: true,
      animations: true,
      scanlines: true,
      matrixRain: false,
      glitch: true,
    },
  },
  matrix: {
    id: 'matrix',
    name: 'Matrix Green',
    description: 'Classic Matrix movie aesthetic with green on black',
    colors: {
      primary: '#00ff00',
      secondary: '#008000',
      accent: '#80ff80',
      background: '#000000',
      surface: '#001100',
      text: '#00ff00',
      border: '#008000',
    },
    fonts: {
      primary: 'VT323',
      secondary: 'VT323',
      mono: 'VT323',
    },
    effects: {
      glow: true,
      animations: true,
      scanlines: false,
      matrixRain: true,
      glitch: false,
    },
  },
  synthwave: {
    id: 'synthwave',
    name: 'Synthwave',
    description: 'Retro 80s synthwave with purple and pink gradients',
    colors: {
      primary: '#ff00ff',
      secondary: '#8000ff',
      accent: '#ff8000',
      background: '#1a0033',
      surface: '#2d0066',
      text: '#ffffff',
      border: '#ff00ff',
    },
    fonts: {
      primary: 'VT323',
      secondary: 'Tahoma',
      mono: 'VT323',
    },
    effects: {
      glow: true,
      animations: true,
      scanlines: true,
      matrixRain: false,
      glitch: false,
    },
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal Dark',
    description: 'Clean minimal theme with reduced effects for better performance',
    colors: {
      primary: '#ffffff',
      secondary: '#888888',
      accent: '#00ffcc',
      background: '#000000',
      surface: '#111111',
      text: '#ffffff',
      border: '#333333',
    },
    fonts: {
      primary: 'Tahoma',
      secondary: 'Tahoma',
      mono: 'VT323',
    },
    effects: {
      glow: false,
      animations: false,
      scanlines: false,
      matrixRain: false,
      glitch: false,
    },
  },
  neon: {
    id: 'neon',
    name: 'Neon City',
    description: 'Bright neon colors with maximum glow effects',
    colors: {
      primary: '#ff0080',
      secondary: '#00ff80',
      accent: '#8000ff',
      background: '#000000',
      surface: '#0a0a0a',
      text: '#ffffff',
      border: '#ff0080',
    },
    fonts: {
      primary: 'VT323',
      secondary: 'Tahoma',
      mono: 'VT323',
    },
    effects: {
      glow: true,
      animations: true,
      scanlines: true,
      matrixRain: true,
      glitch: true,
    },
  },
};

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (themeId: string) => void;
  availableThemes: Theme[];
  settings: {
    reducedMotion: boolean;
    highContrast: boolean;
    fontSize: 'small' | 'medium' | 'large';
    soundEffects: boolean;
  };
  updateSettings: (settings: Partial<ThemeContextType['settings']>) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes.y2k);
  const [settings, setSettings] = useState<{
    reducedMotion: boolean;
    highContrast: boolean;
    fontSize: 'small' | 'medium' | 'large';
    soundEffects: boolean;
  }>({
    reducedMotion: false,
    highContrast: false,
    fontSize: 'medium',
    soundEffects: true,
  });

  // Load theme and settings from localStorage on mount
  useEffect(() => {
    const savedThemeId = localStorage.getItem('zettelkasten-theme');
    const savedSettings = localStorage.getItem('zettelkasten-settings');
    
    if (savedThemeId && themes[savedThemeId]) {
      setCurrentTheme(themes[savedThemeId]);
    }
    
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsedSettings }));
      } catch (error) {
        console.warn('Failed to parse saved settings:', error);
      }
    }

    // Check for system preference for reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setSettings(prev => ({ ...prev, reducedMotion: true }));
    }
  }, []);

  // Apply theme to document root
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply CSS custom properties
    root.style.setProperty('--theme-primary', currentTheme.colors.primary);
    root.style.setProperty('--theme-secondary', currentTheme.colors.secondary);
    root.style.setProperty('--theme-accent', currentTheme.colors.accent);
    root.style.setProperty('--theme-background', currentTheme.colors.background);
    root.style.setProperty('--theme-surface', currentTheme.colors.surface);
    root.style.setProperty('--theme-text', currentTheme.colors.text);
    root.style.setProperty('--theme-border', currentTheme.colors.border);
    
    // Apply theme class to body
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${currentTheme.id}`);
    
    // Apply settings classes
    if (settings.reducedMotion || !currentTheme.effects.animations) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }
    
    if (settings.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    
    document.body.classList.remove('font-small', 'font-medium', 'font-large');
    document.body.classList.add(`font-${settings.fontSize}`);
    
    // Apply effect classes
    if (currentTheme.effects.matrixRain && !settings.reducedMotion) {
      document.body.classList.add('matrix-mode');
    } else {
      document.body.classList.remove('matrix-mode');
    }
    
    if (currentTheme.effects.scanlines && !settings.reducedMotion) {
      document.body.classList.add('scanlines-active');
    } else {
      document.body.classList.remove('scanlines-active');
    }
  }, [currentTheme, settings]);

  const setTheme = (themeId: string) => {
    if (themes[themeId]) {
      setCurrentTheme(themes[themeId]);
      localStorage.setItem('zettelkasten-theme', themeId);
    }
  };

  const updateSettings = (newSettings: Partial<ThemeContextType['settings']>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('zettelkasten-settings', JSON.stringify(updated));
      return updated;
    });
  };

  const value: ThemeContextType = {
    currentTheme,
    setTheme,
    availableThemes: Object.values(themes),
    settings,
    updateSettings,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
