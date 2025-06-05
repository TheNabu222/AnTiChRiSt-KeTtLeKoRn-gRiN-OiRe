
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Search, 
  Brain, 
  Zap, 
  Network, 
  Shield, 
  Sparkles, 
  Terminal, 
  HelpCircle, 
  BookOpen, 
  Play,
  Cpu,
  Wifi,
  Battery,
  Volume2,
  Settings,
  Palette
} from 'lucide-react';
import { useHelp } from '../contexts/HelpContext';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  rainbowMode?: boolean;
}

const Header: React.FC<HeaderProps> = ({ rainbowMode = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const location = useLocation();
  const navigate = useNavigate();
  const { showOnboarding } = useHelp();
  const { currentTheme, setTheme, availableThemes } = useTheme();
  
  const toolsRef = useRef<HTMLDivElement>(null);
  const helpRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);

  // Update time every second for Y2K digital clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolsRef.current && !toolsRef.current.contains(event.target as Node)) {
        setIsToolsOpen(false);
      }
      if (helpRef.current && !helpRef.current.contains(event.target as Node)) {
        setIsHelpOpen(false);
      }
      if (themeRef.current && !themeRef.current.contains(event.target as Node)) {
        setIsThemeOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const toolsItems = [
    { to: '/ai-chat', icon: Brain, label: 'AI Chat Matrix', description: 'Neural Interface' },
    { to: '/cross-reference', icon: Network, label: 'Cross-Reference', description: 'Data Web' },
    { to: '/conspiracy-pinboard', icon: Network, label: 'Conspiracy Board', description: 'Neural Pinboard' },
    { to: '/bloom-compliance', icon: Shield, label: 'Bloom Compliance', description: 'Ethics Core' },
    { to: '/gliotic-lesion', icon: Zap, label: 'Gliotic Lesion', description: 'Brain Mapper' },
    { to: '/mycorrhizal-network', icon: Sparkles, label: 'Mycorrhizal Net', description: 'Bio Network' },
    { to: '/resistance-protocol', icon: Terminal, label: 'Resistance Proto', description: 'Hack System' },
    { to: '/sacred-clown', icon: Sparkles, label: 'Sacred Clown', description: 'Chaos Engine' },
    { to: '/oracle-system', icon: Brain, label: 'Oracle System', description: 'Future Sight' },
    { to: '/terminal-graphics', icon: Terminal, label: 'Terminal GFX', description: 'Retro Console' },
  ];

  return (
    <header className={`sticky top-0 z-50 ${rainbowMode ? 'rainbow-bg' : 'bg-y2k-bg-dark/90'} backdrop-blur-md border-b-2 border-y2k-cyan shadow-cyan-glow`}>
      {/* Top Status Bar */}
      <div className="bg-y2k-bg-medium border-b border-y2k-cyan/30 px-4 py-1">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-xs font-vt323">
          <div className="flex items-center space-x-4 text-y2k-cyan">
            <span className="flex items-center space-x-1">
              <Cpu className="w-3 h-3" />
              <span>CPU: 99%</span>
            </span>
            <span className="flex items-center space-x-1">
              <Wifi className="w-3 h-3" />
              <span>NET: ONLINE</span>
            </span>
            <span className="flex items-center space-x-1">
              <Battery className="w-3 h-3" />
              <span>PWR: ∞</span>
            </span>
            <span className="flex items-center space-x-1">
              <Volume2 className="w-3 h-3" />
              <span>SND: ON</span>
            </span>
          </div>
          <div className="flex items-center space-x-4 text-y2k-magenta">
            <span>{formatDate(currentTime)}</span>
            <span className="animate-pulse">{formatTime(currentTime)}</span>
            <span>Y2K.SYSTEM.ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className={`flex items-center space-x-3 group ${rainbowMode ? 'rainbow-text' : ''}`}
          >
            <div className="relative">
              <Brain className="w-8 h-8 text-y2k-magenta group-hover:animate-glitch transition-all duration-300" />
              <div className="absolute inset-0 bg-y2k-cyan/20 rounded-full animate-pulse-glow" />
            </div>
            <div>
              <h1 className="text-2xl font-vt323 font-bold text-y2k-magenta group-hover:text-shadow-y2k transition-all duration-300">
                ZETTELKASTEN.AI
              </h1>
              <div className="text-xs font-vt323 text-y2k-cyan uppercase tracking-wider">
                CONSCIOUSNESS.EXPLORER.2345
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`nav-item ${location.pathname === '/' ? 'active' : ''} ${rainbowMode ? 'rainbow-text' : ''}`}
            >
              DASHBOARD
            </Link>
            
            <Link 
              to="/zettel-manager" 
              className={`nav-item ${location.pathname === '/zettel-manager' ? 'active' : ''} ${rainbowMode ? 'rainbow-text' : ''}`}
            >
              ZETTEL.MGR
            </Link>

            {/* Tools Dropdown */}
            <div className="relative" ref={toolsRef}>
              <button
                onClick={() => setIsToolsOpen(!isToolsOpen)}
                className={`nav-item flex items-center space-x-1 ${rainbowMode ? 'rainbow-text' : ''}`}
              >
                <span>TOOLS</span>
                <Zap className="w-4 h-4" />
              </button>
              
              {isToolsOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 panel-y2k p-4 animate-pulse-glow">
                  <div className="grid grid-cols-2 gap-3">
                    {toolsItems.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setIsToolsOpen(false)}
                        className="group p-3 bg-y2k-bg-dark rounded border border-y2k-cyan/30 hover:border-y2k-magenta hover:shadow-cyan-glow transition-all duration-300"
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          <item.icon className="w-4 h-4 text-y2k-cyan group-hover:text-y2k-magenta" />
                          <span className="font-vt323 text-sm text-y2k-white group-hover:text-y2k-magenta">
                            {item.label}
                          </span>
                        </div>
                        <div className="text-xs text-y2k-cyan/70 font-tahoma">
                          {item.description}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Google Integration */}
            <Link 
              to="/google-integration" 
              className={`btn-y2k px-3 py-1 text-sm ${rainbowMode ? 'rainbow-text' : ''}`}
            >
              GOOGLE.API
            </Link>

            {/* AI Insights */}
            <Link 
              to="/ai-insights" 
              className={`btn-kasten-3 px-3 py-1 text-sm font-vt323 border-2 rounded transition-all duration-300 hover:scale-105 ${rainbowMode ? 'rainbow-text' : ''}`}
            >
              AI.INSIGHTS
            </Link>

            {/* Theme Switcher */}
            <div className="relative" ref={themeRef}>
              <button
                onClick={() => setIsThemeOpen(!isThemeOpen)}
                className={`nav-item flex items-center space-x-1 ${rainbowMode ? 'rainbow-text' : ''}`}
              >
                <Palette className="w-4 h-4" />
                <span>THEME</span>
              </button>
              
              {isThemeOpen && (
                <div className="absolute top-full right-0 mt-2 w-72 panel-y2k p-4 animate-pulse-glow">
                  <div className="space-y-2">
                    <div className="font-vt323 text-y2k-yellow mb-3 uppercase tracking-wider">VISUAL.THEMES</div>
                    {availableThemes.slice(0, 4).map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => {
                          setTheme(theme.id);
                          setIsThemeOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded border transition-all duration-300 ${
                          currentTheme.id === theme.id
                            ? 'border-y2k-magenta bg-y2k-bg-light text-y2k-magenta'
                            : 'border-y2k-cyan/30 bg-y2k-bg-dark text-y2k-white hover:border-y2k-cyan hover:shadow-cyan-glow'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-4 h-4 rounded border border-y2k-white/20"
                            style={{ backgroundColor: theme.colors.primary }}
                          />
                          <span className="font-vt323 text-sm">{theme.name}</span>
                        </div>
                        {currentTheme.id === theme.id && (
                          <div className="w-2 h-2 bg-y2k-magenta rounded-full animate-pulse" />
                        )}
                      </button>
                    ))}
                    <Link
                      to="/settings"
                      onClick={() => setIsThemeOpen(false)}
                      className="w-full flex items-center justify-center space-x-2 p-2 mt-3 bg-y2k-bg-dark rounded border border-y2k-cyan/30 hover:border-y2k-cyan hover:shadow-cyan-glow transition-all duration-300"
                    >
                      <Settings className="w-4 h-4 text-y2k-cyan" />
                      <span className="font-vt323 text-y2k-white">MORE.SETTINGS</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Help Dropdown */}
            <div className="relative" ref={helpRef}>
              <button
                onClick={() => setIsHelpOpen(!isHelpOpen)}
                className={`nav-item flex items-center space-x-1 ${rainbowMode ? 'rainbow-text' : ''}`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>HELP</span>
              </button>
              
              {isHelpOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 panel-y2k p-4 animate-pulse-glow">
                  <div className="space-y-3">
                    <Link
                      to="/guide"
                      onClick={() => setIsHelpOpen(false)}
                      className="flex items-center space-x-2 p-2 bg-y2k-bg-dark rounded border border-y2k-cyan/30 hover:border-y2k-magenta hover:shadow-cyan-glow transition-all duration-300"
                    >
                      <BookOpen className="w-4 h-4 text-y2k-cyan" />
                      <span className="font-vt323 text-y2k-white">USER.GUIDE</span>
                    </Link>
                    <button
                      onClick={() => {
                        showOnboarding();
                        setIsHelpOpen(false);
                      }}
                      className="w-full flex items-center space-x-2 p-2 bg-y2k-bg-dark rounded border border-y2k-cyan/30 hover:border-y2k-magenta hover:shadow-cyan-glow transition-all duration-300"
                    >
                      <Play className="w-4 h-4 text-y2k-cyan" />
                      <span className="font-vt323 text-y2k-white">START.TOUR</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH.NEURAL.NET..."
                className="input-y2k pl-10 pr-4 py-2 w-64 rounded font-vt323 text-sm"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-y2k-cyan" />
            </div>
          </form>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-y2k-cyan hover:text-y2k-magenta transition-colors duration-300"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden panel-y2k m-4 p-4 animate-pulse-glow">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH.NEURAL.NET..."
                className="input-y2k pl-10 pr-4 py-2 w-full rounded font-vt323"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-y2k-cyan" />
            </div>
          </form>

          {/* Mobile Navigation */}
          <nav className="space-y-4">
            <Link 
              to="/" 
              onClick={() => setIsMenuOpen(false)}
              className={`block nav-item ${location.pathname === '/' ? 'active' : ''}`}
            >
              DASHBOARD
            </Link>
            
            <Link 
              to="/zettel-manager" 
              onClick={() => setIsMenuOpen(false)}
              className={`block nav-item ${location.pathname === '/zettel-manager' ? 'active' : ''}`}
            >
              ZETTEL.MANAGER
            </Link>

            <div className="border-t border-y2k-cyan/30 pt-4">
              <div className="font-vt323 text-y2k-yellow mb-3 uppercase tracking-wider">TOOLS.MATRIX</div>
              <div className="grid grid-cols-2 gap-3">
                {toolsItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsMenuOpen(false)}
                    className="group p-3 bg-y2k-bg-dark rounded border border-y2k-cyan/30 hover:border-y2k-magenta hover:shadow-cyan-glow transition-all duration-300"
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <item.icon className="w-4 h-4 text-y2k-cyan group-hover:text-y2k-magenta" />
                      <span className="font-vt323 text-xs text-y2k-white group-hover:text-y2k-magenta">
                        {item.label}
                      </span>
                    </div>
                    <div className="text-xs text-y2k-cyan/70 font-tahoma">
                      {item.description}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-t border-y2k-cyan/30 pt-4 space-y-3">
              <Link 
                to="/google-integration" 
                onClick={() => setIsMenuOpen(false)}
                className="block btn-y2k text-center py-2"
              >
                GOOGLE.API.INTEGRATION
              </Link>
              
              <Link 
                to="/ai-insights" 
                onClick={() => setIsMenuOpen(false)}
                className="block btn-kasten-3 text-center py-2"
              >
                AI.INSIGHTS.MATRIX
              </Link>
            </div>

            <div className="border-t border-y2k-cyan/30 pt-4 space-y-3">
              <Link
                to="/settings"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center space-x-2 p-2 bg-y2k-bg-dark rounded border border-y2k-cyan/30 hover:border-y2k-magenta hover:shadow-cyan-glow transition-all duration-300"
              >
                <Settings className="w-4 h-4 text-y2k-cyan" />
                <span className="font-vt323 text-y2k-white">SYSTEM.SETTINGS</span>
              </Link>
              <Link
                to="/guide"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center space-x-2 p-2 bg-y2k-bg-dark rounded border border-y2k-cyan/30 hover:border-y2k-magenta hover:shadow-cyan-glow transition-all duration-300"
              >
                <BookOpen className="w-4 h-4 text-y2k-cyan" />
                <span className="font-vt323 text-y2k-white">USER.GUIDE</span>
              </Link>
              <button
                onClick={() => {
                  showOnboarding();
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center space-x-2 p-2 bg-y2k-bg-dark rounded border border-y2k-cyan/30 hover:border-y2k-magenta hover:shadow-cyan-glow transition-all duration-300"
              >
                <Play className="w-4 h-4 text-y2k-cyan" />
                <span className="font-vt323 text-y2k-white">START.NEURAL.TOUR</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
