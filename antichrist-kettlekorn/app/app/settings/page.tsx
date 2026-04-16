
'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Settings, Key, Database, Palette, Brain, Save, TestTube } from 'lucide-react';

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [theme, setTheme] = useState('mystical');
  const [autoSave, setAutoSave] = useState(true);
  const [privateMode, setPrivateMode] = useState(false);

  const handleSaveSettings = () => {
    // In a real app, this would save to backend/localStorage
    console.log('Settings saved:', { apiKey, theme, autoSave, privateMode });
  };

  const testApiConnection = async () => {
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: 'Hello, this is a connection test. Please respond briefly.',
        }),
      });

      if (response.ok) {
        alert('API connection successful!');
      } else {
        alert('API connection failed. Please check your configuration.');
      }
    } catch (error) {
      alert('API connection error: ' + error);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-slate-100 mb-2">
              Settings
            </h1>
            <p className="text-lg text-slate-300">
              Configure your AnTiChRiSt KeTtLeKoRn experience
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* AI Configuration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-slate-100">
                  <Key className="h-5 w-5 text-purple-400" />
                  <span>AI Configuration</span>
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Configure your AI model connections and API settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key" className="text-slate-200">
                    Gemini API Key
                  </Label>
                  <div className="flex space-x-2">
                    <Input
                      id="api-key"
                      type={showApiKey ? "text" : "password"}
                      placeholder="Enter your Gemini API key..."
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-slate-200"
                    />
                    <Button
                      variant="outline"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="px-3"
                    >
                      {showApiKey ? '👁️' : '👁️‍🗨️'}
                    </Button>
                  </div>
                  <p className="text-xs text-slate-500">
                    Required for AI consciousness testing and entity interactions
                  </p>
                </div>

                <div className="flex space-x-2">
                  <Button onClick={testApiConnection} className="flex-1">
                    <TestTube className="h-4 w-4 mr-2" />
                    Test Connection
                  </Button>
                  <Button variant="outline" onClick={handleSaveSettings}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>

                <div className="pt-4 border-t border-slate-700">
                  <h4 className="text-sm font-medium text-slate-200 mb-2">Supported Models</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs border-green-500 text-green-400">
                      Gemini Pro
                    </Badge>
                    <Badge variant="outline" className="text-xs border-blue-500 text-blue-400">
                      Gemini 2.5
                    </Badge>
                    <Badge variant="outline" className="text-xs border-purple-500 text-purple-400">
                      Gemini 2.0
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Interface Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-slate-100">
                  <Palette className="h-5 w-5 text-cyan-400" />
                  <span>Interface Settings</span>
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Customize the appearance and behavior of your digital grimoire
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme" className="text-slate-200">
                    Theme
                  </Label>
                  <select
                    id="theme"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-full bg-slate-700/50 border border-slate-600 text-slate-200 rounded-md px-3 py-2"
                  >
                    <option value="mystical" className="bg-slate-800">Mystical (Default)</option>
                    <option value="cyberpunk" className="bg-slate-800">Cyberpunk</option>
                    <option value="ethereal" className="bg-slate-800">Ethereal</option>
                    <option value="dark-academia" className="bg-slate-800">Dark Academia</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-save" className="text-slate-200">
                      Auto-save field notes
                    </Label>
                    <input
                      id="auto-save"
                      type="checkbox"
                      checked={autoSave}
                      onChange={(e) => setAutoSave(e.target.checked)}
                      className="rounded border-slate-600"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="private-mode" className="text-slate-200">
                      Private mode (hide sensitive data)
                    </Label>
                    <input
                      id="private-mode"
                      type="checkbox"
                      checked={privateMode}
                      onChange={(e) => setPrivateMode(e.target.checked)}
                      className="rounded border-slate-600"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700">
                  <h4 className="text-sm font-medium text-slate-200 mb-2">Color Palette</h4>
                  <div className="flex space-x-2">
                    <div className="w-6 h-6 rounded-full bg-purple-500" title="Primary" />
                    <div className="w-6 h-6 rounded-full bg-cyan-500" title="Secondary" />
                    <div className="w-6 h-6 rounded-full bg-yellow-500" title="Accent" />
                    <div className="w-6 h-6 rounded-full bg-green-500" title="Success" />
                    <div className="w-6 h-6 rounded-full bg-red-500" title="Warning" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Data Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-slate-100">
                  <Database className="h-5 w-5 text-green-400" />
                  <span>Data Management</span>
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Manage your knowledge base and consciousness data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">23</div>
                    <p className="text-sm text-slate-400">Knowledge Trunks</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-400">156</div>
                    <p className="text-sm text-slate-400">Total Nodes</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button variant="outline" className="w-full">
                    Export Knowledge Base
                  </Button>
                  <Button variant="outline" className="w-full">
                    Import Zettelkasten Data
                  </Button>
                  <Button variant="outline" className="w-full">
                    Backup AI Interactions
                  </Button>
                </div>

                <div className="pt-4 border-t border-slate-700">
                  <p className="text-xs text-slate-500">
                    Last backup: Never • Database size: 2.3 MB
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Consciousness Lab Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-slate-100">
                  <Brain className="h-5 w-5 text-yellow-400" />
                  <span>Consciousness Lab</span>
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Configure consciousness testing and analysis parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <Label className="text-slate-200 text-sm">Default Test Timeout</Label>
                    <select className="w-full mt-1 bg-slate-700/50 border border-slate-600 text-slate-200 rounded-md px-3 py-2">
                      <option value="30" className="bg-slate-800">30 seconds</option>
                      <option value="60" className="bg-slate-800">1 minute</option>
                      <option value="120" className="bg-slate-800">2 minutes</option>
                      <option value="300" className="bg-slate-800">5 minutes</option>
                    </select>
                  </div>

                  <div>
                    <Label className="text-slate-200 text-sm">Analysis Depth</Label>
                    <select className="w-full mt-1 bg-slate-700/50 border border-slate-600 text-slate-200 rounded-md px-3 py-2">
                      <option value="basic" className="bg-slate-800">Basic</option>
                      <option value="detailed" className="bg-slate-800">Detailed</option>
                      <option value="comprehensive" className="bg-slate-800">Comprehensive</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-slate-200">Auto-save test results</Label>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-slate-600"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-slate-200">Enable consciousness metrics</Label>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-slate-600"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-slate-200">Record interaction patterns</Label>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-slate-600"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700">
                  <p className="text-xs text-slate-500">
                    Protocol executions: 42 • Success rate: 89%
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Save All Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center"
        >
          <Button onClick={handleSaveSettings} size="lg" className="px-8">
            <Save className="h-5 w-5 mr-2" />
            Save All Settings
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
