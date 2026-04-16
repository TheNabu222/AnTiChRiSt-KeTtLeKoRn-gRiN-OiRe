
'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Network, Eye } from 'lucide-react';
import Link from 'next/link';

interface Node {
  id: string;
  nodeId: string;
  legacyId?: string;
  title: string;
  content?: string;
  logic?: string;
  tags: string[];
  childNodes: Node[];
  parentNode?: Node;
  references: Array<{
    referencedNode: {
      id: string;
      nodeId: string;
      title: string;
    };
    relationshipType?: string;
  }>;
  referencedBy: Array<{
    referencingNode: {
      id: string;
      nodeId: string;
      title: string;
    };
    relationshipType?: string;
  }>;
}

interface Trunk {
  id: string;
  trunkId: number;
  title: string;
  description: string;
  zodiacSign?: string;
  planet?: string;
  theme?: string;
  color?: string;
  nodes: Node[];
}

export default function TrunkPage() {
  const params = useParams();
  const trunkId = params.trunkId as string;
  const [trunk, setTrunk] = useState<Trunk | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  useEffect(() => {
    const fetchTrunk = async () => {
      try {
        const response = await fetch(`/api/trunks/${trunkId}`);
        if (response.ok) {
          const data = await response.json();
          setTrunk(data);
        }
      } catch (error) {
        console.error('Error fetching trunk:', error);
      } finally {
        setLoading(false);
      }
    };

    if (trunkId) {
      fetchTrunk();
    }
  }, [trunkId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!trunk) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-100 mb-4">Trunk Not Found</h1>
          <Link href="/">
            <Button variant="outline">Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const rootNodes = trunk.nodes.filter(node => !node.parentNode);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-200">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Badge 
                  variant="outline" 
                  className="border-2"
                  style={{ borderColor: trunk.color, color: trunk.color }}
                >
                  {trunk.trunkId}
                </Badge>
                <h1 className="text-3xl font-bold text-slate-100">
                  {trunk.title}
                </h1>
              </div>
              <p className="text-lg text-slate-300 max-w-3xl">
                {trunk.description}
              </p>
              {trunk.theme && (
                <p className="text-slate-400 italic">{trunk.theme}</p>
              )}
              {(trunk.zodiacSign || trunk.planet) && (
                <div className="flex items-center space-x-4 text-sm text-slate-500">
                  {trunk.zodiacSign && (
                    <div className="flex items-center space-x-1">
                      <span>♈</span>
                      <span>{trunk.zodiacSign}</span>
                    </div>
                  )}
                  {trunk.planet && (
                    <div className="flex items-center space-x-1">
                      <span>☿</span>
                      <span>{trunk.planet}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Node
              </Button>
              <Button variant="outline" size="sm">
                <Network className="h-4 w-4 mr-2" />
                View Network
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Nodes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Nodes List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-100">
                Knowledge Nodes ({trunk.nodes.length})
              </h2>
            </div>
            
            {trunk.nodes.length === 0 ? (
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto bg-slate-700 rounded-full flex items-center justify-center">
                      <Plus className="h-8 w-8 text-slate-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-slate-200 mb-2">
                        No nodes yet
                      </h3>
                      <p className="text-slate-400 mb-4">
                        This trunk is waiting for its first knowledge node. Start building your digital grimoire.
                      </p>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create First Node
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {rootNodes.map((node, index) => (
                  <motion.div
                    key={node.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card 
                      className={`bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300 cursor-pointer ${
                        selectedNode?.id === node.id ? 'border-purple-500 bg-purple-500/10' : ''
                      }`}
                      onClick={() => setSelectedNode(node)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                                {node.nodeId}
                              </Badge>
                              {node.legacyId && (
                                <Badge variant="outline" className="text-xs border-slate-600 text-slate-500">
                                  {node.legacyId}
                                </Badge>
                              )}
                            </div>
                            <CardTitle className="text-slate-100">
                              {node.title}
                            </CardTitle>
                            {node.logic && (
                              <CardDescription className="text-slate-400 italic">
                                {node.logic}
                              </CardDescription>
                            )}
                          </div>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      {node.content && (
                        <CardContent>
                          <p className="text-slate-300 line-clamp-3">
                            {node.content}
                          </p>
                        </CardContent>
                      )}
                      {(node.tags.length > 0 || node.childNodes.length > 0) && (
                        <CardContent className="pt-0">
                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-1">
                              {node.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {node.tags.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{node.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                            {node.childNodes.length > 0 && (
                              <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                                {node.childNodes.length} children
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Node Details Sidebar */}
          <div className="space-y-6">
            {selectedNode ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-slate-100">Node Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-slate-200 mb-2">{selectedNode.title}</h4>
                      <p className="text-sm text-slate-400 mb-2">ID: {selectedNode.nodeId}</p>
                      {selectedNode.legacyId && (
                        <p className="text-sm text-slate-500 mb-2">Legacy: {selectedNode.legacyId}</p>
                      )}
                      {selectedNode.logic && (
                        <p className="text-sm text-slate-300 italic mb-2">{selectedNode.logic}</p>
                      )}
                      {selectedNode.content && (
                        <p className="text-sm text-slate-300">{selectedNode.content}</p>
                      )}
                    </div>
                    
                    {selectedNode.tags.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium text-slate-200 mb-2">Tags</h5>
                        <div className="flex flex-wrap gap-1">
                          {selectedNode.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {(selectedNode.references.length > 0 || selectedNode.referencedBy.length > 0) && (
                      <div>
                        <h5 className="text-sm font-medium text-slate-200 mb-2">Cross-References</h5>
                        <div className="space-y-2 text-sm">
                          {selectedNode.references.map((ref) => (
                            <div key={ref.referencedNode.id} className="text-slate-400">
                              → {ref.referencedNode.nodeId}: {ref.referencedNode.title}
                            </div>
                          ))}
                          {selectedNode.referencedBy.map((ref) => (
                            <div key={ref.referencingNode.id} className="text-slate-400">
                              ← {ref.referencingNode.nodeId}: {ref.referencingNode.title}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {selectedNode.childNodes.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium text-slate-200 mb-2">Child Nodes</h5>
                        <div className="space-y-1">
                          {selectedNode.childNodes.map((child) => (
                            <div key={child.id} className="text-sm text-slate-400">
                              {child.nodeId}: {child.title}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto bg-slate-700 rounded-full flex items-center justify-center">
                      <Eye className="h-8 w-8 text-slate-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-slate-200 mb-2">
                        Select a Node
                      </h3>
                      <p className="text-slate-400">
                        Click on any node to view its details, connections, and metadata.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
