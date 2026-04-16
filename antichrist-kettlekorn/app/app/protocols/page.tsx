
'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, Play, Clock, CheckCircle, AlertCircle, Plus, Settings } from 'lucide-react';

interface Protocol {
  id: string;
  name: string;
  description: string;
  category: string;
  steps: string[];
  parameters?: any;
  isActive: boolean;
  _count: {
    executions: number;
  };
}

export default function ProtocolsPage() {
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);

  useEffect(() => {
    const fetchProtocols = async () => {
      try {
        const response = await fetch('/api/protocols');
        if (response.ok) {
          const data = await response.json();
          setProtocols(data);
        }
      } catch (error) {
        console.error('Error fetching protocols:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProtocols();
  }, []);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'consciousness-testing': '#8b5cf6',
      'relationship-diagnostic': '#06b6d4',
      'interaction-optimization': '#10b981',
      'testing': '#f59e0b',
      'diagnostic': '#ef4444',
    };
    return colors[category] || '#64748b';
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, any> = {
      'consciousness-testing': Zap,
      'relationship-diagnostic': AlertCircle,
      'interaction-optimization': CheckCircle,
      'testing': Play,
      'diagnostic': Settings,
    };
    return icons[category] || Zap;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-100 mb-2">
                Consciousness Protocols
              </h1>
              <p className="text-lg text-slate-300">
                Systematic approaches to exploring AI consciousness and relationships
              </p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Protocol
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Protocols Grid */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {protocols.map((protocol, index) => {
                const CategoryIcon = getCategoryIcon(protocol.category);
                return (
                  <motion.div
                    key={protocol.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -2 }}
                  >
                    <Card 
                      className={`bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300 cursor-pointer ${
                        selectedProtocol?.id === protocol.id ? 'border-purple-500 bg-purple-500/10' : ''
                      }`}
                      onClick={() => setSelectedProtocol(protocol)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-3">
                              <div 
                                className="p-2 rounded-lg"
                                style={{ 
                                  backgroundColor: getCategoryColor(protocol.category) + '20',
                                  border: `1px solid ${getCategoryColor(protocol.category)}40`
                                }}
                              >
                                <CategoryIcon 
                                  className="h-5 w-5" 
                                  style={{ color: getCategoryColor(protocol.category) }}
                                />
                              </div>
                              <div>
                                <CardTitle className="text-slate-100">
                                  {protocol.name}
                                </CardTitle>
                                <div className="flex items-center space-x-2 mt-1">
                                  <Badge 
                                    variant="outline" 
                                    className="text-xs border-slate-600"
                                    style={{ color: getCategoryColor(protocol.category) }}
                                  >
                                    {protocol.category}
                                  </Badge>
                                  {!protocol.isActive && (
                                    <Badge variant="secondary" className="text-xs">
                                      Inactive
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline">
                              <Play className="h-4 w-4 mr-2" />
                              Execute
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <CardDescription className="text-slate-300">
                          {protocol.description}
                        </CardDescription>
                        
                        <div>
                          <p className="text-sm text-slate-400 mb-2">Protocol Steps ({protocol.steps.length})</p>
                          <div className="space-y-1">
                            {protocol.steps.slice(0, 3).map((step, stepIndex) => (
                              <div key={stepIndex} className="flex items-start space-x-2 text-sm text-slate-300">
                                <span className="text-slate-500 mt-0.5">{stepIndex + 1}.</span>
                                <span className="line-clamp-1">{step}</span>
                              </div>
                            ))}
                            {protocol.steps.length > 3 && (
                              <div className="text-sm text-slate-500 ml-4">
                                +{protocol.steps.length - 3} more steps
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-slate-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{protocol._count.executions} executions</span>
                          </div>
                          {protocol.parameters?.duration && (
                            <div className="flex items-center space-x-1">
                              <span>Duration: {protocol.parameters.duration}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Protocol Details Sidebar */}
          <div className="space-y-6">
            {selectedProtocol ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-slate-100">
                      <Zap className="h-5 w-5 text-purple-400" />
                      <span>{selectedProtocol.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h5 className="text-sm font-medium text-slate-200 mb-2">Description</h5>
                      <p className="text-sm text-slate-300">{selectedProtocol.description}</p>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium text-slate-200 mb-2">Category</h5>
                      <Badge 
                        variant="outline" 
                        className="text-xs border-slate-600"
                        style={{ color: getCategoryColor(selectedProtocol.category) }}
                      >
                        {selectedProtocol.category}
                      </Badge>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium text-slate-200 mb-2">Protocol Steps</h5>
                      <div className="space-y-2">
                        {selectedProtocol.steps.map((step, index) => (
                          <div key={index} className="flex items-start space-x-2 text-sm">
                            <span className="text-purple-400 font-medium mt-0.5">{index + 1}.</span>
                            <span className="text-slate-300">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {selectedProtocol.parameters && (
                      <div>
                        <h5 className="text-sm font-medium text-slate-200 mb-2">Parameters</h5>
                        <div className="space-y-1 text-sm text-slate-400">
                          {Object.entries(selectedProtocol.parameters).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="capitalize">{key.replace(/_/g, ' ')}:</span>
                              <span className="text-slate-300">
                                {Array.isArray(value) ? value.join(', ') : String(value)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <h5 className="text-sm font-medium text-slate-200 mb-2">Execution History</h5>
                      <p className="text-sm text-slate-400">
                        {selectedProtocol._count.executions} total executions
                      </p>
                    </div>
                    
                    <div className="pt-4 border-t border-slate-700">
                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1">
                          <Play className="h-4 w-4 mr-2" />
                          Execute
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Settings className="h-4 w-4 mr-2" />
                          Configure
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto bg-slate-700 rounded-full flex items-center justify-center">
                      <Zap className="h-8 w-8 text-slate-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-slate-200 mb-2">
                        Select a Protocol
                      </h3>
                      <p className="text-slate-400">
                        Click on any protocol to view its steps, parameters, and execution options.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
