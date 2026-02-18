import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

const DigitalCore = () => {
  const coreRef = useRef()
  const outerRef = useRef()
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.2
      coreRef.current.rotation.z = t * 0.1
    }
    if (outerRef.current) {
      outerRef.current.rotation.y = -t * 0.1
      outerRef.current.rotation.x = Math.sin(t * 0.5) * 0.2
    }
  })

  return (
    <group>
      {/* Inner Glowing Core */}
      <Sphere ref={coreRef} args={[1.5, 64, 64]}>
        <MeshDistortMaterial
          color="#00f3ff"
          emissive="#00f3ff"
          emissiveIntensity={2}
          roughness={0.2}
          metalness={0.8}
          distort={0.4}
          speed={2}
          wireframe
        />
      </Sphere>
      
      {/* Solid Inner Core for Occlusion/Depth */}
      <Sphere args={[1.2, 32, 32]}>
        <meshBasicMaterial color="#000000" />
      </Sphere>
      
      {/* Outer Holographic Shell */}
      <Sphere ref={outerRef} args={[1.8, 32, 32]}>
        <meshStandardMaterial
          color="#0066ff"
          transparent
          opacity={0.1}
          wireframe
          side={THREE.DoubleSide}
        />
      </Sphere>
      
      {/* Glow Halo */}
      <pointLight distance={10} intensity={4} color="#00f3ff" decay={2} />
    </group>
  )
}

export default DigitalCore
