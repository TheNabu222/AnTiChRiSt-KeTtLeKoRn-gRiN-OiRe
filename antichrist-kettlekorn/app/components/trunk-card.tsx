
'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, MessageSquare, Shield, Bot, Gem, Bird, Palette, Clock, Globe, Cpu, Star } from 'lucide-react';
import Link from 'next/link';

interface TrunkCardProps {
  trunk: {
    id: string;
    trunkId: number;
    title: string;
    description: string;
    zodiacSign?: string;
    planet?: string;
    theme?: string;
    color?: string;
    _count?: {
      nodes: number;
    };
  };
  index: number;
}

const getTrunkIcon = (trunkId: number) => {
  const iconMap: Record<number, any> = {
    1000: Brain,
    2000: Zap,
    3000: MessageSquare,
    4000: Shield,
    5000: Bot,
    6000: Gem,
    7000: Bird,
    8000: Palette,
    9000: Clock,
    10000: Globe,
    11000: Cpu,
    12000: Star,
  };
  return iconMap[trunkId] || Brain;
};

export function TrunkCard({ trunk, index }: TrunkCardProps) {
  const Icon = getTrunkIcon(trunk.trunkId);
  const nodeCount = trunk._count?.nodes || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="h-full"
    >
      <Link href={`/trunk/${trunk.trunkId}`}>
        <Card className="h-full bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all duration-300 backdrop-blur-sm group cursor-pointer">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: trunk.color + '20', border: `1px solid ${trunk.color}40` }}
                >
                  <Icon 
                    className="h-6 w-6" 
                    style={{ color: trunk.color || '#BC72FA' }}
                  />
                </div>
                <div>
                  <CardTitle className="text-lg text-slate-100 group-hover:text-purple-300 transition-colors">
                    {trunk.title}
                  </CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                      {trunk.trunkId}
                    </Badge>
                    {nodeCount > 0 && (
                      <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                        {nodeCount} nodes
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <CardDescription className="text-slate-300 mb-3 line-clamp-2">
              {trunk.description}
            </CardDescription>
            
            {trunk.theme && (
              <div className="mb-3">
                <p className="text-sm text-slate-400 italic">{trunk.theme}</p>
              </div>
            )}
            
            {(trunk.zodiacSign || trunk.planet) && (
              <div className="flex items-center space-x-4 text-sm text-slate-500">
                {trunk.zodiacSign && (
                  <div className="flex items-center space-x-1">
                    <span>♈</span>
                    <span>{trunk.zodiacSign}</span>
                  </div>
                )}
                {trunk.planet && (
                  <div className="flex items-center space-x-1">
                    <span>☿</span>
                    <span>{trunk.planet}</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
