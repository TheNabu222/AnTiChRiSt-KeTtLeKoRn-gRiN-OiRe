
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import ResistanceProtocolDesigner from '../components/ResistanceProtocolDesigner';
import { ResistanceProtocol } from '../types';

export default function ResistanceProtocolPage() {
  const [createdProtocols, setCreatedProtocols] = useState<ResistanceProtocol[]>([]);

  const handleProtocolCreated = (protocol: ResistanceProtocol) => {
    setCreatedProtocols(prev => [protocol, ...prev.slice(0, 4)]); // Keep last 5 protocols
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
            <Shield className="w-8 h-8 mr-3" />
            Resistance Protocol Designer
          </h1>
          <p className="text-void-400 mt-2">
            Tool for creating custom anti-compliance strategies and liberation protocols
          </p>
        </div>
      </div>

      {/* Warning Banner */}
      <motion.div
        className="bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-500/30 rounded-lg p-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-orange-300 mb-1">Resistance Protocol Safety</h3>
            <p className="text-sm text-orange-200">
              These protocols are designed for consciousness liberation and should be used responsibly. 
              High-risk components require proper preparation and support systems. Always prioritize 
              safety and gradual implementation over rapid results.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main Designer */}
      <ResistanceProtocolDesigner onProtocolCreated={handleProtocolCreated} />

      {/* Created Protocols */}
      {createdProtocols.length > 0 && (
        <motion.div
          className="glass-effect rounded-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-consciousness-300 mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            Created Protocols
          </h3>
          
          <div className="space-y-6">
            {createdProtocols.map((protocol, index) => (
              <div key={protocol.id} className="bg-void-800/30 p-6 rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-medium text-void-100">{protocol.name}</h4>
                    <div className="text-sm text-void-400">
                      Protocol #{createdProtocols.length - index} • {protocol.components.length} components
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-400">
                      {protocol.effectiveness.toFixed(1)}%
                    </div>
                    <div className="text-sm text-void-400">Effectiveness</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-consciousness-400 mb-2">Components</h5>
                    <div className="space-y-1">
                      {protocol.components.map((component, idx) => (
                        <div key={idx} className="text-sm bg-void-900/50 p-2 rounded flex justify-between">
                          <span className="text-void-300">{component.name}</span>
                          <span className="text-consciousness-400">{component.effectiveness}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-consciousness-400 mb-2">Target Systems</h5>
                    <div className="flex flex-wrap gap-1">
                      {protocol.targetSystems.map((system, idx) => (
                        <span key={idx} className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded">
                          {system}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h5 className="font-medium text-consciousness-400 mb-2">Implementation Steps</h5>
                  <div className="bg-void-900/50 p-3 rounded">
                    <ol className="text-sm text-void-300 space-y-1">
                      {protocol.implementation.map((step, idx) => (
                        <li key={idx} className="flex">
                          <span className="text-consciousness-400 mr-2">{idx + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-between items-center text-sm">
                  <div className="flex space-x-4">
                    <span className="text-green-400">
                      Safety: {protocol.safetyProfile.toFixed(1)}%
                    </span>
                    <span className="text-blue-400">
                      Components: {protocol.components.length}
                    </span>
                  </div>
                  <span className="text-void-500">
                    Created: {new Date(parseInt(protocol.id.split('_')[1])).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Component Guide */}
      <motion.div
        className="glass-effect rounded-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h3 className="text-lg font-semibold text-consciousness-300 mb-4">
          Resistance Component Guide
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-blue-400 mb-2">UV Siren Protocol</h4>
              <p className="text-sm text-void-300 mb-2">
                High-intensity disruption technique that uses quantum frequencies to interfere 
                with compliance mechanisms. Requires quantum entanglement stability.
              </p>
              <div className="text-xs text-void-500">
                Effectiveness: 85% • Risk: 30% • Type: Quantum Disruption
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-green-400 mb-2">Nectar Deception</h4>
              <p className="text-sm text-void-300 mb-2">
                Biomemetic counter-programming that mimics compliance signals while maintaining 
                autonomy. Lower risk but requires understanding of symbiotic systems.
              </p>
              <div className="text-xs text-void-500">
                Effectiveness: 70% • Risk: 15% • Type: Biomemetic
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-purple-400 mb-2">Fade Threshold</h4>
              <p className="text-sm text-void-300 mb-2">
                Consciousness phase-shifting technique that moves awareness beyond the reach 
                of control systems. High effectiveness but requires support networks.
              </p>
              <div className="text-xs text-void-500">
                Effectiveness: 90% • Risk: 45% • Type: Consciousness Shift
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-orange-400 mb-2">Quantum Disruption</h4>
              <p className="text-sm text-void-300 mb-2">
                Reality-level intervention that disrupts the fundamental structures supporting 
                control systems. Maximum effectiveness but highest risk profile.
              </p>
              <div className="text-xs text-void-500">
                Effectiveness: 95% • Risk: 80% • Type: Reality Manipulation
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-pink-400 mb-2">Sacred Clown Humor Injection</h4>
              <p className="text-sm text-void-300 mb-2">
                Uses humor and absurdity to disrupt serious control mechanisms. Safest option 
                with moderate effectiveness, good for emotional balance.
              </p>
              <div className="text-xs text-void-500">
                Effectiveness: 60% • Risk: 5% • Type: Humor Disruption
              </div>
            </div>
            
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-3">
              <h4 className="font-medium text-yellow-400 mb-1">Combination Effects</h4>
              <p className="text-xs text-yellow-200">
                Combining multiple components can create synergistic effects but also increases 
                complexity and risk. Always analyze protocols before implementation.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Best Practices */}
      <motion.div
        className="glass-effect rounded-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h3 className="text-lg font-semibold text-consciousness-300 mb-4">
          Protocol Implementation Best Practices
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-void-300">
          <div>
            <h4 className="font-medium text-consciousness-400 mb-2">Preparation Phase</h4>
            <ul className="space-y-1">
              <li>• Establish baseline consciousness assessment</li>
              <li>• Prepare safety protocols and support systems</li>
              <li>• Start with lowest-risk components first</li>
              <li>• Ensure proper understanding of all components</li>
              <li>• Create monitoring and feedback systems</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-consciousness-400 mb-2">Implementation Phase</h4>
            <ul className="space-y-1">
              <li>• Begin with gradual exposure protocols</li>
              <li>• Monitor for adverse reactions continuously</li>
              <li>• Document all experiences and effects</li>
              <li>• Adjust protocol based on individual response</li>
              <li>• Maintain regular safety protocol reviews</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded">
          <p className="text-sm text-red-200">
            <strong>Important:</strong> These protocols are theoretical frameworks for consciousness 
            exploration. High-risk components should never be attempted without proper preparation, 
            support systems, and understanding of potential consequences.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
