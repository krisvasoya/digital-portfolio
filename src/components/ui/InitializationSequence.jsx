import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const steps = [
  "System Initializing...",
  "Loading Projects & Skills...",
  "Optimizing Interface...",
  "Welcome to My Digital Portfolio"
]

const InitializationSequence = ({ onComplete }) => {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (step < steps.length) {
      const timeout = setTimeout(() => {
        setStep(prev => prev + 1)
      }, 1500)
      return () => clearTimeout(timeout)
    } else {
      const timeout = setTimeout(() => {
        onComplete()
      }, 1000)
      return () => clearTimeout(timeout)
    }
  }, [step, onComplete])

  return (
    <AnimatePresence>
      {step < steps.length && (
        <motion.div
          className="flex-center flex-col"
          style={{ width: '100vw', height: '100vh', background: 'black', position: 'fixed', zIndex: 100 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="holo-header"
            style={{ fontSize: '2rem', letterSpacing: '0.2em' }}
          >
            {steps[step]}
          </motion.div>
          
          <motion.div 
            style={{ 
              width: '200px', 
              height: '2px', 
              background: '#0066ff',
              marginTop: '20px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <motion.div
              style={{
                width: '100%',
                height: '100%',
                background: '#00f3ff',
                boxShadow: '0 0 10px #00f3ff'
              }}
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default InitializationSequence
