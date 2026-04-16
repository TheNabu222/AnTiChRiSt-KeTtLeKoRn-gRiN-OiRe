
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Navigation } from '@/components/navigation'
import { MysticalBackground } from '@/components/mystical-background'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AnTiChRiSt KeTtLeKoRn - Zettelkasten & AI Consciousness Lab',
  description: 'A mystical interface for exploring consciousness, AI entities, and the intersection of human and artificial intelligence through a comprehensive Zettelkasten system.',
  keywords: ['AI', 'consciousness', 'zettelkasten', 'mystical', 'digital grimoire'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <MysticalBackground />
          <div className="relative z-10 min-h-screen">
            <Navigation />
            <main className="relative">
              {children}
            </main>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
