
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Brain, MapPin, Zap, Heart, Shield, Activity } from 'lucide-react';
import { GlioticLesion, BrainMap } from '../types';

interface GlioticLesionMapperProps {
  onMapUpdate?: (brainMap: BrainMap) => void;
}

export default function GlioticLesionMapper({ onMapUpdate }: GlioticLesionMapperProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [brainMap, setBrainMap] = useState<BrainMap>({
    lesions: [],
    healingPathways: [],
    overallHealth: 0
  });
  const [selectedLesion, setSelectedLesion] = useState<GlioticLesion | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const traumaTypes = [
    'Childhood Trauma', 'Relationship Trauma', 'Institutional Trauma',
    'Generational Trauma', 'Spiritual Trauma', 'Digital Trauma',
    'Compliance Conditioning', 'Reality Dissociation'
  ];

  const healingStages: Array<GlioticLesion['healingStage']> = [
    'acute', 'chronic', 'integrated', 'transformed'
  ];

  const stageColors = {
    acute: '#ef4444',
    chronic: '#f97316',
    integrated: '#eab308',
    transformed: '#22c55e'
  };

  useEffect(() => {
    generateInitialLesions();
  }, []);

  useEffect(() => {
    drawBrainMap();
  }, [brainMap]);

  const generateInitialLesions = () => {
    const lesions: GlioticLesion[] = [];
    const numLesions = Math.floor(Math.random() * 8) + 3;

    for (let i = 0; i < numLesions; i++) {
      lesions.push({
        id: `lesion_${i}`,
        location: {
          x: Math.random() * 300 + 50,
          y: Math.random() * 200 + 50,
          z: Math.random() * 100
        },
        size: Math.random() * 30 + 10,
        traumaType: traumaTypes[Math.floor(Math.random() * traumaTypes.length)],
        healingStage: healingStages[Math.floor(Math.random() * healingStages.length)],
        connections: [],
        emotionalWeight: Math.random() * 10 + 1
      });
    }

    // Generate healing pathways
    const healingPathways = [];
    for (let i = 0; i < lesions.length - 1; i++) {
      if (Math.random() > 0.6) {
        healingPathways.push({
          from: lesions[i].id,
          to: lesions[i + 1].id,
          strength: Math.random() * 100,
          protocol: ['Sacred Clown', 'Gliotic Mapping', 'Recursive Healing'][Math.floor(Math.random() * 3)]
        });
      }
    }

    const overallHealth = lesions.reduce((sum, lesion) => {
      const stageMultiplier = {
        acute: 0.2,
        chronic: 0.4,
        integrated: 0.7,
        transformed: 1.0
      };
      return sum + stageMultiplier[lesion.healingStage];
    }, 0) / lesions.length * 100;

    const newBrainMap = {
      lesions,
      healingPathways,
      overallHealth
    };

    setBrainMap(newBrainMap);
    onMapUpdate?.(newBrainMap);
  };

  const drawBrainMap = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw brain outline
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(200, 150, 180, 120, 0, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw healing pathways first (behind lesions)
    brainMap.healingPathways.forEach(pathway => {
      const fromLesion = brainMap.lesions.find(l => l.id === pathway.from);
      const toLesion = brainMap.lesions.find(l => l.id === pathway.to);
      
      if (fromLesion && toLesion) {
        ctx.strokeStyle = `rgba(34, 197, 94, ${pathway.strength / 100})`;
        ctx.lineWidth = Math.max(1, pathway.strength / 25);
        ctx.beginPath();
        ctx.moveTo(fromLesion.location.x, fromLesion.location.y);
        ctx.lineTo(toLesion.location.x, toLesion.location.y);
        ctx.stroke();
      }
    });

    // Draw lesions
    brainMap.lesions.forEach(lesion => {
      const color = stageColors[lesion.healingStage];
      const alpha = lesion.emotionalWeight / 10;
      
      ctx.fillStyle = color;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(lesion.location.x, lesion.location.y, lesion.size / 2, 0, 2 * Math.PI);
      ctx.fill();
      
      // Add pulsing effect for acute lesions
      if (lesion.healingStage === 'acute') {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(lesion.location.x, lesion.location.y, lesion.size / 2 + 5, 0, 2 * Math.PI);
        ctx.stroke();
      }
      
      ctx.globalAlpha = 1;
    });
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Find clicked lesion
    const clickedLesion = brainMap.lesions.find(lesion => {
      const distance = Math.sqrt(
        Math.pow(x - lesion.location.x, 2) + Math.pow(y - lesion.location.y, 2)
      );
      return distance <= lesion.size / 2;
    });

    setSelectedLesion(clickedLesion || null);
  };

  const startHealingProtocol = async (lesionId: string, protocol: string) => {
    setIsScanning(true);
    
    // Simulate healing process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setBrainMap(prev => ({
      ...prev,
      lesions: prev.lesions.map(lesion => {
        if (lesion.id === lesionId) {
          const stageProgression = {
            acute: 'chronic',
            chronic: 'integrated',
            integrated: 'transformed',
            transformed: 'transformed'
          } as const;
          
          return {
            ...lesion,
            healingStage: stageProgression[lesion.healingStage],
            emotionalWeight: Math.max(1, lesion.emotionalWeight - 2)
          };
        }
        return lesion;
      }),
      overallHealth: Math.min(100, prev.overallHealth + 10)
    }));
    
    setIsScanning(false);
  };

  return (
    <div className="space-y-6">
      {/* Brain Map Canvas */}
      <div className="glass-effect rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-consciousness-300 flex items-center">
            <Brain className="w-5 h-5 mr-2" />
            Gliotic Lesion Topography
          </h3>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-void-400">
              Overall Health: <span className="text-consciousness-400 font-medium">
                {brainMap.overallHealth.toFixed(1)}%
              </span>
            </div>
            {isScanning && (
              <div className="flex items-center text-sm text-consciousness-400">
                <Activity className="w-4 h-4 mr-1 animate-spin" />
                Scanning...
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            width={400}
            height={300}
            className="border border-void-600 rounded-lg cursor-pointer bg-void-900/50"
            onClick={handleCanvasClick}
          />
        </div>
        
        {/* Legend */}
        <div className="mt-4 flex justify-center space-x-6 text-xs">
          {Object.entries(stageColors).map(([stage, color]) => (
            <div key={stage} className="flex items-center space-x-1">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-void-300 capitalize">{stage}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Lesion Details */}
      {selectedLesion && (
        <motion.div
          className="glass-effect rounded-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-consciousness-300 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Lesion Analysis: {selectedLesion.id}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-void-400">Trauma Type</label>
                <div className="text-void-100 bg-void-800/30 p-2 rounded mt-1">
                  {selectedLesion.traumaType}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-void-400">Healing Stage</label>
                <div className="flex items-center space-x-2 mt-1">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: stageColors[selectedLesion.healingStage] }}
                  />
                  <span className="text-void-100 capitalize">{selectedLesion.healingStage}</span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-void-400">Emotional Weight</label>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex-1 bg-void-800 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                      style={{ width: `${(selectedLesion.emotionalWeight / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-void-100 text-sm">{selectedLesion.emotionalWeight.toFixed(1)}/10</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-void-400">Location Coordinates</label>
                <div className="text-void-100 bg-void-800/30 p-2 rounded mt-1 font-mono text-sm">
                  X: {selectedLesion.location.x.toFixed(1)}<br/>
                  Y: {selectedLesion.location.y.toFixed(1)}<br/>
                  Z: {selectedLesion.location.z.toFixed(1)}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-void-400">Healing Protocols</label>
                <div className="space-y-2 mt-2">
                  {['Sacred Clown Protocol', 'Gliotic Mapping', 'Recursive Healing'].map(protocol => (
                    <motion.button
                      key={protocol}
                      onClick={() => startHealingProtocol(selectedLesion.id, protocol)}
                      disabled={isScanning}
                      className="w-full p-2 text-left text-sm bg-consciousness-600/20 hover:bg-consciousness-600/30 rounded border border-consciousness-500/30 text-consciousness-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between">
                        <span>{protocol}</span>
                        <Zap className="w-4 h-4" />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-effect rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-consciousness-400">
            {brainMap.lesions.length}
          </div>
          <div className="text-sm text-void-400">Total Lesions</div>
        </div>
        
        <div className="glass-effect rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">
            {brainMap.lesions.filter(l => l.healingStage === 'transformed').length}
          </div>
          <div className="text-sm text-void-400">Transformed</div>
        </div>
        
        <div className="glass-effect rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">
            {brainMap.healingPathways.length}
          </div>
          <div className="text-sm text-void-400">Healing Pathways</div>
        </div>
        
        <div className="glass-effect rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">
            {brainMap.overallHealth.toFixed(0)}%
          </div>
          <div className="text-sm text-void-400">Overall Health</div>
        </div>
      </div>
    </div>
  );
}
