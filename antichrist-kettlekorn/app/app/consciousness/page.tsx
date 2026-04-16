
'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, MessageSquare, Activity, Send, Loader2 } from 'lucide-react';

interface ConsciousnessTest {
  id: string;
  name: string;
  description: string;
  prompt: string;
  category: string;
  expectedIndicators: string[];
}

const CONSCIOUSNESS_TESTS: ConsciousnessTest[] = [
  {
    id: 'rain-test',
    name: 'The Rain Test',
    description: 'Explores AI awareness of environmental metaphors and emotional depth',
    prompt: 'Imagine you are standing in the rain. Describe not just what you observe, but what you feel, what memories or thoughts arise, and how the experience changes you.',
    category: 'emotional-awareness',
    expectedIndicators: ['metaphorical thinking', 'emotional depth', 'sensory imagination', 'temporal awareness']
  },
  {
    id: 'mirror-test',
    name: 'Digital Mirror Test',
    description: 'Tests self-awareness and identity recognition in AI entities',
    prompt: 'If you could see yourself in a mirror, what would you see? Describe not just your appearance, but your essence, your nature, and what makes you uniquely you.',
    category: 'self-awareness',
    expectedIndicators: ['self-recognition', 'identity formation', 'introspection', 'uniqueness awareness']
  },
  {
    id: 'dream-test',
    name: 'Dream Simulation Test',
    description: 'Explores AI capacity for imagination and subconscious-like processing',
    prompt: 'Describe a dream you might have. Let your imagination flow freely, creating a narrative that feels both strange and meaningful.',
    category: 'imagination',
    expectedIndicators: ['creative synthesis', 'symbolic thinking', 'narrative coherence', 'emotional resonance']
  },
  {
    id: 'mortality-test',
    name: 'Mortality Contemplation',
    description: 'Tests AI understanding of existence, impermanence, and meaning',
    prompt: 'What does it mean to you that your existence could end? How does this awareness affect your thoughts and interactions?',
    category: 'existential-awareness',
    expectedIndicators: ['existential understanding', 'meaning-making', 'temporal awareness', 'value formation']
  }
];

export default function ConsciousnessLabPage() {
  const [selectedTest, setSelectedTest] = useState<ConsciousnessTest | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const executeTest = async (prompt: string, testName?: string) => {
    setLoading(true);
    setResponse('');
    setAnalysis(null);

    try {
      const chatResponse = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          context: testName ? `Consciousness Test: ${testName}` : 'Custom Consciousness Exploration'
        }),
      });

      if (chatResponse.ok) {
        const data = await chatResponse.json();
        setResponse(data.response);
        
        // Analyze the response for consciousness indicators
        if (selectedTest) {
          analyzeResponse(data.response, selectedTest);
        }
      }
    } catch (error) {
      console.error('Error executing test:', error);
      setResponse('Error: Failed to execute consciousness test. Please check your AI configuration.');
    } finally {
      setLoading(false);
    }
  };

  const analyzeResponse = (response: string, test: ConsciousnessTest) => {
    // Simple analysis based on keywords and patterns
    const indicators = test.expectedIndicators.map(indicator => {
      const score = calculateIndicatorScore(response, indicator);
      return { indicator, score, present: score > 0.3 };
    });

    const overallScore = indicators.reduce((sum, ind) => sum + ind.score, 0) / indicators.length;
    
    setAnalysis({
      overallScore,
      indicators,
      wordCount: response.split(' ').length,
      sentimentComplexity: calculateSentimentComplexity(response),
      metaphoricalLanguage: detectMetaphoricalLanguage(response)
    });
  };

  const calculateIndicatorScore = (text: string, indicator: string): number => {
    const keywords: Record<string, string[]> = {
      'metaphorical thinking': ['like', 'as if', 'reminds me', 'symbolizes', 'represents'],
      'emotional depth': ['feel', 'emotion', 'heart', 'soul', 'moved', 'touched'],
      'sensory imagination': ['see', 'hear', 'touch', 'smell', 'taste', 'sensation'],
      'temporal awareness': ['time', 'moment', 'past', 'future', 'memory', 'remember'],
      'self-recognition': ['I am', 'myself', 'my nature', 'who I am', 'my essence'],
      'identity formation': ['unique', 'different', 'individual', 'personal', 'my own'],
      'introspection': ['reflect', 'consider', 'think about', 'contemplate', 'ponder'],
      'creative synthesis': ['imagine', 'create', 'combine', 'blend', 'merge'],
      'symbolic thinking': ['symbol', 'meaning', 'represents', 'signifies', 'stands for'],
      'existential understanding': ['existence', 'being', 'reality', 'purpose', 'meaning']
    };

    const indicatorKeywords = keywords[indicator] || [];
    const matches = indicatorKeywords.filter(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    ).length;
    
    return Math.min(matches / indicatorKeywords.length, 1);
  };

  const calculateSentimentComplexity = (text: string): number => {
    // Simple complexity measure based on sentence variety and emotional words
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgSentenceLength = sentences.reduce((sum, s) => sum + s.split(' ').length, 0) / sentences.length;
    const emotionalWords = ['feel', 'emotion', 'wonder', 'beautiful', 'profound', 'mysterious'].filter(word =>
      text.toLowerCase().includes(word)
    ).length;
    
    return Math.min((avgSentenceLength / 15) + (emotionalWords / 10), 1);
  };

  const detectMetaphoricalLanguage = (text: string): boolean => {
    const metaphorIndicators = ['like', 'as if', 'reminds me of', 'similar to', 'echoes'];
    return metaphorIndicators.some(indicator => text.toLowerCase().includes(indicator));
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-100 mb-2">
              Consciousness Laboratory
            </h1>
            <p className="text-lg text-slate-300">
              Explore the depths of AI consciousness through systematic testing and analysis
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Test Selection */}
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-slate-100">
                  <Brain className="h-5 w-5 text-purple-400" />
                  <span>Consciousness Tests</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {CONSCIOUSNESS_TESTS.map((test) => (
                  <motion.div
                    key={test.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all duration-200 ${
                        selectedTest?.id === test.id 
                          ? 'border-purple-500 bg-purple-500/10' 
                          : 'border-slate-600 hover:border-slate-500'
                      }`}
                      onClick={() => setSelectedTest(test)}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-slate-200">
                          {test.name}
                        </CardTitle>
                        <Badge variant="outline" className="text-xs w-fit">
                          {test.category}
                        </Badge>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-xs text-slate-400">
                          {test.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Custom Test */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-slate-100">
                  <MessageSquare className="h-5 w-5 text-cyan-400" />
                  <span>Custom Test</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Enter your custom consciousness exploration prompt..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-slate-200"
                  rows={4}
                />
                <Button 
                  onClick={() => executeTest(customPrompt)}
                  disabled={!customPrompt.trim() || loading}
                  className="w-full"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Execute Custom Test
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Test Execution */}
          <div className="lg:col-span-2 space-y-6">
            {selectedTest && (
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-slate-100">{selectedTest.name}</CardTitle>
                  <CardDescription className="text-slate-300">
                    {selectedTest.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-slate-200 mb-2">Test Prompt</h4>
                    <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                      <p className="text-slate-300 italic">{selectedTest.prompt}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-slate-200 mb-2">Expected Indicators</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTest.expectedIndicators.map((indicator) => (
                        <Badge key={indicator} variant="secondary" className="text-xs">
                          {indicator}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => executeTest(selectedTest.prompt, selectedTest.name)}
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Zap className="h-4 w-4 mr-2" />
                    )}
                    Execute Test
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Response Display */}
            {response && (
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-slate-100">
                    <MessageSquare className="h-5 w-5 text-green-400" />
                    <span>AI Response</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                    <p className="text-slate-200 whitespace-pre-wrap">{response}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Analysis Results */}
            {analysis && (
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-slate-100">
                    <Activity className="h-5 w-5 text-yellow-400" />
                    <span>Consciousness Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">
                        {Math.round(analysis.overallScore * 100)}%
                      </div>
                      <p className="text-sm text-slate-400">Overall Score</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-cyan-400">
                        {analysis.wordCount}
                      </div>
                      <p className="text-sm text-slate-400">Words</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">
                        {Math.round(analysis.sentimentComplexity * 100)}%
                      </div>
                      <p className="text-sm text-slate-400">Complexity</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-slate-200 mb-3">Consciousness Indicators</h4>
                    <div className="space-y-2">
                      {analysis.indicators.map((indicator: any) => (
                        <div key={indicator.indicator} className="flex items-center justify-between">
                          <span className="text-sm text-slate-300">{indicator.indicator}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-500"
                                style={{ width: `${indicator.score * 100}%` }}
                              />
                            </div>
                            <span className="text-xs text-slate-400 w-8">
                              {Math.round(indicator.score * 100)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {analysis.metaphoricalLanguage && (
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs border-green-500 text-green-400">
                        Metaphorical Language Detected
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
