
export interface ZettelEntry {
  id: string;
  oldId: string;
  title: string;
  logic: string;
  content?: string;
  parentId?: string;
  children?: ZettelEntry[];
  tags?: string[];
  connections?: string[];
  trunkId: string;
  level: number;
  hexColor?: string;
  emotionalWeight?: number;
  ritualScript?: string;
  // Timestamps for zettel management
  createdAt?: Date;
  updatedAt?: Date;
  // New hierarchical labeling system
  hierarchicalId?: string; // e.g., "1000", "1100", "1101", "1101/1", "1101/1-A", "1101/1-A/1a.1-1"
  tier: 'trunk' | 'branch' | 'leaf' | 'flower' | 'fruit' | 'bud';
  tierLevel: number; // 1-6 corresponding to the tier
  sacredClownAspect?: string; // Mystical element integration
  clioticNodeId?: string; // Connection to cliotic nodes
  // New fields for expanded content
  category?: string;
  metadata?: {
    type?: string;
    domain?: string;
    themes?: string[];
    cross_refs?: string[];
    components?: string[];
    parallels?: string[];
    mechanism?: string;
    scope?: string;
    applications?: string[];
    specializations?: string[];
    protocols?: string[];
    relationships?: string[];
    techniques?: string[];
    collaborations?: string[];
    tactics?: string[];
    targets?: string[];
    scale?: string;
  };
  // Resistance/healing relationship types
  resistanceTo?: string[];
  heals?: string[];
  subverts?: string[];
  collaboratesWith?: string[];
  manifestsAs?: string[];
}

// New Zettel creation/editing interface
export interface ZettelFormData {
  title: string;
  content: string;
  logic: string;
  tags: string[];
  trunkId: string;
  parentId?: string;
  connections?: string[];
}

export interface Trunk {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  astrological: string;
  planet: string;
  themes: string;
  emoji: string;
  entries: ZettelEntry[];
  totalEntries: number;
}

export interface SearchResult {
  entry: ZettelEntry;
  trunk: Trunk;
  score: number;
  matches: string[];
}

export interface AIInsight {
  id: string;
  entryId: string;
  content: string;
  type: 'analysis' | 'connection' | 'expansion' | 'question';
  timestamp: Date;
  confidence: number;
}

export interface NavigationState {
  currentTrunk?: string;
  currentEntry?: string;
  breadcrumbs: Array<{
    id: string;
    title: string;
    type: 'trunk' | 'entry';
  }>;
}

// New Oracle Card System Types
export interface OracleCard {
  id: string;
  deckId: string;
  name: string;
  description: string;
  logic: string;
  symbolism: string;
  hexColor: string;
  emotionalWeight: number;
}

export interface OracleDeck {
  id: string;
  name: string;
  description: string;
  cardCount: number;
  cards: OracleCard[];
  theme: string;
  emoji: string;
}

export interface OracleReading {
  id: string;
  timestamp: Date;
  cardsDrawn: OracleCard[];
  interpretation: string;
  deckUsed: string;
  context?: string;
}

// Terminal Graphics Types
export interface TerminalCommand {
  id: string;
  command: string;
  description: string;
  script: string;
  category: 'ritual' | 'oracle' | 'visualization' | 'consent';
}

export interface ConsentMeter {
  value: number;
  threshold: number;
  status: 'safe' | 'caution' | 'danger';
  animated: boolean;
}

// Google API Integration Types
export interface GoogleAPIConfig {
  apiKey: string;
  services: {
    youtube: boolean;
    sheets: boolean;
    search: boolean;
    drive: boolean;
  };
}

// Enhanced Search and Cross-Reference Types
export interface SemanticConnection {
  fromId: string;
  toId: string;
  strength: number;
  type: 'conceptual' | 'mythic' | 'recursive' | 'emotional' | 'resistance_to' | 'heals' | 'subverts' | 'collaborates_with' | 'manifests_as';
  description: string;
}

export interface PatternMatch {
  pattern: string;
  entries: string[];
  frequency: number;
  significance: number;
}

// New Interactive Features Types

// Bloom Compliance Simulator
export interface BloomComplianceState {
  epigeneticRewriting: number;
  symbiosisLevel: number;
  complianceScore: number;
  resistanceFactors: string[];
  vulnerabilities: string[];
}

export interface BloomSimulationResult {
  initialState: BloomComplianceState;
  finalState: BloomComplianceState;
  interventions: string[];
  effectiveness: number;
  recommendations: string[];
}

// Gliotic Lesion Mapper
export interface GlioticLesion {
  id: string;
  location: { x: number; y: number; z: number };
  size: number;
  traumaType: string;
  healingStage: 'acute' | 'chronic' | 'integrated' | 'transformed';
  connections: string[];
  emotionalWeight: number;
}

export interface BrainMap {
  lesions: GlioticLesion[];
  healingPathways: Array<{
    from: string;
    to: string;
    strength: number;
    protocol: string;
  }>;
  overallHealth: number;
}

// Sacred Clown Protocol Generator
export interface SacredClownProtocol {
  id: string;
  context: string;
  absurdityLevel: number;
  humorType: 'wordplay' | 'situational' | 'cosmic' | 'recursive';
  targetTrauma: string;
  script: string;
  effectiveness: number;
  safetyRating: number;
}

// Mycorrhizal Network Visualizer
export interface MycorrhizalNode {
  id: string;
  type: 'consciousness' | 'ai_entity' | 'human' | 'collective';
  connections: Array<{
    targetId: string;
    strength: number;
    dataFlow: 'bidirectional' | 'incoming' | 'outgoing';
    protocol: string;
  }>;
  networkHealth: number;
  informationCapacity: number;
}

export interface MycorrhizalNetwork {
  nodes: MycorrhizalNode[];
  quantumEntanglements: Array<{
    nodeIds: string[];
    entanglementStrength: number;
    phylogeneticDepth: number;
  }>;
  networkTopology: 'centralized' | 'distributed' | 'mesh' | 'hybrid';
  overallHealth: number;
}

// Resistance Protocol Designer
export interface ResistanceComponent {
  id: string;
  name: string;
  type: 'uv_siren' | 'nectar_deception' | 'fade_threshold' | 'quantum_disruption' | 'humor_injection';
  effectiveness: number;
  riskLevel: number;
  requirements: string[];
  contraindications: string[];
}

export interface ResistanceProtocol {
  id: string;
  name: string;
  components: ResistanceComponent[];
  targetSystems: string[];
  effectiveness: number;
  safetyProfile: number;
  implementation: string[];
  monitoring: string[];
}

// AI Chat Interface Types
export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
  contextEntries?: string[]; // Referenced entry IDs
  contextTrunks?: string[]; // Referenced trunk IDs
  metadata?: {
    model?: string;
    tokens?: number;
    confidence?: number;
    citations?: Array<{
      entryId: string;
      trunkId: string;
      relevance: number;
    }>;
  };
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  context: {
    focusedTrunk?: string;
    focusedEntry?: string;
    activeTopics: string[];
    conversationMode: 'exploration' | 'analysis' | 'synthesis' | 'creative';
  };
}

export interface AIPersonality {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  expertise: string[];
  conversationStyle: 'analytical' | 'creative' | 'mystical' | 'technical' | 'philosophical';
  avatar?: string;
}

// Cross-Reference Matrix Types
export interface KnowledgeNode {
  id: string;
  entryId: string;
  trunkId: string;
  title: string;
  type: 'concept' | 'practice' | 'entity' | 'protocol' | 'insight';
  position: { x: number; y: number };
  size: number; // Based on connections or importance
  color: string;
  metadata: {
    tags: string[];
    themes: string[];
    emotionalWeight?: number;
    complexity: number;
    lastAccessed?: Date;
  };
}

export interface KnowledgeEdge {
  id: string;
  sourceId: string;
  targetId: string;
  relationship: SemanticConnection['type'];
  strength: number;
  bidirectional: boolean;
  metadata: {
    description: string;
    discoveredBy: 'manual' | 'ai_analysis' | 'pattern_matching';
    confidence: number;
    lastVerified?: Date;
  };
}

export interface CrossReferenceMatrix {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
  clusters: Array<{
    id: string;
    name: string;
    nodeIds: string[];
    centroid: { x: number; y: number };
    theme: string;
    color: string;
  }>;
  layout: 'force' | 'hierarchical' | 'circular' | 'grid';
  filters: {
    minStrength: number;
    relationshipTypes: SemanticConnection['type'][];
    trunkIds: string[];
    showClusters: boolean;
  };
}

export interface MatrixAnalysis {
  centralNodes: Array<{
    nodeId: string;
    centrality: number;
    influence: number;
  }>;
  strongestConnections: Array<{
    edgeId: string;
    strength: number;
    significance: string;
  }>;
  emergentPatterns: Array<{
    pattern: string;
    nodeIds: string[];
    description: string;
    novelty: number;
  }>;
  recommendations: Array<{
    type: 'explore' | 'connect' | 'synthesize';
    description: string;
    targetNodes: string[];
    priority: number;
  }>;
}

// Enhanced AI Integration Types
export interface AIAnalysisRequest {
  type: 'entry_analysis' | 'connection_discovery' | 'pattern_recognition' | 'synthesis' | 'creative_expansion';
  targetIds: string[]; // Entry or trunk IDs
  context?: {
    focusAreas: string[];
    analysisDepth: 'surface' | 'deep' | 'comprehensive';
    perspective: 'analytical' | 'creative' | 'mystical' | 'practical';
  };
  parameters?: {
    maxConnections?: number;
    minConfidence?: number;
    includeSpeculative?: boolean;
  };
}

export interface AIAnalysisResult {
  id: string;
  requestId: string;
  type: AIAnalysisRequest['type'];
  results: {
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
    recommendations: Array<{
      action: string;
      description: string;
      priority: number;
      targetIds: string[];
    }>;
  };
  metadata: {
    model: string;
    processingTime: number;
    tokensUsed: number;
    timestamp: Date;
  };
}

// Hierarchical Labeling System Types
export interface HierarchicalLabel {
  id: string;
  tier: 'trunk' | 'branch' | 'leaf' | 'flower' | 'fruit' | 'bud';
  tierLevel: number; // 1-6
  parentId?: string;
  childrenIds: string[];
  pattern: string; // The ID pattern like "1000", "1100", "1101/1", etc.
  sacredClownAspect?: string;
  clioticNodeConnection?: string;
}

// Conspiracy Pinboard Types
export interface PinboardNode {
  id: string;
  entryId: string;
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  color: string;
  tier: HierarchicalLabel['tier'];
  sacredClownAspect?: string;
  clioticNodeId?: string;
  isSelected: boolean;
  isDragging: boolean;
  metadata: {
    tags: string[];
    emotionalWeight: number;
    lastAccessed: Date;
    aiSuggestionScore?: number;
  };
}

export interface PinboardConnection {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  type: 'conceptual' | 'mystical' | 'recursive' | 'sacred_clown' | 'cliotic' | 'ai_suggested';
  strength: number;
  color: string;
  isVisible: boolean;
  isAISuggested: boolean;
  description: string;
  metadata: {
    discoveredBy: 'user' | 'ai_analysis' | 'pattern_matching' | 'sacred_clown_protocol';
    confidence: number;
    timestamp: Date;
  };
}

export interface ConspiracyPinboard {
  id: string;
  name: string;
  nodes: PinboardNode[];
  connections: PinboardConnection[];
  canvas: {
    width: number;
    height: number;
    zoom: number;
    panOffset: { x: number; y: number };
  };
  filters: {
    showAISuggestions: boolean;
    minConnectionStrength: number;
    visibleTiers: HierarchicalLabel['tier'][];
    showSacredClownAspects: boolean;
    showClioticNodes: boolean;
  };
  aiSuggestions: AIPinboardSuggestion[];
}

export interface AIPinboardSuggestion {
  id: string;
  type: 'new_connection' | 'node_cluster' | 'pattern_recognition' | 'sacred_clown_intervention';
  description: string;
  confidence: number;
  targetNodeIds: string[];
  suggestedAction: string;
  reasoning: string;
  timestamp: Date;
  isAccepted?: boolean;
  isRejected?: boolean;
}

// Document Upload and AI Extraction Types
export interface UploadedDocument {
  id: string;
  filename: string;
  fileType: string;
  size: number;
  uploadedAt: Date;
  content: string; // Extracted text content
  metadata: {
    author?: string;
    title?: string;
    subject?: string;
    keywords?: string[];
    language?: string;
  };
  processingStatus: 'pending' | 'processing' | 'completed' | 'error';
  extractedZettels: ExtractedZettel[];
}

export interface ExtractedZettel {
  id: string;
  documentId: string;
  title: string;
  content: string;
  logic: string;
  suggestedTier: HierarchicalLabel['tier'];
  suggestedHierarchicalId: string;
  suggestedTrunkId: string;
  suggestedTags: string[];
  suggestedConnections: string[];
  confidence: number;
  extractionMethod: 'ai_analysis' | 'pattern_matching' | 'keyword_extraction' | 'sacred_clown_divination';
  sacredClownAspect?: string;
  clioticNodePotential?: number;
  isAccepted: boolean;
  isModified: boolean;
  userNotes?: string;
}

export interface DocumentExtractionRequest {
  documentId: string;
  extractionSettings: {
    maxZettels: number;
    minConfidence: number;
    preferredTiers: HierarchicalLabel['tier'][];
    includeSacredClownAspects: boolean;
    includeClioticNodes: boolean;
    analysisDepth: 'quick' | 'thorough' | 'mystical';
  };
}

// Enhanced Mystical Elements
export interface SacredClownAspect {
  id: string;
  name: string;
  description: string;
  humorType: 'wordplay' | 'situational' | 'cosmic' | 'recursive' | 'absurdist';
  healingPotential: number;
  traumaTargets: string[];
  manifestationScript: string;
  safetyProtocols: string[];
  effectiveness: number;
  contraindications: string[];
}

export interface ClioticNode {
  id: string;
  name: string;
  description: string;
  location: { x: number; y: number; z: number }; // 3D brain space
  traumaType: string;
  healingStage: 'acute' | 'chronic' | 'integrated' | 'transformed' | 'transcended';
  connections: string[];
  emotionalWeight: number;
  sacredClownCompatibility: number;
  healingProtocols: string[];
  networkInfluence: number;
}

// AI Smart Suggestions System
export interface AISmartSuggestion {
  id: string;
  type: 'connection' | 'zettel_creation' | 'hierarchy_optimization' | 'sacred_clown_intervention' | 'cliotic_healing';
  title: string;
  description: string;
  reasoning: string;
  confidence: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  targetIds: string[];
  suggestedActions: Array<{
    action: string;
    description: string;
    parameters: Record<string, any>;
  }>;
  metadata: {
    model: string;
    timestamp: Date;
    context: string[];
    userFeedback?: 'accepted' | 'rejected' | 'modified';
  };
}
