
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Brain, Sparkles, Zap, Eye, Check, X, AlertTriangle } from 'lucide-react';
import { UploadedDocument, ExtractedZettel, DocumentExtractionRequest, HierarchicalLabel } from '../types';
import { HierarchicalLabelingSystem } from '../utils/hierarchicalLabeling';

interface DocumentUploaderProps {
  onDocumentUploaded: (document: UploadedDocument) => void;
  onZettelExtracted: (zettel: ExtractedZettel) => void;
  className?: string;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  onDocumentUploaded,
  onZettelExtracted,
  className = ''
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractionSettings, setExtractionSettings] = useState<DocumentExtractionRequest['extractionSettings']>({
    maxZettels: 10,
    minConfidence: 0.7,
    preferredTiers: ['leaf', 'flower'],
    includeSacredClownAspects: true,
    includeClioticNodes: true,
    analysisDepth: 'thorough'
  });

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    files.forEach(processFile);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(processFile);
  }, []);

  const processFile = async (file: File) => {
    setIsProcessing(true);
    
    try {
      // Simulate file reading and text extraction
      const content = await readFileContent(file);
      
      const document: UploadedDocument = {
        id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        filename: file.name,
        fileType: file.type,
        size: file.size,
        uploadedAt: new Date(),
        content,
        metadata: {
          title: file.name.replace(/\.[^/.]+$/, ''),
          keywords: extractKeywords(content)
        },
        processingStatus: 'processing',
        extractedZettels: []
      };

      setUploadedDocuments(prev => [...prev, document]);
      onDocumentUploaded(document);

      // Start AI extraction process
      await extractZettelsFromDocument(document);
      
    } catch (error) {
      console.error('Error processing file:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const extractKeywords = (content: string): string[] => {
    // Simple keyword extraction
    const words = content.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3);
    
    const frequency: Record<string, number> = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });
    
    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
  };

  const extractZettelsFromDocument = async (document: UploadedDocument) => {
    // Simulate AI-powered zettel extraction
    const sentences = document.content.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const extractedZettels: ExtractedZettel[] = [];

    for (let i = 0; i < Math.min(sentences.length, extractionSettings.maxZettels); i++) {
      const sentence = sentences[i].trim();
      if (!sentence) continue;

      const confidence = 0.6 + Math.random() * 0.4; // Random confidence between 0.6-1.0
      if (confidence < extractionSettings.minConfidence) continue;

      const suggestedTier = extractionSettings.preferredTiers[
        Math.floor(Math.random() * extractionSettings.preferredTiers.length)
      ];

      const hierarchicalId = HierarchicalLabelingSystem.generateHierarchicalId(
        suggestedTier,
        suggestedTier === 'trunk' ? undefined : '1000',
        i
      );

      const extractedZettel: ExtractedZettel = {
        id: `extracted_${Date.now()}_${i}`,
        documentId: document.id,
        title: `Extracted Insight ${i + 1}`,
        content: sentence,
        logic: `Extracted from ${document.filename} using ${extractionSettings.analysisDepth} analysis`,
        suggestedTier,
        suggestedHierarchicalId: hierarchicalId,
        suggestedTrunkId: '1', // Default to first trunk
        suggestedTags: document.metadata.keywords?.slice(0, 3) || [],
        suggestedConnections: [],
        confidence,
        extractionMethod: extractionSettings.analysisDepth === 'mystical' ? 'sacred_clown_divination' : 'ai_analysis',
        sacredClownAspect: extractionSettings.includeSacredClownAspects 
          ? HierarchicalLabelingSystem.generateSacredClownAspect(suggestedTier, hierarchicalId)
          : undefined,
        clioticNodePotential: extractionSettings.includeClioticNodes ? Math.random() : undefined,
        isAccepted: false,
        isModified: false
      };

      extractedZettels.push(extractedZettel);
    }

    // Update document with extracted zettels
    setUploadedDocuments(prev => 
      prev.map(doc => 
        doc.id === document.id 
          ? { ...doc, extractedZettels, processingStatus: 'completed' }
          : doc
      )
    );
  };

  const acceptZettel = (zettel: ExtractedZettel) => {
    const updatedZettel = { ...zettel, isAccepted: true };
    onZettelExtracted(updatedZettel);
    
    setUploadedDocuments(prev =>
      prev.map(doc => ({
        ...doc,
        extractedZettels: doc.extractedZettels.map(z => 
          z.id === zettel.id ? updatedZettel : z
        )
      }))
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Upload Area */}
      <motion.div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300
          ${isDragOver 
            ? 'border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-400/20' 
            : 'border-gray-600 bg-gray-900/50 hover:border-magenta-400 hover:bg-magenta-400/5'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <input
          type="file"
          multiple
          accept=".txt,.md,.pdf,.doc,.docx"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-4">
          <motion.div
            animate={{ rotate: isProcessing ? 360 : 0 }}
            transition={{ duration: 2, repeat: isProcessing ? Infinity : 0, ease: "linear" }}
          >
            <Upload className="mx-auto h-12 w-12 text-cyan-400" />
          </motion.div>
          
          <div>
            <h3 className="text-xl font-bold text-cyan-400 font-mono">
              NEURAL DOCUMENT INGESTION
            </h3>
            <p className="text-gray-300 mt-2">
              Drop documents here or click to upload • AI will extract potential zettels
            </p>
          </div>
          
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-yellow-400 font-mono"
            >
              <Brain className="inline mr-2" />
              PROCESSING NEURAL PATTERNS...
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Extraction Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900/70 border border-gray-700 rounded-lg p-6"
      >
        <h4 className="text-lg font-bold text-magenta-400 font-mono mb-4 flex items-center">
          <Sparkles className="mr-2" />
          EXTRACTION PROTOCOLS
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-mono text-cyan-400 mb-2">
              Max Zettels
            </label>
            <input
              type="number"
              value={extractionSettings.maxZettels}
              onChange={(e) => setExtractionSettings(prev => ({
                ...prev,
                maxZettels: parseInt(e.target.value)
              }))}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white font-mono"
              min="1"
              max="50"
            />
          </div>
          
          <div>
            <label className="block text-sm font-mono text-cyan-400 mb-2">
              Min Confidence
            </label>
            <input
              type="range"
              value={extractionSettings.minConfidence}
              onChange={(e) => setExtractionSettings(prev => ({
                ...prev,
                minConfidence: parseFloat(e.target.value)
              }))}
              className="w-full"
              min="0.1"
              max="1"
              step="0.1"
            />
            <span className="text-xs text-gray-400 font-mono">
              {(extractionSettings.minConfidence * 100).toFixed(0)}%
            </span>
          </div>
          
          <div>
            <label className="block text-sm font-mono text-cyan-400 mb-2">
              Analysis Depth
            </label>
            <select
              value={extractionSettings.analysisDepth}
              onChange={(e) => setExtractionSettings(prev => ({
                ...prev,
                analysisDepth: e.target.value as any
              }))}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white font-mono"
            >
              <option value="quick">Quick Scan</option>
              <option value="thorough">Deep Analysis</option>
              <option value="mystical">Sacred Clown Divination</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center text-sm font-mono text-cyan-400">
              <input
                type="checkbox"
                checked={extractionSettings.includeSacredClownAspects}
                onChange={(e) => setExtractionSettings(prev => ({
                  ...prev,
                  includeSacredClownAspects: e.target.checked
                }))}
                className="mr-2"
              />
              Sacred Clown Aspects
            </label>
            <label className="flex items-center text-sm font-mono text-cyan-400">
              <input
                type="checkbox"
                checked={extractionSettings.includeClioticNodes}
                onChange={(e) => setExtractionSettings(prev => ({
                  ...prev,
                  includeClioticNodes: e.target.checked
                }))}
                className="mr-2"
              />
              Cliotic Node Mapping
            </label>
          </div>
        </div>
      </motion.div>

      {/* Uploaded Documents */}
      <AnimatePresence>
        {uploadedDocuments.map((document) => (
          <motion.div
            key={document.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gray-900/70 border border-gray-700 rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <FileText className="h-6 w-6 text-yellow-400" />
                <div>
                  <h5 className="font-mono text-white">{document.filename}</h5>
                  <p className="text-sm text-gray-400">
                    {(document.size / 1024).toFixed(1)} KB • {document.processingStatus}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {document.processingStatus === 'processing' && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Zap className="h-5 w-5 text-cyan-400" />
                  </motion.div>
                )}
                {document.processingStatus === 'completed' && (
                  <Check className="h-5 w-5 text-green-400" />
                )}
              </div>
            </div>

            {/* Extracted Zettels */}
            {document.extractedZettels.length > 0 && (
              <div className="space-y-3">
                <h6 className="font-mono text-cyan-400 text-sm">
                  EXTRACTED NEURAL PATTERNS ({document.extractedZettels.length})
                </h6>
                
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {document.extractedZettels.map((zettel) => (
                    <motion.div
                      key={zettel.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`
                        p-3 rounded border-l-4 
                        ${zettel.isAccepted 
                          ? 'bg-green-900/30 border-green-400' 
                          : 'bg-gray-800/50 border-yellow-400'
                        }
                      `}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-xs font-mono text-cyan-400">
                              {HierarchicalLabelingSystem.getTierEmoji(zettel.suggestedTier)} 
                              {zettel.suggestedHierarchicalId}
                            </span>
                            <span className="text-xs text-gray-400">
                              {(zettel.confidence * 100).toFixed(0)}% confidence
                            </span>
                          </div>
                          
                          <p className="text-sm text-white mb-2">
                            {zettel.content.substring(0, 150)}
                            {zettel.content.length > 150 ? '...' : ''}
                          </p>
                          
                          {zettel.sacredClownAspect && (
                            <div className="text-xs text-magenta-400 font-mono">
                              🎭 {zettel.sacredClownAspect}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex space-x-2 ml-4">
                          {!zettel.isAccepted && (
                            <>
                              <button
                                onClick={() => acceptZettel(zettel)}
                                className="p-1 text-green-400 hover:bg-green-400/20 rounded"
                                title="Accept Zettel"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                className="p-1 text-red-400 hover:bg-red-400/20 rounded"
                                title="Reject Zettel"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          <button
                            className="p-1 text-cyan-400 hover:bg-cyan-400/20 rounded"
                            title="Preview Zettel"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
