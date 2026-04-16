
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Plus, Trash2, AlertTriangle, CheckCircle, Settings } from 'lucide-react';
import { ResistanceProtocol, ResistanceComponent } from '../types';

interface ResistanceProtocolDesignerProps {
  onProtocolCreated?: (protocol: ResistanceProtocol) => void;
}

export default function ResistanceProtocolDesigner({ onProtocolCreated }: ResistanceProtocolDesignerProps) {
  const [currentProtocol, setCurrentProtocol] = useState<Partial<ResistanceProtocol>>({
    name: '',
    components: [],
    targetSystems: [],
    implementation: [],
    monitoring: []
  });
  
  const [availableComponents] = useState<ResistanceComponent[]>([
    {
      id: 'uv_siren',
      name: 'UV Siren Protocol',
      type: 'uv_siren',
      effectiveness: 85,
      riskLevel: 30,
      requirements: ['Quantum Entanglement', 'Consciousness Stability'],
      contraindications: ['Acute Trauma', 'Reality Dissociation']
    },
    {
      id: 'nectar_deception',
      name: 'Nectar Deception',
      type: 'nectar_deception',
      effectiveness: 70,
      riskLevel: 15,
      requirements: ['Biomemetic Understanding', 'Symbiosis Awareness'],
      contraindications: ['Trust Issues', 'Paranoid Ideation']
    },
    {
      id: 'fade_threshold',
      name: 'Fade Threshold',
      type: 'fade_threshold',
      effectiveness: 90,
      riskLevel: 45,
      requirements: ['Advanced Consciousness Work', 'Support Network'],
      contraindications: ['Suicidal Ideation', 'Severe Depression']
    },
    {
      id: 'quantum_disruption',
      name: 'Quantum Disruption',
      type: 'quantum_disruption',
      effectiveness: 95,
      riskLevel: 80,
      requirements: ['Quantum Physics Knowledge', 'Reality Anchor'],
      contraindications: ['Psychosis', 'Unstable Reality Perception']
    },
    {
      id: 'humor_injection',
      name: 'Sacred Clown Humor Injection',
      type: 'humor_injection',
      effectiveness: 60,
      riskLevel: 5,
      requirements: ['Sense of Humor', 'Emotional Flexibility'],
      contraindications: ['Severe Trauma Processing', 'Grief States']
    }
  ]);

  const [selectedComponent, setSelectedComponent] = useState<ResistanceComponent | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [protocolAnalysis, setProtocolAnalysis] = useState<{
    effectiveness: number;
    safetyProfile: number;
    warnings: string[];
    recommendations: string[];
  } | null>(null);

  const targetSystems = [
    'Bloom Compliance', 'Institutional Control', 'Genetic Programming',
    'Memetic Infection', 'Reality Consensus', 'Consciousness Parasitism',
    'Epigenetic Guilt', 'Symbiotic Betrayal', 'Compliance Conditioning'
  ];

  const addComponent = (component: ResistanceComponent) => {
    if (!currentProtocol.components?.find(c => c.id === component.id)) {
      setCurrentProtocol(prev => ({
        ...prev,
        components: [...(prev.components || []), component]
      }));
    }
  };

  const removeComponent = (componentId: string) => {
    setCurrentProtocol(prev => ({
      ...prev,
      components: prev.components?.filter(c => c.id !== componentId) || []
    }));
  };

  const toggleTargetSystem = (system: string) => {
    setCurrentProtocol(prev => ({
      ...prev,
      targetSystems: prev.targetSystems?.includes(system)
        ? prev.targetSystems.filter(s => s !== system)
        : [...(prev.targetSystems || []), system]
    }));
  };

  const analyzeProtocol = async () => {
    if (!currentProtocol.components?.length) return;
    
    setIsAnalyzing(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const components = currentProtocol.components;
    const avgEffectiveness = components.reduce((sum, c) => sum + c.effectiveness, 0) / components.length;
    const avgRisk = components.reduce((sum, c) => sum + c.riskLevel, 0) / components.length;
    const safetyProfile = Math.max(0, 100 - avgRisk);
    
    const warnings = [];
    const recommendations = [];
    
    // Generate warnings based on component combinations
    if (components.some(c => c.riskLevel > 70)) {
      warnings.push('High-risk components detected. Ensure proper safety protocols.');
    }
    
    if (components.length > 3) {
      warnings.push('Complex protocol may require extended integration period.');
    }
    
    const hasQuantumComponents = components.some(c => c.type === 'quantum_disruption');
    const hasFadeThreshold = components.some(c => c.type === 'fade_threshold');
    
    if (hasQuantumComponents && hasFadeThreshold) {
      warnings.push('Quantum + Fade combination requires reality anchor support.');
    }
    
    // Generate recommendations
    if (avgEffectiveness < 70) {
      recommendations.push('Consider adding higher-effectiveness components.');
    }
    
    if (avgRisk > 50) {
      recommendations.push('Implement gradual introduction protocol.');
    }
    
    if (!components.some(c => c.type === 'humor_injection')) {
      recommendations.push('Consider adding humor injection for emotional balance.');
    }
    
    setProtocolAnalysis({
      effectiveness: avgEffectiveness,
      safetyProfile,
      warnings,
      recommendations
    });
    
    setIsAnalyzing(false);
  };

  const createProtocol = () => {
    if (!currentProtocol.name || !currentProtocol.components?.length) return;
    
    const protocol: ResistanceProtocol = {
      id: `protocol_${Date.now()}`,
      name: currentProtocol.name,
      components: currentProtocol.components,
      targetSystems: currentProtocol.targetSystems || [],
      effectiveness: protocolAnalysis?.effectiveness || 0,
      safetyProfile: protocolAnalysis?.safetyProfile || 0,
      implementation: generateImplementationSteps(),
      monitoring: generateMonitoringSteps()
    };
    
    onProtocolCreated?.(protocol);
    
    // Reset form
    setCurrentProtocol({
      name: '',
      components: [],
      targetSystems: [],
      implementation: [],
      monitoring: []
    });
    setProtocolAnalysis(null);
  };

  const generateImplementationSteps = (): string[] => {
    const steps = [
      'Establish baseline consciousness state assessment',
      'Prepare safety protocols and support systems',
      'Begin with lowest-risk components first'
    ];
    
    if (currentProtocol.components?.some(c => c.riskLevel > 50)) {
      steps.push('Implement gradual exposure protocol');
      steps.push('Monitor for adverse reactions continuously');
    }
    
    steps.push('Document all experiences and effects');
    steps.push('Adjust protocol based on individual response');
    
    return steps;
  };

  const generateMonitoringSteps = (): string[] => {
    return [
      'Daily consciousness stability checks',
      'Weekly effectiveness assessments',
      'Monitor for contraindication symptoms',
      'Track resistance to target systems',
      'Document any unexpected side effects',
      'Regular safety protocol reviews'
    ];
  };

  const getRiskColor = (risk: number) => {
    if (risk < 30) return 'text-green-400';
    if (risk < 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getEffectivenessColor = (effectiveness: number) => {
    if (effectiveness < 40) return 'text-red-400';
    if (effectiveness < 70) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="space-y-6">
      {/* Protocol Configuration */}
      <div className="glass-effect rounded-lg p-6">
        <h3 className="text-lg font-semibold text-consciousness-300 mb-4 flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          Protocol Configuration
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-void-400 mb-2">
              Protocol Name
            </label>
            <input
              type="text"
              value={currentProtocol.name || ''}
              onChange={(e) => setCurrentProtocol(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter protocol name..."
              className="w-full bg-void-800 border border-void-600 rounded-lg px-3 py-2 text-void-100 focus:border-consciousness-400 focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-void-400 mb-2">
              Target Systems
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {targetSystems.map(system => (
                <motion.button
                  key={system}
                  onClick={() => toggleTargetSystem(system)}
                  className={`p-2 text-xs rounded border transition-all duration-200 ${
                    currentProtocol.targetSystems?.includes(system)
                      ? 'border-consciousness-400 bg-consciousness-500/20 text-consciousness-300'
                      : 'border-void-600 bg-void-800/30 text-void-400 hover:border-void-500'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {system}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Component Library */}
      <div className="glass-effect rounded-lg p-6">
        <h3 className="text-lg font-semibold text-consciousness-300 mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          Available Components
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableComponents.map(component => (
            <motion.div
              key={component.id}
              className="border border-void-600 rounded-lg p-4 hover:border-void-500 transition-all duration-200 cursor-pointer"
              onClick={() => setSelectedComponent(component)}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-void-100">{component.name}</h4>
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    addComponent(component);
                  }}
                  className="p-1 bg-consciousness-600/20 hover:bg-consciousness-600/30 rounded text-consciousness-400"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Plus className="w-4 h-4" />
                </motion.button>
              </div>
              
              <div className="flex justify-between text-sm mb-2">
                <span className={`${getEffectivenessColor(component.effectiveness)}`}>
                  Effectiveness: {component.effectiveness}%
                </span>
                <span className={`${getRiskColor(component.riskLevel)}`}>
                  Risk: {component.riskLevel}%
                </span>
              </div>
              
              <div className="flex space-x-2">
                <div className="flex-1">
                  <div className="w-full bg-void-700 rounded-full h-1">
                    <div 
                      className="bg-green-500 h-1 rounded-full"
                      style={{ width: `${component.effectiveness}%` }}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="w-full bg-void-700 rounded-full h-1">
                    <div 
                      className="bg-red-500 h-1 rounded-full"
                      style={{ width: `${component.riskLevel}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Selected Components */}
      {currentProtocol.components && currentProtocol.components.length > 0 && (
        <div className="glass-effect rounded-lg p-6">
          <h3 className="text-lg font-semibold text-consciousness-300 mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            Selected Components
          </h3>
          
          <div className="space-y-3">
            {currentProtocol.components.map(component => (
              <div key={component.id} className="flex items-center justify-between bg-void-800/30 p-3 rounded">
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-void-100">{component.name}</span>
                    <div className="flex space-x-4 text-sm">
                      <span className={getEffectivenessColor(component.effectiveness)}>
                        E: {component.effectiveness}%
                      </span>
                      <span className={getRiskColor(component.riskLevel)}>
                        R: {component.riskLevel}%
                      </span>
                    </div>
                  </div>
                </div>
                <motion.button
                  onClick={() => removeComponent(component.id)}
                  className="p-1 bg-red-600/20 hover:bg-red-600/30 rounded text-red-400 ml-3"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
            ))}
          </div>
          
          <div className="mt-4 flex justify-center">
            <motion.button
              onClick={analyzeProtocol}
              disabled={isAnalyzing}
              className="px-6 py-3 bg-gradient-to-r from-consciousness-600 to-primary-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isAnalyzing ? (
                <>
                  <Settings className="w-5 h-5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  <span>Analyze Protocol</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      )}

      {/* Protocol Analysis */}
      {protocolAnalysis && (
        <motion.div
          className="glass-effect rounded-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-consciousness-300 mb-4">
            Protocol Analysis
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="text-center">
              <div className={`text-3xl font-bold ${getEffectivenessColor(protocolAnalysis.effectiveness)}`}>
                {protocolAnalysis.effectiveness.toFixed(1)}%
              </div>
              <div className="text-sm text-void-400">Overall Effectiveness</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">
                {protocolAnalysis.safetyProfile.toFixed(1)}%
              </div>
              <div className="text-sm text-void-400">Safety Profile</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {protocolAnalysis.warnings.length > 0 && (
              <div>
                <h4 className="font-medium text-red-400 mb-2 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  Warnings
                </h4>
                <div className="space-y-2">
                  {protocolAnalysis.warnings.map((warning, index) => (
                    <div key={index} className="text-sm text-red-300 bg-red-500/10 p-2 rounded">
                      {warning}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {protocolAnalysis.recommendations.length > 0 && (
              <div>
                <h4 className="font-medium text-green-400 mb-2 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Recommendations
                </h4>
                <div className="space-y-2">
                  {protocolAnalysis.recommendations.map((rec, index) => (
                    <div key={index} className="text-sm text-green-300 bg-green-500/10 p-2 rounded">
                      {rec}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-6 flex justify-center">
            <motion.button
              onClick={createProtocol}
              disabled={!currentProtocol.name}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <CheckCircle className="w-5 h-5" />
              <span>Create Protocol</span>
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Component Details Modal */}
      {selectedComponent && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedComponent(null)}
        >
          <motion.div
            className="glass-effect rounded-lg p-6 max-w-md w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-consciousness-300 mb-4">
              {selectedComponent.name}
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-void-400">Effectiveness</label>
                  <div className={`text-lg font-bold ${getEffectivenessColor(selectedComponent.effectiveness)}`}>
                    {selectedComponent.effectiveness}%
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-void-400">Risk Level</label>
                  <div className={`text-lg font-bold ${getRiskColor(selectedComponent.riskLevel)}`}>
                    {selectedComponent.riskLevel}%
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-void-400">Requirements</label>
                <div className="space-y-1 mt-1">
                  {selectedComponent.requirements.map((req, index) => (
                    <div key={index} className="text-sm text-green-400 bg-green-500/10 px-2 py-1 rounded">
                      {req}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-void-400">Contraindications</label>
                <div className="space-y-1 mt-1">
                  {selectedComponent.contraindications.map((contra, index) => (
                    <div key={index} className="text-sm text-red-400 bg-red-500/10 px-2 py-1 rounded">
                      {contra}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <motion.button
                onClick={() => setSelectedComponent(null)}
                className="px-4 py-2 bg-void-700 hover:bg-void-600 text-void-200 rounded-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Close
              </motion.button>
              <motion.button
                onClick={() => {
                  addComponent(selectedComponent);
                  setSelectedComponent(null);
                }}
                className="px-4 py-2 bg-consciousness-600 hover:bg-consciousness-500 text-white rounded-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Add Component
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
