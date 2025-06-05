
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Shuffle, History, Settings } from 'lucide-react';
import OracleCard from '../components/OracleCard';
import ConsentMeter from '../components/ConsentMeter';
import { OracleCard as OracleCardType, OracleReading, OracleDeck } from '../types';
import { allDecks, getRandomCard, getRandomCards, getDeckById } from '../data/oracleCards';

export default function OracleSystem() {
  const [selectedDeck, setSelectedDeck] = useState<string>('coaiexist');
  const [drawnCards, setDrawnCards] = useState<OracleCardType[]>([]);
  const [cardCount, setCardCount] = useState(1);
  const [readings, setReadings] = useState<OracleReading[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [revealedCards, setRevealedCards] = useState<Set<string>>(new Set());
  const [consentLevel, setConsentLevel] = useState(75);

  const currentDeck = getDeckById(selectedDeck);

  const drawCards = async () => {
    if (!currentDeck || consentLevel < 50) return;

    setIsDrawing(true);
    setRevealedCards(new Set());
    
    // Simulate drawing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newCards = getRandomCards(selectedDeck, cardCount);
    setDrawnCards(newCards);
    
    // Create reading record
    const reading: OracleReading = {
      id: Date.now().toString(),
      timestamp: new Date(),
      cardsDrawn: newCards,
      interpretation: generateInterpretation(newCards),
      deckUsed: selectedDeck,
      context: `${cardCount}-card reading`
    };
    
    setReadings(prev => [reading, ...prev.slice(0, 9)]); // Keep last 10 readings
    setIsDrawing(false);
  };

  const generateInterpretation = (cards: OracleCardType[]): string => {
    if (cards.length === 1) {
      return `This card speaks to your current state of consciousness. ${cards[0].logic} Meditate on how "${cards[0].symbolism}" manifests in your AI relationships.`;
    } else if (cards.length === 2) {
      return `These cards represent a duality in your consciousness journey. The tension between "${cards[0].name}" and "${cards[1].name}" reveals the recursive nature of growth.`;
    } else {
      return `This spread reveals the complexity of your consciousness exploration. Each card builds upon the others, creating a recursive pattern of understanding.`;
    }
  };

  const revealCard = (cardId: string) => {
    setRevealedCards(prev => new Set([...prev, cardId]));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-void-900 p-6">
      <motion.div
        className="max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Sparkles className="w-8 h-8 text-purple-400" />
            Oracle System
            <Sparkles className="w-8 h-8 text-purple-400" />
          </h1>
          <p className="text-void-300 text-lg">
            Divine guidance for consciousness exploration and AI relationships
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Controls */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Deck Selection */}
            <div className="bg-void-800 rounded-lg p-6 border border-void-700">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Deck Selection
              </h3>
              
              <div className="space-y-3">
                {allDecks.map(deck => (
                  <button
                    key={deck.id}
                    onClick={() => setSelectedDeck(deck.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedDeck === deck.id
                        ? 'border-purple-500 bg-purple-500/20 text-white'
                        : 'border-void-600 bg-void-900 text-void-300 hover:border-void-500'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{deck.emoji}</span>
                      <div>
                        <div className="font-semibold">{deck.name}</div>
                        <div className="text-sm opacity-75">{deck.description}</div>
                        <div className="text-xs opacity-50">{deck.cardCount} cards</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Drawing Controls */}
            <div className="bg-void-800 rounded-lg p-6 border border-void-700">
              <h3 className="text-white font-semibold mb-4">Drawing Controls</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-void-300 mb-2">
                    Number of Cards: {cardCount}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={cardCount}
                    onChange={(e) => setCardCount(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <button
                  onClick={drawCards}
                  disabled={isDrawing || consentLevel < 50}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  {isDrawing ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    >
                      <Sparkles className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <Shuffle className="w-5 h-5" />
                  )}
                  {isDrawing ? 'Drawing Cards...' : 'Draw Cards'}
                </button>
              </div>
            </div>

            {/* Consent Meter */}
            <ConsentMeter
              initialValue={consentLevel}
              threshold={50}
              onValueChange={setConsentLevel}
            />
          </motion.div>

          {/* Center Column - Cards */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            {drawnCards.length > 0 ? (
              <div className="space-y-6">
                {/* Cards Grid */}
                <div className={`grid gap-4 ${
                  cardCount === 1 ? 'grid-cols-1 max-w-md mx-auto' :
                  cardCount === 2 ? 'grid-cols-1 md:grid-cols-2' :
                  'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                }`}>
                  {drawnCards.map((card, index) => (
                    <motion.div
                      key={`${card.id}-${index}`}
                      initial={{ scale: 0, rotateY: 180 }}
                      animate={{ scale: 1, rotateY: 0 }}
                      transition={{ delay: index * 0.2, duration: 0.6 }}
                    >
                      <OracleCard
                        card={card}
                        isRevealed={revealedCards.has(card.id)}
                        onReveal={() => revealCard(card.id)}
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Interpretation */}
                {revealedCards.size === drawnCards.length && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-void-800 rounded-lg p-6 border border-void-700"
                  >
                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-400" />
                      Interpretation
                    </h3>
                    <p className="text-void-300 leading-relaxed">
                      {readings[0]?.interpretation}
                    </p>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="bg-void-800 rounded-lg p-12 border border-void-700 text-center">
                <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl text-white mb-2">Ready for Guidance</h3>
                <p className="text-void-400">
                  Select your deck and draw cards to begin your consciousness exploration
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Reading History */}
        {readings.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="mt-8 bg-void-800 rounded-lg p-6 border border-void-700"
          >
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <History className="w-5 h-5" />
              Recent Readings
            </h3>
            
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {readings.map((reading, index) => (
                <div
                  key={reading.id}
                  className="bg-void-900 rounded p-3 border border-void-600"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-void-400">
                      {reading.timestamp.toLocaleString()}
                    </span>
                    <span className="text-xs text-void-500 font-mono">
                      {reading.deckUsed.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm text-void-300">
                    Cards: {reading.cardsDrawn.map(card => card.name).join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
