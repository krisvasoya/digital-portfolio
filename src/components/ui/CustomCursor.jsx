import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { audioSys } from '../../utils/AudioSystem';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const blobRef = useRef(null);
  const ringRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  
  // Mouse tracking with velocity for liquid stretching
  const mouse = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const vel = useRef({ x: 0, y: 0 });
  
  useEffect(() => {
    document.body.style.cursor = 'none';

    const onMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      // Hover detection
      const target = e.target;
      const isPointer = window.getComputedStyle(target).cursor === 'pointer' || 
                        target.closest('button') || 
                        target.closest('a');
      setIsHovering(isPointer);
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    // GSAP Animation Loop for Liquid Physics
    const render = () => {
      // Lagging position for smoothness
      const dt = 0.15;
      pos.current.x += (mouse.current.x - pos.current.x) * dt;
      pos.current.y += (mouse.current.y - pos.current.y) * dt;
      
      // Velocity calculation
      vel.current.x = mouse.current.x - pos.current.x;
      vel.current.y = mouse.current.y - pos.current.y;
      const speed = Math.sqrt(vel.current.x * vel.current.x + vel.current.y * vel.current.y);
      
      // Rotation based on movement direction
      const angle = Math.atan2(vel.current.y, vel.current.x) * (180 / Math.PI);
      
      // Stretch based on speed
      const stretch = Math.min(speed * 0.01, 0.8);
      const scaleX = 1 + stretch;
      const scaleY = 1 - stretch * 0.5;

      // Audio Reactivity
      const audioIntensity = audioSys.getFrequencyData() || 0;
      const pulseScale = 1 + audioIntensity * 0.5;

      if (cursorRef.current) {
        gsap.set(cursorRef.current, {
          x: pos.current.x,
          y: pos.current.y,
        });
      }

      if (ringRef.current) {
        gsap.set(ringRef.current, {
          x: pos.current.x,
          y: pos.current.y,
          scale: isHovering ? 1.5 : 1,
          opacity: isHovering ? 0.3 : 0.6,
        });
      }

      if (blobRef.current) {
        gsap.set(blobRef.current, {
          rotation: angle,
          scaleX: scaleX * pulseScale,
          scaleY: scaleY * pulseScale,
          width: isHovering ? 60 : 30,
          height: isHovering ? 60 : 30,
          boxShadow: `0 0 ${10 + audioIntensity * 30}px rgba(255, 255, 255, ${0.4 + audioIntensity * 0.6})`,
          duration: 0.3,
          ease: "power2.out"
        });
      }

      requestAnimationFrame(render);
    };

    const animationId = requestAnimationFrame(render);

    return () => {
      document.body.style.cursor = 'auto';
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      cancelAnimationFrame(animationId);
    };
  }, [isHovering]); // isHovering is back in dependencies to reflect the scale/opacity changes in the loop correctly if needed, but the loop is self-sustaining. Actually better to keep it to ensure the loop closure sees the latest isHovering.


  return (
    <>
      <div 
        ref={cursorRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 9999,
          transform: 'translate(-50%, -50%)',
          mixBlendMode: 'difference'
        }}
      >
        {/* Liquid Metal Blob */}
        <div 
          ref={blobRef}
          style={{
            width: 30,
            height: 30,
            background: 'radial-gradient(circle at 30% 30%, #ffffff, #90a4ae 40%, #455a64 90%)',
            borderRadius: '50%',
            filter: 'url(#gooey-filter)',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            transition: 'width 0.3s, height 0.3s'
          }}
        >
          {/* Subtle Glare */}
          <div style={{
            position: 'absolute',
            top: '15%',
            left: '15%',
            width: '30%',
            height: '30%',
            background: 'rgba(255, 255, 255, 0.4)',
            borderRadius: '50%',
            filter: 'blur(2px)'
          }} />
        </div>

      {/* Secondary Trailing Ring */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 40,
          height: 40,
          border: '1px solid rgba(255, 255, 255, 0.5)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9998,
          transform: 'translate(-50%, -50%)',
          mixBlendMode: 'difference'
        }}
      />

      {/* Click Ripple Wave */}
      {isClicking && (
        <motion.div
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            position: 'absolute',
            width: 20,
            height: 20,
            border: '2px solid #fff',
            borderRadius: '50%',
            top: '50%',
            left: '50%',
            marginTop: -10,
            marginLeft: -10,
            zIndex: 10000
          }}
        />
      )}
      </div>

      {/* SVG Gooey Filter Definition */}
      <svg style={{ visibility: 'hidden', position: 'absolute' }} width="0" height="0">
        <defs>
          <filter id="gooey-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix 
              in="blur" 
              mode="matrix" 
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" 
              result="goo" 
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>
    </>
  );
};

export default CustomCursor;


