import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { audioSys } from '../../utils/AudioSystem'

const Terminal = ({ onNavigate }) => {
  const [history, setHistory] = useState([
    { type: 'system', text: 'KRISH.EXE v2.0.24 [Neural Link Active]' },
    { type: 'system', text: 'Type "help" for a list of available commands.' },
  ])
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  const handleCommand = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      const cmd = input.trim().toLowerCase()
      let response = []

      // Add user command to history
      const newHistory = [...history, { type: 'user', text: `> ${input}` }]

      // Command logic
      switch (cmd) {
        case 'help':
          response = [
            'Available commands:',
            '  projects           - Load project database',
            '  skills             - Analyze technical capabilities',
            '  about              - Access personal logs',
            '  contact            - Open communication channel',
            '  clear              - Clear terminal output',
            '  open project analyzer - Boot analyzer module'
          ]
          break;
        case 'overview':
        case 'home':
          onNavigate('overview')
          response = ['Initializing Display Core... Success.']
          break;
        case 'projects':
          onNavigate('projects')
          response = ['Accessing Project Database... Loaded.']
          break;
        case 'skills':
          onNavigate('skills')
          response = ['Scanning Technical Capabilities... 100% matched.']
          break;
        case 'about':
        case 'history':
          onNavigate('history')
          response = ['Retrieving Personal Logs... Decrypted.']
          break;
        case 'contact':
          onNavigate('contact')
          response = ['Opening Secure Communication Channel...']
          break;
        case 'graphics high':
          response = ['Graphics set to HIGH. Post-processing enabled.']
          window.dispatchEvent(new CustomEvent('graphics-toggle', { detail: 'high' }))
          break;
        case 'graphics low':
          response = ['Graphics set to LOW. Post-processing disabled to save power.']
          window.dispatchEvent(new CustomEvent('graphics-toggle', { detail: 'low' }))
          break;
        case 'open project analyzer':
        case 'open analyzer':
          onNavigate('projects') // Assuming projects hosts the analyzer, or maybe a secret
          response = ['[PROJECT ANALYZER BOOT SEQUENCE INITIATED]']
          window.dispatchEvent(new Event('trigger-glitch'))
          break;
        case 'clear':
          setHistory([])
          setInput('')
          return
        case 'sudo rm -rf /':
          response = ['NICE TRY. ACCESS DENIED.', 'Security Level: MAXIMUM']
          break;
        default:
          response = [`Command not found: ${cmd}`, 'Type "help" for a list of commands.']
      }

      setHistory([...newHistory, ...response.map(text => ({ type: 'response', text }))])
      setInput('')
    }
  }

  return (
    <div style={{ flex: 1, background: 'rgba(0,0,0,0.5)', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', border: '1px solid rgba(0,243,255,0.1)' }}>
      <h4 className="holo-text" style={{ fontSize: '0.9rem', marginBottom: '0.5rem', borderBottom: '1px solid rgba(0,243,255,0.2)', paddingBottom: '0.5rem' }}>
        Interactive Terminal
      </h4>
      
      <div style={{ flex: 1, overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '10px' }}>
        {history.map((line, i) => (
          <div key={i} style={{ 
            color: line.type === 'user' ? '#fff' : line.type === 'system' ? '#00f3ff' : '#94a3b8',
            marginBottom: '4px'
          }}>
            {line.type === 'response' || line.type === 'system' ? (
              line.text.split('').map((char, index) => (
                <motion.span
                  key={`${i}-${index}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.05, delay: index * 0.02 }}
                >
                  {char}
                </motion.span>
              ))
            ) : (
              line.text
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', fontFamily: 'monospace', fontSize: '0.8rem' }}>
        <span style={{ color: '#00f3ff', marginRight: '8px' }}>{'>'}</span>
        <input 
          type="text" 
          value={input}
          onChange={(e) => {
             setInput(e.target.value)
             audioSys.playType()
          }}
          onKeyDown={handleCommand}
          spellCheck="false"
          style={{ 
            background: 'transparent', 
            border: 'none', 
            color: '#fff', 
            outline: 'none',
            flex: 1,
            fontFamily: 'monospace'
          }}
          autoFocus
        />
      </div>
    </div>
  )
}

export default Terminal
