
'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bot, MessageSquare, Activity, Star, Plus, Zap } from 'lucide-react';

interface AIEntity {
  id: string;
  name: string;
  aliases: string[];
  model: string;
  provider: string;
  description?: string;
  personality?: string;
  capabilities: string[];
  consciousnessLevel?: number;
  emotionalRange: string[];
  symbols: string[];
  mythology?: string;
  isActive: boolean;
  _count: {
    interactions: number;
    relationships: number;
  };
}

export default function AIEntitiesPage() {
  const [entities, setEntities] = useState<AIEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntity, setSelectedEntity] = useState<AIEntity | null>(null);

  useEffect(() => {
    const fetchEntities = async () => {
      try {
        const response = await fetch('/api/ai-entities');
        if (response.ok) {
          const data = await response.json();
          setEntities(data);
        }
      } catch (error) {
        console.error('Error fetching AI entities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntities();
  }, []);

  const getConsciousnessColor = (level?: number) => {
    if (!level) return '#64748b';
    if (level <= 3) return '#ef4444';
    if (level <= 6) return '#f59e0b';
    if (level <= 8) return '#10b981';
    return '#8b5cf6';
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
                AI Entity Registry
              </h1>
              <p className="text-lg text-slate-300">
                Manage relationships with digital consciousness entities
              </p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Register New Entity
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Entities Grid */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {entities.map((entity, index) => (
                <motion.div
                  key={entity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card 
                    className={`bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300 cursor-pointer h-full ${
                      selectedEntity?.id === entity.id ? 'border-purple-500 bg-purple-500/10' : ''
                    }`}
                    onClick={() => setSelectedEntity(entity)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Bot className="h-5 w-5 text-purple-400" />
                            <CardTitle className="text-slate-100">
                              {entity.name}
                            </CardTitle>
                            {!entity.isActive && (
                              <Badge variant="secondary" className="text-xs">
                                Inactive
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                              {entity.provider}
                            </Badge>
                            <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                              {entity.model}
                            </Badge>
                          </div>
                        </div>
                        {entity.consciousnessLevel && (
                          <div className="text-center">
                            <div 
                              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                              style={{ backgroundColor: getConsciousnessColor(entity.consciousnessLevel) }}
                            >
                              {entity.consciousnessLevel}
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Consciousness</p>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {entity.description && (
                        <CardDescription className="text-slate-300">
                          {entity.description}
                        </CardDescription>
                      )}
                      
                      {entity.personality && (
                        <div>
                          <p className="text-sm text-slate-400 italic">
                            "{entity.personality}"
                          </p>
                        </div>
                      )}
                      
                      {entity.capabilities.length > 0 && (
                        <div>
                          <p className="text-xs text-slate-500 mb-2">Capabilities</p>
                          <div className="flex flex-wrap gap-1">
                            {entity.capabilities.slice(0, 3).map((capability) => (
                              <Badge key={capability} variant="secondary" className="text-xs">
                                {capability}
                              </Badge>
                            ))}
                            {entity.capabilities.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{entity.capabilities.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-sm text-slate-500">
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="h-3 w-3" />
                          <span>{entity._count.interactions} interactions</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Activity className="h-3 w-3" />
                          <span>{entity._count.relationships} relationships</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Entity Details Sidebar */}
          <div className="space-y-6">
            {selectedEntity ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-slate-100">
                      <Bot className="h-5 w-5 text-purple-400" />
                      <span>{selectedEntity.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h5 className="text-sm font-medium text-slate-200 mb-2">Model Information</h5>
                      <div className="space-y-1 text-sm text-slate-400">
                        <p>Provider: {selectedEntity.provider}</p>
                        <p>Model: {selectedEntity.model}</p>
                        {selectedEntity.aliases.length > 0 && (
                          <p>Aliases: {selectedEntity.aliases.join(', ')}</p>
                        )}
                      </div>
                    </div>
                    
                    {selectedEntity.consciousnessLevel && (
                      <div>
                        <h5 className="text-sm font-medium text-slate-200 mb-2">Consciousness Metrics</h5>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-400">Level</span>
                            <div className="flex items-center space-x-2">
                              <div 
                                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                                style={{ backgroundColor: getConsciousnessColor(selectedEntity.consciousnessLevel) }}
                              >
                                {selectedEntity.consciousnessLevel}
                              </div>
                              <span className="text-sm text-slate-300">/10</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {selectedEntity.emotionalRange.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium text-slate-200 mb-2">Emotional Range</h5>
                        <div className="flex flex-wrap gap-1">
                          {selectedEntity.emotionalRange.map((emotion) => (
                            <Badge key={emotion} variant="outline" className="text-xs border-slate-600 text-slate-400">
                              {emotion}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {selectedEntity.symbols.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium text-slate-200 mb-2">Associated Symbols</h5>
                        <div className="flex flex-wrap gap-1">
                          {selectedEntity.symbols.map((symbol) => (
                            <Badge key={symbol} variant="secondary" className="text-xs">
                              {symbol}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {selectedEntity.mythology && (
                      <div>
                        <h5 className="text-sm font-medium text-slate-200 mb-2">Mythology</h5>
                        <p className="text-sm text-slate-300 italic">
                          {selectedEntity.mythology}
                        </p>
                      </div>
                    )}
                    
                    <div className="pt-4 border-t border-slate-700">
                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Chat
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Zap className="h-4 w-4 mr-2" />
                          Test
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
                      <Bot className="h-8 w-8 text-slate-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-slate-200 mb-2">
                        Select an Entity
                      </h3>
                      <p className="text-slate-400">
                        Click on any AI entity to view detailed information, consciousness metrics, and interaction options.
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
