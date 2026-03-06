import React, { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { easing } from 'maath'
import gsap from 'gsap'
import { audioSys } from '../../utils/AudioSystem'

const DigitalCore = () => {
  const coreRef = useRef()
  const outerRef = useRef()
  const lightRef = useRef()
  const groupRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [pulse, setPulse] = useState(0)
  const [isWarping, setIsWarping] = useState(false)
  const lastPointer = useRef(new THREE.Vector2())
  const velocityAverage = useRef(0)
  
  const [scrollProgress, setScrollProgress] = useState(0)
  const gyroOffset = useRef(new THREE.Vector2())

  const handleClick = (e) => {
    e.stopPropagation()
    setPulse(2)
    audioSys.playPulse()
  }

  useEffect(() => {
    const handleScroll = (e) => setScrollProgress(e.detail)
    const handleGyro = (e) => {
      gyroOffset.current.x = e.detail.x
      gyroOffset.current.y = e.detail.y
    }
    
    window.addEventListener('main-scroll', handleScroll)
    
    const handleWarp = () => {
      setIsWarping(true)
      audioSys.playWarp()
      
      // GSAP Explosion Timeline
      const tl = gsap.timeline({
        onComplete: () => setIsWarping(false)
      })

      // Explode outwards and fade
      if (groupRef.current) {
        tl.to(groupRef.current.scale, {
          x: 15, y: 15, z: 15, duration: 0.4, ease: "power2.in"
        })
        .to(groupRef.current.scale, {
          x: 1, y: 1, z: 1, duration: 0.6, ease: "power2.out"
        }, "+=0.1")
      }
      
      if (coreRef.current?.material) {
        tl.to(coreRef.current.material, {
          distort: 1.5, emissiveIntensity: 10, duration: 0.4
        }, 0)
        .to(coreRef.current.material, {
          distort: 0.4, emissiveIntensity: 2, duration: 0.6
        }, "-=0.6")
      }
    }
    
    window.addEventListener('page-transition', handleWarp)
    window.addEventListener('device-tilt', handleGyro)
    return () => {
        window.removeEventListener('page-transition', handleWarp)
        window.removeEventListener('main-scroll', handleScroll)
        window.removeEventListener('device-tilt', handleGyro)
    }
  }, [])

  useFrame((state, delta) => {
    if (isWarping) return // Let GSAP handle during warp
    
    const t = state.clock.getElapsedTime()
    
    if (pulse > 0) {
      setPulse(p => Math.max(0, p - delta * 3))
    }

    // Velocity tracking for Mood Mode
    const dx = state.pointer.x - lastPointer.current.x
    const dy = state.pointer.y - lastPointer.current.y
    const velocity = Math.sqrt(dx*dx + dy*dy) / (delta || 0.016)
    velocityAverage.current = velocityAverage.current * 0.95 + velocity * 0.05
    lastPointer.current.copy(state.pointer)
    
    const moodIntensity = Math.min(velocityAverage.current * 0.15, 1.2) // Cap mood intensity

    const pointerDistance = Math.sqrt(state.pointer.x ** 2 + state.pointer.y ** 2)
    const hoverScale = hovered ? 1.1 : 1.0
    // Combine base scale, hover, pulse, pointer distance, scroll progress AND mood intensity
    const scrollScaleModifier = 1 + (scrollProgress * 0.5) // Grow up to 1.5x larger based on scroll
    const targetScale = (hoverScale + pulse + (pointerDistance * 0.1) + moodIntensity * 0.2) * scrollScaleModifier

    if (coreRef.current) {
      // Base rotation + pointer influence + gyro + scroll influence + mood
      const combinedInputX = state.pointer.x + gyroOffset.current.x
      const combinedInputY = state.pointer.y + gyroOffset.current.y
      
      const targetRotX = (combinedInputY * 0.5) + Math.sin(t * 0.2) * 0.1 + (scrollProgress * Math.PI) + (moodIntensity * 0.5)
      const targetRotY = (combinedInputX * 0.5) + (t * (0.2 + moodIntensity * 0.8)) + (scrollProgress * Math.PI * 2)
      
      easing.dampE(coreRef.current.rotation, [targetRotX, targetRotY, t * 0.1], 0.25, delta)
      easing.damp3(coreRef.current.scale, [targetScale, targetScale, targetScale], 0.2, delta)
      
      if (coreRef.current.material) {
        const targetEmissive = 2 + pulse * 5 + pointerDistance * 2 + (scrollProgress * 2) + (moodIntensity * 4)
        easing.damp(coreRef.current.material, 'emissiveIntensity', targetEmissive, 0.2, delta)
        
        // Distortion reactivity to scroll
        const targetDistort = 0.4 + (scrollProgress * 0.6)
        easing.damp(coreRef.current.material, 'distort', targetDistort, 0.2, delta)
        
        coreRef.current.material.speed = 2 + pulse * 5 + pointerDistance * 2 + moodIntensity * 8
        
        // Color transition based on mood (calm blue -> intense red)
        const calmColor = new THREE.Color("#00f3ff")
        const intenseColor = new THREE.Color("#ff0055")
        coreRef.current.material.color.lerpColors(calmColor, intenseColor, Math.min(moodIntensity, 1))
        coreRef.current.material.emissive.lerpColors(calmColor, intenseColor, Math.min(moodIntensity, 1))
      }
    }
    
    if (outerRef.current) {
      const combinedInputX = state.pointer.x + gyroOffset.current.x
      const combinedInputY = state.pointer.y + gyroOffset.current.y
      
      const targetOuterRotX = -(combinedInputY * 0.3) + Math.sin(t * 0.5) * 0.2 - (scrollProgress * Math.PI)
      const targetOuterRotY = -(combinedInputX * 0.3) - (t * (0.1 + moodIntensity * 0.5)) - (scrollProgress * Math.PI * 2)
      
      easing.dampE(outerRef.current.rotation, [targetOuterRotX, targetOuterRotY, 0], 0.3, delta)
      const outerScale = targetScale * 1.2
      easing.damp3(outerRef.current.scale, [outerScale, outerScale, outerScale], 0.3, delta)
    }
    
    if (lightRef.current) {
      const targetLight = 4 + pulse * 10 + pointerDistance * 5 + (scrollProgress * 5) + (moodIntensity * 5)
      easing.damp(lightRef.current, 'intensity', targetLight, 0.2, delta)
      
      const calmColor = new THREE.Color("#00f3ff")
      const intenseColor = new THREE.Color("#ff0055")
      lightRef.current.color.lerpColors(calmColor, intenseColor, Math.min(moodIntensity, 1))
    }
  })

  return (
    <group 
      ref={groupRef}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
      onPointerOut={() => setHovered(false)}
      onClick={handleClick}
    >
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
      
      <Sphere args={[1.2, 32, 32]}>
        <meshBasicMaterial color="#000000" />
      </Sphere>
      
      <Sphere ref={outerRef} args={[1.8, 32, 32]}>
        <meshStandardMaterial
          color="#0066ff"
          transparent
          opacity={0.15}
          wireframe
          side={THREE.DoubleSide}
        />
      </Sphere>
      
      <pointLight ref={lightRef} distance={15} intensity={4} color="#00f3ff" decay={2} />
    </group>
  )
}

export default DigitalCore
