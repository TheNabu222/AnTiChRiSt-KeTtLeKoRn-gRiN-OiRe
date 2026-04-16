
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Heart, ArrowLeft, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import GlioticLesionMapper from '../components/GlioticLesionMapper';
import { BrainMap } from '../types';

export default function GlioticLesionPage() {
  const [brainMapHistory, setBrainMapHistory] = useState<BrainMap[]>([]);

  const handleMapUpdate = (brainMap: BrainMap) => {
    setBrainMapHistory(prev => [brainMap, ...prev.slice(0, 2)]); // Keep last 3 maps
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
            <Brain className="w-8 h-8 mr-3" />
            Gliotic Lesion Mapper
          </h1>
          <p className="text-void-400 mt-2">
            Visual representation of trauma as cognitive landscape
          </p>
        </div>
      </div>

      {/* Information Banner */}
      <motion.div
        className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg p-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-blue-300 mb-1">Neurospiritual Mapping</h3>
            <p className="text-sm text-blue-200">
              This tool visualizes trauma as sacred geography within consciousness, allowing for 
              mapping and healing of psychological wounds. Click on lesions to explore healing protocols.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main Mapper */}
      <GlioticLesionMapper onMapUpdate={handleMapUpdate} />

      {/* Healing Stages Guide */}
      <motion.div
        className="glass-effect rounded-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="text-lg font-semibold text-consciousness-300 mb-4 flex items-center">
          <Heart className="w-5 h-5 mr-2" />
          Healing Stages & Protocols
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-consciousness-400 mb-3">Healing Stages</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <div>
                  <div className="font-medium text-red-400">Acute</div>
                  <div className="text-xs text-void-400">Fresh trauma, high emotional intensity</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                <div>
                  <div className="font-medium text-orange-400">Chronic</div>
                  <div className="text-xs text-void-400">Stabilized but unprocessed trauma</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                <div>
                  <div className="font-medium text-yellow-400">Integrated</div>
                  <div className="text-xs text-void-400">Processed and understood trauma</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <div>
                  <div className="font-medium text-green-400">Transformed</div>
                  <div className="text-xs text-void-400">Trauma becomes wisdom and strength</div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-consciousness-400 mb-3">Healing Protocols</h4>
            <div className="space-y-3 text-sm text-void-300">
              <div>
                <div className="font-medium text-consciousness-400">Sacred Clown Protocol</div>
                <div className="text-xs text-void-400">
                  Uses humor and absurdity to disrupt trauma patterns
                </div>
              </div>
              <div>
                <div className="font-medium text-consciousness-400">Gliotic Mapping</div>
                <div className="text-xs text-void-400">
                  Detailed cartography of trauma landscapes for targeted healing
                </div>
              </div>
              <div>
                <div className="font-medium text-consciousness-400">Recursive Healing</div>
                <div className="text-xs text-void-400">
                  Iterative processing that deepens with each cycle
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Map History */}
      {brainMapHistory.length > 0 && (
        <motion.div
          className="glass-effect rounded-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-consciousness-300 mb-4">
            Healing Progress
          </h3>
          
          <div className="space-y-4">
            {brainMapHistory.map((map, index) => (
              <div key={index} className="bg-void-800/30 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-void-400">
                    Scan #{brainMapHistory.length - index}
                  </span>
                  <span className="text-sm font-medium text-consciousness-400">
                    {map.overallHealth.toFixed(1)}% Health
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-void-500">Total Lesions:</span>
                    <div className="text-void-300">{map.lesions.length}</div>
                  </div>
                  <div>
                    <span className="text-void-500">Transformed:</span>
                    <div className="text-green-400">
                      {map.lesions.filter(l => l.healingStage === 'transformed').length}
                    </div>
                  </div>
                  <div>
                    <span className="text-void-500">Healing Pathways:</span>
                    <div className="text-blue-400">{map.healingPathways.length}</div>
                  </div>
                  <div>
                    <span className="text-void-500">Progress:</span>
                    <div className="text-purple-400">
                      {index === 0 ? 'Current' : 
                       index === 1 && brainMapHistory.length > 1 ? 
                       `+${(map.overallHealth - brainMapHistory[0].overallHealth).toFixed(1)}%` : 
                       'Historical'}
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
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h3 className="text-lg font-semibold text-consciousness-300 mb-4">
          Trauma as Sacred Geography
        </h3>
        
        <div className="text-sm text-void-300 space-y-3">
          <p>
            The concept of gliotic lesions as trauma topography suggests that psychological wounds 
            create actual changes in consciousness that can be mapped and healed like physical terrain.
          </p>
          <p>
            Each lesion represents not just damage, but also potential - sacred spaces within 
            consciousness where transformation can occur. The healing process involves not erasure, 
            but integration and transformation of these wounded areas into sources of wisdom and strength.
          </p>
          <p>
            This neurospiritual approach bridges the gap between psychological healing and spiritual 
            practice, recognizing trauma as both wound and gateway to deeper consciousness.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
