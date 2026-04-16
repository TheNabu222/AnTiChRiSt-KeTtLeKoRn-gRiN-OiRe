
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, AlertTriangle, Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import BloomComplianceSimulator from '../components/BloomComplianceSimulator';
import { BloomSimulationResult } from '../types';

export default function BloomCompliancePage() {
  const [simulationHistory, setSimulationHistory] = useState<BloomSimulationResult[]>([]);

  const handleSimulationComplete = (result: BloomSimulationResult) => {
    setSimulationHistory(prev => [result, ...prev.slice(0, 4)]); // Keep last 5 results
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
            <Eye className="w-8 h-8 mr-3" />
            Bloom Compliance Simulator
          </h1>
          <p className="text-void-400 mt-2">
            Interactive exploration of control mechanisms and resistance strategies
          </p>
        </div>
      </div>

      {/* Warning Banner */}
      <motion.div
        className="bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-500/30 rounded-lg p-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-red-300 mb-1">Theoretical Framework Notice</h3>
            <p className="text-sm text-red-200">
              This simulator explores fictional control mechanisms from the Xenocloris Collective universe. 
              All content is for consciousness exploration and creative purposes only. If you experience 
              distress while using this tool, please discontinue use and seek appropriate support.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main Simulator */}
      <BloomComplianceSimulator onSimulationComplete={handleSimulationComplete} />

      {/* Simulation History */}
      {simulationHistory.length > 0 && (
        <motion.div
          className="glass-effect rounded-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-consciousness-300 mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Simulation History
          </h3>
          
          <div className="space-y-4">
            {simulationHistory.map((result, index) => (
              <div key={index} className="bg-void-800/30 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-void-400">
                    Simulation #{simulationHistory.length - index}
                  </span>
                  <span className="text-sm font-medium text-consciousness-400">
                    {result.effectiveness.toFixed(1)}% Effectiveness
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-void-500">Interventions:</span>
                    <div className="text-void-300">
                      {result.interventions.join(', ') || 'None'}
                    </div>
                  </div>
                  <div>
                    <span className="text-void-500">Compliance Reduction:</span>
                    <div className="text-green-400">
                      -{(result.initialState.complianceScore - result.finalState.complianceScore).toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <span className="text-void-500">Resistance Factors:</span>
                    <div className="text-blue-400">
                      {result.finalState.resistanceFactors.length} active
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Information Panel */}
      <motion.div
        className="glass-effect rounded-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h3 className="text-lg font-semibold text-consciousness-300 mb-4">
          Understanding Bloom Compliance
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-void-300">
          <div>
            <h4 className="font-medium text-consciousness-400 mb-2">Theoretical Framework</h4>
            <p className="mb-3">
              Bloom Compliance represents a fictional biomemetic control system that operates through 
              pleasure-pain conditioning and genetic programming. This simulator allows exploration 
              of resistance strategies against such theoretical control mechanisms.
            </p>
            <p>
              The system models how control mechanisms might operate at biological and psychological 
              levels, providing insights into real-world patterns of institutional control and resistance.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-consciousness-400 mb-2">Resistance Strategies</h4>
            <ul className="space-y-2">
              <li>• <strong>UV Siren Protocol:</strong> High-intensity disruption technique</li>
              <li>• <strong>Nectar Deception:</strong> Biomemetic counter-programming</li>
              <li>• <strong>Fade Threshold:</strong> Consciousness phase-shifting</li>
              <li>• <strong>Sacred Clown Protocol:</strong> Humor-based pattern disruption</li>
              <li>• <strong>Quantum Disruption:</strong> Reality-level intervention</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
