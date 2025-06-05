
import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
  const [matrixMode, setMatrixMode] = useState(false);
  const [konamiMode, setKonamiMode] = useState(false);
  const [rainbowMode, setRainbowMode] = useState(false);

  // Matrix Rain Effect Component
  const MatrixRain: React.FC = () => {
    const [chars, setChars] = useState<Array<{ id: number; char: string; left: number; delay: number }>>([]);

    useEffect(() => {
      const matrixChars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
      const newChars = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        char: matrixChars[Math.floor(Math.random() * matrixChars.length)],
        left: Math.random() * 100,
        delay: Math.random() * 20,
      }));
      setChars(newChars);
    }, []);

    return (
      <div className="matrix-rain">
        {chars.map((char) => (
          <div
            key={char.id}
            className="matrix-char"
            style={{
              left: `${char.left}%`,
              animationDelay: `${char.delay}s`,
            }}
          >
            {char.char}
          </div>
        ))}
      </div>
    );
  };

  // Scan Line Effect
  const ScanLine: React.FC = () => (
    <div className="scan-line" />
  );

  // Konami Code Detection
  useEffect(() => {
    const konamiCode = [
      'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
      'KeyB', 'KeyA'
    ];
    let konamiIndex = 0;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          setKonamiMode(!konamiMode);
          konamiIndex = 0;
          // Show notification
          const notification = document.createElement('div');
          notification.textContent = konamiMode ? 'KONAMI MODE DISABLED' : 'KONAMI MODE ACTIVATED';
          notification.className = 'fixed top-4 right-4 bg-y2k-magenta text-y2k-black px-4 py-2 font-vt323 text-xl z-50 animate-pulse-glow';
          document.body.appendChild(notification);
          setTimeout(() => notification.remove(), 3000);
        }
      } else {
        konamiIndex = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [konamiMode]);

  // Easter Egg Commands
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Matrix Mode Toggle (Ctrl + M)
      if (event.ctrlKey && event.key === 'm') {
        event.preventDefault();
        setMatrixMode(!matrixMode);
        const notification = document.createElement('div');
        notification.textContent = matrixMode ? 'MATRIX MODE DISABLED' : 'MATRIX MODE ACTIVATED';
        notification.className = 'fixed top-4 left-4 bg-y2k-cyan text-y2k-black px-4 py-2 font-vt323 text-xl z-50 animate-pulse-glow';
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
      }

      // Rainbow Mode Toggle (Ctrl + R)
      if (event.ctrlKey && event.key === 'r') {
        event.preventDefault();
        setRainbowMode(!rainbowMode);
        const notification = document.createElement('div');
        notification.textContent = rainbowMode ? 'RAINBOW MODE DISABLED' : 'RAINBOW MODE ACTIVATED';
        notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-y2k-yellow text-y2k-black px-4 py-2 font-vt323 text-xl z-50 animate-pulse-glow';
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [matrixMode, rainbowMode]);

  return (
    <div className={`min-h-screen bg-y2k-black text-y2k-white ${konamiMode ? 'konami-mode' : ''} ${matrixMode ? 'matrix-mode' : ''}`}>
      {/* Matrix Rain Effect */}
      {matrixMode && <MatrixRain />}
      
      {/* Scan Line Effect */}
      <ScanLine />
      
      {/* Background Grid Effect */}
      <div className="fixed inset-0 bg-cyber-grid opacity-20 pointer-events-none" />
      
      {/* Main Layout */}
      <div className="relative z-10">
        <Header rainbowMode={rainbowMode} />
        
        <div className="flex">
          <Sidebar rainbowMode={rainbowMode} />
          
          <main className={`flex-1 ml-0 lg:ml-64 transition-all duration-300 ${rainbowMode ? 'rainbow-bg' : ''}`}>
            <div className="p-4 lg:p-6">
              <div className="max-w-7xl mx-auto">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>
      
      {/* Data Stream Effect */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-y2k-cyan to-transparent opacity-50 animate-data-stream" />
      
      {/* Corner Decorations */}
      <div className="fixed top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-y2k-magenta" />
      <div className="fixed top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-y2k-cyan" />
      <div className="fixed bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-y2k-yellow" />
      <div className="fixed bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-y2k-purple" />
      
      {/* Easter Egg Indicator */}
      <div className="fixed bottom-4 right-4 text-xs font-vt323 text-y2k-cyan/50 select-none">
        <div>CTRL+M: Matrix</div>
        <div>CTRL+R: Rainbow</div>
        <div>↑↑↓↓←→←→BA: Konami</div>
      </div>
    </div>
  );
};

export default Layout;
