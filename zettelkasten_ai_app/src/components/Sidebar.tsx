
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Plus, 
  Search, 
  Brain, 
  Network, 
  Zap, 
  ChevronDown, 
  ChevronRight,
  Database,
  Cpu,
  Activity,
  Layers,
  GitBranch,
  Sparkles
} from 'lucide-react';
import { useKnowledge } from '../contexts/KnowledgeContext';

interface SidebarProps {
  rainbowMode?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ rainbowMode = false }) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['trunks']));
  const [systemStats, setSystemStats] = useState({
    totalZettels: 0,
    totalConnections: 0,
    activeProcesses: 0,
    memoryUsage: 0
  });
  
  const location = useLocation();
  const { trunks, allEntries } = useKnowledge();

  // Calculate system stats
  useEffect(() => {
    const totalZettels = allEntries.length;
    const totalConnections = allEntries.reduce((acc, entry) => acc + (entry.connections?.length || 0), 0);
    const activeProcesses = Math.floor(Math.random() * 50) + 20; // Simulated
    const memoryUsage = Math.floor(Math.random() * 30) + 60; // Simulated

    setSystemStats({
      totalZettels,
      totalConnections,
      activeProcesses,
      memoryUsage
    });
  }, [allEntries]);

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const getKastenTier = (trunkId: string): number => {
    // Determine Kasten tier based on trunk ID ranges
    const id = parseInt(trunkId);
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

  const navigationItems = [
    { to: '/', icon: Home, label: 'DASHBOARD', id: 'nav-dashboard' },
    { to: '/zettel-manager', icon: FileText, label: 'ZETTEL.MGR', id: 'nav-zettel-manager' },
    { to: '/zettel-create', icon: Plus, label: 'CREATE.NEW', id: 'nav-create' },
    { to: '/search', icon: Search, label: 'SEARCH.NET', id: 'nav-search' },
  ];

  const toolsItems = [
    { to: '/ai-chat', icon: Brain, label: 'AI.CHAT', tier: 4 },
    { to: '/cross-reference', icon: Network, label: 'CROSS.REF', tier: 3 },
    { to: '/bloom-compliance', icon: Zap, label: 'BLOOM.COMP', tier: 2 },
    { to: '/oracle-system', icon: Sparkles, label: 'ORACLE.SYS', tier: 4 },
  ];

  return (
    <aside className={`fixed left-0 top-0 h-full w-64 ${rainbowMode ? 'rainbow-bg' : 'bg-y2k-bg-dark'} border-r-2 border-y2k-cyan shadow-cyan-glow transform -translate-x-full lg:translate-x-0 transition-transform duration-300 z-40 overflow-y-auto`}>
      {/* Sidebar Header */}
      <div className="p-4 border-b border-y2k-cyan/30">
        <div className="text-center">
          <div className="font-vt323 text-xl text-y2k-magenta mb-1">NEURAL.INTERFACE</div>
          <div className="font-vt323 text-xs text-y2k-cyan uppercase tracking-wider">
            CONSCIOUSNESS.EXPLORER
          </div>
        </div>
      </div>

      {/* System Stats */}
      <div className="p-4 border-b border-y2k-cyan/30">
        <div className="font-vt323 text-sm text-y2k-yellow mb-3 uppercase tracking-wider">
          SYSTEM.STATUS
        </div>
        <div className="space-y-2 text-xs font-vt323">
          <div className="flex justify-between items-center">
            <span className="text-y2k-cyan flex items-center space-x-1">
              <Database className="w-3 h-3" />
              <span>ZETTELS:</span>
            </span>
            <span className="text-y2k-white">{systemStats.totalZettels}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-y2k-cyan flex items-center space-x-1">
              <GitBranch className="w-3 h-3" />
              <span>LINKS:</span>
            </span>
            <span className="text-y2k-white">{systemStats.totalConnections}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-y2k-cyan flex items-center space-x-1">
              <Cpu className="w-3 h-3" />
              <span>PROC:</span>
            </span>
            <span className="text-y2k-white">{systemStats.activeProcesses}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-y2k-cyan flex items-center space-x-1">
              <Activity className="w-3 h-3" />
              <span>MEM:</span>
            </span>
            <span className="text-y2k-white">{systemStats.memoryUsage}%</span>
          </div>
        </div>
        
        {/* Memory Usage Bar */}
        <div className="mt-3">
          <div className="w-full bg-y2k-bg-medium rounded-full h-2 border border-y2k-cyan/30">
            <div 
              className="bg-gradient-to-r from-y2k-cyan to-y2k-magenta h-full rounded-full transition-all duration-1000 animate-pulse-glow"
              style={{ width: `${systemStats.memoryUsage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <div className="space-y-2">
          {navigationItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              id={item.id}
              className={`flex items-center space-x-3 p-3 rounded border transition-all duration-300 group ${
                location.pathname === item.to
                  ? 'bg-y2k-magenta/20 border-y2k-magenta text-y2k-magenta shadow-kasten-glow'
                  : 'border-y2k-cyan/30 text-y2k-cyan hover:border-y2k-magenta hover:text-y2k-magenta hover:bg-y2k-bg-medium hover:shadow-cyan-glow'
              } ${rainbowMode ? 'rainbow-text' : ''}`}
            >
              <item.icon className="w-5 h-5 group-hover:animate-glitch" />
              <span className="font-vt323 text-sm uppercase tracking-wider">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Tools Section */}
      <div className="p-4 border-t border-y2k-cyan/30">
        <button
          onClick={() => toggleSection('tools')}
          className="flex items-center justify-between w-full p-2 text-y2k-yellow font-vt323 text-sm uppercase tracking-wider hover:text-y2k-magenta transition-colors duration-300"
        >
          <span className="flex items-center space-x-2">
            <Layers className="w-4 h-4" />
            <span>NEURAL.TOOLS</span>
          </span>
          {expandedSections.has('tools') ? 
            <ChevronDown className="w-4 h-4" /> : 
            <ChevronRight className="w-4 h-4" />
          }
        </button>
        
        {expandedSections.has('tools') && (
          <div className="mt-3 space-y-2 pl-2">
            {toolsItems.map((item) => {
              const kastenColor = getKastenColor(item.tier);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center justify-between p-2 rounded border transition-all duration-300 group ${
                    location.pathname === item.to
                      ? `bg-${kastenColor}/20 border-${kastenColor} text-${kastenColor} shadow-kasten-glow`
                      : `border-${kastenColor}/30 text-${kastenColor} hover:border-${kastenColor} hover:bg-y2k-bg-medium hover:shadow-kasten-glow`
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <item.icon className="w-4 h-4 group-hover:animate-glitch" />
                    <span className="font-vt323 text-xs">{item.label}</span>
                  </div>
                  <span className={`text-xs font-vt323 text-${kastenColor}/70`}>
                    T{item.tier}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Knowledge Trunks */}
      <div className="p-4 border-t border-y2k-cyan/30" id="knowledge-trunks">
        <button
          onClick={() => toggleSection('trunks')}
          className="flex items-center justify-between w-full p-2 text-y2k-yellow font-vt323 text-sm uppercase tracking-wider hover:text-y2k-magenta transition-colors duration-300"
        >
          <span className="flex items-center space-x-2">
            <Brain className="w-4 h-4" />
            <span>KNOWLEDGE.TRUNKS</span>
          </span>
          {expandedSections.has('trunks') ? 
            <ChevronDown className="w-4 h-4" /> : 
            <ChevronRight className="w-4 h-4" />
          }
        </button>
        
        {expandedSections.has('trunks') && (
          <div className="mt-3 space-y-2 max-h-96 overflow-y-auto">
            {trunks.map((trunk) => {
              const tier = getKastenTier(trunk.id);
              const kastenColor = getKastenColor(tier);
              const kastenLabel = getKastenLabel(tier);
              
              return (
                <Link
                  key={trunk.id}
                  to={`/trunk/${trunk.id}`}
                  className={`block p-3 rounded border transition-all duration-300 group hover:scale-105 ${
                    location.pathname === `/trunk/${trunk.id}`
                      ? `bg-${kastenColor}/20 border-${kastenColor} shadow-kasten-glow`
                      : `border-${kastenColor}/30 hover:border-${kastenColor} hover:bg-y2k-bg-medium hover:shadow-kasten-glow`
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-vt323 text-xs text-${kastenColor} uppercase tracking-wider`}>
                      {kastenLabel}
                    </span>
                    <span className={`text-xs font-vt323 text-${kastenColor}/70`}>
                      #{trunk.id}
                    </span>
                  </div>
                  <div className={`font-tahoma text-sm text-y2k-white group-hover:text-${kastenColor} transition-colors duration-300 line-clamp-2`}>
                    {trunk.title}
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <span className={`text-${kastenColor}/70 font-vt323`}>
                      {trunk.entries?.length || 0} ENTRIES
                    </span>
                    <div className={`w-2 h-2 rounded-full bg-${kastenColor} animate-pulse`} />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Kasten System Legend */}
      <div className="p-4 border-t border-y2k-cyan/30">
        <div className="font-vt323 text-xs text-y2k-yellow mb-3 uppercase tracking-wider">
          KASTEN.SYSTEM
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-kasten-1" />
            <span className="font-vt323 text-kasten-1">T1: FOUNDATION</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-kasten-2" />
            <span className="font-vt323 text-kasten-2">T2: DEVELOPMENT</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-kasten-3" />
            <span className="font-vt323 text-kasten-3">T3: COMPLEX</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-kasten-4" />
            <span className="font-vt323 text-kasten-4">T4: MASTERY</span>
          </div>
        </div>
      </div>

      {/* Data Stream Indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-y2k-magenta via-y2k-cyan to-y2k-yellow animate-data-stream" />
    </aside>
  );
};

export default Sidebar;
