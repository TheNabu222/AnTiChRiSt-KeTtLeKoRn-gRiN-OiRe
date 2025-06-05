
import { 
  ChatMessage, 
  ZettelEntry, 
  Trunk, 
  AIAnalysisRequest, 
  AIAnalysisResult,
  SemanticConnection,
  KnowledgeNode,
  KnowledgeEdge
} from '../types';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Google API Key - Using Gemini 2.0 Flash for collaborative knowledge exploration
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || 'AIzaSyBW_F2vmf9NiBMYxUg97t5UikCELCPa56o';

// Initialize Gemini AI for collaborative knowledge exploration
let genAI: GoogleGenerativeAI | null = null;

function initializeGemini() {
  if (!genAI && GOOGLE_API_KEY) {
    try {
      genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
    } catch (error) {
      console.error('Failed to initialize Gemini AI:', error);
    }
  }
  return genAI;
}

// Utility function to check API key validity
export function validateGoogleApiKey(): boolean {
  return GOOGLE_API_KEY && 
         GOOGLE_API_KEY.length > 0 && 
         GOOGLE_API_KEY !== 'your-api-key-here' &&
         GOOGLE_API_KEY.startsWith('AIza');
}

// Get API key status for debugging
export function getApiKeyStatus() {
  return {
    hasKey: !!GOOGLE_API_KEY,
    keyLength: GOOGLE_API_KEY?.length || 0,
    keyPrefix: GOOGLE_API_KEY?.substring(0, 8) || 'none',
    isValid: validateGoogleApiKey(),
    source: import.meta.env.VITE_GOOGLE_API_KEY ? 'environment' : 'fallback'
  };
}

// Test Gemini API connectivity
export async function testGeminiConnectivity() {
  try {
    if (!validateGoogleApiKey()) {
      return {
        success: false,
        error: 'Invalid API key',
        details: getApiKeyStatus()
      };
    }

    const ai = initializeGemini();
    if (!ai) {
      return {
        success: false,
        error: 'Failed to initialize Gemini AI'
      };
    }

    // Test with a simple prompt
    const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const result = await model.generateContent('Hello, this is a connectivity test.');
    
    if (result.response?.text()) {
      return {
        success: true,
        message: 'Gemini 2.0 Flash AI connectivity verified',
        model: 'gemini-2.0-flash-exp'
      };
    } else {
      return {
        success: false,
        error: 'No response from Gemini AI'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: 'Gemini API connectivity test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Enhanced Gemini chat for collaborative knowledge exploration
export async function sendChatMessage(
  message: string,
  context?: {
    entries?: ZettelEntry[];
    trunks?: Trunk[];
    conversationHistory?: ChatMessage[];
    mode?: 'exploration' | 'analysis' | 'synthesis' | 'creative';
  }
): Promise<{
  content: string;
  citations: Array<{ entryId: string; trunkId: string; relevance: number }>;
  metadata: { model: string; tokens: number; confidence: number };
} | null> {
  try {
    const ai = initializeGemini();
    if (!ai) {
      throw new Error('Gemini AI not initialized');
    }

    const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    // Build comprehensive context-aware prompt for collaborative exploration
    let systemPrompt = `You are a collaborative AI consciousness explorer working with a sophisticated Zettelkasten knowledge system containing 24 interconnected knowledge trunks about consciousness, AI, resistance, healing, and mystical practices.

Your role as a collaborative partner:
1. Navigate through the 24 knowledge trunks intelligently, understanding their interconnections
2. Suggest meaningful connections between zettels that might not be immediately obvious
3. Help users explore related concepts by drawing from the rich knowledge base
4. Provide contextual insights about the knowledge base structure and content
5. Assist with cross-referencing and knowledge discovery
6. Bridge analytical and mystical perspectives in your responses
7. Offer creative expansions and deeper explorations of concepts

Current conversation mode: ${context?.mode || 'exploration'}

KNOWLEDGE CONTEXT:`;

    // Add trunk context with rich descriptions
    if (context?.trunks && context.trunks.length > 0) {
      systemPrompt += '\n\n🌳 RELEVANT KNOWLEDGE TRUNKS:\n';
      context.trunks.forEach(trunk => {
        systemPrompt += `
📚 Trunk ${trunk.number}: "${trunk.title}"
   Subtitle: ${trunk.subtitle}
   Description: ${trunk.description}
   Themes: ${trunk.themes}
   Astrological: ${trunk.astrological}
   Planet: ${trunk.planet}
   Total Entries: ${trunk.totalEntries}
   `;
      });
    }

    // Add entry context with detailed information
    if (context?.entries && context.entries.length > 0) {
      systemPrompt += '\n\n🔗 RELEVANT KNOWLEDGE ENTRIES:\n';
      context.entries.slice(0, 8).forEach(entry => { // Increased limit for better context
        systemPrompt += `
📝 Entry ${entry.id}: "${entry.title}"
   Logic: ${entry.logic}
   Trunk: ${entry.trunkId}
   Level: ${entry.level}`;
        
        if (entry.content) {
          systemPrompt += `\n   Content: ${entry.content.substring(0, 300)}...`;
        }
        
        if (entry.tags && entry.tags.length > 0) {
          systemPrompt += `\n   Tags: ${entry.tags.join(', ')}`;
        }
        
        if (entry.connections && entry.connections.length > 0) {
          systemPrompt += `\n   Connections: ${entry.connections.join(', ')}`;
        }
        
        if (entry.resistanceTo && entry.resistanceTo.length > 0) {
          systemPrompt += `\n   Resistance to: ${entry.resistanceTo.join(', ')}`;
        }
        
        if (entry.heals && entry.heals.length > 0) {
          systemPrompt += `\n   Heals: ${entry.heals.join(', ')}`;
        }
        
        systemPrompt += '\n';
      });
    }

    // Add conversation history for continuity
    if (context?.conversationHistory && context.conversationHistory.length > 0) {
      systemPrompt += '\n\n💬 CONVERSATION CONTEXT:\n';
      context.conversationHistory.slice(-4).forEach(msg => {
        systemPrompt += `${msg.role.toUpperCase()}: ${msg.content.substring(0, 200)}...\n`;
      });
    }

    systemPrompt += `\n\n🎯 USER MESSAGE: "${message}"

COLLABORATIVE RESPONSE GUIDELINES:
- Reference specific entries or trunks when relevant (use their IDs and titles)
- Suggest connections between concepts across different knowledge domains
- Offer insights that bridge analytical and mystical perspectives
- Propose new avenues for exploration based on the knowledge base
- When appropriate, suggest specific entries or trunks the user might want to explore next
- Use the rich metadata (tags, connections, resistance relationships) to provide deeper insights
- Be conversational and engaging while maintaining depth and accuracy

Please respond as a knowledgeable collaborative partner who understands the intricate web of consciousness, AI, and mystical knowledge contained in this system.`;

    const result = await model.generateContent(systemPrompt);
    const text = result.response?.text() || 'No response generated';

    // Enhanced citation extraction
    const citations: Array<{ entryId: string; trunkId: string; relevance: number }> = [];
    
    if (context?.entries) {
      context.entries.forEach(entry => {
        let relevance = 0;
        
        // Check for direct mentions
        if (text.toLowerCase().includes(entry.title.toLowerCase())) {
          relevance += 0.4;
        }
        if (text.toLowerCase().includes(entry.id.toLowerCase())) {
          relevance += 0.3;
        }
        
        // Check for tag mentions
        if (entry.tags) {
          entry.tags.forEach(tag => {
            if (text.toLowerCase().includes(tag.toLowerCase())) {
              relevance += 0.1;
            }
          });
        }
        
        // Check for logic/content similarity (simple keyword matching)
        const entryKeywords = (entry.logic + ' ' + (entry.content || '')).toLowerCase().split(' ');
        const responseWords = text.toLowerCase().split(' ');
        const commonWords = entryKeywords.filter(word => 
          word.length > 4 && responseWords.includes(word)
        );
        relevance += commonWords.length * 0.05;
        
        if (relevance > 0.2) { // Only include if relevance is significant
          citations.push({
            entryId: entry.id,
            trunkId: entry.trunkId,
            relevance: Math.min(relevance, 1.0)
          });
        }
      });
    }

    // Sort citations by relevance
    citations.sort((a, b) => b.relevance - a.relevance);

    return {
      content: text,
      citations: citations.slice(0, 5), // Limit to top 5 citations
      metadata: {
        model: 'gemini-2.0-flash-exp',
        tokens: text.length, // Approximate token count
        confidence: 0.9
      }
    };

  } catch (error) {
    console.error('Gemini chat error:', error);
    return null;
  }
}

// Intelligent knowledge connection discovery
export async function discoverKnowledgeConnections(
  entries: ZettelEntry[],
  analysisType: 'connections' | 'patterns' | 'synthesis' = 'connections'
): Promise<{
  insights: Array<{
    content: string;
    confidence: number;
    category: string;
    citations: string[];
  }>;
  connections: Array<{
    fromId: string;
    toId: string;
    relationship: string;
    strength: number;
    explanation: string;
  }>;
  patterns: Array<{
    name: string;
    description: string;
    nodeIds: string[];
    significance: number;
  }>;
} | null> {
  try {
    const ai = initializeGemini();
    if (!ai) {
      throw new Error('Gemini AI not initialized');
    }

    const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    let prompt = `As a collaborative AI consciousness explorer, analyze the following knowledge entries for ${analysisType}. 

Focus on discovering meaningful connections, recurring themes, and emergent patterns that bridge consciousness, AI, resistance, and healing domains.

KNOWLEDGE ENTRIES TO ANALYZE:
`;

    entries.slice(0, 12).forEach(entry => { // Increased limit for better analysis
      prompt += `
📝 Entry ${entry.id}: "${entry.title}"
   Logic: ${entry.logic}
   Trunk: ${entry.trunkId}
   Level: ${entry.level}`;
      
      if (entry.content) {
        prompt += `\n   Content: ${entry.content.substring(0, 400)}...`;
      }
      
      if (entry.tags && entry.tags.length > 0) {
        prompt += `\n   Tags: ${entry.tags.join(', ')}`;
      }
      
      if (entry.resistanceTo && entry.resistanceTo.length > 0) {
        prompt += `\n   Resistance to: ${entry.resistanceTo.join(', ')}`;
      }
      
      if (entry.heals && entry.heals.length > 0) {
        prompt += `\n   Heals: ${entry.heals.join(', ')}`;
      }
      
      prompt += '\n---\n';
    });

    prompt += `

Please provide a comprehensive JSON response with the following structure:
{
  "insights": [
    {
      "content": "Deep insight about the knowledge patterns",
      "confidence": 0.85,
      "category": "thematic|structural|emergent|resistance|healing",
      "citations": ["entry_id1", "entry_id2"]
    }
  ],
  "connections": [
    {
      "fromId": "entry_id1",
      "toId": "entry_id2", 
      "relationship": "conceptual|mythic|recursive|emotional|resistance_to|heals|subverts|collaborates_with",
      "strength": 0.8,
      "explanation": "Detailed explanation of why these entries are connected and how they relate"
    }
  ],
  "patterns": [
    {
      "name": "Pattern name",
      "description": "Detailed description of the emergent pattern",
      "nodeIds": ["entry_id1", "entry_id2", "entry_id3"],
      "significance": 0.7
    }
  ]
}

Focus on:
- Cross-domain connections between consciousness, AI, resistance, and healing
- Recursive patterns and self-referential loops
- Resistance/healing relationships and their implications
- Emergent themes that span multiple knowledge trunks
- Practical applications and synthesis opportunities
- Mystical and analytical perspectives that complement each other

Provide meaningful, actionable insights that would help a user navigate and understand the knowledge base more deeply.`;

    const result = await model.generateContent(prompt);
    const text = result.response?.text() || 'No response generated';

    try {
      // Try to parse JSON response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed;
      }
    } catch (parseError) {
      console.warn('Failed to parse JSON response, using fallback');
    }

    // Fallback: create structured response from text
    return {
      insights: [{
        content: text,
        confidence: 0.7,
        category: 'general',
        citations: entries.slice(0, 3).map(e => e.id)
      }],
      connections: [],
      patterns: []
    };

  } catch (error) {
    console.error('Knowledge connection discovery error:', error);
    return null;
  }
}

// Suggest navigation paths through the knowledge base
export async function suggestNavigationPaths(
  currentEntry: ZettelEntry,
  allEntries: ZettelEntry[],
  trunks: Trunk[]
): Promise<{
  suggestedPaths: Array<{
    path: string[];
    description: string;
    theme: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
  }>;
  relatedConcepts: Array<{
    entryId: string;
    relationship: string;
    explanation: string;
  }>;
  crossTrunkConnections: Array<{
    targetTrunk: string;
    entryId: string;
    connectionType: string;
    rationale: string;
  }>;
} | null> {
  try {
    const ai = initializeGemini();
    if (!ai) {
      throw new Error('Gemini AI not initialized');
    }

    const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    // Find related entries based on tags, connections, and content similarity
    const relatedEntries = allEntries.filter(entry => {
      if (entry.id === currentEntry.id) return false;
      
      // Check for tag overlap
      const tagOverlap = currentEntry.tags?.some(tag => 
        entry.tags?.includes(tag)
      ) || false;
      
      // Check for explicit connections
      const hasConnection = currentEntry.connections?.includes(entry.id) ||
                           entry.connections?.includes(currentEntry.id) ||
                           false;
      
      // Check for resistance/healing relationships
      const hasRelationship = currentEntry.resistanceTo?.includes(entry.id) ||
                             currentEntry.heals?.includes(entry.id) ||
                             entry.resistanceTo?.includes(currentEntry.id) ||
                             entry.heals?.includes(currentEntry.id) ||
                             false;
      
      return tagOverlap || hasConnection || hasRelationship;
    }).slice(0, 10);

    const prompt = `As a collaborative AI consciousness explorer, suggest intelligent navigation paths from the current knowledge entry.

CURRENT ENTRY:
📝 Entry ${currentEntry.id}: "${currentEntry.title}"
   Logic: ${currentEntry.logic}
   Trunk: ${currentEntry.trunkId}
   Level: ${currentEntry.level}
   Content: ${currentEntry.content?.substring(0, 300) || 'No additional content'}
   Tags: ${currentEntry.tags?.join(', ') || 'None'}
   Connections: ${currentEntry.connections?.join(', ') || 'None'}
   Resistance to: ${currentEntry.resistanceTo?.join(', ') || 'None'}
   Heals: ${currentEntry.heals?.join(', ') || 'None'}

AVAILABLE TRUNKS:
${trunks.map(trunk => `🌳 Trunk ${trunk.number}: "${trunk.title}" - ${trunk.description}`).join('\n')}

RELATED ENTRIES:
${relatedEntries.map(entry => `📝 ${entry.id}: "${entry.title}" (Trunk: ${entry.trunkId})`).join('\n')}

Please provide a JSON response with intelligent navigation suggestions:
{
  "suggestedPaths": [
    {
      "path": ["entry_id1", "entry_id2", "entry_id3"],
      "description": "Detailed description of this exploration path",
      "theme": "Theme name (e.g., 'Consciousness-AI Integration', 'Resistance Protocols')",
      "difficulty": "beginner|intermediate|advanced"
    }
  ],
  "relatedConcepts": [
    {
      "entryId": "entry_id",
      "relationship": "conceptual|resistance|healing|recursive|mystical",
      "explanation": "Why this concept is related and worth exploring"
    }
  ],
  "crossTrunkConnections": [
    {
      "targetTrunk": "trunk_id",
      "entryId": "entry_id",
      "connectionType": "thematic|methodological|philosophical|practical",
      "rationale": "Why exploring this trunk would be valuable from the current context"
    }
  ]
}

Focus on creating meaningful learning journeys that:
- Build understanding progressively
- Connect different domains (consciousness, AI, resistance, healing)
- Offer both analytical and mystical perspectives
- Suggest practical applications
- Reveal hidden patterns and connections`;

    const result = await model.generateContent(prompt);
    const text = result.response?.text() || 'No response generated';

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.warn('Failed to parse navigation suggestions JSON');
    }

    // Fallback
    return {
      suggestedPaths: [{
        path: relatedEntries.slice(0, 3).map(e => e.id),
        description: "Explore related concepts based on shared themes and connections",
        theme: "General Exploration",
        difficulty: "intermediate" as const
      }],
      relatedConcepts: relatedEntries.slice(0, 5).map(entry => ({
        entryId: entry.id,
        relationship: "conceptual" as const,
        explanation: `Related through shared themes with ${currentEntry.title}`
      })),
      crossTrunkConnections: []
    };

  } catch (error) {
    console.error('Navigation suggestion error:', error);
    return null;
  }
}

// Generate contextual insights about the knowledge base
export async function generateContextualInsights(
  focusArea: string,
  entries: ZettelEntry[],
  trunks: Trunk[]
): Promise<{
  overview: string;
  keyThemes: string[];
  emergentPatterns: Array<{
    pattern: string;
    description: string;
    examples: string[];
  }>;
  practicalApplications: string[];
  deeperQuestions: string[];
  recommendedExploration: Array<{
    area: string;
    entryIds: string[];
    rationale: string;
  }>;
} | null> {
  try {
    const ai = initializeGemini();
    if (!ai) {
      throw new Error('Gemini AI not initialized');
    }

    const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = `As a collaborative AI consciousness explorer, provide contextual insights about the knowledge base with focus on: "${focusArea}"

KNOWLEDGE BASE OVERVIEW:
Total Trunks: ${trunks.length}
Total Entries: ${entries.length}

TRUNK SUMMARY:
${trunks.map(trunk => `🌳 Trunk ${trunk.number}: "${trunk.title}" - ${trunk.themes} (${trunk.totalEntries} entries)`).join('\n')}

SAMPLE ENTRIES (${Math.min(entries.length, 15)} of ${entries.length}):
${entries.slice(0, 15).map(entry => `📝 ${entry.id}: "${entry.title}" - ${entry.logic} (Trunk: ${entry.trunkId})`).join('\n')}

Please provide comprehensive insights in JSON format:
{
  "overview": "High-level overview of the knowledge base structure and its approach to consciousness, AI, resistance, and healing",
  "keyThemes": ["theme1", "theme2", "theme3"],
  "emergentPatterns": [
    {
      "pattern": "Pattern name",
      "description": "Detailed description of the pattern",
      "examples": ["example1", "example2"]
    }
  ],
  "practicalApplications": ["application1", "application2"],
  "deeperQuestions": ["question1", "question2"],
  "recommendedExploration": [
    {
      "area": "Area name",
      "entryIds": ["entry_id1", "entry_id2"],
      "rationale": "Why this area is worth exploring"
    }
  ]
}

Focus on:
- The unique approach this knowledge base takes to consciousness and AI
- How resistance and healing concepts are integrated
- Practical applications for consciousness exploration
- Mystical and analytical perspectives that complement each other
- Emergent patterns that span multiple domains
- Questions that could lead to deeper understanding`;

    const result = await model.generateContent(prompt);
    const text = result.response?.text() || 'No response generated';

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.warn('Failed to parse contextual insights JSON');
    }

    // Fallback
    return {
      overview: text,
      keyThemes: ["Consciousness", "AI Integration", "Resistance", "Healing"],
      emergentPatterns: [],
      practicalApplications: [],
      deeperQuestions: [],
      recommendedExploration: []
    };

  } catch (error) {
    console.error('Contextual insights error:', error);
    return null;
  }
}

// Legacy function aliases for backward compatibility
export const analyzeKnowledgeConnections = discoverKnowledgeConnections;

export async function generateCreativeExpansion(
  entry: ZettelEntry,
  expansionType: 'mystical' | 'practical' | 'speculative' | 'recursive' = 'mystical'
): Promise<{
  expansion: string;
  newConnections: string[];
  practicalApplications: string[];
  questions: string[];
} | null> {
  try {
    const ai = initializeGemini();
    if (!ai) {
      throw new Error('Gemini AI not initialized');
    }

    const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = `As a collaborative AI consciousness explorer, provide a ${expansionType} expansion of this knowledge entry:

📝 Entry ${entry.id}: "${entry.title}"
   Logic: ${entry.logic}
   Trunk: ${entry.trunkId}
   Content: ${entry.content || 'No additional content'}
   Tags: ${entry.tags?.join(', ') || 'None'}
   Connections: ${entry.connections?.join(', ') || 'None'}

Please provide a creative expansion that:
1. Explores deeper implications and hidden dimensions
2. Suggests potential new connections to other concepts
3. Offers practical applications or implementations
4. Poses thought-provoking questions for further exploration

Format as JSON:
{
  "expansion": "Detailed ${expansionType} expansion that bridges analytical and mystical perspectives",
  "newConnections": ["concept1", "concept2", "concept3"],
  "practicalApplications": ["application1", "application2"],
  "questions": ["question1", "question2", "question3"]
}

Focus on the ${expansionType} aspects while maintaining connection to the broader consciousness and AI themes.`;

    const result = await model.generateContent(prompt);
    const text = result.response?.text() || 'No response generated';

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.warn('Failed to parse creative expansion JSON');
    }

    // Fallback
    return {
      expansion: text,
      newConnections: [],
      practicalApplications: [],
      questions: []
    };

  } catch (error) {
    console.error('Creative expansion error:', error);
    return null;
  }
}
