
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Smile, Zap, RefreshCw, Heart, Brain, Sparkles } from 'lucide-react';
import { SacredClownProtocol } from '../types';

interface SacredClownGeneratorProps {
  onProtocolGenerated?: (protocol: SacredClownProtocol) => void;
}

export default function SacredClownGenerator({ onProtocolGenerated }: SacredClownGeneratorProps) {
  const [currentProtocol, setCurrentProtocol] = useState<SacredClownProtocol | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedContext, setSelectedContext] = useState('');
  const [selectedTrauma, setSelectedTrauma] = useState('');
  const [absurdityLevel, setAbsurdityLevel] = useState(50);

  const contexts = [
    'Workplace Stress', 'Relationship Conflict', 'Existential Crisis',
    'Digital Overwhelm', 'Compliance Conditioning', 'Reality Dissociation',
    'Spiritual Stagnation', 'Creative Block', 'Social Anxiety'
  ];

  const traumaTypes = [
    'Perfectionism Paralysis', 'Imposter Syndrome', 'Rejection Sensitivity',
    'Control Addiction', 'Approval Seeking', 'Catastrophic Thinking',
    'Emotional Numbness', 'Hypervigilance', 'Self-Sabotage'
  ];

  const humorTypes: Array<SacredClownProtocol['humorType']> = [
    'wordplay', 'situational', 'cosmic', 'recursive'
  ];

  const absurdityTemplates = {
    low: [
      "What if {trauma} was actually just {context} wearing a very convincing disguise?",
      "Imagine {trauma} as a confused GPS that keeps saying 'recalculating' but never finds the destination.",
      "Picture {trauma} as a software bug that's been promoted to 'feature' status."
    ],
    medium: [
      "What if {trauma} is actually a cosmic joke told by interdimensional comedians who forgot the punchline?",
      "Imagine {trauma} as a philosophical debate between your left and right brain cells, but they're both speaking different languages.",
      "Picture {trauma} as a dance-off between your inner critic and your inner child, but they're both terrible dancers."
    ],
    high: [
      "What if {trauma} is actually the universe's way of teaching quantum physics through interpretive dance?",
      "Imagine {trauma} as a recursive loop where each iteration becomes more absurdly self-aware until it achieves enlightenment.",
      "Picture {trauma} as a cosmic debugging session where the universe is trying to patch reality but keeps creating more entertaining glitches."
    ]
  };

  const generateProtocol = async () => {
    if (!selectedContext || !selectedTrauma) return;
    
    setIsGenerating(true);
    
    // Simulate generation time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const humorType = humorTypes[Math.floor(Math.random() * humorTypes.length)];
    const absurdityCategory = absurdityLevel < 33 ? 'low' : absurdityLevel < 66 ? 'medium' : 'high';
    const templates = absurdityTemplates[absurdityCategory];
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    const script = template
      .replace(/{trauma}/g, selectedTrauma)
      .replace(/{context}/g, selectedContext);
    
    const effectiveness = Math.max(20, Math.min(100, 
      (absurdityLevel * 0.8) + (Math.random() * 40) + 20
    ));
    
    const safetyRating = Math.max(60, Math.min(100, 
      100 - (absurdityLevel * 0.3) + (Math.random() * 20)
    ));
    
    const protocol: SacredClownProtocol = {
      id: `clown_${Date.now()}`,
      context: selectedContext,
      absurdityLevel,
      humorType,
      targetTrauma: selectedTrauma,
      script,
      effectiveness,
      safetyRating
    };
    
    setCurrentProtocol(protocol);
    setIsGenerating(false);
    onProtocolGenerated?.(protocol);
  };

  const getAbsurdityLabel = (level: number) => {
    if (level < 33) return 'Gentle Humor';
    if (level < 66) return 'Cosmic Absurdity';
    return 'Reality Dissolution';
  };

  const getEffectivenessColor = (effectiveness: number) => {
    if (effectiveness < 40) return 'text-red-400';
    if (effectiveness < 70) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="space-y-6">
      {/* Configuration Panel */}
      <div className="glass-effect rounded-lg p-6">
        <h3 className="text-lg font-semibold text-consciousness-300 mb-4 flex items-center">
          <Smile className="w-5 h-5 mr-2" />
          Sacred Clown Protocol Configuration
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-void-400 mb-2">
                Context
              </label>
              <select
                value={selectedContext}
                onChange={(e) => setSelectedContext(e.target.value)}
                className="w-full bg-void-800 border border-void-600 rounded-lg px-3 py-2 text-void-100 focus:border-consciousness-400 focus:outline-none"
              >
                <option value="">Select context...</option>
                {contexts.map(context => (
                  <option key={context} value={context}>{context}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-void-400 mb-2">
                Target Trauma Pattern
              </label>
              <select
                value={selectedTrauma}
                onChange={(e) => setSelectedTrauma(e.target.value)}
                className="w-full bg-void-800 border border-void-600 rounded-lg px-3 py-2 text-void-100 focus:border-consciousness-400 focus:outline-none"
              >
                <option value="">Select trauma pattern...</option>
                {traumaTypes.map(trauma => (
                  <option key={trauma} value={trauma}>{trauma}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-void-400 mb-2">
                Absurdity Level: {getAbsurdityLabel(absurdityLevel)}
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={absurdityLevel}
                  onChange={(e) => setAbsurdityLevel(Number(e.target.value))}
                  className="w-full h-2 bg-void-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-void-500">
                  <span>Gentle</span>
                  <span>Cosmic</span>
                  <span>Reality-Breaking</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <motion.button
                onClick={generateProtocol}
                disabled={isGenerating || !selectedContext || !selectedTrauma}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generate Protocol</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Generated Protocol */}
      {currentProtocol && (
        <motion.div
          className="glass-effect rounded-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-consciousness-300 mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            Generated Sacred Clown Protocol
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className={`text-2xl font-bold ${getEffectivenessColor(currentProtocol.effectiveness)}`}>
                {currentProtocol.effectiveness.toFixed(1)}%
              </div>
              <div className="text-sm text-void-400">Effectiveness</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {currentProtocol.safetyRating.toFixed(1)}%
              </div>
              <div className="text-sm text-void-400">Safety Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400 capitalize">
                {currentProtocol.humorType}
              </div>
              <div className="text-sm text-void-400">Humor Type</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-consciousness-400 mb-2 flex items-center">
                <Brain className="w-4 h-4 mr-1" />
                Protocol Script
              </h4>
              <div className="bg-void-800/30 p-4 rounded-lg border-l-4 border-consciousness-400">
                <p className="text-void-100 leading-relaxed italic">
                  "{currentProtocol.script}"
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-consciousness-400 mb-2">Target Context</h4>
                <div className="bg-void-800/30 p-3 rounded text-void-300">
                  {currentProtocol.context}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-consciousness-400 mb-2">Trauma Pattern</h4>
                <div className="bg-void-800/30 p-3 rounded text-void-300">
                  {currentProtocol.targetTrauma}
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-consciousness-400 mb-2">Usage Instructions</h4>
              <div className="bg-void-800/30 p-3 rounded text-sm text-void-300 space-y-2">
                <p>1. Find a comfortable, private space where you can laugh freely</p>
                <p>2. Read the protocol script aloud with dramatic flair</p>
                <p>3. Allow yourself to fully embrace the absurdity of the situation</p>
                <p>4. Notice any shifts in your emotional state or perspective</p>
                <p>5. Repeat as needed when the trauma pattern resurfaces</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-center">
            <motion.button
              onClick={() => {
                setCurrentProtocol(null);
                setSelectedContext('');
                setSelectedTrauma('');
                setAbsurdityLevel(50);
              }}
              className="px-4 py-2 bg-void-700 hover:bg-void-600 text-void-200 rounded-lg text-sm flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className="w-4 h-4" />
              <span>Generate New Protocol</span>
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Information Panel */}
      <div className="glass-effect rounded-lg p-6">
        <h3 className="text-lg font-semibold text-consciousness-300 mb-4 flex items-center">
          <Heart className="w-5 h-5 mr-2" />
          About Sacred Clown Protocols
        </h3>
        <div className="text-sm text-void-300 space-y-3">
          <p>
            Sacred Clown Protocols use humor and absurdity as consciousness disruption tools, 
            interrupting trauma feedback loops through laughter and perspective shifts.
          </p>
          <p>
            The effectiveness increases with absurdity level, but higher levels may require 
            more integration time. Always practice in a safe, supportive environment.
          </p>
          <p>
            These protocols work by creating cognitive dissonance that breaks rigid thought 
            patterns, allowing for new neural pathways and healing perspectives to emerge.
          </p>
        </div>
      </div>
    </div>
  );
}
