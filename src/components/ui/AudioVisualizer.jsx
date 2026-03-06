import React, { useEffect, useRef } from 'react'
import { audioSys } from '../../utils/AudioSystem'

const AudioVisualizer = () => {
  const canvasRef = useRef(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationId
    
    const render = () => {
      const data = audioSys.getFullFrequencyData()
      if (!data) {
        animationId = requestAnimationFrame(render)
        return
      }
      
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = 40
      const barCount = data.length
      
      ctx.beginPath()
      ctx.strokeStyle = '#00f3ff'
      ctx.lineWidth = 2
      ctx.shadowBlur = 10
      ctx.shadowColor = '#00f3ff'
      
      for (let i = 0; i < barCount; i++) {
        const value = data[i]
        const percent = value / 255
        const height = radius * percent * 2 // Taller bars
        const angle = (i / barCount) * Math.PI * 2
        
        const x1 = centerX + Math.cos(angle) * (radius + 2)
        const y1 = centerY + Math.sin(angle) * (radius + 2)
        const x2 = centerX + Math.cos(angle) * (radius + height + 2)
        const y2 = centerY + Math.sin(angle) * (radius + height + 2)
        
        // Gradient color based on frequency
        const hue = 180 + (percent * 40)
        ctx.strokeStyle = `hsla(${hue}, 100%, 50%, ${0.5 + percent * 0.5})`
        ctx.lineWidth = 2 + percent * 2
        
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
      }
      
      // Secondary glowing ring
      const avg = data.reduce((a, b) => a + b, 0) / data.length
      const pulseSize = radius + (avg / 255) * 30
      
      ctx.beginPath()
      ctx.arc(centerX, centerY, pulseSize, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(0, 243, 255, 0.2)'
      ctx.lineWidth = 1
      ctx.setLineDash([5, 5])
      ctx.stroke()
      ctx.setLineDash([])

      // Center Core Glow
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
      gradient.addColorStop(0, `rgba(0, 243, 255, ${0.4 + (avg/255) * 0.4})`)
      gradient.addColorStop(1, 'rgba(0, 243, 255, 0)')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.fill()
      
      animationId = requestAnimationFrame(render)
    }
    
    render()
    
    return () => cancelAnimationFrame(animationId)
  }, [])

  return (
    <canvas 
      ref={canvasRef} 
      width={200} 
      height={200}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        pointerEvents: 'none',
        zIndex: 100,
        opacity: 0.8
      }}
    />
  )
}

export default AudioVisualizer
