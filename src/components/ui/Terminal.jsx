import React, { useState, useEffect, useRef } from 'react'
import { audioSys } from '../../utils/AudioSystem'

const Typewriter = ({ text, delay = 20 }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text]);

  return <span>{currentText}</span>;
};

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
    <div style={{ 
      flex: 1, 
      background: 'rgba(0,0,0,0.7)', 
      borderRadius: '8px', 
      padding: '1rem', 
      display: 'flex', 
      flexDirection: 'column', 
      border: '1px solid rgba(0,243,255,0.2)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* CRT Flicker Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))',
        backgroundSize: '100% 2px, 3px 100%',
        pointerEvents: 'none',
        zIndex: 10,
        opacity: 0.5,
        animation: 'terminalFlicker 0.15s infinite ease-in-out'
      }} />
      
      <h4 className="holo-text" style={{ fontSize: '0.9rem', marginBottom: '0.5rem', borderBottom: '1px solid rgba(0,243,255,0.2)', paddingBottom: '0.5rem' }}>
        Terminal@SI-Core:~$
      </h4>
      
      <div style={{ flex: 1, overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '10px', position: 'relative', zIndex: 1 }}>
        {history.map((line, i) => (
          <div key={i} style={{ 
            color: line.type === 'user' ? '#fff' : line.type === 'system' ? '#00f3ff' : '#94a3b8',
            marginBottom: '4px',
            textShadow: line.type === 'system' ? '0 0 5px rgba(0,243,255,0.5)' : 'none'
          }}>
            {line.type === 'response' || line.type === 'system' ? (
              <Typewriter text={line.text} delay={15} />
            ) : (
              line.text
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', fontFamily: 'monospace', fontSize: '0.8rem', position: 'relative', zIndex: 1 }}>
        <span style={{ color: '#00f3ff', marginRight: '8px' }}>$</span>
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

      <style>{`
        @keyframes terminalFlicker {
          0% { opacity: 0.45; }
          5% { opacity: 0.55; }
          10% { opacity: 0.48; }
          15% { opacity: 0.52; }
          20% { opacity: 0.45; }
          25% { opacity: 0.55; }
          30% { opacity: 0.48; }
          100% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}

export default Terminal
