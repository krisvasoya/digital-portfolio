import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as random from 'maath/random/dist/maath-random.esm'

const Particles = (props) => {
  const ref = useRef()
  // Generate random points in a sphere volume
  const [sphere] = useState(() => random.inSphere(new Float32Array(5000), { radius: 20 }))

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10
    ref.current.rotation.y -= delta / 15

    // Mouse interaction
    // const time = state.clock.getElapsedTime()
    // const mouseX = state.mouse.x * 2 // Expand mouse range
    // const mouseY = state.mouse.y * 2
    
    // We can add subtle wave motion or reaction here if we expanded the points to be individual meshes, 
    // but for simple Points material, rotation is the most performant way to "move" the field.
    // To make it more interactive, we'll lerp the rotation based on mouse position
    
    ref.current.rotation.x = state.mouse.y * 0.2
    ref.current.rotation.y = state.mouse.x * 0.2
  })

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#00f3ff"
          size={0.03}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.4}
        />
      </Points>
    </group>
  )
}

export default Particles
