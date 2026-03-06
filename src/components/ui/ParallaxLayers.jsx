import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'

const ParallaxLayers = () => {
  const layer1 = useRef(null)
  const layer2 = useRef(null)
  const layer3 = useRef(null)

  useEffect(() => {
    let currentX = 0, currentY = 0

    const handleMouseMove = (e) => {
      currentX = (e.clientX / window.innerWidth - 0.5) * 2
      currentY = (e.clientY / window.innerHeight - 0.5) * 2

      gsap.to(layer1.current, { x: currentX * 20, y: currentY * 20, duration: 1, ease: 'power2.out' })
      gsap.to(layer2.current, { x: currentX * 40, y: currentY * 40, duration: 1, ease: 'power2.out' })
      gsap.to(layer3.current, { x: currentX * 80, y: currentY * 80, duration: 1, ease: 'power2.out' })
    }

    const handleScroll = (e) => {
      const p = e.detail // 0 to 1
      // Use GSAP's y property for translation
      gsap.to(layer1.current, { y: currentY * 20 - (p * 50), duration: 0.5, ease: 'power2.out', overwrite: 'auto' })
      gsap.to(layer2.current, { y: currentY * 40 - (p * 150), duration: 0.5, ease: 'power2.out', overwrite: 'auto' })
      gsap.to(layer3.current, { y: currentY * 80 - (p * 300), duration: 0.5, ease: 'power2.out', overwrite: 'auto' })
    }

    const handleGyro = (e) => {
      const { x, y } = e.detail
      
      // Override currentX and currentY with gyro data on mobile
      currentX = x * 2
      currentY = y * 2

      gsap.to(layer1.current, { x: currentX * 20, y: currentY * 20, duration: 1, ease: 'power2.out' })
      gsap.to(layer2.current, { x: currentX * 40, y: currentY * 40, duration: 1, ease: 'power2.out' })
      gsap.to(layer3.current, { x: currentX * 80, y: currentY * 80, duration: 1, ease: 'power2.out' })
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('main-scroll', handleScroll)
    window.addEventListener('device-tilt', handleGyro)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('main-scroll', handleScroll)
      window.removeEventListener('device-tilt', handleGyro)
    }
  }, [])

  return (
    <div style={{ position: 'fixed', top: '-20%', left: '-20%', width: '140%', height: '140%', pointerEvents: 'none', zIndex: -1 }}>
      <div 
        ref={layer1} 
        style={{ 
          position: 'absolute', inset: 0, opacity: 0.15,
          background: 'radial-gradient(circle at center, var(--color-primary) 0%, transparent 2px)',
          backgroundSize: '80px 80px'
        }} 
      />
      <div 
        ref={layer2} 
        style={{ 
          position: 'absolute', inset: 0, opacity: 0.1,
          background: 'radial-gradient(circle at center, var(--color-accent) 0%, transparent 3px)',
          backgroundSize: '150px 150px', backgroundPosition: '50px 50px'
        }} 
      />
      <div 
        ref={layer3} 
        style={{ 
          position: 'absolute', inset: 0, opacity: 0.05,
          background: 'radial-gradient(circle at center, white 0%, transparent 4px)',
          backgroundSize: '250px 250px', backgroundPosition: '100px 100px'
        }} 
      />
    </div>
  )
}

export default ParallaxLayers
