import React, { Suspense, useState, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei'
import { EffectComposer, Bloom, Noise, Vignette, Glitch } from '@react-three/postprocessing'
import { easing } from 'maath'
import DigitalCore from './DigitalCore'
import OrbitalRings from './OrbitalRings'
import Particles from './Particles'
import Hologram from './Hologram'
import NeuralNetwork from './NeuralNetwork'


function ParallaxRig({ children }) {
  const groupRef = useRef()
  const [isZoomed, setIsZoomed] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleSelect = () => setIsZoomed(true)
    const handleClear = () => setIsZoomed(false)
    const handleNav = (e) => { if (e.type === 'page-transition') setIsZoomed(false) }
    const handleScroll = (e) => setScrollProgress(e.detail)

    window.addEventListener('project-select', handleSelect)
    window.addEventListener('project-clear', handleClear)
    window.addEventListener('page-transition', handleNav)
    window.addEventListener('main-scroll', handleScroll)
    
    return () => {
      window.removeEventListener('project-select', handleSelect)
      window.removeEventListener('project-clear', handleClear)
      window.removeEventListener('page-transition', handleNav)
      window.removeEventListener('main-scroll', handleScroll)
    }
  }, [])

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Cinematic Camera Path Logic
      // Z-axis movement (flying through)
      const zoomZ = isZoomed ? 6 : 0;
      const scrollZ = scrollProgress * 15; // Move up to 15 units forward
      easing.damp(groupRef.current.position, 'z', zoomZ + scrollZ, 0.4, delta)

      // Dynamic Rotation based on scroll and mouse
      const targetRotX = (state.pointer.y * 0.1) + (scrollProgress * Math.PI * 0.1)
      const targetRotY = (state.pointer.x * 0.1) + (scrollProgress * Math.PI * 0.2)
      
      easing.dampE(
        groupRef.current.rotation,
        [targetRotX, targetRotY, state.clock.getElapsedTime() * 0.05],
        0.25,
        delta
      )
    }
  })
  return <group ref={groupRef}>{children}</group>
}

const Scene = ({ isDayTheme }) => {
  const [glitching, setGlitching] = useState(false)
  const [highQuality, setHighQuality] = useState(true)

  useEffect(() => {
    const handleGlitch = () => {
      setGlitching(true)
      setTimeout(() => setGlitching(false), 300) // Brief glitch
    }
    const handleGraphics = (e) => setHighQuality(e.detail === 'high')
    
    window.addEventListener('page-transition', handleGlitch)
    window.addEventListener('graphics-toggle', handleGraphics)
    return () => {
      window.removeEventListener('page-transition', handleGlitch)
      window.removeEventListener('graphics-toggle', handleGraphics)
    }
  }, [])

  return (
    <Canvas 
      gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
      dpr={highQuality ? [1, 2] : 1} 
    >
      <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={45} />
      <color attach="background" args={[isDayTheme ? '#f0f4f8' : '#000000']} />
      
      <ambientLight intensity={isDayTheme ? 1.0 : 0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color={isDayTheme ? "#ff6b6b" : "#00f3ff"} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color={isDayTheme ? "#ff8e53" : "#0066ff"} />
      
      <Suspense fallback={null}>
        <ParallaxRig>
          <DigitalCore />
          <OrbitalRings />
          <Particles count={highQuality ? 2000 : 500} />
          <NeuralNetwork />
          <Hologram />

        </ParallaxRig>
        
        <Environment preset="city" />
        
        {highQuality ? (
          <EffectComposer disableNormalPass>
            <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.5} radius={0.6} levels={8} />
            <Noise opacity={0.02} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
            {glitching && <Glitch delay={[0, 0]} duration={[0.1, 0.3]} active strength={[0.2, 0.4]} />}
          </EffectComposer>
        ) : (
          <EffectComposer disableNormalPass>
            {glitching && <Glitch delay={[0, 0]} duration={[0.1, 0.3]} active strength={[0.2, 0.4]} />}
          </EffectComposer>
        )}
      </Suspense>
      
      <OrbitControls 
        enablePan={false} 
        enableZoom={false} 
        maxPolarAngle={Math.PI / 1.5} 
        minPolarAngle={Math.PI / 3}
        autoRotate={true}
        autoRotateSpeed={0.5}
      />
    </Canvas>
  )
}

export default Scene
