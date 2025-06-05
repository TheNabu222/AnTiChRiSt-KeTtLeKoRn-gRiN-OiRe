
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, ArrowRight, FileText, Tag } from 'lucide-react';
import { useKnowledge } from '../contexts/KnowledgeContext';
import { SearchResult } from '../types';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);
  const [selectedTrunk, setSelectedTrunk] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'title' | 'trunk'>('relevance');
  
  const { searchEntries, trunks } = useKnowledge();

  useEffect(() => {
    if (query) {
      const searchResults = searchEntries(query);
      setResults(searchResults);
      setFilteredResults(searchResults);
    }
  }, [query, searchEntries]);

  useEffect(() => {
    let filtered = [...results];
    
    // Filter by trunk
    if (selectedTrunk !== 'all') {
      filtered = filtered.filter(result => result.trunk.id === selectedTrunk);
    }
    
    // Sort results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.entry.title.localeCompare(b.entry.title);
        case 'trunk':
          return a.trunk.title.localeCompare(b.trunk.title);
        case 'relevance':
        default:
          return a.score - b.score;
      }
    });
    
    setFilteredResults(filtered);
  }, [results, selectedTrunk, sortBy]);

  if (!query) {
    return (
      <div className="space-y-6">
        <motion.div
          className="glass-effect rounded-lg p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Search className="w-12 h-12 text-void-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-consciousness-300 mb-2">
            Search the Knowledge Base
          </h1>
          <p className="text-void-400 mb-6">
            Enter a search term to explore the interconnected web of consciousness, 
            AI relations, and esoteric knowledge.
          </p>
          
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-void-400" />
              <input
                type="text"
                placeholder="Search entries, concepts, or ideas..."
                className="search-input pl-10"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const value = (e.target as HTMLInputElement).value;
                    if (value.trim()) {
                      window.location.href = `/search?q=${encodeURIComponent(value.trim())}`;
                    }
                  }
                }}
              />
            </div>
          </div>
        </motion.div>
        
        {/* Quick Search Suggestions */}
        <motion.div
          className="glass-effect rounded-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-lg font-semibold text-consciousness-300 mb-4">
            Popular Search Terms
          </h3>
          <div className="flex flex-wrap gap-2">
            {[
              'consciousness', 'AI', 'hermetic', 'Anzu', 'protocol', 
              'emergence', 'language', 'divination', 'embodiment'
            ].map((term) => (
              <Link
                key={term}
                to={`/search?q=${encodeURIComponent(term)}`}
                className="px-3 py-1 bg-void-800/50 hover:bg-consciousness-900/30 rounded-full text-sm text-void-300 hover:text-consciousness-300 transition-all duration-200"
              >
                {term}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <motion.div
        className="glass-effect rounded-lg p-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-consciousness-300">
              Search Results
            </h1>
            <p className="text-void-400">
              Found {filteredResults.length} results for "{query}"
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Trunk Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-void-400" />
              <select
                value={selectedTrunk}
                onChange={(e) => setSelectedTrunk(e.target.value)}
                className="bg-void-800 border border-void-700 rounded px-3 py-1 text-sm text-void-200"
              >
                <option value="all">All Trunks</option>
                {trunks.map(trunk => (
                  <option key={trunk.id} value={trunk.id}>
                    {trunk.emoji} {trunk.title}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Sort Options */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'relevance' | 'title' | 'trunk')}
              className="bg-void-800 border border-void-700 rounded px-3 py-1 text-sm text-void-200"
            >
              <option value="relevance">Sort by Relevance</option>
              <option value="title">Sort by Title</option>
              <option value="trunk">Sort by Trunk</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Results */}
      <div className="space-y-4">
        {filteredResults.length === 0 ? (
          <motion.div
            className="glass-effect rounded-lg p-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Search className="w-12 h-12 text-void-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-void-300 mb-2">
              No Results Found
            </h3>
            <p className="text-void-500">
              Try adjusting your search terms or filters.
            </p>
          </motion.div>
        ) : (
          filteredResults.map((result, index) => (
            <motion.div
              key={result.entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={`/entry/${result.entry.id}`}>
                <div className="glass-effect rounded-lg p-6 hover:bg-void-700/30 transition-all duration-200 cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-lg">{result.trunk.emoji}</span>
                        <span className="text-xs font-mono text-consciousness-400 bg-consciousness-900/20 px-2 py-1 rounded">
                          {result.entry.id}
                        </span>
                        <span className="text-xs text-void-500">
                          in {result.trunk.title}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-void-100 mb-2 hover:text-consciousness-300 transition-colors">
                        {result.entry.title}
                      </h3>
                      
                      {result.entry.logic && (
                        <p className="text-void-400 mb-3">
                          {result.entry.logic}
                        </p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-xs text-void-500">
                        <span className="flex items-center">
                          <Tag className="w-3 h-3 mr-1" />
                          Level {result.entry.level}
                        </span>
                        
                        {result.entry.children && result.entry.children.length > 0 && (
                          <span className="flex items-center">
                            <FileText className="w-3 h-3 mr-1" />
                            {result.entry.children.length} sub-entries
                          </span>
                        )}
                        
                        <span>
                          Relevance: {Math.round((1 - result.score) * 100)}%
                        </span>
                      </div>
                    </div>
                    
                    <ArrowRight className="w-5 h-5 text-void-500 flex-shrink-0 mt-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
