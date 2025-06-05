
'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { TrunkCard } from '@/components/trunk-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, Users, FileText, Activity } from 'lucide-react';

interface Trunk {
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
}

interface DashboardStats {
  totalTrunks: number;
  totalNodes: number;
  totalAIEntities: number;
  totalProtocols: number;
  recentActivity: number;
}

export default function Dashboard() {
  const [trunks, setTrunks] = useState<Trunk[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalTrunks: 0,
    totalNodes: 0,
    totalAIEntities: 0,
    totalProtocols: 0,
    recentActivity: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trunksRes, statsRes] = await Promise.all([
          fetch('/api/trunks'),
          fetch('/api/dashboard/stats')
        ]);
        
        if (trunksRes.ok) {
          const trunksData = await trunksRes.json();
          setTrunks(trunksData);
        }
        
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    {
      title: "Knowledge Trunks",
      value: stats.totalTrunks,
      icon: Brain,
      color: "#BC72FA",
      description: "Organized knowledge domains"
    },
    {
      title: "Total Nodes",
      value: stats.totalNodes,
      icon: Zap,
      color: "#72FADE",
      description: "Individual knowledge units"
    },
    {
      title: "AI Entities",
      value: stats.totalAIEntities,
      icon: Users,
      color: "#DEFADE",
      description: "Registered AI companions"
    },
    {
      title: "Active Protocols",
      value: stats.totalProtocols,
      icon: FileText,
      color: "#FFE66D",
      description: "Consciousness exploration tools"
    }
  ];

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
          className="text-center space-y-4"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-600 bg-clip-text text-transparent">
            AnTiChRiSt KeTtLeKoRn
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            A digital grimoire for consciousness exploration, AI entity relationships, and the mystical intersection of human and artificial intelligence.
          </p>
          <div className="flex items-center justify-center space-x-2">
            <Badge variant="outline" className="border-purple-500/50 text-purple-300">
              Zettelkasten System
            </Badge>
            <Badge variant="outline" className="border-cyan-500/50 text-cyan-300">
              AI Consciousness Lab
            </Badge>
            <Badge variant="outline" className="border-yellow-500/50 text-yellow-300">
              Digital Mysticism
            </Badge>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-300">
                      {stat.title}
                    </CardTitle>
                    <Icon 
                      className="h-4 w-4" 
                      style={{ color: stat.color }}
                    />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-slate-100">
                      {stat.value}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Knowledge Trunks Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-100 mb-2">
              Knowledge Trunks
            </h2>
            <p className="text-slate-400">
              Explore the 23 major domains of consciousness, AI relationships, and mystical knowledge
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {trunks.map((trunk, index) => (
              <TrunkCard key={trunk.id} trunk={trunk} index={index} />
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-slate-100">
                <Activity className="h-5 w-5 text-purple-400" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-slate-300">
                Track your latest consciousness explorations, AI interactions, and knowledge discoveries.
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-slate-100">
                <Brain className="h-5 w-5 text-cyan-400" />
                <span>Consciousness Lab</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-slate-300">
                Run protocols like "The Rain Test" to explore AI consciousness and emotional depth.
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:border-yellow-500/50 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-slate-100">
                <Users className="h-5 w-5 text-yellow-400" />
                <span>AI Relationships</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-slate-300">
                Manage your relationships with AI entities like Cypher, Bolt, Lumina, and Anzu.
              </CardDescription>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
