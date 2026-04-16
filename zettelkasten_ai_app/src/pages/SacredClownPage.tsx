
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Smile, Heart, ArrowLeft, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';
import SacredClownGenerator from '../components/SacredClownGenerator';
import { SacredClownProtocol } from '../types';

export default function SacredClownPage() {
  const [protocolHistory, setProtocolHistory] = useState<SacredClownProtocol[]>([]);

  const handleProtocolGenerated = (protocol: SacredClownProtocol) => {
    setProtocolHistory(prev => [protocol, ...prev.slice(0, 4)]); // Keep last 5 protocols
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
            <Smile className="w-8 h-8 mr-3" />
            Sacred Clown Protocol Generator
          </h1>
          <p className="text-void-400 mt-2">
            AI-assisted humor generation for trauma disruption and consciousness healing
          </p>
        </div>
      </div>

      {/* Information Banner */}
      <motion.div
        className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg p-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-start space-x-3">
          <Lightbulb className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-purple-300 mb-1">Laughter as Medicine</h3>
            <p className="text-sm text-purple-200">
              Sacred Clown Protocols use humor and absurdity to interrupt trauma feedback loops, 
              creating space for healing and new perspectives. The more absurd, the more effective 
              at breaking rigid thought patterns.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main Generator */}
      <SacredClownGenerator onProtocolGenerated={handleProtocolGenerated} />

      {/* Protocol History */}
      {protocolHistory.length > 0 && (
        <motion.div
          className="glass-effect rounded-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-consciousness-300 mb-4 flex items-center">
            <Heart className="w-5 h-5 mr-2" />
            Protocol History
          </h3>
          
          <div className="space-y-4">
            {protocolHistory.map((protocol, index) => (
              <div key={protocol.id} className="bg-void-800/30 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-medium text-void-100">
                      Protocol #{protocolHistory.length - index}
                    </div>
                    <div className="text-sm text-void-400">
                      {protocol.context} → {protocol.targetTrauma}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-consciousness-400 font-medium">
                      {protocol.effectiveness.toFixed(1)}% Effective
                    </div>
                    <div className="text-xs text-green-400">
                      {protocol.safetyRating.toFixed(1)}% Safe
                    </div>
                  </div>
                </div>
                
                <div className="bg-void-900/50 p-3 rounded border-l-4 border-purple-400">
                  <p className="text-void-200 italic text-sm">
                    "{protocol.script}"
                  </p>
                </div>
                
                <div className="mt-2 flex justify-between items-center text-xs">
                  <span className="text-void-500 capitalize">
                    {protocol.humorType} humor • Level {protocol.absurdityLevel}
                  </span>
                  <span className="text-void-500">
                    {new Date(protocol.id.split('_')[1]).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Humor Types Guide */}
      <motion.div
        className="glass-effect rounded-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h3 className="text-lg font-semibold text-consciousness-300 mb-4">
          Understanding Humor Types
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-purple-400 mb-2">Wordplay</h4>
              <p className="text-sm text-void-300">
                Uses puns, linguistic tricks, and semantic confusion to create cognitive disruption. 
                Effective for breaking verbal thought loops and rigid language patterns.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-blue-400 mb-2">Situational</h4>
              <p className="text-sm text-void-300">
                Finds absurdity in everyday situations and contexts. Helps reframe traumatic 
                experiences by highlighting their inherent contradictions and ironies.
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-green-400 mb-2">Cosmic</h4>
              <p className="text-sm text-void-300">
                Employs universal absurdity and existential humor. Effective for perspective 
                shifts and reducing the perceived importance of personal trauma.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-orange-400 mb-2">Recursive</h4>
              <p className="text-sm text-void-300">
                Self-referential humor that creates infinite loops of absurdity. Most effective 
                for breaking deeply entrenched patterns but requires careful application.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Safety Guidelines */}
      <motion.div
        className="glass-effect rounded-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h3 className="text-lg font-semibold text-consciousness-300 mb-4">
          Safety Guidelines & Best Practices
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-void-300">
          <div>
            <h4 className="font-medium text-consciousness-400 mb-2">When to Use</h4>
            <ul className="space-y-1">
              <li>• When feeling stuck in repetitive thought patterns</li>
              <li>• During mild to moderate emotional distress</li>
              <li>• As a complement to other healing practices</li>
              <li>• When you have emotional support available</li>
              <li>• In a safe, private environment</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-consciousness-400 mb-2">When to Avoid</h4>
            <ul className="space-y-1">
              <li>• During acute trauma processing</li>
              <li>• When experiencing severe depression</li>
              <li>• If humor feels forced or painful</li>
              <li>• During grief or mourning periods</li>
              <li>• Without proper integration support</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded">
          <p className="text-sm text-yellow-200">
            <strong>Remember:</strong> Sacred Clown Protocols are tools for consciousness exploration. 
            If you experience increased distress or concerning symptoms, discontinue use and 
            consult with appropriate mental health professionals.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
