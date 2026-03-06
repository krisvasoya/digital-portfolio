import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { audioSys } from '../../utils/AudioSystem'

const NeuralNetwork = ({ nodeCount = 50, connectionMaxDistance = 6 }) => {
  const pointsRef = useRef()
  const linesRef = useRef()
  const groupRef = useRef()
  
  // Data for nodes and positions
  const { positions, lineGeometry } = useMemo(() => {
    // Seeded random for React Purity
    const seededRandom = (s) => {
      const t = s + 0x6D2B79F5
      const r = Math.imul(t ^ (t >>> 15), t | 1)
      return ((r + Math.imul(r ^ (r >>> 7), r | 61)) ^ r) >>> 0
    }

    const pos = new Float32Array(nodeCount * 3)
    const nodesArray = []
    
    // Create random node positions
    for (let i = 0; i < nodeCount; i++) {
      const i3 = i * 3
      const s = (i + 1) * 12345 // arbitrary seed base
      
      const x = (seededRandom(s) / 0xFFFFFFFF - 0.5) * 20
      const y = (seededRandom(s + 1) / 0xFFFFFFFF - 0.5) * 20
      const z = (seededRandom(s + 2) / 0xFFFFFFFF - 0.5) * 20
      
      pos[i3] = x
      pos[i3 + 1] = y
      pos[i3 + 2] = z
      nodesArray.push(new THREE.Vector3(x, y, z))
    }
    
    // Create connections based on distance
    const lineCoords = []
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dist = nodesArray[i].distanceTo(nodesArray[j])
        if (dist < connectionMaxDistance) {
          lineCoords.push(nodesArray[i].x, nodesArray[i].y, nodesArray[i].z)
          lineCoords.push(nodesArray[j].x, nodesArray[j].y, nodesArray[j].z)
        }
      }
    }
    
    const lineGeo = new THREE.BufferGeometry()
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(lineCoords, 3))
    
    return { positions: pos, lineGeometry: lineGeo }
  }, [nodeCount, connectionMaxDistance])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    const audioIntensity = audioSys.getFrequencyData() || 0
    
    if (groupRef.current) {
        // Subtle mouse influence on whole network rotation
        const targetRotX = (state.pointer.y * 0.2)
        const targetRotY = (state.pointer.x * 0.2)
        
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.1)
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY + t * 0.05, 0.1)
    }

    if (pointsRef.current) {
        // Pulse size based on audio
        pointsRef.current.material.size = 0.15 + audioIntensity * 0.3
        pointsRef.current.material.opacity = 0.6 + audioIntensity * 0.4
    }

    if (linesRef.current) {
        // Pulsating lines
        linesRef.current.material.opacity = 0.05 + audioIntensity * 0.2
        linesRef.current.scale.setScalar(1 + audioIntensity * 0.05)
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, -8]}>
      {/* Nodes */}
      <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#00f3ff"
          size={0.15}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      
      {/* Connections */}
      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial 
          color="#00f3ff" 
          transparent 
          opacity={0.05} 
          linewidth={1}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  )
}

export default NeuralNetwork

