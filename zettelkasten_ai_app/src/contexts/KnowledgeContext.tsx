
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Trunk, ZettelEntry, SearchResult, NavigationState, ZettelFormData } from '../types';
import { parseKnowledgeBase, getAllEntries, findEntry } from '../data/knowledgeParser';
import Fuse from 'fuse.js';

interface KnowledgeContextType {
  trunks: Trunk[];
  allEntries: ZettelEntry[];
  loading: boolean;
  searchEntries: (query: string) => SearchResult[];
  getTrunk: (id: string) => Trunk | undefined;
  getEntry: (id: string) => { entry: ZettelEntry; trunk: Trunk } | null;
  navigation: NavigationState;
  setNavigation: (nav: NavigationState) => void;
  // Zettel CRUD operations
  createZettel: (data: ZettelFormData) => Promise<ZettelEntry>;
  updateZettel: (id: string, data: Partial<ZettelFormData>) => Promise<ZettelEntry>;
  deleteZettel: (id: string) => Promise<void>;
  // Zettel management
  getZettelsByTrunk: (trunkId: string) => ZettelEntry[];
  getZettelsByTag: (tag: string) => ZettelEntry[];
  getRecentZettels: (limit?: number) => ZettelEntry[];
}

const KnowledgeContext = createContext<KnowledgeContextType | undefined>(undefined);

export function useKnowledge() {
  const context = useContext(KnowledgeContext);
  if (context === undefined) {
    throw new Error('useKnowledge must be used within a KnowledgeProvider');
  }
  return context;
}

interface KnowledgeProviderProps {
  children: ReactNode;
}

export function KnowledgeProvider({ children }: KnowledgeProviderProps) {
  const [trunks, setTrunks] = useState<Trunk[]>([]);
  const [allEntries, setAllEntries] = useState<ZettelEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [fuse, setFuse] = useState<Fuse<ZettelEntry> | null>(null);
  const [navigation, setNavigation] = useState<NavigationState>({
    breadcrumbs: []
  });

  useEffect(() => {
    async function loadKnowledgeBase() {
      try {
        console.log('Loading knowledge base...');
        
        // Try to load the markdown file, but fallback to sample data if it fails
        let markdownContent = '';
        try {
          const response = await fetch('/REORDERED_MASTER_INDEX.md');
          if (response.ok) {
            markdownContent = await response.text();
            console.log('Loaded markdown file successfully');
          } else {
            console.warn('Failed to load markdown file, using sample data');
          }
        } catch (fetchError) {
          console.warn('Fetch error, using sample data:', fetchError);
        }
        
        // Parse the knowledge base (will use sample data if markdown is empty)
        const parsedTrunks = parseKnowledgeBase(markdownContent);
        const entries = getAllEntries(parsedTrunks);
        
        console.log('Setting trunks:', parsedTrunks.length);
        setTrunks(parsedTrunks);
        setAllEntries(entries);
        
        // Initialize search
        const fuseInstance = new Fuse(entries, {
          keys: [
            { name: 'title', weight: 0.4 },
            { name: 'logic', weight: 0.3 },
            { name: 'content', weight: 0.2 },
            { name: 'tags', weight: 0.1 }
          ],
          threshold: 0.3,
          includeScore: true,
          includeMatches: true
        });
        
        setFuse(fuseInstance);
        console.log('Knowledge base loaded successfully');
      } catch (error) {
        console.error('Failed to load knowledge base:', error);
        // Even on error, provide sample data
        const parsedTrunks = parseKnowledgeBase('');
        setTrunks(parsedTrunks);
        setAllEntries(getAllEntries(parsedTrunks));
      } finally {
        setLoading(false);
      }
    }

    loadKnowledgeBase();
  }, []);

  const searchEntries = (query: string): SearchResult[] => {
    if (!fuse || !query.trim()) return [];
    
    const results = fuse.search(query);
    
    return results.map(result => {
      const entry = result.item;
      const trunk = trunks.find(t => t.id === entry.trunkId)!;
      
      return {
        entry,
        trunk,
        score: result.score || 0,
        matches: result.matches?.map(match => match.key || '') || []
      };
    });
  };

  const getTrunk = (id: string): Trunk | undefined => {
    return trunks.find(trunk => trunk.id === id);
  };

  const getEntry = (id: string) => {
    return findEntry(trunks, id);
  };

  // Generate unique ID for new zettels
  const generateZettelId = (): string => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `z_${timestamp}_${random}`;
  };

  // Zettel CRUD operations
  const createZettel = async (data: ZettelFormData): Promise<ZettelEntry> => {
    const newZettel: ZettelEntry = {
      id: generateZettelId(),
      oldId: '',
      title: data.title,
      logic: data.logic,
      content: data.content,
      tags: data.tags,
      connections: data.connections || [],
      trunkId: data.trunkId,
      parentId: data.parentId,
      level: data.parentId ? 1 : 0, // Simple level calculation
      createdAt: new Date(),
      updatedAt: new Date(),
      children: []
    };

    // Update trunks state
    setTrunks(prevTrunks => {
      return prevTrunks.map(trunk => {
        if (trunk.id === data.trunkId) {
          const updatedEntries = [...trunk.entries, newZettel];
          return {
            ...trunk,
            entries: updatedEntries,
            totalEntries: updatedEntries.length
          };
        }
        return trunk;
      });
    });

    // Update allEntries
    setAllEntries(prev => [...prev, newZettel]);

    // Update search index
    if (fuse) {
      const newFuse = new Fuse([...allEntries, newZettel], {
        keys: [
          { name: 'title', weight: 0.4 },
          { name: 'logic', weight: 0.3 },
          { name: 'content', weight: 0.2 },
          { name: 'tags', weight: 0.1 }
        ],
        threshold: 0.3,
        includeScore: true,
        includeMatches: true
      });
      setFuse(newFuse);
    }

    return newZettel;
  };

  const updateZettel = async (id: string, data: Partial<ZettelFormData>): Promise<ZettelEntry> => {
    let updatedZettel: ZettelEntry | null = null;

    // Update trunks state
    setTrunks(prevTrunks => {
      return prevTrunks.map(trunk => {
        const updatedEntries = trunk.entries.map(entry => {
          if (entry.id === id) {
            updatedZettel = {
              ...entry,
              ...data,
              updatedAt: new Date()
            };
            return updatedZettel;
          }
          return entry;
        });
        
        return {
          ...trunk,
          entries: updatedEntries
        };
      });
    });

    // Update allEntries
    setAllEntries(prev => prev.map(entry => {
      if (entry.id === id) {
        const updated = {
          ...entry,
          ...data,
          updatedAt: new Date()
        };
        updatedZettel = updated;
        return updated;
      }
      return entry;
    }));

    // Update search index
    if (fuse && updatedZettel) {
      const newFuse = new Fuse(allEntries, {
        keys: [
          { name: 'title', weight: 0.4 },
          { name: 'logic', weight: 0.3 },
          { name: 'content', weight: 0.2 },
          { name: 'tags', weight: 0.1 }
        ],
        threshold: 0.3,
        includeScore: true,
        includeMatches: true
      });
      setFuse(newFuse);
    }

    if (!updatedZettel) {
      throw new Error(`Zettel with id ${id} not found`);
    }

    return updatedZettel;
  };

  const deleteZettel = async (id: string): Promise<void> => {
    // Update trunks state
    setTrunks(prevTrunks => {
      return prevTrunks.map(trunk => {
        const updatedEntries = trunk.entries.filter(entry => entry.id !== id);
        return {
          ...trunk,
          entries: updatedEntries,
          totalEntries: updatedEntries.length
        };
      });
    });

    // Update allEntries
    setAllEntries(prev => prev.filter(entry => entry.id !== id));

    // Update search index
    const updatedEntries = allEntries.filter(entry => entry.id !== id);
    const newFuse = new Fuse(updatedEntries, {
      keys: [
        { name: 'title', weight: 0.4 },
        { name: 'logic', weight: 0.3 },
        { name: 'content', weight: 0.2 },
        { name: 'tags', weight: 0.1 }
      ],
      threshold: 0.3,
      includeScore: true,
      includeMatches: true
    });
    setFuse(newFuse);
  };

  // Zettel management functions
  const getZettelsByTrunk = (trunkId: string): ZettelEntry[] => {
    return allEntries.filter(entry => entry.trunkId === trunkId);
  };

  const getZettelsByTag = (tag: string): ZettelEntry[] => {
    return allEntries.filter(entry => 
      entry.tags?.some(t => t.toLowerCase().includes(tag.toLowerCase()))
    );
  };

  const getRecentZettels = (limit: number = 10): ZettelEntry[] => {
    return allEntries
      .filter(entry => entry.createdAt)
      .sort((a, b) => {
        const dateA = a.createdAt || new Date(0);
        const dateB = b.createdAt || new Date(0);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, limit);
  };

  const value: KnowledgeContextType = {
    trunks,
    allEntries,
    loading,
    searchEntries,
    getTrunk,
    getEntry,
    navigation,
    setNavigation,
    createZettel,
    updateZettel,
    deleteZettel,
    getZettelsByTrunk,
    getZettelsByTag,
    getRecentZettels
  };

  return (
    <KnowledgeContext.Provider value={value}>
      {children}
    </KnowledgeContext.Provider>
  );
}
