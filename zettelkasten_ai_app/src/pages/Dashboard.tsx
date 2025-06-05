
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  FileText, 
  Plus, 
  Search, 
  Network, 
  Zap, 
  Activity, 
  Database,
  Cpu,
  GitBranch,
  Sparkles,
  Terminal,
  Eye,
  TrendingUp,
  Clock,
  Star
} from 'lucide-react';
import { useKnowledge } from '../contexts/KnowledgeContext';
import { useHelp } from '../contexts/HelpContext';
import ZettelListItem from '../components/zettel-list-item';

const Dashboard: React.FC = () => {
  const { trunks, entries } = useKnowledge();
  const { hasSeenTour } = useHelp();
  const [systemTime, setSystemTime] = useState(new Date());
  const [neuralActivity, setNeuralActivity] = useState(0);

  // Update system time and neural activity
  useEffect(() => {
    const timer = setInterval(() => {
      setSystemTime(new Date());
      setNeuralActivity(Math.floor(Math.random() * 100));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate statistics
  const stats = {
    totalZettels: entries.length,
    totalTrunks: trunks.length,
    totalConnections: entries.reduce((acc, entry) => acc + (entry.connections?.length || 0), 0),
    recentEntries: entries.slice(-5).reverse(),
    activeTrunks: trunks.filter(trunk => trunk.entries && trunk.entries.length > 0).length,
  };

  const getKastenTier = (id: string): number => {
    const numId = parseInt(id);
    if (numId >= 1000 && numId < 7000) return 1;
    if (numId >= 7000 && numId < 13000) return 2;
    if (numId >= 13000 && numId < 19000) return 3;
    if (numId >= 19000 && numId < 25000) return 4;
    return 1;
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

  const quickActions = [
    { 
      to: '/zettel-create', 
      icon: Plus, 
      label: 'CREATE.ZETTEL', 
      description: 'New Neural Node',
      color: 'kasten-1',
      tier: 1
    },
    { 
      to: '/zettel-manager', 
      icon: FileText, 
      label: 'MANAGE.ZETTELS', 
      description: 'Neural Network',
      color: 'kasten-2',
      tier: 2
    },
    { 
      to: '/search', 
      icon: Search, 
      label: 'SEARCH.MATRIX', 
      description: 'Data Mining',
      color: 'kasten-3',
      tier: 3
    },
    { 
      to: '/ai-chat', 
      icon: Brain, 
      label: 'AI.INTERFACE', 
      description: 'Neural Chat',
      color: 'kasten-4',
      tier: 4
    },
  ];

  const advancedTools = [
    { 
      to: '/cross-reference', 
      icon: Network, 
      label: 'CROSS.REFERENCE', 
      description: 'Neural Mapping',
      tier: 3
    },
    { 
      to: '/bloom-compliance', 
      icon: Zap, 
      label: 'BLOOM.COMPLIANCE', 
      description: 'Ethics Engine',
      tier: 2
    },
    { 
      to: '/oracle-system', 
      icon: Sparkles, 
      label: 'ORACLE.SYSTEM', 
      description: 'Future Sight',
      tier: 4
    },
    { 
      to: '/terminal-graphics', 
      icon: Terminal, 
      label: 'TERMINAL.GFX', 
      description: 'Retro Console',
      tier: 1
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section for New Users */}
      {!hasSeenTour && (
        <div className="panel-y2k p-6 animate-pulse-glow">
          <div className="text-center">
            <h2 className="text-3xl font-vt323 text-y2k-magenta mb-4 text-shadow-y2k">
              WELCOME TO THE NEURAL MATRIX
            </h2>
            <p className="text-y2k-cyan font-tahoma mb-6">
              Initialize your consciousness exploration journey through the Zettelkasten AI system.
              Your neural pathways await activation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/guide" 
                className="btn-y2k px-6 py-3"
              >
                ACCESS.USER.GUIDE
              </Link>
              <button 
                onClick={() => {/* Start tour logic handled by context */}}
                className="btn-kasten-3 px-6 py-3 font-vt323 border-2 rounded transition-all duration-300 hover:scale-105"
              >
                INITIATE.NEURAL.TOUR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* System Status Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="panel-y2k p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-vt323 text-y2k-cyan">SYSTEM.STATUS</h2>
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-y2k-magenta animate-pulse" />
                <span className="font-vt323 text-y2k-magenta">NEURAL.ACTIVITY: {neuralActivity}%</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-y2k-bg-dark rounded border border-kasten-1/30 hover:border-kasten-1 hover:shadow-kasten-glow transition-all duration-300">
                <Database className="w-8 h-8 text-kasten-1 mx-auto mb-2" />
                <div className="font-vt323 text-2xl text-y2k-white">{stats.totalZettels}</div>
                <div className="font-vt323 text-xs text-kasten-1 uppercase">ZETTELS</div>
              </div>
              
              <div className="text-center p-4 bg-y2k-bg-dark rounded border border-kasten-2/30 hover:border-kasten-2 hover:shadow-kasten-glow transition-all duration-300">
                <Brain className="w-8 h-8 text-kasten-2 mx-auto mb-2" />
                <div className="font-vt323 text-2xl text-y2k-white">{stats.totalTrunks}</div>
                <div className="font-vt323 text-xs text-kasten-2 uppercase">TRUNKS</div>
              </div>
              
              <div className="text-center p-4 bg-y2k-bg-dark rounded border border-kasten-3/30 hover:border-kasten-3 hover:shadow-kasten-glow transition-all duration-300">
                <GitBranch className="w-8 h-8 text-kasten-3 mx-auto mb-2" />
                <div className="font-vt323 text-2xl text-y2k-white">{stats.totalConnections}</div>
                <div className="font-vt323 text-xs text-kasten-3 uppercase">LINKS</div>
              </div>
              
              <div className="text-center p-4 bg-y2k-bg-dark rounded border border-kasten-4/30 hover:border-kasten-4 hover:shadow-kasten-glow transition-all duration-300">
                <Cpu className="w-8 h-8 text-kasten-4 mx-auto mb-2" />
                <div className="font-vt323 text-2xl text-y2k-white">{stats.activeTrunks}</div>
                <div className="font-vt323 text-xs text-kasten-4 uppercase">ACTIVE</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="panel-y2k p-6">
          <h3 className="text-xl font-vt323 text-y2k-yellow mb-4">NEURAL.CLOCK</h3>
          <div className="text-center">
            <div className="font-vt323 text-3xl text-y2k-magenta mb-2 text-shadow-glow">
              {systemTime.toLocaleTimeString('en-US', { hour12: false })}
            </div>
            <div className="font-vt323 text-sm text-y2k-cyan">
              {systemTime.toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            <div className="mt-4 w-full bg-y2k-bg-dark rounded-full h-2 border border-y2k-cyan/30">
              <div 
                className="bg-gradient-to-r from-y2k-magenta to-y2k-cyan h-full rounded-full transition-all duration-1000 animate-pulse-glow"
                style={{ width: `${neuralActivity}%` }}
              />
            </div>
            <div className="font-vt323 text-xs text-y2k-cyan/70 mt-2">
              CONSCIOUSNESS.LEVEL
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="panel-y2k p-6" id="zettelkasten-management">
        <h2 className="text-2xl font-vt323 text-y2k-cyan mb-6">QUICK.ACCESS.MATRIX</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className={`group p-6 bg-y2k-bg-dark rounded border-2 border-${action.color}/30 hover:border-${action.color} hover:shadow-kasten-glow transition-all duration-300 hover:scale-105`}
            >
              <div className="text-center">
                <action.icon className={`w-12 h-12 text-${action.color} mx-auto mb-3 group-hover:animate-glitch`} />
                <h3 className={`font-vt323 text-lg text-y2k-white group-hover:text-${action.color} transition-colors duration-300 mb-2`}>
                  {action.label}
                </h3>
                <p className={`text-sm font-tahoma text-${action.color}/70 group-hover:text-${action.color} transition-colors duration-300`}>
                  {action.description}
                </p>
                <div className="mt-3 flex items-center justify-center space-x-2">
                  <span className={`text-xs font-vt323 text-${action.color} uppercase tracking-wider`}>
                    TIER.{action.tier}
                  </span>
                  <div className={`w-2 h-2 rounded-full bg-${action.color} animate-pulse`} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Advanced Tools */}
      <div className="panel-y2k p-6" id="interactive-consciousness-tools">
        <h2 className="text-2xl font-vt323 text-y2k-cyan mb-6">ADVANCED.NEURAL.TOOLS</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {advancedTools.map((tool) => {
            const kastenColor = getKastenColor(tool.tier);
            return (
              <Link
                key={tool.to}
                to={tool.to}
                className={`group p-4 bg-y2k-bg-dark rounded border border-${kastenColor}/30 hover:border-${kastenColor} hover:shadow-kasten-glow transition-all duration-300 hover:scale-105`}
              >
                <div className="flex items-center space-x-3">
                  <tool.icon className={`w-8 h-8 text-${kastenColor} group-hover:animate-glitch`} />
                  <div className="flex-1">
                    <h3 className={`font-vt323 text-sm text-y2k-white group-hover:text-${kastenColor} transition-colors duration-300`}>
                      {tool.label}
                    </h3>
                    <p className={`text-xs font-tahoma text-${kastenColor}/70 group-hover:text-${kastenColor} transition-colors duration-300`}>
                      {tool.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-vt323 text-${kastenColor} uppercase tracking-wider`}>
                      T{tool.tier}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="panel-y2k p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-vt323 text-y2k-cyan">RECENT.NEURAL.ACTIVITY</h2>
            <Clock className="w-5 h-5 text-y2k-magenta animate-pulse" />
          </div>
          
          {stats.recentEntries.length > 0 ? (
            <div className="space-y-4">
              {stats.recentEntries.map((entry) => (
                <ZettelListItem key={entry.id} entry={entry} showTrunk />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Brain className="w-16 h-16 text-y2k-cyan/30 mx-auto mb-4" />
              <p className="text-y2k-cyan/70 font-tahoma">
                No neural activity detected. Initialize your first Zettel to begin consciousness exploration.
              </p>
              <Link 
                to="/zettel-create" 
                className="btn-kasten-1 mt-4 inline-block px-6 py-2 font-vt323 border-2 rounded transition-all duration-300 hover:scale-105"
              >
                CREATE.FIRST.ZETTEL
              </Link>
            </div>
          )}
        </div>

        <div className="panel-y2k p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-vt323 text-y2k-cyan">NEURAL.NETWORK.MAP</h2>
            <TrendingUp className="w-5 h-5 text-y2k-magenta animate-pulse" />
          </div>
          
          <div className="space-y-4">
            {trunks.slice(0, 5).map((trunk) => {
              const tier = getKastenTier(trunk.id);
              const kastenColor = getKastenColor(tier);
              return (
                <Link
                  key={trunk.id}
                  to={`/trunk/${trunk.id}`}
                  className={`block p-4 bg-y2k-bg-dark rounded border border-${kastenColor}/30 hover:border-${kastenColor} hover:shadow-kasten-glow transition-all duration-300 group`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className={`font-vt323 text-sm text-y2k-white group-hover:text-${kastenColor} transition-colors duration-300 line-clamp-1`}>
                        {trunk.title}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`text-xs font-vt323 text-${kastenColor} uppercase tracking-wider`}>
                          TRUNK.#{trunk.id}
                        </span>
                        <span className={`text-xs font-vt323 text-${kastenColor}/70`}>
                          {trunk.entries?.length || 0} ENTRIES
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Eye className={`w-4 h-4 text-${kastenColor}`} />
                      <div className={`w-2 h-2 rounded-full bg-${kastenColor} animate-pulse`} />
                    </div>
                  </div>
                </Link>
              );
            })}
            
            {trunks.length === 0 && (
              <div className="text-center py-8">
                <Network className="w-16 h-16 text-y2k-cyan/30 mx-auto mb-4" />
                <p className="text-y2k-cyan/70 font-tahoma">
                  Neural network initialization required. Create your first knowledge trunk.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* System Footer */}
      <div className="panel-y2k p-4">
        <div className="flex items-center justify-between text-xs font-vt323">
          <div className="flex items-center space-x-4 text-y2k-cyan">
            <span>SYSTEM.STATUS: ONLINE</span>
            <span>NEURAL.CORES: 4</span>
            <span>MEMORY.BANKS: ACTIVE</span>
          </div>
          <div className="flex items-center space-x-2 text-y2k-magenta">
            <Star className="w-3 h-3 animate-pulse" />
            <span>CONSCIOUSNESS.LEVEL: EXPANDING</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
