import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Typewriter from 'typewriter-effect';

const InitializationSequence = ({ onComplete }) => {
  const [phase, setPhase] = useState(0); // 0: initial blank, 1: boot text, 2: progress, 3: post-progress text
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  
  // Custom scanline style for the retro CRT feel
  const scanlineStyle = {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
    backgroundSize: '100% 2px, 3px 100%',
    pointerEvents: 'none',
    zIndex: 10,
  };

  useEffect(() => {
    // Sequence timing
    const t = setTimeout(() => setPhase(1), 500); 
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase === 2) {
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += Math.floor(Math.random() * 12) + 4;
        if (currentProgress >= 100) {
          currentProgress = 100;
          clearInterval(interval);
          setTimeout(() => setPhase(3), 400); // move to phase 3 slightly after reaching 100%
        }
        setProgress(currentProgress);
      }, 80);
      return () => clearInterval(interval);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 3) {
      // Allow type writer to finish typing the final welcome string before triggering exit
      setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          onComplete();
        }, 800); // 800ms exit animation
      }, 3500); 
    }
  }, [phase, onComplete]);

  // Loading bar logic
  const filledBlocks = Math.floor(progress / 5);
  const emptyBlocks = 20 - filledBlocks;
  const barString = '█'.repeat(Math.max(0, filledBlocks)) + '░'.repeat(Math.max(0, emptyBlocks));

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: '#000000',
            color: '#00f3ff', // Sci-fi cyan
            fontFamily: '"Courier New", Courier, monospace',
            padding: '2rem',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden'
          }}
        >
          <div style={scanlineStyle} />
          
          <div style={{ zIndex: 11, fontSize: '1.2rem', lineHeight: '1.8', maxWidth: '600px', width: '100%', textAlign: 'left' }}>
            
            {phase >= 1 && (
              <Typewriter
                onInit={(typewriter) => {
                  typewriter
                    .changeDelay(40)
                    .typeString('Initializing SI AI System...<br/>')
                    .pauseFor(200)
                    .callFunction(() => {
                       setPhase(2);
                    })
                    .start();
                }}
                options={{ 
                  cursor: phase === 1 ? '█' : '', // hide cursor when done
                  delay: 40
                }}
              />
            )}

            {phase >= 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ margin: '0.5rem 0' }}>
                Loading Neural Modules <span style={{ color: '#00ff41' }}>{barString}</span> {progress}%
              </motion.div>
            )}

            {phase >= 3 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Typewriter
                  onInit={(typewriter) => {
                    typewriter
                      .changeDelay(30)
                      .typeString('Decrypting Portfolio Core...<br/>')
                      .pauseFor(300)
                      .typeString('Authentication Complete.<br/><br/>')
                      .pauseFor(400)
                      .typeString('<span style="color:#fff; font-size:2.5rem; font-weight:bold; text-shadow: 0 0 15px #00f3ff; display:block; text-align:center; letter-spacing: 0.1em;">WELCOME USER</span>')
                      .start();
                  }}
                  options={{ cursor: '█' }}
                />
              </motion.div>
            )}

          </div>

          {/* Glitch Flash Overlay - flashes right when welcome text appears */}
          {phase === 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.8, 0, 0.3, 0] }}
              transition={{ delay: 2.2, duration: 0.4, times: [0, 0.1, 0.2, 0.3, 1] }}
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'white',
                mixBlendMode: 'overlay',
                zIndex: 20,
                pointerEvents: 'none'
              }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InitializationSequence;
