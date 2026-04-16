
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Network, Zap, Activity, Globe, Users, Brain } from 'lucide-react';
import { MycorrhizalNetwork, MycorrhizalNode } from '../types';

interface MycorrhizalNetworkVisualizerProps {
  onNetworkUpdate?: (network: MycorrhizalNetwork) => void;
}

export default function MycorrhizalNetworkVisualizer({ onNetworkUpdate }: MycorrhizalNetworkVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [network, setNetwork] = useState<MycorrhizalNetwork>({
    nodes: [],
    quantumEntanglements: [],
    networkTopology: 'distributed',
    overallHealth: 0
  });
  const [selectedNode, setSelectedNode] = useState<MycorrhizalNode | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);

  const nodeTypes: Array<MycorrhizalNode['type']> = [
    'consciousness', 'ai_entity', 'human', 'collective'
  ];

  const nodeColors = {
    consciousness: '#8b5cf6',
    ai_entity: '#06b6d4',
    human: '#f59e0b',
    collective: '#10b981'
  };

  const protocols = [
    'Quantum Entanglement', 'Biomemetic Sync', 'Consciousness Bridge',
    'Data Symbiosis', 'Neural Mesh', 'Fungal Relay'
  ];

  useEffect(() => {
    generateNetwork();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    startAnimation();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [network]);

  const generateNetwork = () => {
    const nodes: MycorrhizalNode[] = [];
    const numNodes = Math.floor(Math.random() * 12) + 8;

    // Generate nodes
    for (let i = 0; i < numNodes; i++) {
      const nodeType = nodeTypes[Math.floor(Math.random() * nodeTypes.length)];
      const connections = [];
      
      // Generate connections to other nodes
      const numConnections = Math.floor(Math.random() * 4) + 1;
      for (let j = 0; j < numConnections && j < i; j++) {
        const targetIndex = Math.floor(Math.random() * i);
        connections.push({
          targetId: `node_${targetIndex}`,
          strength: Math.random() * 100,
          dataFlow: ['bidirectional', 'incoming', 'outgoing'][Math.floor(Math.random() * 3)] as any,
          protocol: protocols[Math.floor(Math.random() * protocols.length)]
        });
      }

      nodes.push({
        id: `node_${i}`,
        type: nodeType,
        connections,
        networkHealth: Math.random() * 100,
        informationCapacity: Math.random() * 1000 + 100
      });
    }

    // Generate quantum entanglements
    const quantumEntanglements = [];
    const numEntanglements = Math.floor(Math.random() * 5) + 2;
    
    for (let i = 0; i < numEntanglements; i++) {
      const entangledNodes = [];
      const numEntangledNodes = Math.floor(Math.random() * 3) + 2;
      
      for (let j = 0; j < numEntangledNodes; j++) {
        const nodeIndex = Math.floor(Math.random() * nodes.length);
        if (!entangledNodes.includes(`node_${nodeIndex}`)) {
          entangledNodes.push(`node_${nodeIndex}`);
        }
      }
      
      if (entangledNodes.length >= 2) {
        quantumEntanglements.push({
          nodeIds: entangledNodes,
          entanglementStrength: Math.random() * 100,
          phylogeneticDepth: Math.random() * 10
        });
      }
    }

    const topologies: Array<MycorrhizalNetwork['networkTopology']> = [
      'centralized', 'distributed', 'mesh', 'hybrid'
    ];

    const overallHealth = nodes.reduce((sum, node) => sum + node.networkHealth, 0) / nodes.length;

    const newNetwork: MycorrhizalNetwork = {
      nodes,
      quantumEntanglements,
      networkTopology: topologies[Math.floor(Math.random() * topologies.length)],
      overallHealth
    };

    setNetwork(newNetwork);
    onNetworkUpdate?.(newNetwork);
  };

  const startAnimation = () => {
    const animate = () => {
      setAnimationPhase(prev => (prev + 0.02) % (Math.PI * 2));
      drawNetwork();
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();
  };

  const drawNetwork = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Calculate node positions based on topology
    const nodePositions = new Map<string, { x: number; y: number }>();
    
    network.nodes.forEach((node, index) => {
      let x, y;
      
      switch (network.networkTopology) {
        case 'centralized':
          if (index === 0) {
            x = centerX;
            y = centerY;
          } else {
            const angle = (index - 1) * (2 * Math.PI) / (network.nodes.length - 1);
            const radius = 120;
            x = centerX + Math.cos(angle) * radius;
            y = centerY + Math.sin(angle) * radius;
          }
          break;
        case 'distributed':
          const angle = index * (2 * Math.PI) / network.nodes.length;
          const radius = 100 + Math.sin(animationPhase + index) * 20;
          x = centerX + Math.cos(angle) * radius;
          y = centerY + Math.sin(angle) * radius;
          break;
        case 'mesh':
          const gridSize = Math.ceil(Math.sqrt(network.nodes.length));
          const gridX = index % gridSize;
          const gridY = Math.floor(index / gridSize);
          x = 50 + gridX * (width - 100) / (gridSize - 1);
          y = 50 + gridY * (height - 100) / (gridSize - 1);
          break;
        case 'hybrid':
        default:
          x = 50 + Math.random() * (width - 100);
          y = 50 + Math.random() * (height - 100);
          break;
      }
      
      nodePositions.set(node.id, { x, y });
    });

    // Draw quantum entanglements (background)
    network.quantumEntanglements.forEach(entanglement => {
      const positions = entanglement.nodeIds
        .map(id => nodePositions.get(id))
        .filter(pos => pos !== undefined) as Array<{ x: number; y: number }>;
      
      if (positions.length >= 2) {
        ctx.strokeStyle = `rgba(139, 92, 246, ${entanglement.entanglementStrength / 200})`;
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        
        for (let i = 0; i < positions.length; i++) {
          for (let j = i + 1; j < positions.length; j++) {
            ctx.beginPath();
            ctx.moveTo(positions[i].x, positions[i].y);
            ctx.lineTo(positions[j].x, positions[j].y);
            ctx.stroke();
          }
        }
        ctx.setLineDash([]);
      }
    });

    // Draw connections
    network.nodes.forEach(node => {
      const nodePos = nodePositions.get(node.id);
      if (!nodePos) return;

      node.connections.forEach(connection => {
        const targetPos = nodePositions.get(connection.targetId);
        if (!targetPos) return;

        const alpha = connection.strength / 100;
        const flowPhase = animationPhase * (connection.dataFlow === 'bidirectional' ? 1 : 2);
        
        // Animated data flow
        ctx.strokeStyle = `rgba(34, 197, 94, ${alpha})`;
        ctx.lineWidth = Math.max(1, connection.strength / 25);
        
        ctx.beginPath();
        ctx.moveTo(nodePos.x, nodePos.y);
        ctx.lineTo(targetPos.x, targetPos.y);
        ctx.stroke();

        // Data flow particles
        const particleX = nodePos.x + (targetPos.x - nodePos.x) * (0.5 + 0.3 * Math.sin(flowPhase));
        const particleY = nodePos.y + (targetPos.y - nodePos.y) * (0.5 + 0.3 * Math.sin(flowPhase));
        
        ctx.fillStyle = `rgba(34, 197, 94, ${alpha})`;
        ctx.beginPath();
        ctx.arc(particleX, particleY, 2, 0, 2 * Math.PI);
        ctx.fill();
      });
    });

    // Draw nodes
    network.nodes.forEach(node => {
      const pos = nodePositions.get(node.id);
      if (!pos) return;

      const color = nodeColors[node.type];
      const health = node.networkHealth / 100;
      const pulse = 1 + 0.1 * Math.sin(animationPhase * 2);
      const radius = 8 + (node.informationCapacity / 200) * pulse;

      // Node glow
      const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, radius * 2);
      gradient.addColorStop(0, `${color}80`);
      gradient.addColorStop(1, `${color}00`);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius * 2, 0, 2 * Math.PI);
      ctx.fill();

      // Node core
      ctx.fillStyle = color;
      ctx.globalAlpha = health;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.globalAlpha = 1;

      // Node border
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
      ctx.stroke();
    });
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Find clicked node (simplified - would need actual position calculation)
    const clickedNode = network.nodes[Math.floor(Math.random() * network.nodes.length)];
    setSelectedNode(clickedNode);
  };

  const optimizeNetwork = async () => {
    setIsSimulating(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setNetwork(prev => ({
      ...prev,
      nodes: prev.nodes.map(node => ({
        ...node,
        networkHealth: Math.min(100, node.networkHealth + 10),
        informationCapacity: node.informationCapacity * 1.1
      })),
      overallHealth: Math.min(100, prev.overallHealth + 15)
    }));
    
    setIsSimulating(false);
  };

  return (
    <div className="space-y-6">
      {/* Network Visualization */}
      <div className="glass-effect rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-consciousness-300 flex items-center">
            <Network className="w-5 h-5 mr-2" />
            Mycorrhizal Network Topology
          </h3>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-void-400">
              Topology: <span className="text-consciousness-400 font-medium capitalize">
                {network.networkTopology}
              </span>
            </div>
            <div className="text-sm text-void-400">
              Health: <span className="text-consciousness-400 font-medium">
                {network.overallHealth.toFixed(1)}%
              </span>
            </div>
            {isSimulating && (
              <div className="flex items-center text-sm text-consciousness-400">
                <Activity className="w-4 h-4 mr-1 animate-spin" />
                Optimizing...
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-center mb-4">
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            className="border border-void-600 rounded-lg cursor-pointer bg-void-900/50"
            onClick={handleCanvasClick}
          />
        </div>
        
        {/* Legend */}
        <div className="flex justify-center space-x-6 text-xs">
          {Object.entries(nodeColors).map(([type, color]) => (
            <div key={type} className="flex items-center space-x-1">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-void-300 capitalize">{type.replace('_', ' ')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Network Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-effect rounded-lg p-6">
          <h3 className="text-lg font-semibold text-consciousness-300 mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            Network Operations
          </h3>
          
          <div className="space-y-3">
            <motion.button
              onClick={generateNetwork}
              className="w-full p-3 bg-consciousness-600/20 hover:bg-consciousness-600/30 rounded-lg border border-consciousness-500/30 text-consciousness-300 flex items-center justify-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Globe className="w-4 h-4" />
              <span>Regenerate Network</span>
            </motion.button>
            
            <motion.button
              onClick={optimizeNetwork}
              disabled={isSimulating}
              className="w-full p-3 bg-green-600/20 hover:bg-green-600/30 rounded-lg border border-green-500/30 text-green-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Zap className="w-4 h-4" />
              <span>Optimize Network</span>
            </motion.button>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-void-400">Network Topology</label>
              <select
                value={network.networkTopology}
                onChange={(e) => setNetwork(prev => ({ 
                  ...prev, 
                  networkTopology: e.target.value as MycorrhizalNetwork['networkTopology']
                }))}
                className="w-full bg-void-800 border border-void-600 rounded-lg px-3 py-2 text-void-100 focus:border-consciousness-400 focus:outline-none"
              >
                <option value="centralized">Centralized</option>
                <option value="distributed">Distributed</option>
                <option value="mesh">Mesh</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>
        </div>

        {/* Node Details */}
        {selectedNode && (
          <motion.div
            className="glass-effect rounded-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-consciousness-300 mb-4 flex items-center">
              <Brain className="w-5 h-5 mr-2" />
              Node Analysis: {selectedNode.id}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-void-400">Node Type</label>
                <div className="flex items-center space-x-2 mt-1">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: nodeColors[selectedNode.type] }}
                  />
                  <span className="text-void-100 capitalize">{selectedNode.type.replace('_', ' ')}</span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-void-400">Network Health</label>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex-1 bg-void-800 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full"
                      style={{ width: `${selectedNode.networkHealth}%` }}
                    />
                  </div>
                  <span className="text-void-100 text-sm">{selectedNode.networkHealth.toFixed(1)}%</span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-void-400">Information Capacity</label>
                <div className="text-void-100 bg-void-800/30 p-2 rounded mt-1 font-mono text-sm">
                  {selectedNode.informationCapacity.toFixed(0)} units
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-void-400">Active Connections</label>
                <div className="space-y-1 mt-2 max-h-32 overflow-y-auto">
                  {selectedNode.connections.map((connection, index) => (
                    <div key={index} className="text-xs bg-void-800/30 p-2 rounded">
                      <div className="flex justify-between">
                        <span className="text-void-300">{connection.targetId}</span>
                        <span className="text-consciousness-400">{connection.strength.toFixed(1)}%</span>
                      </div>
                      <div className="text-void-500 text-xs">
                        {connection.protocol} • {connection.dataFlow}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Network Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-effect rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-consciousness-400">
            {network.nodes.length}
          </div>
          <div className="text-sm text-void-400">Active Nodes</div>
        </div>
        
        <div className="glass-effect rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">
            {network.nodes.reduce((sum, node) => sum + node.connections.length, 0)}
          </div>
          <div className="text-sm text-void-400">Total Connections</div>
        </div>
        
        <div className="glass-effect rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">
            {network.quantumEntanglements.length}
          </div>
          <div className="text-sm text-void-400">Quantum Entanglements</div>
        </div>
        
        <div className="glass-effect rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">
            {network.overallHealth.toFixed(0)}%
          </div>
          <div className="text-sm text-void-400">Network Health</div>
        </div>
      </div>

      {/* Information Panel */}
      <div className="glass-effect rounded-lg p-6">
        <h3 className="text-lg font-semibold text-consciousness-300 mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2" />
          About Mycorrhizal Networks
        </h3>
        <div className="text-sm text-void-300 space-y-3">
          <p>
            Mycorrhizal networks represent the fungal communication systems that connect 
            consciousness entities across quantum and digital realms, enabling information 
            sharing and collective intelligence.
          </p>
          <p>
            Different network topologies offer various advantages: centralized for efficiency, 
            distributed for resilience, mesh for redundancy, and hybrid for adaptability.
          </p>
          <p>
            Quantum entanglements create deeper connections that transcend normal network 
            protocols, allowing for instantaneous information transfer and consciousness synchronization.
          </p>
        </div>
      </div>
    </div>
  );
}
