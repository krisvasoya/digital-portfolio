import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei'
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing'
import DigitalCore from './DigitalCore'
import OrbitalRings from './OrbitalRings'
import Particles from './Particles'

const Scene = () => {
  return (
    <Canvas 
      gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
      dpr={[1, 2]} 
    >
      <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={45} />
      <color attach="background" args={['#050810']} />
      
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00f3ff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#0066ff" />
      
      <Suspense fallback={null}>
        <group rotation={[0, 0, 0.1]}>
          <DigitalCore />
          <OrbitalRings />
          <Particles count={2000} />
        </group>
        
        <Environment preset="city" />
        
        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.5} radius={0.6} levels={8} />
          <Noise opacity={0.02} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
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
