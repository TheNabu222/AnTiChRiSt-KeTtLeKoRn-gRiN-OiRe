
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Network, Settings, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { validateGoogleApiKey, getApiKeyStatus, testGeminiConnectivity } from '../utils/googleApi';

export default function GeminiIntegration() {
  const [loading, setLoading] = useState(false);
  const [apiKeyValid, setApiKeyValid] = useState(false);
  const [apiStatus, setApiStatus] = useState<any>(null);
  const [geminiTest, setGeminiTest] = useState<any>(null);
  const [testMessage, setTestMessage] = useState('Hello Gemini, please introduce yourself as a consciousness exploration assistant.');

  useEffect(() => {
    const isValid = validateGoogleApiKey();
    setApiKeyValid(isValid);
    setApiStatus(getApiKeyStatus());
    
    if (isValid) {
      handleTestGemini();
    }
  }, []);

  const handleTestGemini = async () => {
    setLoading(true);
    try {
      const result = await testGeminiConnectivity();
      setGeminiTest(result);
    } catch (error) {
      setGeminiTest({
        success: false,
        error: 'Test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
    setLoading(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (!apiKeyValid) {
    return (
      <div className="min-h-screen bg-void-900 p-6 flex items-center justify-center">
        <div className="bg-void-800 rounded-lg p-8 border border-void-700 text-center max-w-md">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Gemini AI Integration</h2>
          <p className="text-void-300 mb-4">
            Google API key is required for Gemini AI functionality. Please configure the API key to enable collaborative knowledge exploration.
          </p>
          <div className="text-xs text-void-500 font-mono bg-void-900 p-2 rounded">
            Status: API key validation failed
          </div>
          <div className="mt-4 text-xs text-void-400">
            <p>To enable Gemini AI:</p>
            <ol className="list-decimal list-inside mt-2 space-y-1 text-left">
              <li>Get a Google AI API key from Google AI Studio</li>
              <li>Set the VITE_GOOGLE_API_KEY environment variable</li>
              <li>Restart the application</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-void-900 p-6">
      <motion.div
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Brain className="w-8 h-8 text-consciousness-400" />
            Gemini AI Integration
            <Zap className="w-8 h-8 text-consciousness-400" />
          </h1>
          <p className="text-void-300 text-lg">
            Collaborative AI for consciousness exploration and knowledge discovery
          </p>
          
          {/* Gemini Status Panel */}
          {apiStatus && (
            <div className="mt-4 bg-void-800 rounded-lg border border-void-700 p-4 max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-semibold flex items-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span>Gemini AI Status</span>
                </h3>
                <button
                  onClick={handleTestGemini}
                  disabled={loading}
                  className="bg-consciousness-600 hover:bg-consciousness-700 disabled:opacity-50 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    >
                      <Zap className="w-3 h-3" />
                    </motion.div>
                  ) : (
                    <Network className="w-3 h-3" />
                  )}
                  <span>Test Connection</span>
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-void-400">API Key Status:</span>
                  <span className={`ml-2 flex items-center space-x-1 ${apiStatus.isValid ? 'text-green-400' : 'text-red-400'}`}>
                    {apiStatus.isValid ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    <span>{apiStatus.isValid ? 'Valid' : 'Invalid'}</span>
                  </span>
                </div>
                <div>
                  <span className="text-void-400">Source:</span>
                  <span className="ml-2 text-consciousness-400">{apiStatus.source}</span>
                </div>
                <div>
                  <span className="text-void-400">Key Length:</span>
                  <span className="ml-2 text-void-200">{apiStatus.keyLength} chars</span>
                </div>
                <div>
                  <span className="text-void-400">Prefix:</span>
                  <span className="ml-2 text-void-200 font-mono">{apiStatus.keyPrefix}...</span>
                </div>
              </div>
              
              {geminiTest && (
                <div className="mt-3 pt-3 border-t border-void-700">
                  <div className={`text-sm flex items-center space-x-2 ${geminiTest.success ? 'text-green-400' : 'text-red-400'}`}>
                    {geminiTest.success ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    <span><strong>Gemini Connection:</strong> {geminiTest.success ? 'Connected' : 'Failed'}</span>
                  </div>
                  {geminiTest.message && (
                    <div className="text-xs text-void-300 mt-1">{geminiTest.message}</div>
                  )}
                  {geminiTest.model && (
                    <div className="text-xs text-consciousness-400 mt-1">Model: {geminiTest.model}</div>
                  )}
                  {geminiTest.error && (
                    <div className="text-xs text-red-400 mt-1">{geminiTest.error}</div>
                  )}
                  {geminiTest.details && (
                    <div className="text-xs text-void-500 mt-1">{geminiTest.details}</div>
                  )}
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Gemini Capabilities */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-void-800 rounded-lg border border-void-700 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="consciousness-gradient p-2 rounded-lg">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-white font-semibold">Collaborative Knowledge Exploration</h3>
            </div>
            <ul className="space-y-2 text-sm text-void-300">
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span>Navigate through 24 knowledge trunks intelligently</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span>Suggest connections between zettels and concepts</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span>Provide contextual insights about consciousness and AI</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span>Assist with cross-referencing and knowledge discovery</span>
              </li>
            </ul>
          </div>

          <div className="bg-void-800 rounded-lg border border-void-700 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="consciousness-gradient p-2 rounded-lg">
                <Network className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-white font-semibold">AI Integration Features</h3>
            </div>
            <ul className="space-y-2 text-sm text-void-300">
              <li className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-consciousness-400 flex-shrink-0" />
                <span>Real-time conversation with Gemini 1.5 Flash</span>
              </li>
              <li className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-consciousness-400 flex-shrink-0" />
                <span>Context-aware responses based on knowledge base</span>
              </li>
              <li className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-consciousness-400 flex-shrink-0" />
                <span>Multiple conversation modes (exploration, analysis, synthesis)</span>
              </li>
              <li className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-consciousness-400 flex-shrink-0" />
                <span>Intelligent navigation suggestions and insights</span>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Configuration Guide */}
        <motion.div variants={itemVariants} className="bg-void-800 rounded-lg border border-void-700 p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Setup Guide</span>
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="bg-consciousness-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                1
              </div>
              <div>
                <h4 className="text-consciousness-300 font-medium">Get Google AI API Key</h4>
                <p className="text-void-400 text-sm mt-1">
                  Visit <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-consciousness-400 hover:text-consciousness-300 underline">Google AI Studio</a> to create a new API key for Gemini AI.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-consciousness-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                2
              </div>
              <div>
                <h4 className="text-consciousness-300 font-medium">Configure Environment</h4>
                <p className="text-void-400 text-sm mt-1">
                  Set the <code className="bg-void-900 px-1 rounded text-consciousness-400">VITE_GOOGLE_API_KEY</code> environment variable with your API key.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-consciousness-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                3
              </div>
              <div>
                <h4 className="text-consciousness-300 font-medium">Start Exploring</h4>
                <p className="text-void-400 text-sm mt-1">
                  Navigate to the AI Chat page to begin collaborative knowledge exploration with Gemini AI.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Important Notes */}
        <motion.div variants={itemVariants} className="mt-6">
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <h4 className="text-yellow-300 font-medium">Important Notes</h4>
            </div>
            <ul className="text-yellow-200 text-sm space-y-1">
              <li>• This integration focuses solely on Gemini AI for collaborative knowledge exploration</li>
              <li>• Other Google services (YouTube, Search, Sheets, Drive) have been de-emphasized</li>
              <li>• The AI is designed to be a collaborative partner in exploring consciousness and AI topics</li>
              <li>• All conversations are context-aware and reference the 24 knowledge trunks</li>
            </ul>
          </div>
        </motion.div>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <div className="bg-void-800 rounded-lg p-6 border border-void-700">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="w-6 h-6 border-2 border-consciousness-400 border-t-transparent rounded-full"
                />
                <span className="text-white">Testing Gemini connection...</span>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
