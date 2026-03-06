import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Torus, Html, Sphere } from '@react-three/drei'

// Individual orbiting skill node
const Satellite = ({ skill, radius, speed, angle, yOffset, color }) => {
  const ref = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (ref.current) {
      ref.current.position.x = Math.cos(t * speed + angle) * radius
      ref.current.position.z = Math.sin(t * speed + angle) * radius
      // Gentle bobbing motion
      ref.current.position.y = Math.sin(t * speed * 2 + angle) * 0.5 + yOffset
    }
  })

  return (
    <group ref={ref}>
      <Sphere args={[0.04, 16, 16]}>
        <meshBasicMaterial color={color} />
      </Sphere>
      <Html distanceFactor={12} center position={[0, 0.2, 0]}>
        <div style={{
          color: color, 
          fontFamily: 'monospace',
          fontSize: '12px',
          fontWeight: 'bold',
          textShadow: `0 0 10px ${color}`,
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          background: 'rgba(0, 0, 0, 0.4)',
          padding: '2px 6px',
          borderRadius: '4px',
          border: `1px solid rgba(255, 255, 255, 0.1)`
        }}>
          {skill}
        </div>
      </Html>
    </group>
  )
}

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

  const skillNodes = [
    { skill: 'React', radius: 3.5, speed: 0.2, angle: 0, yOffset: 0, color: '#00f3ff' },
    { skill: 'Three.js', radius: 3.5, speed: 0.2, angle: Math.PI, yOffset: 0.5, color: '#00f3ff' },
    { skill: 'Node.js', radius: 2.8, speed: -0.3, angle: Math.PI / 2, yOffset: -0.5, color: '#00ff41' },
    { skill: 'Python', radius: 2.8, speed: -0.3, angle: Math.PI * 1.5, yOffset: 0.2, color: '#00ff41' },
    { skill: 'GSAP', radius: 4.2, speed: 0.15, angle: Math.PI / 4, yOffset: 0, color: '#ffcc00' },
    { skill: 'UI/UX', radius: 4.2, speed: 0.15, angle: Math.PI * 1.25, yOffset: -0.3, color: '#ffcc00' }
  ]

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

      {/* Galaxy Skill Nodes */}
      {skillNodes.map((s, i) => <Satellite key={i} {...s} />)}
    </group>
  )
}

export default OrbitalRings
