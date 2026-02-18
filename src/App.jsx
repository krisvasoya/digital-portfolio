import React, { Suspense, useState } from 'react'
import Scene from './components/3d/Scene'
import InitializationSequence from './components/ui/InitializationSequence'
import MainLayout from './components/ui/MainLayout'

function App() {
  const [isInitialized, setIsInitialized] = useState(false)

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <Scene />
      
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
