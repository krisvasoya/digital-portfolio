import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

const ParticleLayer = ({ count, size, color, opacity, speedModifier = 1, radius = 20 }) => {
  const ref = useRef()
  
  const positions = useMemo(() => {
    // Seeded random for React Purity (and React Compiler compatibility)
    const seededRandom = (s) => {
      const t = s + 0x6D2B79F5
      const r = Math.imul(t ^ (t >>> 15), t | 1)
      return ((r + Math.imul(r ^ (r >>> 7), r | 61)) ^ r) >>> 0
    }

    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
        const i3 = i * 3
        const s = (i + 1) * count * (radius + 1)
        pos[i3] = (seededRandom(s) / 0xFFFFFFFF - 0.5) * radius * 2
        pos[i3 + 1] = (seededRandom(s + 1) / 0xFFFFFFFF - 0.5) * radius * 2
        pos[i3 + 2] = (seededRandom(s + 2) / 0xFFFFFFFF - 0.5) * radius * 2
    }
    return pos
  }, [count, radius])

  useFrame((state) => {
    if (!ref.current) return
    
    const t = state.clock.getElapsedTime() * speedModifier
    
    // Cosmic Drift
    ref.current.rotation.x = Math.sin(t * 0.1) * 0.1
    ref.current.rotation.y = t * 0.05
    ref.current.rotation.z = Math.cos(t * 0.1) * 0.1

    // Mouse Influence - subtle push
    const mouseX = state.pointer.x * 2
    const mouseY = state.pointer.y * 2
    
    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, mouseX * 0.5, 0.1)
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, mouseY * 0.5, 0.1)
  })

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={color}
        size={size}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={opacity}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}

const Particles = () => {
  return (
    <group>
      {/* Near Layer - Floating Dust */}
      <ParticleLayer 
        count={2000} 
        size={0.08} 
        color="#ffffff" 
        opacity={0.3} 
        speedModifier={0.8} 
        radius={15}
      />
      
      {/* Mid Layer - Main Digital Particles */}
      <ParticleLayer 
        count={8000} 
        size={0.04} 
        color="#00f3ff" 
        opacity={0.4} 
        speedModifier={0.4} 
        radius={25}
      />
      
      {/* Far Layer - Distant Stars */}
      <ParticleLayer 
        count={5000} 
        size={0.02} 
        color="#0066ff" 
        opacity={0.2} 
        speedModifier={0.1} 
        radius={40}
      />
    </group>
  )
}

export default Particles

