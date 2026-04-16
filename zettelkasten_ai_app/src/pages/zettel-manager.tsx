
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  SortAsc, 
  SortDesc,
  Brain,
  Database,
  Activity,
  Zap,
  Network,
  Star,
  Eye,
  Calendar,
  Tag
} from 'lucide-react';
import { useKnowledge } from '../contexts/KnowledgeContext';
import ZettelListItem from '../components/zettel-list-item';

const ZettelManager: React.FC = () => {
  const { entries, trunks } = useKnowledge();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrunk, setSelectedTrunk] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'connections'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const getKastenTier = (entryId: string): number => {
    const id = parseInt(entryId);
    if (id >= 1000 && id < 7000) return 1;
    if (id >= 7000 && id < 13000) return 2;
    if (id >= 13000 && id < 19000) return 3;
    if (id >= 19000 && id < 25000) return 4;
    return 1;
  };

  const getKastenColor = (tier: number): string => {
    switch (tier) {
      case 1: return 'kasten-1';
      case 2: return 'kasten-2';
      case 3: return 'kasten-3';
      case 4: return 'kasten-4';
      default: return 'kasten-1';
    }
  };

  const getKastenLabel = (tier: number): string => {
    switch (tier) {
      case 1: return 'FOUNDATION';
      case 2: return 'DEVELOPMENT';
      case 3: return 'COMPLEX';
      case 4: return 'MASTERY';
      default: return 'FOUNDATION';
    }
  };

  const filteredAndSortedEntries = useMemo(() => {
    let filtered = entries.filter(entry => {
      const matchesSearch = entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (entry.tags && entry.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
      
      const matchesTrunk = selectedTrunk === 'all' || entry.trunkId === selectedTrunk;
      
      const entryTier = getKastenTier(entry.id);
      const matchesTier = selectedTier === 'all' || entryTier.toString() === selectedTier;
      
      return matchesSearch && matchesTrunk && matchesTier;
    });

    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'connections':
          comparison = (a.connections?.length || 0) - (b.connections?.length || 0);
          break;
        case 'date':
        default:
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [entries, searchQuery, selectedTrunk, selectedTier, sortBy, sortOrder]);

  const stats = {
    total: entries.length,
    filtered: filteredAndSortedEntries.length,
    tier1: entries.filter(e => getKastenTier(e.id) === 1).length,
    tier2: entries.filter(e => getKastenTier(e.id) === 2).length,
    tier3: entries.filter(e => getKastenTier(e.id) === 3).length,
    tier4: entries.filter(e => getKastenTier(e.id) === 4).length,
  };

  const toggleSort = (field: 'date' | 'title' | 'connections') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-vt323 text-y2k-magenta text-shadow-y2k mb-2">
            NEURAL.MATRIX.MANAGER
          </h1>
          <p className="text-y2k-cyan font-tahoma">
            Manage and explore your consciousness network nodes
          </p>
        </div>
        
        <Link 
          to="/zettel-create" 
          className="btn-y2k px-6 py-3 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>CREATE.NEW.ZETTEL</span>
        </Link>
      </div>

      {/* Stats Dashboard */}
      <div className="panel-y2k p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="text-center p-4 bg-y2k-bg-dark rounded border border-y2k-cyan/30 hover:border-y2k-cyan hover:shadow-cyan-glow transition-all duration-300">
            <Database className="w-6 h-6 text-y2k-cyan mx-auto mb-2" />
            <div className="font-vt323 text-xl text-y2k-white">{stats.total}</div>
            <div className="font-vt323 text-xs text-y2k-cyan uppercase">TOTAL</div>
          </div>
          
          <div className="text-center p-4 bg-y2k-bg-dark rounded border border-kasten-1/30 hover:border-kasten-1 hover:shadow-kasten-glow transition-all duration-300">
            <Brain className="w-6 h-6 text-kasten-1 mx-auto mb-2" />
            <div className="font-vt323 text-xl text-y2k-white">{stats.tier1}</div>
            <div className="font-vt323 text-xs text-kasten-1 uppercase">T1</div>
          </div>
          
          <div className="text-center p-4 bg-y2k-bg-dark rounded border border-kasten-2/30 hover:border-kasten-2 hover:shadow-kasten-glow transition-all duration-300">
            <Zap className="w-6 h-6 text-kasten-2 mx-auto mb-2" />
            <div className="font-vt323 text-xl text-y2k-white">{stats.tier2}</div>
            <div className="font-vt323 text-xs text-kasten-2 uppercase">T2</div>
          </div>
          
          <div className="text-center p-4 bg-y2k-bg-dark rounded border border-kasten-3/30 hover:border-kasten-3 hover:shadow-kasten-glow transition-all duration-300">
            <Network className="w-6 h-6 text-kasten-3 mx-auto mb-2" />
            <div className="font-vt323 text-xl text-y2k-white">{stats.tier3}</div>
            <div className="font-vt323 text-xs text-kasten-3 uppercase">T3</div>
          </div>
          
          <div className="text-center p-4 bg-y2k-bg-dark rounded border border-kasten-4/30 hover:border-kasten-4 hover:shadow-kasten-glow transition-all duration-300">
            <Star className="w-6 h-6 text-kasten-4 mx-auto mb-2" />
            <div className="font-vt323 text-xl text-y2k-white">{stats.tier4}</div>
            <div className="font-vt323 text-xs text-kasten-4 uppercase">T4</div>
          </div>
          
          <div className="text-center p-4 bg-y2k-bg-dark rounded border border-y2k-magenta/30 hover:border-y2k-magenta hover:shadow-y2k transition-all duration-300">
            <Eye className="w-6 h-6 text-y2k-magenta mx-auto mb-2" />
            <div className="font-vt323 text-xl text-y2k-white">{stats.filtered}</div>
            <div className="font-vt323 text-xs text-y2k-magenta uppercase">VISIBLE</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="panel-y2k p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-y2k-cyan" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH.NEURAL.MATRIX..."
                className="input-y2k pl-12 pr-4 py-3 w-full rounded font-vt323"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-kasten-2 px-4 py-3 font-vt323 border-2 rounded transition-all duration-300 hover:scale-105 flex items-center space-x-2 ${showFilters ? 'bg-kasten-2/20' : ''}`}
          >
            <Filter className="w-5 h-5" />
            <span>FILTERS</span>
          </button>

          {/* View Mode Toggle */}
          <div className="flex border-2 border-y2k-cyan rounded overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-3 font-vt323 transition-all duration-300 ${
                viewMode === 'grid' 
                  ? 'bg-y2k-cyan text-y2k-black' 
                  : 'text-y2k-cyan hover:bg-y2k-cyan/20'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-3 font-vt323 transition-all duration-300 ${
                viewMode === 'list' 
                  ? 'bg-y2k-cyan text-y2k-black' 
                  : 'text-y2k-cyan hover:bg-y2k-cyan/20'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-y2k-cyan/30">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Trunk Filter */}
              <div>
                <label className="block font-vt323 text-y2k-cyan text-sm mb-2 uppercase tracking-wider">
                  KNOWLEDGE.TRUNK
                </label>
                <select
                  value={selectedTrunk}
                  onChange={(e) => setSelectedTrunk(e.target.value)}
                  className="input-y2k w-full py-2 px-3 rounded font-vt323"
                >
                  <option value="all">ALL.TRUNKS</option>
                  {trunks.map(trunk => (
                    <option key={trunk.id} value={trunk.id}>
                      TRUNK.#{trunk.id} - {trunk.title.substring(0, 30)}...
                    </option>
                  ))}
                </select>
              </div>

              {/* Tier Filter */}
              <div>
                <label className="block font-vt323 text-y2k-cyan text-sm mb-2 uppercase tracking-wider">
                  KASTEN.TIER
                </label>
                <select
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(e.target.value)}
                  className="input-y2k w-full py-2 px-3 rounded font-vt323"
                >
                  <option value="all">ALL.TIERS</option>
                  <option value="1">TIER.1 - FOUNDATION</option>
                  <option value="2">TIER.2 - DEVELOPMENT</option>
                  <option value="3">TIER.3 - COMPLEX</option>
                  <option value="4">TIER.4 - MASTERY</option>
                </select>
              </div>

              {/* Sort Options */}
              <div>
                <label className="block font-vt323 text-y2k-cyan text-sm mb-2 uppercase tracking-wider">
                  SORT.MATRIX
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleSort('date')}
                    className={`flex-1 px-3 py-2 font-vt323 text-xs border rounded transition-all duration-300 ${
                      sortBy === 'date' 
                        ? 'border-y2k-magenta text-y2k-magenta bg-y2k-magenta/20' 
                        : 'border-y2k-cyan/30 text-y2k-cyan hover:border-y2k-cyan'
                    }`}
                  >
                    <Calendar className="w-3 h-3 mx-auto mb-1" />
                    DATE
                    {sortBy === 'date' && (
                      sortOrder === 'asc' ? <SortAsc className="w-3 h-3 mx-auto" /> : <SortDesc className="w-3 h-3 mx-auto" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => toggleSort('title')}
                    className={`flex-1 px-3 py-2 font-vt323 text-xs border rounded transition-all duration-300 ${
                      sortBy === 'title' 
                        ? 'border-y2k-magenta text-y2k-magenta bg-y2k-magenta/20' 
                        : 'border-y2k-cyan/30 text-y2k-cyan hover:border-y2k-cyan'
                    }`}
                  >
                    <Tag className="w-3 h-3 mx-auto mb-1" />
                    TITLE
                    {sortBy === 'title' && (
                      sortOrder === 'asc' ? <SortAsc className="w-3 h-3 mx-auto" /> : <SortDesc className="w-3 h-3 mx-auto" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => toggleSort('connections')}
                    className={`flex-1 px-3 py-2 font-vt323 text-xs border rounded transition-all duration-300 ${
                      sortBy === 'connections' 
                        ? 'border-y2k-magenta text-y2k-magenta bg-y2k-magenta/20' 
                        : 'border-y2k-cyan/30 text-y2k-cyan hover:border-y2k-cyan'
                    }`}
                  >
                    <Network className="w-3 h-3 mx-auto mb-1" />
                    LINKS
                    {sortBy === 'connections' && (
                      sortOrder === 'asc' ? <SortAsc className="w-3 h-3 mx-auto" /> : <SortDesc className="w-3 h-3 mx-auto" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="panel-y2k p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-vt323 text-y2k-cyan">
            NEURAL.MATRIX.RESULTS
          </h2>
          <div className="flex items-center space-x-4 text-sm font-vt323">
            <span className="text-y2k-cyan">
              SHOWING: {stats.filtered} / {stats.total}
            </span>
            <div className="flex items-center space-x-1">
              <Activity className="w-4 h-4 text-y2k-magenta animate-pulse" />
              <span className="text-y2k-magenta">ACTIVE.SCAN</span>
            </div>
          </div>
        </div>

        {filteredAndSortedEntries.length === 0 ? (
          <div className="text-center py-12">
            <Brain className="w-16 h-16 text-y2k-cyan/30 mx-auto mb-4" />
            <h3 className="text-xl font-vt323 text-y2k-magenta mb-2">
              NO.NEURAL.NODES.FOUND
            </h3>
            <p className="text-y2k-cyan font-tahoma mb-6">
              {searchQuery || selectedTrunk !== 'all' || selectedTier !== 'all'
                ? 'Adjust your search parameters to find neural nodes.'
                : 'Your neural matrix is empty. Create your first Zettel to begin consciousness exploration.'
              }
            </p>
            {!searchQuery && selectedTrunk === 'all' && selectedTier === 'all' && (
              <Link 
                to="/zettel-create" 
                className="btn-kasten-1 px-6 py-3 font-vt323 border-2 rounded transition-all duration-300 hover:scale-105"
              >
                CREATE.FIRST.ZETTEL
              </Link>
            )}
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }>
            {filteredAndSortedEntries.map((entry) => (
              <ZettelListItem 
                key={entry.id} 
                entry={entry} 
                showTrunk={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats Footer */}
      <div className="panel-y2k p-4">
        <div className="flex items-center justify-between text-xs font-vt323">
          <div className="flex items-center space-x-4 text-y2k-cyan">
            <span>MATRIX.STATUS: ACTIVE</span>
            <span>NEURAL.CORES: {stats.total}</span>
            <span>CONNECTIONS: {entries.reduce((acc, e) => acc + (e.connections?.length || 0), 0)}</span>
          </div>
          <div className="flex items-center space-x-2 text-y2k-magenta">
            <Activity className="w-3 h-3 animate-pulse" />
            <span>CONSCIOUSNESS.EXPANDING</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZettelManager;
