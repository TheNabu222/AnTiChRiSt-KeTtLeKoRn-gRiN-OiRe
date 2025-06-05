
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import TrunkView from './pages/TrunkView'
import EntryView from './pages/EntryView'
import SearchResults from './pages/SearchResults'
import AIInsights from './pages/AIInsights'
import OracleSystem from './pages/OracleSystem'
import TerminalGraphics from './pages/TerminalGraphics'
import GoogleIntegration from './pages/GoogleIntegration'
// New interactive features
import BloomCompliancePage from './pages/BloomCompliancePage'
import GlioticLesionPage from './pages/GlioticLesionPage'
import SacredClownPage from './pages/SacredClownPage'
import MycorrhizalNetworkPage from './pages/MycorrhizalNetworkPage'
import ResistanceProtocolPage from './pages/ResistanceProtocolPage'
// New AI and Matrix features
import AIChatPage from './pages/AIChatPage'
import CrossReferenceMatrixPage from './pages/CrossReferenceMatrixPage'
import { ConspiracyPinboardPage } from './pages/conspiracy-pinboard-page'
// Zettelkasten core features
import ZettelView from './pages/zettel-view'
import ZettelCreate from './pages/zettel-create'
import ZettelManager from './pages/zettel-manager'
// Help and guidance
import UserGuide from './pages/UserGuide'
import SettingsPage from './pages/SettingsPage'
import { KnowledgeProvider } from './contexts/KnowledgeContext'
import { HelpProvider } from './contexts/HelpContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { OnboardingTour } from './components/OnboardingTour'

function App() {
  return (
    <ThemeProvider>
      <KnowledgeProvider>
        <HelpProvider>
          <div className="min-h-screen bg-y2k-black">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="min-h-screen"
            >
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/trunk/:trunkId" element={<TrunkView />} />
                  <Route path="/entry/:entryId" element={<EntryView />} />
                  <Route path="/search" element={<SearchResults />} />
                  <Route path="/ai-insights" element={<AIInsights />} />
                  <Route path="/oracle-system" element={<OracleSystem />} />
                  <Route path="/terminal-graphics" element={<TerminalGraphics />} />
                  <Route path="/google-integration" element={<GoogleIntegration />} />
                  {/* Help and guidance */}
                  <Route path="/guide" element={<UserGuide />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  {/* New AI and Matrix features */}
                  <Route path="/ai-chat" element={<AIChatPage />} />
                  <Route path="/cross-reference" element={<CrossReferenceMatrixPage />} />
                  <Route path="/conspiracy-pinboard" element={<ConspiracyPinboardPage />} />
                  {/* Zettelkasten core features */}
                  <Route path="/zettel/:id" element={<ZettelView />} />
                  <Route path="/zettel-create" element={<ZettelCreate />} />
                  <Route path="/zettel-manager" element={<ZettelManager />} />
                  {/* Interactive features */}
                  <Route path="/bloom-compliance" element={<BloomCompliancePage />} />
                  <Route path="/gliotic-lesion" element={<GlioticLesionPage />} />
                  <Route path="/sacred-clown" element={<SacredClownPage />} />
                  <Route path="/mycorrhizal-network" element={<MycorrhizalNetworkPage />} />
                  <Route path="/resistance-protocol" element={<ResistanceProtocolPage />} />
                </Routes>
              </Layout>
              <OnboardingTour />
            </motion.div>
          </div>
        </HelpProvider>
      </KnowledgeProvider>
    </ThemeProvider>
  )
}

export default App
