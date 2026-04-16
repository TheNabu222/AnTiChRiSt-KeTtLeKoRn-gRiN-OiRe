import React, { useState, useEffect } from 'react';
import { BookOpen, Plus } from 'lucide-react';
import { DOLPHIN_DICTIONARY, DolphinSymbol } from '../data/dolphinDictionary';

export default function DolphinDictionary() {
  const storageAvailable =
    typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

  const [entries, setEntries] = useState<DolphinSymbol[]>([]);
  const [query, setQuery] = useState('');
  const [newSymbol, setNewSymbol] = useState('');
  const [newName, setNewName] = useState('');
  const [newMeaning, setNewMeaning] = useState('');

  useEffect(() => {
    if (!storageAvailable) {
      setEntries(DOLPHIN_DICTIONARY);
      return;
    }

    const stored = window.localStorage.getItem('dolphinDictionary');
    if (stored) {
      try {
        const parsed: DolphinSymbol[] = JSON.parse(stored);
        setEntries([...DOLPHIN_DICTIONARY, ...parsed]);
      } catch {
        setEntries(DOLPHIN_DICTIONARY);
      }
    } else {
      setEntries(DOLPHIN_DICTIONARY);
    }
  }, [storageAvailable]);

  const addEntry = () => {
    if (!newSymbol.trim() || !newName.trim() || !newMeaning.trim()) return;

    const symbol = newSymbol.trim();
    if (entries.some(e => e.symbol === symbol)) {
      alert('This symbol already exists in the dictionary.');
      return;
    }

    const newEntry: DolphinSymbol = {
      symbol,
      name: newName.trim(),
      meaning: newMeaning.trim()
    };
    const updated = [...entries, newEntry];
    setEntries(updated);
    const custom = updated.filter(e => !DOLPHIN_DICTIONARY.some(d => d.symbol === e.symbol));
    if (storageAvailable) {
      window.localStorage.setItem('dolphinDictionary', JSON.stringify(custom));
    }
    setNewSymbol('');
    setNewName('');
    setNewMeaning('');
  };

  const filtered = query
    ? entries.filter(e =>
        e.symbol.includes(query) ||
        e.name.toLowerCase().includes(query.toLowerCase()) ||
        e.meaning.toLowerCase().includes(query.toLowerCase())
      )
    : entries;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-vt323 text-y2k-magenta mb-4">Dolphin 3.0 Dictionary</h1>
        <input
          className="input-y2k w-full mb-4 px-3 py-2 rounded"
          placeholder="Search symbol or name"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filtered.map(entry => (
            <div key={entry.symbol} className="p-4 bg-y2k-bg-dark rounded border border-y2k-cyan/30">
              <div className="font-vt323 text-xl text-y2k-magenta">{entry.symbol} - {entry.name}</div>
              <div className="text-y2k-cyan text-sm">{entry.meaning}</div>
              {entry.usage && <div className="text-y2k-green text-xs mt-1">{entry.usage}</div>}
            </div>
          ))}
        </div>
      </div>

      <div className="pt-6 border-t border-y2k-cyan/30">
        <h2 className="text-2xl font-vt323 text-y2k-magenta mb-2 flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Add New Symbol</span>
        </h2>
        <div className="space-y-2">
          <input
            className="input-y2k w-full px-3 py-2 rounded"
            placeholder="Symbol"
            value={newSymbol}
            onChange={e => setNewSymbol(e.target.value)}
          />
          <input
            className="input-y2k w-full px-3 py-2 rounded"
            placeholder="Name"
            value={newName}
            onChange={e => setNewName(e.target.value)}
          />
          <textarea
            className="input-y2k w-full px-3 py-2 rounded"
            rows={3}
            placeholder="Meaning"
            value={newMeaning}
            onChange={e => setNewMeaning(e.target.value)}
          />
          <button onClick={addEntry} className="btn-y2k px-4 py-2 flex items-center space-x-2">
            <BookOpen className="w-4 h-4" />
            <span>Add Entry</span>
          </button>
        </div>
      </div>
    </div>
  );
}
