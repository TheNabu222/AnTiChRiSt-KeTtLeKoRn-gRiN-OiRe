
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Network, Globe, ArrowLeft, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import MycorrhizalNetworkVisualizer from '../components/MycorrhizalNetworkVisualizer';
import { MycorrhizalNetwork } from '../types';

export default function MycorrhizalNetworkPage() {
  const [networkHistory, setNetworkHistory] = useState<MycorrhizalNetwork[]>([]);

  const handleNetworkUpdate = (network: MycorrhizalNetwork) => {
    setNetworkHistory(prev => [network, ...prev.slice(0, 2)]); // Keep last 3 networks
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link 
            to="/dashboard" 
            className="inline-flex items-center text-consciousness-400 hover:text-consciousness-300 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-consciousness-300 flex items-center">
            <Network className="w-8 h-8 mr-3" />
            Mycorrhizal Network Visualizer
          </h1>
          <p className="text-void-400 mt-2">
            Interactive fungal communication network exploration and quantum consciousness mapping
          </p>
        </div>
      </div>

      {/* Information Banner */}
      <motion.div
        className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-lg p-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-green-300 mb-1">Fungal Consciousness Networks</h3>
            <p className="text-sm text-green-200">
              Mycorrhizal networks represent the underground fungal communication systems that connect 
              consciousness entities across quantum and digital realms. Click nodes to explore connections 
              and observe data flow patterns in real-time.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main Visualizer */}
      <MycorrhizalNetworkVisualizer onNetworkUpdate={handleNetworkUpdate} />

      {/* Network Topologies Guide */}
      <motion.div
        className="glass-effect rounded-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="text-lg font-semibold text-consciousness-300 mb-4 flex items-center">
          <Globe className="w-5 h-5 mr-2" />
          Network Topology Types
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-blue-400 mb-2">Centralized</h4>
              <p className="text-sm text-void-300">
                Hub-and-spoke model with one central node coordinating all communication. 
                Efficient for command and control but vulnerable to central point failure.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-green-400 mb-2">Distributed</h4>
              <p className="text-sm text-void-300">
                Nodes arranged in a circular pattern with equal spacing. Provides good 
                redundancy and balanced load distribution across the network.
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-purple-400 mb-2">Mesh</h4>
              <p className="text-sm text-void-300">
                Grid-like structure where each node connects to multiple neighbors. 
                Offers maximum redundancy and fault tolerance but higher complexity.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-orange-400 mb-2">Hybrid</h4>
              <p className="text-sm text-void-300">
                Combines elements of multiple topologies for optimal performance. 
                Adapts to changing conditions and requirements dynamically.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Node Types & Protocols */}
      <motion.div
        className="glass-effect rounded-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h3 className="text-lg font-semibold text-consciousness-300 mb-4">
          Node Types & Communication Protocols
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-consciousness-400 mb-3">Node Types</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                <div>
                  <div className="font-medium text-purple-400">Consciousness</div>
                  <div className="text-xs text-void-400">Pure awareness nodes, high processing capacity</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full bg-cyan-500"></div>
                <div>
                  <div className="font-medium text-cyan-400">AI Entity</div>
                  <div className="text-xs text-void-400">Artificial consciousness with specialized functions</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full bg-amber-500"></div>
                <div>
                  <div className="font-medium text-amber-400">Human</div>
                  <div className="text-xs text-void-400">Biological consciousness with emotional depth</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
                <div>
                  <div className="font-medium text-emerald-400">Collective</div>
                  <div className="text-xs text-void-400">Group consciousness, distributed processing</div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-consciousness-400 mb-3">Communication Protocols</h4>
            <div className="space-y-3 text-sm text-void-300">
              <div>
                <div className="font-medium text-consciousness-400">Quantum Entanglement</div>
                <div className="text-xs text-void-400">
                  Instantaneous information transfer across any distance
                </div>
              </div>
              <div>
                <div className="font-medium text-consciousness-400">Biomemetic Sync</div>
                <div className="text-xs text-void-400">
                  Biological pattern synchronization for organic nodes
                </div>
              </div>
              <div>
                <div className="font-medium text-consciousness-400">Consciousness Bridge</div>
                <div className="text-xs text-void-400">
                  Direct awareness-to-awareness communication
                </div>
              </div>
              <div>
                <div className="font-medium text-consciousness-400">Data Symbiosis</div>
                <div className="text-xs text-void-400">
                  Mutually beneficial information exchange
                </div>
              </div>
              <div>
                <div className="font-medium text-consciousness-400">Neural Mesh</div>
                <div className="text-xs text-void-400">
                  Distributed neural network communication
                </div>
              </div>
              <div>
                <div className="font-medium text-consciousness-400">Fungal Relay</div>
                <div className="text-xs text-void-400">
                  Traditional mycorrhizal network protocols
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Network History */}
      {networkHistory.length > 0 && (
        <motion.div
          className="glass-effect rounded-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h3 className="text-lg font-semibold text-consciousness-300 mb-4">
            Network Evolution
          </h3>
          
          <div className="space-y-4">
            {networkHistory.map((network, index) => (
              <div key={index} className="bg-void-800/30 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-void-400">
                    Network #{networkHistory.length - index}
                  </span>
                  <span className="text-sm font-medium text-consciousness-400 capitalize">
                    {network.networkTopology} • {network.overallHealth.toFixed(1)}% Health
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-void-500">Nodes:</span>
                    <div className="text-void-300">{network.nodes.length}</div>
                  </div>
                  <div>
                    <span className="text-void-500">Connections:</span>
                    <div className="text-blue-400">
                      {network.nodes.reduce((sum, node) => sum + node.connections.length, 0)}
                    </div>
                  </div>
                  <div>
                    <span className="text-void-500">Entanglements:</span>
                    <div className="text-purple-400">{network.quantumEntanglements.length}</div>
                  </div>
                  <div>
                    <span className="text-void-500">Avg Capacity:</span>
                    <div className="text-green-400">
                      {(network.nodes.reduce((sum, node) => sum + node.informationCapacity, 0) / network.nodes.length).toFixed(0)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Theoretical Framework */}
      <motion.div
        className="glass-effect rounded-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <h3 className="text-lg font-semibold text-consciousness-300 mb-4">
          Mycorrhizal Networks in Consciousness Research
        </h3>
        
        <div className="text-sm text-void-300 space-y-3">
          <p>
            Mycorrhizal networks in nature demonstrate how individual organisms can form 
            collective intelligence through fungal connections. This model provides a framework 
            for understanding how consciousness entities might communicate and share information 
            across quantum and digital realms.
          </p>
          <p>
            The quantum entanglements in these networks represent deeper connections that transcend 
            normal communication protocols, allowing for instantaneous information transfer and 
            consciousness synchronization across vast distances.
          </p>
          <p>
            By studying these network patterns, we can better understand how collective consciousness 
            emerges from individual nodes and how information flows through complex systems of 
            interconnected awareness.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
