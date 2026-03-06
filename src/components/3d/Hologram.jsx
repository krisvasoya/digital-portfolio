import React, { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Float } from '@react-three/drei'
import * as THREE from 'three'

const Hologram = () => {
  const [project, setProject] = useState(null)
  const groupRef = useRef()
  const materialRef = useRef()
  
  useEffect(() => {
    const handleSelect = (e) => setProject(e.detail)
    const handleClear = () => setProject(null)
    
    // Listen for custom events
    window.addEventListener('project-select', handleSelect)
    window.addEventListener('project-clear', handleClear)
    
    // Also clear if nav changes
    const handleNav = (e) => {
        if (e.type === 'trigger-glitch') { // This is fired on nav change
            setProject(null)
        }
    }
    window.addEventListener('trigger-glitch', handleNav)
    
    return () => {
      window.removeEventListener('project-select', handleSelect)
      window.removeEventListener('project-clear', handleClear)
      window.removeEventListener('trigger-glitch', handleNav)
    }
  }, [])

  useFrame((state) => {
    if (materialRef.current) {
        // Create a pulsing hologram effect
        materialRef.current.opacity = 0.7 + Math.sin(state.clock.elapsedTime * 2) * 0.2
    }
  })

  if (!project) return null

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group ref={groupRef} position={[0, 0, 2]}> {/* Move it slightly forward */}
        {/* Holographic Panel Background */}
        <mesh position={[0, 0, -0.1]}>
            <planeGeometry args={[6, 3]} />
            <meshBasicMaterial 
                color="#00f3ff" 
                transparent 
                opacity={0.1} 
                side={THREE.DoubleSide} 
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </mesh>
        
        {/* Hologram Borders */}
        <mesh position={[0, 0, -0.09]}>
             <boxGeometry args={[6.1, 3.1, 0.01]} />
             <meshBasicMaterial color="#00f3ff" wireframe transparent opacity={0.3} />
        </mesh>

        <Text
          position={[0, 0.8, 0]}
          fontSize={0.4}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          ref={materialRef}
          material-transparent={true}
        >
          {project.name}
        </Text>
        
        <Text
          position={[0, 0, 0]}
          fontSize={0.15}
          color="#00f3ff"
          maxWidth={5}
          textAlign="center"
          anchorX="center"
          anchorY="middle"
        >
          {project.description.length > 200 ? project.description.substring(0, 200) + '...' : project.description}
        </Text>
        
        <Text
           position={[0, -1, 0]}
           fontSize={0.12}
           color="#ff0055"
           anchorX="center"
           anchorY="middle"
        >
            [ SYSTEM FILE RETRIEVED ]
        </Text>
      </group>
    </Float>
  )
}

export default Hologram
