
import { ZettelEntry, Trunk, KnowledgeNode, KnowledgeEdge, CrossReferenceMatrix, SemanticConnection } from '../types';

// Generate knowledge nodes from entries
export function generateKnowledgeNodes(entries: ZettelEntry[], trunks: Trunk[]): KnowledgeNode[] {
  return entries.map((entry, index) => {
    const trunk = trunks.find(t => t.id === entry.trunkId);
    
    // Determine node type based on entry characteristics
    let nodeType: KnowledgeNode['type'] = 'concept';
    if (entry.ritualScript || entry.metadata?.protocols?.length) {
      nodeType = 'protocol';
    } else if (entry.metadata?.type === 'practice' || entry.logic.toLowerCase().includes('practice')) {
      nodeType = 'practice';
    } else if (entry.metadata?.type === 'entity' || entry.title.toLowerCase().includes('entity')) {
      nodeType = 'entity';
    } else if (entry.logic.toLowerCase().includes('insight') || entry.logic.toLowerCase().includes('revelation')) {
      nodeType = 'insight';
    }

    // Calculate complexity based on content and connections
    const complexity = Math.min(1, (
      (entry.content?.length || 0) / 1000 +
      (entry.tags?.length || 0) / 10 +
      (entry.connections?.length || 0) / 5 +
      (entry.metadata?.cross_refs?.length || 0) / 5
    ) / 4);

    // Position nodes in a rough circle initially (will be adjusted by layout algorithm)
    const angle = (index / entries.length) * 2 * Math.PI;
    const radius = 300 + Math.random() * 200;
    const position = {
      x: 500 + Math.cos(angle) * radius,
      y: 400 + Math.sin(angle) * radius
    };

    return {
      id: entry.id,
      entryId: entry.id,
      trunkId: entry.trunkId,
      title: entry.title,
      type: nodeType,
      position,
      size: Math.max(0.3, complexity),
      color: trunk?.emoji || '#6B7280',
      metadata: {
        tags: entry.tags || [],
        themes: entry.metadata?.themes || [],
        emotionalWeight: entry.emotionalWeight,
        complexity,
        lastAccessed: new Date()
      }
    };
  });
}

// Generate knowledge edges based on various connection types
export function generateKnowledgeEdges(entries: ZettelEntry[], nodes: KnowledgeNode[]): KnowledgeEdge[] {
  const edges: KnowledgeEdge[] = [];
  const nodeMap = new Map(nodes.map(node => [node.entryId, node]));

  entries.forEach(entry => {
    const sourceNode = nodeMap.get(entry.id);
    if (!sourceNode) return;

    // Direct connections
    entry.connections?.forEach(connectionId => {
      const targetNode = nodeMap.get(connectionId);
      if (targetNode) {
        edges.push(createEdge(sourceNode.id, targetNode.id, 'conceptual', 0.8, 'Direct connection'));
      }
    });

    // Cross-references
    entry.metadata?.cross_refs?.forEach(refId => {
      const targetNode = nodeMap.get(refId);
      if (targetNode) {
        edges.push(createEdge(sourceNode.id, targetNode.id, 'conceptual', 0.6, 'Cross-reference'));
      }
    });

    // Resistance relationships
    entry.resistanceTo?.forEach(targetId => {
      const targetNode = nodeMap.get(targetId);
      if (targetNode) {
        edges.push(createEdge(sourceNode.id, targetNode.id, 'resistance_to', 0.7, 'Resistance relationship'));
      }
    });

    // Healing relationships
    entry.heals?.forEach(targetId => {
      const targetNode = nodeMap.get(targetId);
      if (targetNode) {
        edges.push(createEdge(sourceNode.id, targetNode.id, 'heals', 0.7, 'Healing relationship'));
      }
    });

    // Subversion relationships
    entry.subverts?.forEach(targetId => {
      const targetNode = nodeMap.get(targetId);
      if (targetNode) {
        edges.push(createEdge(sourceNode.id, targetNode.id, 'subverts', 0.6, 'Subversion relationship'));
      }
    });

    // Collaboration relationships
    entry.collaboratesWith?.forEach(targetId => {
      const targetNode = nodeMap.get(targetId);
      if (targetNode) {
        edges.push(createEdge(sourceNode.id, targetNode.id, 'collaborates_with', 0.8, 'Collaboration relationship'));
      }
    });

    // Manifestation relationships
    entry.manifestsAs?.forEach(targetId => {
      const targetNode = nodeMap.get(targetId);
      if (targetNode) {
        edges.push(createEdge(sourceNode.id, targetNode.id, 'manifests_as', 0.7, 'Manifestation relationship'));
      }
    });

    // Tag-based connections
    entries.forEach(otherEntry => {
      if (entry.id === otherEntry.id) return;
      
      const targetNode = nodeMap.get(otherEntry.id);
      if (!targetNode) return;

      const sharedTags = (entry.tags || []).filter(tag => 
        (otherEntry.tags || []).includes(tag)
      );

      if (sharedTags.length > 0) {
        const strength = Math.min(0.8, sharedTags.length * 0.2);
        edges.push(createEdge(
          sourceNode.id, 
          targetNode.id, 
          'conceptual', 
          strength, 
          `Shared tags: ${sharedTags.join(', ')}`
        ));
      }

      // Theme-based connections
      const sharedThemes = (entry.metadata?.themes || []).filter(theme =>
        (otherEntry.metadata?.themes || []).includes(theme)
      );

      if (sharedThemes.length > 0) {
        const strength = Math.min(0.7, sharedThemes.length * 0.25);
        edges.push(createEdge(
          sourceNode.id,
          targetNode.id,
          'mythic',
          strength,
          `Shared themes: ${sharedThemes.join(', ')}`
        ));
      }

      // Emotional weight similarity
      if (entry.emotionalWeight && otherEntry.emotionalWeight) {
        const weightDiff = Math.abs(entry.emotionalWeight - otherEntry.emotionalWeight);
        if (weightDiff < 0.3) {
          const strength = 0.5 - weightDiff;
          edges.push(createEdge(
            sourceNode.id,
            targetNode.id,
            'emotional',
            strength,
            'Similar emotional resonance'
          ));
        }
      }
    });
  });

  // Remove duplicate edges and return
  return removeDuplicateEdges(edges);
}

function createEdge(
  sourceId: string,
  targetId: string,
  relationship: SemanticConnection['type'],
  strength: number,
  description: string
): KnowledgeEdge {
  return {
    id: `edge-${sourceId}-${targetId}-${relationship}`,
    sourceId,
    targetId,
    relationship,
    strength,
    bidirectional: ['conceptual', 'emotional', 'collaborates_with'].includes(relationship),
    metadata: {
      description,
      discoveredBy: 'pattern_matching',
      confidence: strength,
      lastVerified: new Date()
    }
  };
}

function removeDuplicateEdges(edges: KnowledgeEdge[]): KnowledgeEdge[] {
  const seen = new Set<string>();
  return edges.filter(edge => {
    const key1 = `${edge.sourceId}-${edge.targetId}-${edge.relationship}`;
    const key2 = `${edge.targetId}-${edge.sourceId}-${edge.relationship}`;
    
    if (seen.has(key1) || (edge.bidirectional && seen.has(key2))) {
      return false;
    }
    
    seen.add(key1);
    return true;
  });
}

// Generate clusters using simple community detection
export function generateClusters(nodes: KnowledgeNode[], edges: KnowledgeEdge[]) {
  const clusters: CrossReferenceMatrix['clusters'] = [];
  const visited = new Set<string>();
  
  // Build adjacency list
  const adjacency = new Map<string, Set<string>>();
  nodes.forEach(node => adjacency.set(node.id, new Set()));
  
  edges.forEach(edge => {
    adjacency.get(edge.sourceId)?.add(edge.targetId);
    if (edge.bidirectional) {
      adjacency.get(edge.targetId)?.add(edge.sourceId);
    }
  });

  // Simple clustering based on connectivity
  nodes.forEach(node => {
    if (visited.has(node.id)) return;
    
    const cluster = exploreCluster(node.id, adjacency, visited);
    if (cluster.length >= 2) {
      const clusterNodes = nodes.filter(n => cluster.includes(n.id));
      const centroid = calculateCentroid(clusterNodes);
      const theme = inferClusterTheme(clusterNodes);
      
      clusters.push({
        id: `cluster-${clusters.length}`,
        name: theme,
        nodeIds: cluster,
        centroid,
        theme,
        color: getClusterColor(clusters.length)
      });
    }
  });

  return clusters;
}

function exploreCluster(
  startNodeId: string,
  adjacency: Map<string, Set<string>>,
  visited: Set<string>,
  cluster: string[] = []
): string[] {
  if (visited.has(startNodeId)) return cluster;
  
  visited.add(startNodeId);
  cluster.push(startNodeId);
  
  const neighbors = adjacency.get(startNodeId) || new Set();
  neighbors.forEach(neighborId => {
    if (!visited.has(neighborId)) {
      exploreCluster(neighborId, adjacency, visited, cluster);
    }
  });
  
  return cluster;
}

function calculateCentroid(nodes: KnowledgeNode[]): { x: number; y: number } {
  if (nodes.length === 0) return { x: 0, y: 0 };
  
  const sum = nodes.reduce(
    (acc, node) => ({
      x: acc.x + node.position.x,
      y: acc.y + node.position.y
    }),
    { x: 0, y: 0 }
  );
  
  return {
    x: sum.x / nodes.length,
    y: sum.y / nodes.length
  };
}

function inferClusterTheme(nodes: KnowledgeNode[]): string {
  const allTags = nodes.flatMap(node => node.metadata.tags);
  const allThemes = nodes.flatMap(node => node.metadata.themes);
  
  // Find most common tag or theme
  const tagCounts = new Map<string, number>();
  [...allTags, ...allThemes].forEach(tag => {
    tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
  });
  
  const mostCommon = Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])[0];
  
  return mostCommon ? mostCommon[0] : `Cluster ${nodes.length} nodes`;
}

function getClusterColor(index: number): string {
  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
  ];
  return colors[index % colors.length];
}

// Apply force-directed layout algorithm
export function applyForceDirectedLayout(
  nodes: KnowledgeNode[],
  edges: KnowledgeEdge[],
  iterations: number = 100
): KnowledgeNode[] {
  const updatedNodes = nodes.map(node => ({ ...node }));
  const k = Math.sqrt((1000 * 800) / nodes.length); // Optimal distance
  
  for (let iter = 0; iter < iterations; iter++) {
    const forces = new Map<string, { x: number; y: number }>();
    
    // Initialize forces
    updatedNodes.forEach(node => {
      forces.set(node.id, { x: 0, y: 0 });
    });
    
    // Repulsive forces between all nodes
    for (let i = 0; i < updatedNodes.length; i++) {
      for (let j = i + 1; j < updatedNodes.length; j++) {
        const node1 = updatedNodes[i];
        const node2 = updatedNodes[j];
        
        const dx = node1.position.x - node2.position.x;
        const dy = node1.position.y - node2.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;
        
        const force = (k * k) / distance;
        const fx = (dx / distance) * force;
        const fy = (dy / distance) * force;
        
        const force1 = forces.get(node1.id)!;
        const force2 = forces.get(node2.id)!;
        
        force1.x += fx;
        force1.y += fy;
        force2.x -= fx;
        force2.y -= fy;
      }
    }
    
    // Attractive forces for connected nodes
    edges.forEach(edge => {
      const source = updatedNodes.find(n => n.id === edge.sourceId);
      const target = updatedNodes.find(n => n.id === edge.targetId);
      
      if (!source || !target) return;
      
      const dx = target.position.x - source.position.x;
      const dy = target.position.y - source.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy) || 1;
      
      const force = (distance * distance) / k * edge.strength;
      const fx = (dx / distance) * force;
      const fy = (dy / distance) * force;
      
      const sourceForce = forces.get(source.id)!;
      const targetForce = forces.get(target.id)!;
      
      sourceForce.x += fx;
      sourceForce.y += fy;
      targetForce.x -= fx;
      targetForce.y -= fy;
    });
    
    // Apply forces with cooling
    const temperature = 0.1 * (1 - iter / iterations);
    
    updatedNodes.forEach(node => {
      const force = forces.get(node.id)!;
      const displacement = Math.sqrt(force.x * force.x + force.y * force.y) || 1;
      
      node.position.x += (force.x / displacement) * Math.min(displacement, temperature * 50);
      node.position.y += (force.y / displacement) * Math.min(displacement, temperature * 50);
      
      // Keep nodes within bounds
      node.position.x = Math.max(50, Math.min(950, node.position.x));
      node.position.y = Math.max(50, Math.min(750, node.position.y));
    });
  }
  
  return updatedNodes;
}

// Create initial matrix from knowledge base
export function createCrossReferenceMatrix(
  entries: ZettelEntry[],
  trunks: Trunk[]
): CrossReferenceMatrix {
  const nodes = generateKnowledgeNodes(entries, trunks);
  const edges = generateKnowledgeEdges(entries, nodes);
  const clusters = generateClusters(nodes, edges);
  
  // Apply initial layout
  const layoutNodes = applyForceDirectedLayout(nodes, edges, 50);
  
  return {
    nodes: layoutNodes,
    edges,
    clusters,
    layout: 'force',
    filters: {
      minStrength: 0.1,
      relationshipTypes: [
        'conceptual', 'mythic', 'recursive', 'emotional',
        'resistance_to', 'heals', 'subverts', 'collaborates_with', 'manifests_as'
      ],
      trunkIds: [],
      showClusters: true
    }
  };
}
