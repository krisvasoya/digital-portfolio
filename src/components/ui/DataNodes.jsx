import React, { useRef, useEffect } from 'react';

class Particle {
  constructor(width, height) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 1;
    this.vy = (Math.random() - 0.5) * 1;
    this.baseSize = Math.random() * 2 + 1;
    this.size = this.baseSize;
    this.energy = 0; // energy spikes when near mouse
  }

  update(width, height, mouse, mouseRadius) {
    this.x += this.vx;
    this.y += this.vy;

    // Wrap around
    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;

    // Mouse interaction
    if (mouse.x != null && mouse.y != null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < mouseRadius) {
        // Pulse node size and energy
        this.energy = (mouseRadius - distance) / mouseRadius;
        this.size = this.baseSize + (this.energy * 3);
        
        // Slight attraction/repulsion
        const force = (mouseRadius - distance) / mouseRadius;
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        
        // Push away slightly
        this.x -= forceDirectionX * force * 2;
        this.y -= forceDirectionY * force * 2;
      } else {
        this.energy = 0;
        this.size = this.baseSize;
      }
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    
    // Base color vs pulsed color
    const r = 0;
    const g = 243;
    const b = 255;
    const a = 0.3 + (this.energy * 0.7); // Opacity increases with energy
    
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
    ctx.shadowBlur = this.energy > 0 ? 15 : 0;
    ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 1)`;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

const DataNodes = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let particles = [];
    const particleCount = Math.floor((width * height) / 15000); // Responsive count
    const connectionDistance = 150;
    const mouseRadius = 200;

    let mouse = {
      x: null,
      y: null,
      vx: 0,
      vy: 0
    };

    const handleMouseMove = (e) => {
      mouse.vx = e.clientX - mouse.x;
      mouse.vy = e.clientY - mouse.y;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(width, height));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw lines between particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            
            // Opacity based on distance and combined energy
            const baseOpacity = 1 - (distance / connectionDistance);
            const energyBonus = (particles[i].energy + particles[j].energy) * 0.5;
            const finalOpacity = Math.min(0.8, (baseOpacity * 0.2) + energyBonus);
            
            ctx.strokeStyle = `rgba(0, 243, 255, ${finalOpacity})`;
            ctx.lineWidth = 1 + (energyBonus * 2);
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Update and draw particles
      particles.forEach(p => {
        p.update(width, height, mouse, mouseRadius);
        p.draw(ctx);
      });

      requestAnimationFrame(animate);
    };

    initParticles();
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none'
      }}
    />
  );
};

export default DataNodes;
