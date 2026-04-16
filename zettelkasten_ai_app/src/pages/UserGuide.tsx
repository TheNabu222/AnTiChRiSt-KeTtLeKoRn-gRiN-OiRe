
import React, { useState } from 'react';
import { 
  BookOpen, 
  Brain, 
  MessageSquare, 
  Grid3X3, 
  Sparkles, 
  Database,
  Search,
  Plus,
  Link,
  Lightbulb,
  Settings,
  HelpCircle
} from 'lucide-react';

interface GuideSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

const UserGuide: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections: GuideSection[] = [
    {
      id: 'overview',
      title: 'Overview',
      icon: <BookOpen className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">What is Zettelkasten AI Consciousness Explorer?</h3>
            <p className="text-gray-600 mb-4">
              This application combines the traditional Zettelkasten note-taking methodology with modern AI capabilities 
              to create a powerful knowledge management and consciousness exploration system.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Key Concepts:</h4>
              <ul className="space-y-2 text-blue-800">
                <li><strong>Zettel:</strong> Individual knowledge notes that can be linked together</li>
                <li><strong>Trunk:</strong> Thematic categories organizing related knowledge areas</li>
                <li><strong>Cross-References:</strong> Connections between different knowledge domains</li>
                <li><strong>AI Integration:</strong> Intelligent assistance for knowledge exploration</li>
              </ul>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-3">Getting Started</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>Explore the Dashboard to get an overview of your knowledge base</li>
              <li>Browse through the 24 knowledge trunks to find areas of interest</li>
              <li>Create your first Zettel to start building your knowledge network</li>
              <li>Use the AI Chat to ask questions and explore ideas</li>
              <li>Discover connections using the Cross-Reference Matrix</li>
            </ol>
          </div>
        </div>
      )
    },
    {
      id: 'trunks',
      title: 'Knowledge Trunks',
      icon: <Database className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">Understanding Knowledge Trunks</h3>
            <p className="text-gray-600 mb-4">
              Your knowledge is organized into 24 thematic trunks, each containing related entries on specific topics. 
              These serve as the main organizational structure for your knowledge base.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Core Philosophy Trunks</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Consciousness Studies</li>
                <li>• Phenomenology</li>
                <li>• Metaphysics</li>
                <li>• Ethics & Morality</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">AI & Technology</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Artificial Intelligence</li>
                <li>• Machine Learning</li>
                <li>• Cognitive Science</li>
                <li>• Digital Philosophy</li>
              </ul>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">How to Use Trunks:</h4>
            <ul className="space-y-2 text-gray-600">
              <li>• Click on any trunk to explore its contents</li>
              <li>• Each trunk contains multiple entries with detailed information</li>
              <li>• Use the search function to find specific topics within trunks</li>
              <li>• Create new Zettels and assign them to relevant trunks</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'ai-chat',
      title: 'AI Chat Assistant',
      icon: <MessageSquare className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">AI-Powered Conversations</h3>
            <p className="text-gray-600 mb-4">
              The AI Chat Assistant helps you explore ideas, ask questions, and gain insights based on your knowledge base. 
              It's designed to facilitate deep thinking and creative exploration.
            </p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">What You Can Do:</h4>
            <ul className="space-y-2 text-green-800">
              <li>• Ask questions about consciousness, AI, and philosophy</li>
              <li>• Brainstorm new ideas and concepts</li>
              <li>• Get explanations of complex topics</li>
              <li>• Explore connections between different ideas</li>
              <li>• Receive suggestions for further research</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Tips for Effective AI Conversations:</h4>
            <ul className="space-y-2 text-gray-600">
              <li>• Be specific in your questions for better responses</li>
              <li>• Ask follow-up questions to dive deeper into topics</li>
              <li>• Use the chat to explore "what if" scenarios</li>
              <li>• Save important insights as new Zettels</li>
            </ul>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-900 mb-2">Gemini Collaborator:</h4>
            <p className="text-yellow-800">
              The right panel features Google's Gemini AI for additional perspectives and collaborative thinking. 
              Use it alongside the main chat for comprehensive exploration.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'zettels',
      title: 'Zettel Management',
      icon: <Plus className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">Creating and Managing Zettels</h3>
            <p className="text-gray-600 mb-4">
              Zettels are the building blocks of your knowledge system. Each Zettel represents a single idea, 
              concept, or piece of information that can be linked to others.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Creating Zettels</h4>
              <ul className="space-y-2 text-blue-800">
                <li>• Click "Create Zettel" in the sidebar</li>
                <li>• Choose a relevant trunk category</li>
                <li>• Add a descriptive title</li>
                <li>• Write your content in the editor</li>
                <li>• Add tags for better organization</li>
              </ul>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2">Best Practices</h4>
              <ul className="space-y-2 text-purple-800">
                <li>• Keep each Zettel focused on one idea</li>
                <li>• Use clear, descriptive titles</li>
                <li>• Link related Zettels together</li>
                <li>• Regular review and updating</li>
                <li>• Use consistent tagging</li>
              </ul>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Zettel Management Features:</h4>
            <ul className="space-y-2 text-gray-600">
              <li>• <strong>Search:</strong> Find Zettels by title, content, or tags</li>
              <li>• <strong>Filter:</strong> Organize by trunk, date, or tags</li>
              <li>• <strong>Edit:</strong> Update content and connections anytime</li>
              <li>• <strong>Link:</strong> Create connections between related ideas</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'matrix',
      title: 'Cross-Reference Matrix',
      icon: <Grid3X3 className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">Discovering Hidden Connections</h3>
            <p className="text-gray-600 mb-4">
              The Cross-Reference Matrix is a powerful tool that helps you discover unexpected relationships 
              and connections between different areas of your knowledge base.
            </p>
          </div>
          
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h4 className="font-semibold text-indigo-900 mb-2">How It Works:</h4>
            <ul className="space-y-2 text-indigo-800">
              <li>• Analyzes relationships between different trunks</li>
              <li>• Identifies common themes and concepts</li>
              <li>• Suggests potential connections to explore</li>
              <li>• Visualizes knowledge network patterns</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Using the Matrix:</h4>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>Select trunks you want to analyze</li>
              <li>Choose analysis parameters (themes, concepts, etc.)</li>
              <li>Review the generated connections</li>
              <li>Explore suggested relationships</li>
              <li>Create new Zettels based on discoveries</li>
            </ol>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="font-semibold text-orange-900 mb-2">Benefits:</h4>
            <p className="text-orange-800">
              The matrix helps break down knowledge silos, reveals interdisciplinary insights, 
              and sparks new research directions by showing how different domains connect.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'creative-tools',
      title: 'Creative Tools',
      icon: <Sparkles className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">Consciousness Exploration Tools</h3>
            <p className="text-gray-600 mb-4">
              Access a variety of creative and consciousness exploration tools designed to inspire 
              new perspectives and facilitate deeper understanding.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-pink-50 p-4 rounded-lg">
              <h4 className="font-semibold text-pink-900 mb-2">Oracle Cards</h4>
              <p className="text-pink-800 text-sm mb-2">
                Draw inspiration from consciousness-themed oracle cards for meditation and reflection.
              </p>
              <ul className="text-pink-700 text-sm space-y-1">
                <li>• Daily inspiration</li>
                <li>• Meditation prompts</li>
                <li>• Creative triggers</li>
              </ul>
            </div>
            <div className="bg-teal-50 p-4 rounded-lg">
              <h4 className="font-semibold text-teal-900 mb-2">Sacred Clown Generator</h4>
              <p className="text-teal-800 text-sm mb-2">
                Generate playful, wisdom-filled personas for creative exploration and perspective shifts.
              </p>
              <ul className="text-teal-700 text-sm space-y-1">
                <li>• Creative personas</li>
                <li>• Perspective shifts</li>
                <li>• Wisdom through play</li>
              </ul>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Terminal Graphics</h4>
              <p className="text-green-800 text-sm mb-2">
                Explore consciousness through interactive terminal-style visualizations and commands.
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2">Specialized Simulators</h4>
              <p className="text-purple-800 text-sm mb-2">
                Access various consciousness and network simulation tools for deep exploration.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'tips',
      title: 'Tips & Best Practices',
      icon: <Lightbulb className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">Making the Most of Your Knowledge System</h3>
          </div>
          
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Daily Practice</h4>
              <ul className="space-y-2 text-blue-800">
                <li>• Start each session by reviewing recent Zettels</li>
                <li>• Create at least one new Zettel per session</li>
                <li>• Use the AI chat to explore new questions</li>
                <li>• Regularly check the Cross-Reference Matrix for new connections</li>
              </ul>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Knowledge Organization</h4>
              <ul className="space-y-2 text-green-800">
                <li>• Use consistent tagging across your Zettels</li>
                <li>• Create links between related concepts</li>
                <li>• Regularly review and update older Zettels</li>
                <li>• Use the search function to avoid duplicates</li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-900 mb-2">Creative Exploration</h4>
              <ul className="space-y-2 text-yellow-800">
                <li>• Use Oracle cards for daily inspiration</li>
                <li>• Experiment with different AI conversation styles</li>
                <li>• Explore unexpected trunk combinations in the matrix</li>
                <li>• Document insights from creative tools as new Zettels</li>
              </ul>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2">Troubleshooting</h4>
              <ul className="space-y-2 text-purple-800">
                <li>• If you can't find something, try different search terms</li>
                <li>• Use the help tooltips throughout the interface</li>
                <li>• Restart the onboarding tour if you need a refresher</li>
                <li>• Check the console for any technical issues</li>
              </ul>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Guide</h1>
          <p className="text-gray-600">
            Complete guide to using the Zettelkasten AI Consciousness Explorer
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
              <h2 className="font-semibold text-gray-900 mb-4">Contents</h2>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {section.icon}
                    <span className="text-sm font-medium">{section.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-8">
              {sections.find(s => s.id === activeSection)?.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGuide;
