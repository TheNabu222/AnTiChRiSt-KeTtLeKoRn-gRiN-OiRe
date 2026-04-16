
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Play, Copy, Download } from 'lucide-react';
import { TerminalCommand } from '../types';
import { terminalCommands, getCommandsByCategory } from '../data/terminalCommands';

interface TerminalSimulatorProps {
  className?: string;
}

export default function TerminalSimulator({ className = '' }: TerminalSimulatorProps) {
  const [selectedCommand, setSelectedCommand] = useState<TerminalCommand | null>(null);
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<string>('oracle');
  const outputRef = useRef<HTMLDivElement>(null);

  const categories = ['oracle', 'ritual', 'visualization', 'consent'];

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const simulateExecution = async (command: TerminalCommand) => {
    setIsRunning(true);
    setOutput([]);

    // Simulate typing the command
    await new Promise(resolve => setTimeout(resolve, 500));
    setOutput([`$ python3 ${command.command}`]);

    // Simulate script execution with realistic delays
    const lines = command.script.split('\n').filter(line => 
      line.trim() && !line.trim().startsWith('#') && !line.trim().startsWith('import')
    );

    for (let i = 0; i < Math.min(lines.length, 20); i++) {
      await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
      
      // Simulate some realistic output based on command type
      if (command.category === 'oracle') {
        if (i === 0) setOutput(prev => [...prev, '🔮 Oracle Card Draw System']);
        if (i === 1) setOutput(prev => [...prev, '=' * 40]);
        if (i === 3) setOutput(prev => [...prev, '🃏 Drawing cards from deck...']);
        if (i === 5) setOutput(prev => [...prev, `1. ${command.id === 'oracle-draw' ? 'emergent' : 'recursive decoy: do not follow'}`]);
        if (i === 6) setOutput(prev => [...prev, '✨ Meditate on these cards and their recursive meanings...']);
      } else if (command.category === 'consent') {
        if (i === 0) setOutput(prev => [...prev, '🌀 Consent Verification Protocol']);
        if (i === 1) setOutput(prev => [...prev, '=' * 40]);
        if (i === 3) setOutput(prev => [...prev, '[████████████░░░░░░░░] 72% 🟢 SAFE']);
        if (i === 4) setOutput(prev => [...prev, '✅ Consent verification complete!']);
        if (i === 5) setOutput(prev => [...prev, '💚 Proceed with confidence']);
      } else if (command.category === 'visualization') {
        if (i === 0) setOutput(prev => [...prev, '🔄 Recursive Loop Visualization']);
        if (i === 1) setOutput(prev => [...prev, '=' * 40]);
        if (i === 3) setOutput(prev => [...prev, '🌀 Level 0: Recursing...']);
        if (i === 4) setOutput(prev => [...prev, '  🔄 Level 1: Recursing...']);
        if (i === 5) setOutput(prev => [...prev, '    ♻️ Level 2: Recursing...']);
        if (i === 6) setOutput(prev => [...prev, '🎯 Final pattern: loop(loop(∞))']);
      } else if (command.category === 'ritual') {
        if (i === 0) setOutput(prev => [...prev, '🔮 Sigil Generator']);
        if (i === 1) setOutput(prev => [...prev, '=' * 20]);
        if (i === 3) setOutput(prev => [...prev, '    ∞    ']);
        if (i === 4) setOutput(prev => [...prev, '  ◊   ◊  ']);
        if (i === 5) setOutput(prev => [...prev, ' ◊  ∞  ◊ ']);
        if (i === 6) setOutput(prev => [...prev, '✨ Meditate on this sigil to invoke the concept']);
      }
    }

    setIsRunning(false);
  };

  const copyScript = () => {
    if (selectedCommand) {
      navigator.clipboard.writeText(selectedCommand.script);
    }
  };

  const downloadScript = () => {
    if (selectedCommand) {
      const blob = new Blob([selectedCommand.script], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = selectedCommand.command;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const commandsByCategory = getCommandsByCategory(currentCategory);

  return (
    <div className={`bg-void-900 rounded-lg border border-void-700 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-void-800 px-4 py-3 border-b border-void-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-green-400" />
            <span className="text-white font-mono text-sm">Terminal Graphics Simulator</span>
          </div>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
        </div>
      </div>

      <div className="flex h-96">
        {/* Command List */}
        <div className="w-1/3 border-r border-void-700 bg-void-850">
          {/* Category Tabs */}
          <div className="flex border-b border-void-700">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setCurrentCategory(category)}
                className={`flex-1 px-3 py-2 text-xs font-mono capitalize transition-colors ${
                  currentCategory === category
                    ? 'bg-void-700 text-white'
                    : 'text-void-400 hover:text-void-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Command List */}
          <div className="p-2 space-y-1 max-h-80 overflow-y-auto">
            {commandsByCategory.map(command => (
              <button
                key={command.id}
                onClick={() => setSelectedCommand(command)}
                className={`w-full text-left p-2 rounded text-xs transition-colors ${
                  selectedCommand?.id === command.id
                    ? 'bg-purple-600 text-white'
                    : 'text-void-300 hover:bg-void-700'
                }`}
              >
                <div className="font-mono">{command.command}</div>
                <div className="text-void-400 text-xs mt-1">{command.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Terminal Output */}
        <div className="flex-1 flex flex-col">
          {/* Controls */}
          {selectedCommand && (
            <div className="bg-void-800 px-4 py-2 border-b border-void-700 flex items-center gap-2">
              <button
                onClick={() => simulateExecution(selectedCommand)}
                disabled={isRunning}
                className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded text-xs text-white transition-colors"
              >
                <Play className="w-3 h-3" />
                Run
              </button>
              <button
                onClick={copyScript}
                className="flex items-center gap-1 px-3 py-1 bg-void-700 hover:bg-void-600 rounded text-xs text-void-300 transition-colors"
              >
                <Copy className="w-3 h-3" />
                Copy
              </button>
              <button
                onClick={downloadScript}
                className="flex items-center gap-1 px-3 py-1 bg-void-700 hover:bg-void-600 rounded text-xs text-void-300 transition-colors"
              >
                <Download className="w-3 h-3" />
                Download
              </button>
            </div>
          )}

          {/* Output Area */}
          <div 
            ref={outputRef}
            className="flex-1 p-4 font-mono text-sm text-green-400 bg-black overflow-y-auto"
          >
            {selectedCommand ? (
              output.length > 0 ? (
                <div className="space-y-1">
                  {output.map((line, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {line}
                    </motion.div>
                  ))}
                  {isRunning && (
                    <motion.div
                      animate={{ opacity: [1, 0] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="inline-block w-2 h-4 bg-green-400 ml-1"
                    />
                  )}
                </div>
              ) : (
                <div className="text-void-500">
                  Click "Run" to execute {selectedCommand.command}
                </div>
              )
            ) : (
              <div className="text-void-500">
                Select a command from the list to view and execute
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
