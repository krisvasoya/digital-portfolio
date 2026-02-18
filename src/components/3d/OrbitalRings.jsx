import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Torus } from '@react-three/drei'

const OrbitalRings = () => {
  const ring1 = useRef()
  const ring2 = useRef()
  const ring3 = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    
    if (ring1.current) {
      ring1.current.rotation.x = t * 0.1
      ring1.current.rotation.y = t * 0.05
    }
    
    if (ring2.current) {
      ring2.current.rotation.x = -t * 0.15
      ring2.current.rotation.z = t * 0.05
    }
    
    if (ring3.current) {
      ring3.current.rotation.y = t * 0.2
      ring3.current.rotation.x = t * 0.1
    }
  })

  return (
    <group>
      {/* Ring 1 - Large vertical-ish */}
      <Torus ref={ring1} args={[3.5, 0.02, 16, 100]}>
        <meshStandardMaterial 
          color="#0066ff" 
          emissive="#0066ff"
          emissiveIntensity={0.5}
          transparent 
          opacity={0.3} 
        />
      </Torus>

      {/* Ring 2 - Medium diagonal */}
      <Torus ref={ring2} args={[2.8, 0.03, 16, 100]}>
        <meshStandardMaterial 
          color="#00f3ff" 
          emissive="#00f3ff"
          emissiveIntensity={0.8}
          transparent 
          opacity={0.4} 
        />
      </Torus>

      {/* Ring 3 - Small fast */}
      <Torus ref={ring3} args={[2.2, 0.01, 16, 100]}>
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#ffffff"
          emissiveIntensity={1}
          transparent 
          opacity={0.2} 
        />
      </Torus>
    </group>
  )
}

export default OrbitalRings
