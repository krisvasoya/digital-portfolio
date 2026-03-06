import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Monitor, Cpu, Activity, ShieldCheck, Volume2 } from 'lucide-react'

const CommandPalette = ({ onNavigate, onToggleAudio }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const inputRef = useRef(null)

  // Global key listener for Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
        setInput('')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  const commands = [
    { id: 'overview', name: 'Open Display Core', icon: <Activity size={16}/>, action: () => onNavigate('overview') },
    { id: 'projects', name: 'View Projects', icon: <Monitor size={16}/>, action: () => onNavigate('projects') },
    { id: 'skills', name: 'Scan Skills', icon: <Cpu size={16}/>, action: () => onNavigate('skills') },
    { id: 'history', name: 'Access History Log', icon: <Activity size={16}/>, action: () => onNavigate('history') },
    { id: 'contact', name: 'Initiate Contact', icon: <ShieldCheck size={16}/>, action: () => onNavigate('contact') },
    { id: 'audio', name: 'Toggle Audio System', icon: <Volume2 size={16}/>, action: onToggleAudio },
  ]

  const filteredCommands = commands.filter(cmd => 
    cmd.name.toLowerCase().includes(input.toLowerCase()) || 
    cmd.id.toLowerCase().includes(input.toLowerCase())
  )

  const handleCommandExecute = (action) => {
    action()
    setIsOpen(false)
    setInput('')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="command-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(5, 8, 16, 0.8)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '15vh'
          }}
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ 
              scale: 1.1, 
              opacity: 0, 
              y: 20,
              filter: 'blur(10px) brightness(2)'
            }}
            animate={{ 
              scale: 1, 
              opacity: 1, 
              y: 0,
              filter: 'blur(0px) brightness(1)'
            }}
            exit={{ 
              scale: 0.95, 
              opacity: 0, 
              y: -20,
              filter: 'blur(5px)'
            }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 25
            }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '600px',
              background: 'rgba(10, 15, 30, 0.95)',
              border: '1px solid rgba(0, 243, 255, 0.3)',
              borderRadius: '12px',
              boxShadow: '0 0 40px rgba(0, 243, 255, 0.2)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Input Header */}
            <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(0, 243, 255, 0.1)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Search size={20} color="#00f3ff" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Type a command or search..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  fontSize: '1.2rem',
                  outline: 'none',
                  fontFamily: 'monospace'
                }}
              />
              <span style={{ fontSize: '0.8rem', color: '#64748b', border: '1px solid #1e293b', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>ESC</span>
            </div>

            {/* Command List */}
            <div style={{ padding: '0.5rem', maxHeight: '300px', overflowY: 'auto' }}>
              {filteredCommands.length > 0 ? (
                filteredCommands.map((cmd) => (
                  <motion.button
                    key={cmd.id}
                    onClick={() => handleCommandExecute(cmd.action)}
                    whileHover={{ backgroundColor: 'rgba(0, 243, 255, 0.1)', x: 5 }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1rem',
                      background: 'transparent',
                      border: 'none',
                      color: '#e2e8f0',
                      cursor: 'pointer',
                      borderRadius: '8px',
                      transition: 'background 0.2s',
                      textAlign: 'left',
                      fontFamily: 'monospace'
                    }}
                  >
                    <span style={{ color: '#00f3ff' }}>{cmd.icon}</span>
                    <span style={{ flex: 1, fontSize: '1rem' }}>{cmd.name}</span>
                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>CMD</span>
                  </motion.button>
                ))
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b', fontFamily: 'monospace' }}>
                   NO COMMANDS FOUND FOR "{input}"
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div style={{ padding: '0.8rem 1.5rem', background: 'rgba(0,0,0,0.5)', borderTop: '1px solid rgba(0, 243, 255, 0.1)', fontSize: '0.8rem', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
                <span>Use arrows to navigate</span>
                <span className="holo-text">Global System Access</span>
            </div>
            
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CommandPalette
