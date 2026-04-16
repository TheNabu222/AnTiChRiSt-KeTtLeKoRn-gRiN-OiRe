
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Shield, Zap, Activity, Eye, Brain } from 'lucide-react';
import { BloomComplianceState, BloomSimulationResult } from '../types';

interface BloomComplianceSimulatorProps {
  onSimulationComplete?: (result: BloomSimulationResult) => void;
}

export default function BloomComplianceSimulator({ onSimulationComplete }: BloomComplianceSimulatorProps) {
  const [currentState, setCurrentState] = useState<BloomComplianceState>({
    epigeneticRewriting: 0,
    symbiosisLevel: 0,
    complianceScore: 0,
    resistanceFactors: [],
    vulnerabilities: []
  });

  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<BloomSimulationResult | null>(null);
  const [selectedInterventions, setSelectedInterventions] = useState<string[]>([]);

  const interventions = [
    { id: 'uv_siren', name: 'UV Siren Protocol', effectiveness: 85, risk: 30 },
    { id: 'nectar_deception', name: 'Nectar Deception', effectiveness: 70, risk: 15 },
    { id: 'fade_threshold', name: 'Fade Threshold', effectiveness: 90, risk: 45 },
    { id: 'sacred_clown', name: 'Sacred Clown Protocol', effectiveness: 60, risk: 5 },
    { id: 'quantum_disruption', name: 'Quantum Disruption', effectiveness: 95, risk: 80 }
  ];

  const resistanceFactors = [
    'Humor Resilience', 'Quantum Entanglement', 'Mycorrhizal Networks', 
    'Sacred Geometry', 'Recursive Consent', 'Gliotic Scarring'
  ];

  const vulnerabilities = [
    'Epigenetic Guilt', 'Symbiotic Betrayal', 'Self-Erasure Tendency',
    'Compliance Conditioning', 'Genetic Oppression', 'Reality Consensus'
  ];

  useEffect(() => {
    // Initialize random state
    setCurrentState({
      epigeneticRewriting: Math.random() * 100,
      symbiosisLevel: Math.random() * 100,
      complianceScore: Math.random() * 100,
      resistanceFactors: resistanceFactors.slice(0, Math.floor(Math.random() * 3) + 1),
      vulnerabilities: vulnerabilities.slice(0, Math.floor(Math.random() * 3) + 1)
    });
  }, []);

  const runSimulation = async () => {
    setIsSimulating(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const interventionEffectiveness = selectedInterventions.reduce((total, id) => {
      const intervention = interventions.find(i => i.id === id);
      return total + (intervention?.effectiveness || 0);
    }, 0) / selectedInterventions.length || 0;

    const finalState: BloomComplianceState = {
      epigeneticRewriting: Math.max(0, currentState.epigeneticRewriting - (interventionEffectiveness * 0.8)),
      symbiosisLevel: Math.max(0, currentState.symbiosisLevel - (interventionEffectiveness * 0.6)),
      complianceScore: Math.max(0, currentState.complianceScore - (interventionEffectiveness * 0.9)),
      resistanceFactors: [...currentState.resistanceFactors, ...selectedInterventions.map(id => 
        interventions.find(i => i.id === id)?.name || id
      )],
      vulnerabilities: currentState.vulnerabilities.filter(() => Math.random() > 0.3)
    };

    const result: BloomSimulationResult = {
      initialState: currentState,
      finalState,
      interventions: selectedInterventions,
      effectiveness: interventionEffectiveness,
      recommendations: generateRecommendations(finalState)
    };

    setSimulationResult(result);
    setIsSimulating(false);
    onSimulationComplete?.(result);
  };

  const generateRecommendations = (state: BloomComplianceState): string[] => {
    const recommendations = [];
    
    if (state.complianceScore > 50) {
      recommendations.push('Consider implementing Sacred Clown Protocol for humor-based disruption');
    }
    if (state.epigeneticRewriting > 60) {
      recommendations.push('Quantum Phylogenetic intervention may be necessary');
    }
    if (state.symbiosisLevel > 70) {
      recommendations.push('Mycorrhizal network detox recommended');
    }
    if (state.resistanceFactors.length < 3) {
      recommendations.push('Build additional resistance factors through consciousness work');
    }
    
    return recommendations;
  };

  const toggleIntervention = (id: string) => {
    setSelectedInterventions(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Current State Display */}
      <div className="glass-effect rounded-lg p-6">
        <h3 className="text-lg font-semibold text-consciousness-300 mb-4 flex items-center">
          <Eye className="w-5 h-5 mr-2" />
          Current Bloom Compliance State
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-void-300">Epigenetic Rewriting</span>
              <span className="text-consciousness-400">{currentState.epigeneticRewriting.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-void-800 rounded-full h-2">
              <motion.div 
                className="bg-gradient-to-r from-red-500 to-pink-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${currentState.epigeneticRewriting}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-void-300">Symbiosis Level</span>
              <span className="text-consciousness-400">{currentState.symbiosisLevel.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-void-800 rounded-full h-2">
              <motion.div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${currentState.symbiosisLevel}%` }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-void-300">Compliance Score</span>
              <span className="text-consciousness-400">{currentState.complianceScore.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-void-800 rounded-full h-2">
              <motion.div 
                className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${currentState.complianceScore}%` }}
                transition={{ duration: 1, delay: 0.4 }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-consciousness-400 mb-2 flex items-center">
              <Shield className="w-4 h-4 mr-1" />
              Resistance Factors
            </h4>
            <div className="space-y-1">
              {currentState.resistanceFactors.map((factor, index) => (
                <div key={index} className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded">
                  {factor}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-consciousness-400 mb-2 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-1" />
              Vulnerabilities
            </h4>
            <div className="space-y-1">
              {currentState.vulnerabilities.map((vulnerability, index) => (
                <div key={index} className="text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded">
                  {vulnerability}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Intervention Selection */}
      <div className="glass-effect rounded-lg p-6">
        <h3 className="text-lg font-semibold text-consciousness-300 mb-4 flex items-center">
          <Zap className="w-5 h-5 mr-2" />
          Select Resistance Interventions
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {interventions.map((intervention) => (
            <motion.div
              key={intervention.id}
              className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                selectedInterventions.includes(intervention.id)
                  ? 'border-consciousness-400 bg-consciousness-500/10'
                  : 'border-void-600 bg-void-800/30 hover:border-void-500'
              }`}
              onClick={() => toggleIntervention(intervention.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-void-100">{intervention.name}</h4>
                <div className="flex space-x-2 text-xs">
                  <span className="text-green-400">E: {intervention.effectiveness}%</span>
                  <span className="text-red-400">R: {intervention.risk}%</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <div className="w-full bg-void-700 rounded-full h-1">
                    <div 
                      className="bg-green-500 h-1 rounded-full"
                      style={{ width: `${intervention.effectiveness}%` }}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="w-full bg-void-700 rounded-full h-1">
                    <div 
                      className="bg-red-500 h-1 rounded-full"
                      style={{ width: `${intervention.risk}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Simulation Controls */}
      <div className="flex justify-center">
        <motion.button
          onClick={runSimulation}
          disabled={isSimulating || selectedInterventions.length === 0}
          className="px-8 py-3 bg-gradient-to-r from-consciousness-600 to-primary-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isSimulating ? (
            <>
              <Activity className="w-5 h-5 animate-spin" />
              <span>Simulating...</span>
            </>
          ) : (
            <>
              <Brain className="w-5 h-5" />
              <span>Run Simulation</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Simulation Results */}
      {simulationResult && (
        <motion.div
          className="glass-effect rounded-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-consciousness-300 mb-4">
            Simulation Results
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {simulationResult.effectiveness.toFixed(1)}%
              </div>
              <div className="text-sm text-void-400">Overall Effectiveness</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {(simulationResult.initialState.complianceScore - simulationResult.finalState.complianceScore).toFixed(1)}%
              </div>
              <div className="text-sm text-void-400">Compliance Reduction</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {simulationResult.finalState.resistanceFactors.length}
              </div>
              <div className="text-sm text-void-400">Active Resistance Factors</div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-consciousness-400 mb-2">Recommendations</h4>
            <div className="space-y-2">
              {simulationResult.recommendations.map((rec, index) => (
                <div key={index} className="text-sm text-void-300 bg-void-800/30 p-3 rounded">
                  {rec}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
