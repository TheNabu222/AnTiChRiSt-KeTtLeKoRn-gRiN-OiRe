
import { HierarchicalLabel, ZettelEntry } from '../types';

export class HierarchicalLabelingSystem {
  // Generate hierarchical ID based on tier and parent
  static generateHierarchicalId(
    tier: HierarchicalLabel['tier'],
    parentId?: string,
    siblingCount: number = 0
  ): string {
    switch (tier) {
      case 'trunk':
        // Format: 1000, 2000, 3000, etc.
        return `${(siblingCount + 1) * 1000}`;
      
      case 'branch':
        // Format: 1100, 1200, 1300, etc.
        if (!parentId) throw new Error('Branch requires parent trunk ID');
        const trunkBase = parseInt(parentId);
        return `${trunkBase + (siblingCount + 1) * 100}`;
      
      case 'leaf':
        // Format: 1101, 1102, 1103, etc.
        if (!parentId) throw new Error('Leaf requires parent branch ID');
        const branchBase = parseInt(parentId);
        return `${branchBase + (siblingCount + 1)}`;
      
      case 'flower':
        // Format: 1101/1, 1101/2, 1101/3, etc.
        if (!parentId) throw new Error('Flower requires parent leaf ID');
        return `${parentId}/${siblingCount + 1}`;
      
      case 'fruit':
        // Format: 1101/1-A, 1101/1-B, 1101/1-C, etc.
        if (!parentId) throw new Error('Fruit requires parent flower ID');
        const fruitLetter = String.fromCharCode(65 + siblingCount); // A, B, C...
        return `${parentId}-${fruitLetter}`;
      
      case 'bud':
        // Format: 1101/1-A/1a.1-1, 1101/1-A/1a.1-2, etc.
        if (!parentId) throw new Error('Bud requires parent fruit ID');
        return `${parentId}/1a.1-${siblingCount + 1}`;
      
      default:
        throw new Error(`Unknown tier: ${tier}`);
    }
  }

  // Parse hierarchical ID to determine tier and parent
  static parseHierarchicalId(id: string): {
    tier: HierarchicalLabel['tier'];
    tierLevel: number;
    parentId?: string;
  } {
    // Bud pattern: 1101/1-A/1a.1-1
    if (id.includes('/') && id.includes('-') && id.includes('.')) {
      const parts = id.split('/');
      const parentId = parts.slice(0, -1).join('/');
      return { tier: 'bud', tierLevel: 6, parentId };
    }
    
    // Fruit pattern: 1101/1-A
    if (id.includes('/') && id.includes('-') && !id.includes('.')) {
      const parts = id.split('-');
      const parentId = parts[0];
      return { tier: 'fruit', tierLevel: 5, parentId };
    }
    
    // Flower pattern: 1101/1
    if (id.includes('/') && !id.includes('-')) {
      const parts = id.split('/');
      const parentId = parts[0];
      return { tier: 'flower', tierLevel: 4, parentId };
    }
    
    // Leaf pattern: 1101, 1102, etc. (4-digit numbers not ending in 00)
    if (/^\d{4}$/.test(id) && !id.endsWith('00')) {
      const branchId = id.substring(0, 2) + '00';
      return { tier: 'leaf', tierLevel: 3, parentId: branchId };
    }
    
    // Branch pattern: 1100, 1200, etc. (4-digit numbers ending in 00 but not 000)
    if (/^\d{2}00$/.test(id)) {
      const trunkId = id.substring(0, 1) + '000';
      return { tier: 'branch', tierLevel: 2, parentId: trunkId };
    }
    
    // Trunk pattern: 1000, 2000, etc. (4-digit numbers ending in 000)
    if (/^\d000$/.test(id)) {
      return { tier: 'trunk', tierLevel: 1 };
    }
    
    throw new Error(`Invalid hierarchical ID format: ${id}`);
  }

  // Get all children of a hierarchical ID
  static getChildrenIds(parentId: string, allEntries: ZettelEntry[]): string[] {
    return allEntries
      .filter(entry => {
        if (!entry.hierarchicalId) return false;
        try {
          const parsed = this.parseHierarchicalId(entry.hierarchicalId);
          return parsed.parentId === parentId;
        } catch {
          return false;
        }
      })
      .map(entry => entry.hierarchicalId!)
      .sort();
  }

  // Get the full hierarchical path
  static getHierarchicalPath(id: string, allEntries: ZettelEntry[]): string[] {
    const path: string[] = [];
    let currentId: string | undefined = id;
    
    while (currentId) {
      path.unshift(currentId);
      try {
        const parsed = this.parseHierarchicalId(currentId);
        currentId = parsed.parentId;
      } catch {
        break;
      }
    }
    
    return path;
  }

  // Generate sacred clown aspect based on hierarchical position
  static generateSacredClownAspect(
    tier: HierarchicalLabel['tier'],
    hierarchicalId: string
  ): string {
    const clownAspects = {
      trunk: ['Cosmic Jester', 'Reality Hacker', 'Paradigm Shifter', 'Truth Fool'],
      branch: ['Wisdom Trickster', 'Pattern Breaker', 'Sacred Satirist', 'Divine Comedian'],
      leaf: ['Healing Humorist', 'Trauma Transformer', 'Absurdity Alchemist', 'Joy Weaver'],
      flower: ['Moment Magician', 'Spontaneous Sage', 'Laughter Liberator', 'Wit Wizard'],
      fruit: ['Harvest Harlequin', 'Completion Clown', 'Fruition Fool', 'Manifestation Mime'],
      bud: ['Potential Prankster', 'Future Fool', 'Possibility Pixie', 'Tomorrow Trickster']
    };
    
    const aspects = clownAspects[tier];
    const hash = hierarchicalId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return aspects[hash % aspects.length];
  }

  // Generate cliotic node ID based on hierarchical position
  static generateClioticNodeId(
    tier: HierarchicalLabel['tier'],
    hierarchicalId: string,
    emotionalWeight: number = 0.5
  ): string {
    const nodeTypes = {
      trunk: 'CORE',
      branch: 'MAJOR',
      leaf: 'MINOR',
      flower: 'MICRO',
      fruit: 'NANO',
      bud: 'QUANTUM'
    };
    
    const intensity = Math.floor(emotionalWeight * 10);
    return `${nodeTypes[tier]}-${hierarchicalId.replace(/[\/\-\.]/g, '_')}-${intensity}`;
  }

  // Validate hierarchical ID format
  static validateHierarchicalId(id: string): boolean {
    try {
      this.parseHierarchicalId(id);
      return true;
    } catch {
      return false;
    }
  }

  // Get tier color for UI display
  static getTierColor(tier: HierarchicalLabel['tier']): string {
    const colors = {
      trunk: '#ff00ff', // Magenta
      branch: '#00ffff', // Cyan
      leaf: '#ffff00', // Yellow
      flower: '#ff1493', // Hot Pink
      fruit: '#00ff00', // Bright Green
      bud: '#8a2be2' // Electric Purple
    };
    return colors[tier];
  }

  // Get tier emoji for UI display
  static getTierEmoji(tier: HierarchicalLabel['tier']): string {
    const emojis = {
      trunk: '🌳',
      branch: '🌿',
      leaf: '🍃',
      flower: '🌸',
      fruit: '🍎',
      bud: '🌱'
    };
    return emojis[tier];
  }
}
