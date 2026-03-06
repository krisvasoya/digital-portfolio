import React, { Suspense, useState, useEffect } from 'react'
import Scene from './components/3d/Scene'
import InitializationSequence from './components/ui/InitializationSequence'
import MainLayout from './components/ui/MainLayout'

function App() {
  const [isInitialized, setIsInitialized] = useState(false)
  const isDayTheme = React.useMemo(() => {
    return false; // Force dark theme as requested
  }, []);

  useEffect(() => {
    if (isDayTheme) {
      document.body.classList.add('theme-solar');
    } else {
      document.body.classList.remove('theme-solar');
    }
  }, [isDayTheme]);

  return (
    <div className={isDayTheme ? 'theme-solar' : ''} style={{ position: 'relative', width: '100%', height: '100vh', backgroundColor: 'var(--color-bg-base)', transition: 'background-color 0.5s ease' }}>
      <Scene isDayTheme={isDayTheme} />
      
      {/* UI Overlay Placeholder */}
      <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 10, width: '100vw', height: '100vh', pointerEvents: 'none' }}>
        {!isInitialized ? (
          <InitializationSequence onComplete={() => setIsInitialized(true)} />
        ) : (
          <MainLayout />
        )}
      </div>
    </div>
  )
}

export default App
