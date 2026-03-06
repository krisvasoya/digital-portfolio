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
        const height = radius * percent * 1.5
        const angle = (i / barCount) * Math.PI * 2
        
        const x1 = centerX + Math.cos(angle) * radius
        const y1 = centerY + Math.sin(angle) * radius
        const x2 = centerX + Math.cos(angle) * (radius + height)
        const y2 = centerY + Math.sin(angle) * (radius + height)
        
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
      }
      
      ctx.stroke()
      
      // Simple Pulse Circle in middle
      const avg = data.reduce((a, b) => a + b, 0) / data.length
      const pulseSize = radius + (avg / 255) * 20
      
      ctx.beginPath()
      ctx.arc(centerX, centerY, pulseSize, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(0, 243, 255, 0.3)'
      ctx.stroke()
      
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
