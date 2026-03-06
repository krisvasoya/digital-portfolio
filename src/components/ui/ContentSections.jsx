import React, { useState } from 'react'
import { motion } from 'framer-motion'

const Typewriter = ({ text, delay = 50 }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  React.useEffect(() => {
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

const ProjectCard = ({ project }) => {
  const cardRef = React.useRef(null)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    // Calculate rotation limits (-5 to 5 degrees)
    setRotateX(((y - centerY) / centerY) * -5)
    setRotateY(((x - centerX) / centerX) * 5)
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
  }

  return (
    <motion.div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => window.dispatchEvent(new CustomEvent('project-select', { detail: project }))}
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
      }}
      animate={{
        rotateX,
        rotateY,
        transformPerspective: 1000
      }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      whileHover={{ scale: 1.05, zIndex: 10, borderColor: '#00f3ff', boxShadow: '0 20px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 243, 255, 0.3)' }}
      style={{ 
        padding: '1.5rem', 
        border: '1px solid rgba(0,243,255,0.2)', 
        borderRadius: '12px', 
        background: 'rgba(5, 8, 16, 0.6)', 
        cursor: 'pointer',
        position: 'relative',
        transformStyle: 'preserve-3d',
        backdropFilter: 'blur(10px)'
      }}
    >
      <div style={{ transform: 'translateZ(30px)' }}>
        <h3 style={{ color: '#00f3ff', marginBottom: '0.5rem', textShadow: '0 0 10px rgba(0,243,255,0.5)' }}>{project.name}</h3>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.5' }}>
          {project.id === 1 ? <Typewriter text={project.description} delay={10} /> : project.description}
        </p>
      </div>
      
      {/* Holographic grid overlay */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '12px', pointerEvents: 'none',
        background: 'linear-gradient(rgba(0, 243, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 243, 255, 0.1) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        opacity: 0.3,
        transform: 'translateZ(-10px)'
      }} />
    </motion.div>
  )
}

export const Projects = () => (
  <motion.div 
    initial="hidden"
    animate="visible"
    variants={{
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    }}
    className="glass-panel" 
    style={{ height: '100%', overflowY: 'auto', perspective: '1000px' }}
  >
    <h2 className="holo-header">My Projects</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) minmax(250px, 1fr)', gap: '1.5rem', padding: '1rem 0' }}>
      {[
        {
          id: 1,
          name: "Digital Friction Analyzer",
          description: "Digital Friction Analyzer is a smart web analytics platform that tracks how users interact with a website and identifies where they struggle or get confused. It records clicks, navigation patterns, hesitation time, and repeated actions, then analyzes this behavior to detect hidden usability problems. The system shows results through an interactive dashboard with charts, heatmaps, and behavioral insights. This helps developers understand user frustration, improve website design, and create a smoother, more efficient user experience."
        },
        { id: 2, name: "Project Name 2", description: "COMING SOON" },
        { id: 3, name: "Project Name 3", description: "COMING SOON" },
        { id: 4, name: "Project Name 4", description: "COMING SOON" }
      ].map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  </motion.div>
)

export const Skills = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} 
    animate={{ opacity: 1, y: 0 }} 
    className="glass-panel" 
    style={{ height: '100%', overflowY: 'auto', position: 'relative' }}
  >
    <div style={{ position: 'absolute', top: 20, right: 20, width: 120, height: 120, opacity: 0.5, pointerEvents: 'none' }}>
      <svg viewBox="0 0 100 100" width="100%" height="100%" className="radar-svg">
        <circle cx="50" cy="50" r="48" fill="none" stroke="#00f3ff" strokeWidth="0.5" strokeDasharray="2 4" />
        <circle cx="50" cy="50" r="32" fill="none" stroke="#00f3ff" strokeWidth="0.5" opacity="0.5" />
        <circle cx="50" cy="50" r="16" fill="none" stroke="#00f3ff" strokeWidth="0.5" opacity="0.3" />
        <line x1="50" y1="2" x2="50" y2="98" stroke="#00f3ff" strokeWidth="0.5" opacity="0.5" />
        <line x1="2" y1="50" x2="98" y2="50" stroke="#00f3ff" strokeWidth="0.5" opacity="0.5" />
        
        {/* Radar sweep matching the cyber scanner theme */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          style={{ transformOrigin: '50px 50px' }}
        >
          <line x1="50" y1="50" x2="50" y2="2" stroke="#00ff41" strokeWidth="1.5" />
          <path d="M50 50 L50 2 A48 48 0 0 1 98 50 Z" fill="url(#radarGrad)" opacity="0.8" />
        </motion.g>

        {/* Blips */}
        <motion.circle cx="70" cy="30" r="2" fill="#00ff41" initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 4, delay: 0.5 }} />
        <motion.circle cx="30" cy="65" r="2" fill="#00ff41" initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 4, delay: 2.5 }} />
        <motion.circle cx="65" cy="70" r="1.5" fill="#00f3ff" initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 4, delay: 1.5 }} />

        <defs>
          <linearGradient id="radarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ff41" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#00ff41" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>

    <h2 className="holo-header" style={{ marginBottom: '2rem' }}>Technical Skills Scanner</h2>
    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingRight: '100px' }}>
      {[
        { name: "React / Frontend", level: "98%" },
        { name: "HTML / CSS", level: "95%" },
        { name: "Python", level: "85%" },
        { name: "2D Animation (Adobe Photoshop)", level: "90%" },
        { name: "Video Editing (DaVinci Resolve)", level: "88%" }
      ].map((skill, index) => (
        <li key={index} style={{ position: 'relative' }}>
          <div className="flex-between" style={{ marginBottom: '0.4rem' }}>
            <span style={{ fontFamily: 'monospace', letterSpacing: '1px', fontSize: '0.9rem', color: '#e2e8f0' }}>{skill.name}</span>
            <span className="holo-text" style={{ fontSize: '0.8rem' }}>{skill.level}</span>
          </div>
          <div style={{ width: '100%', height: '6px', background: 'rgba(0, 243, 255, 0.1)', borderRadius: '3px', overflow: 'hidden', border: '1px solid rgba(0, 243, 255, 0.2)' }}>
            <motion.div 
              initial={{ width: 0 }} 
              animate={{ width: skill.level }} 
              transition={{ duration: 1.5, delay: 0.2 + (index * 0.1), ease: "easeOut" }}
              style={{ 
                height: '100%', 
                background: 'linear-gradient(90deg, #00f3ff, #00ff41)',
                boxShadow: '0 0 10px #00f3ff'
              }} 
            />
          </div>
        </li>
      ))}
    </ul>
  </motion.div>
)

export const History = () => (
    <motion.div 
    initial={{ opacity: 0, y: 20 }} 
    animate={{ opacity: 1, y: 0 }} 
    className="glass-panel" 
    style={{ height: '100%', overflowY: 'auto' }}
  >
    <h2 className="holo-header">About Me</h2>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3 style={{ color: '#00f3ff', marginBottom: '0.5rem' }}>Professional Summary</h3>
        <p style={{ color: '#94a3b8' }}>Full Stack Developer with hands-on experience building modern, scalable web applications using React and Node.js. Strong foundation in frontend architecture, backend integration, and performance optimization. Focused on developing structured, maintainable systems that deliver real-world impact.</p>
      </div>

      <div>
        <h3 style={{ color: '#00f3ff', marginBottom: '0.5rem' }}>Core Expertise</h3>
        <ul style={{ color: '#94a3b8', listStyle: 'disc', paddingLeft: '1.2rem' }}>
          <li>Frontend Development (React, responsive UI systems)</li>
          <li>Backend Development (Node.js, REST APIs, database integration)</li>
          <li>Application Architecture & Modular Design</li>
          <li>Performance Optimization & Clean Code Practices</li>
          <li>UI Motion & 2D Visual Design Principles</li>
        </ul>
      </div>

      <div>
        <h3 style={{ color: '#00f3ff', marginBottom: '0.5rem' }}>Technical Approach</h3>
        <p style={{ color: '#94a3b8' }}>I approach development with a systems mindset — prioritizing clarity, scalability, and efficiency. Every feature is designed with long-term maintainability and measurable performance in mind. My goal is not just to build interfaces, but to engineer complete, reliable digital solutions.</p>
      </div>

      <div>
        <h3 style={{ color: '#00f3ff', marginBottom: '0.5rem' }}>Creative Edge</h3>
        <p style={{ color: '#94a3b8' }}>In addition to development, I have experience in 2D animation, visual design using Adobe Photoshop, and professional video editing with DaVinci Resolve. This allows me to bridge technical implementation with strong visual execution, creating products that are both functional and engaging.</p>
      </div>

      <div>
        <h3 style={{ color: '#00f3ff', marginBottom: '0.5rem' }}>Personal Interests</h3>
        <ul style={{ color: '#94a3b8', display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1rem' }}>
          <li>Photography</li>
          <li>Travel Exploration</li>
          <li>Reading & Research</li>
          <li>Painting & Creative Writing</li>
          <li>Music & Visual Storytelling</li>
        </ul>
      </div>
    </div>
  </motion.div>
)

export const Contact = () => {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [currentInput, setCurrentInput] = useState('')
  const [logs, setLogs] = useState([
    { text: 'SECURE COMM LINK ESTABLISHED.', type: 'system' },
    { text: 'PLEASE IDENTIFY YOURSELF (NAME):', type: 'prompt' }
  ])
  
  const endRef = React.useRef(null)

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && currentInput.trim() !== '') {
      const val = currentInput.trim()
      setCurrentInput('')
      
      setLogs(prev => [...prev, { text: val, type: 'user' }])
      
      if (step === 0) {
        setFormData(prev => ({ ...prev, name: val }))
        setStep(1)
        setTimeout(() => {
          setLogs(prev => [...prev, { text: 'ENTER COMMUNICATION ADDRESS (EMAIL):', type: 'prompt' }])
        }, 300)
      } else if (step === 1) {
        setFormData(prev => ({ ...prev, email: val }))
        setStep(2)
        setTimeout(() => {
          setLogs(prev => [...prev, { text: 'TRANSMIT ENCRYPTED PAYLOAD (MESSAGE):', type: 'prompt' }])
        }, 300)
      } else if (step === 2) {
        const finalData = { ...formData, message: val }
        setFormData(finalData)
        setStep(3)
        setTimeout(() => {
          setLogs(prev => [...prev, 
            { text: 'ENCRYPTING PAYLOAD...', type: 'system' },
            { text: 'TRANSMISSION READY. DISPATCHING TO KRISH.EXE...', type: 'success' }
          ])
          setTimeout(() => {
            const subject = `Portfolio Contact from ${finalData.name}`
            const body = `${finalData.message}\n\nFrom: ${finalData.name} (${finalData.email})`
            window.location.href = `mailto:krishvasoy6@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
          }, 1500)
        }, 500)
      }
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="glass-panel" 
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <h2 className="holo-header" style={{ marginBottom: '1rem' }}>Secure Comms</h2>
      <div 
        style={{ 
          flex: 1, 
          background: 'rgba(0, 5, 10, 0.8)', 
          border: '1px solid rgba(0, 243, 255, 0.3)', 
          borderRadius: '8px', 
          padding: '1.5rem', 
          fontFamily: 'monospace',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.8rem',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)'
        }}
        onClick={() => document.getElementById('contact-input')?.focus()}
      >
        {logs.map((log, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ 
              color: log.type === 'user' ? '#fff' : log.type === 'success' ? '#00ff41' : '#00f3ff',
              opacity: log.type === 'system' ? 0.7 : 1,
              display: 'flex',
              gap: '0.5rem'
            }}
          >
            {log.type === 'user' && <span style={{ color: '#00ff41' }}>{'>'}</span>}
            {log.type === 'prompt' && <span style={{ color: '#ffcc00' }}>[?]</span>}
            {log.type === 'system' && <span style={{ color: '#94a3b8' }}>[*]</span>}
            {log.type === 'success' && <span style={{ color: '#00ff41' }}>[+]</span>}
            <span>{log.text}</span>
          </motion.div>
        ))}
        {step < 3 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <span style={{ color: '#00ff41' }}>{'>'}</span>
            <input 
              id="contact-input"
              autoFocus
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontFamily: 'monospace',
                fontSize: '1rem',
                outline: 'none',
                flex: 1,
                caretColor: '#00f3ff'
              }}
            />
          </div>
        )}
        <div ref={endRef} />
      </div>
    </motion.div>
  )
}
