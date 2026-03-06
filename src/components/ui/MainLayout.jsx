import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Monitor, Cpu, Activity, ShieldCheck, Volume2, VolumeX } from 'lucide-react'
import { Projects, Skills, History, Contact } from './ContentSections'
import Terminal from './Terminal'
import CommandPalette from './CommandPalette'
import DataNodes from './DataNodes'
import FloatingAI from './FloatingAI'
import CustomCursor from './CustomCursor'
import ParallaxLayers from './ParallaxLayers'
import AudioVisualizer from './AudioVisualizer'
import { audioSys } from '../../utils/AudioSystem'

const MainLayout = () => {
  const [activeSection, setActiveSection] = useState('overview')
  const [isProjectViewing, setIsProjectViewing] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [overrideActive, setOverrideActive] = useState(false)
  const [githubData, setGithubData] = useState(null)

  React.useEffect(() => {
    fetch('https://api.github.com/users/krishvasoya')
      .then(res => res.json())
      .then(data => setGithubData(data))
      .catch(err => console.error("GitHub fetch error:", err))
  }, [])

  const toggleAudio = () => {
    if (audioEnabled) {
      audioSys.stop()
      setAudioEnabled(false)
    } else {
      audioSys.init()
      setAudioEnabled(true)
    }
  }

  React.useEffect(() => {
    const handleSelect = () => setIsProjectViewing(true)
    const handleClear = () => setIsProjectViewing(false)
    const handleNav = (e) => { if (e.type === 'page-transition') setIsProjectViewing(false) }

    window.addEventListener('project-select', handleSelect)
    window.addEventListener('project-clear', handleClear)
    window.addEventListener('page-transition', handleNav)

    // Konami Code sequence: Up, Up, Down, Down, Left, Right, Left, Right, B, A
    const konamiCode = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']
    let konamiIndex = 0

    const handleKeyDown = (e) => {
      if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++
        if (konamiIndex === konamiCode.length) {
          setOverrideActive(true)
          audioSys.playPulse() // Play heavy pulse sound
          konamiIndex = 0
          setTimeout(() => setOverrideActive(false), 5000) // Revert after 5s
        }
      } else {
        konamiIndex = 0
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    
    // Add scroll tracking for 3D universe
    const handleScroll = (e) => {
      const target = e.target;
      // Dispatch custom event with scroll info for ThreeJS
      const scrollProgress = target.scrollTop / (target.scrollHeight - target.clientHeight) || 0;
      window.dispatchEvent(new CustomEvent('main-scroll', { detail: scrollProgress }));
    };
    
    // Gyroscope tracking for mobile
    const handleOrientation = (e) => {
      // beta (-180 to 180) front-back tilt, gamma (-90 to 90) left-right tilt
      if (!e.beta || !e.gamma) return;
      const tiltX = (e.gamma / 90); // Normalize roughly -1 to 1
      const tiltY = (e.beta / 180); // Normalize roughly -1 to 1
      window.dispatchEvent(new CustomEvent('device-tilt', { detail: { x: tiltX, y: tiltY } }));
    };

    window.addEventListener('scroll', handleScroll, true); // capture phase
    window.addEventListener('deviceorientation', handleOrientation);

    return () => {
      window.removeEventListener('project-select', handleSelect)
      window.removeEventListener('project-clear', handleClear)
      window.removeEventListener('page-transition', handleNav)
      window.removeEventListener('scroll', handleScroll, true)
      window.removeEventListener('deviceorientation', handleOrientation)
    }
  }, [])

  return (
    <div className="scanlines-container" style={{ filter: overrideActive ? 'hue-rotate(270deg) contrast(150%) brightness(150%)' : 'none', transition: 'filter 0.5s ease' }}>
      <CustomCursor />
      <div className="scanlines" style={{ opacity: overrideActive ? 0.3 : 0.1 }} />
      <ParallaxLayers />
      <DataNodes />
      {audioEnabled && <AudioVisualizer />}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 1 }}
      className="main-layout-grid"
      style={{ 
        width: '100%', 
        height: '100%', 
        padding: '2rem', 
        display: 'grid', 
        gridTemplateColumns: '300px 1fr 300px',
        gridTemplateRows: 'auto 1fr auto',
        gap: '1.5rem',
        pointerEvents: 'auto'
      }}
    >
      {/* Header */}
      <header style={{ gridColumn: '1 / -1', background: overrideActive ? 'rgba(255, 0, 0, 0.1)' : 'rgba(5, 8, 16, 0.6)', borderColor: overrideActive ? '#ff0000' : 'rgba(0, 243, 255, 0.2)' }} className="flex-between glass-panel layout-header">
        <div className="flex-col">
          <h1 className="holo-header" style={{ margin: 0, color: overrideActive ? '#ff0000' : '#00f3ff', textShadow: overrideActive ? '0 0 10px #ff0000' : 'none' }}>
            {overrideActive ? 'OVERRIDE PROTOCOL' : 'SI AI SYSTEM'}
          </h1>
          <span className="holo-text" style={{ fontSize: '0.8rem', color: overrideActive ? '#ff4444' : '#00f3ff' }}>Computer Science Student</span>
        </div>
        <div className="flex-center" style={{ gap: '1.5rem' }}>
          <button 
             onClick={toggleAudio}
             className="cyber-btn"
             style={{ padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent' }}
          >
            {audioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span style={{ fontSize: '0.8rem' }}>AUDIO LOG</span>
          </button>
          <div className="flex-center" style={{ gap: '0.5rem' }}>
            <Activity size={20} color={overrideActive ? "#ff0000" : "#00f3ff"} />
            <span className="holo-text" style={{ color: overrideActive ? "#ff0000" : "#00f3ff" }}>
              {overrideActive ? 'WARNING' : 'SYSTEM ONLINE'}
            </span>
          </div>
        </div>
      </header>

      {/* Left Sidebar - Navigation/Stats */}
      <aside className="glass-panel flex-col layout-nav" style={{ gap: '2rem' }}>
        <div className="flex-col" style={{ gap: '1rem' }}>
          <h3 className="holo-text">System Status</h3>
          <div className="flex-between">
             <span style={{ color: 'var(--color-text-muted)' }}>CPU Load</span>
             <span style={{ color: 'var(--color-primary)' }}>12%</span>
          </div>
          <div className="flex-between">
             <span style={{ color: 'var(--color-text-muted)' }}>Memory</span>
             <span style={{ color: 'var(--color-primary)' }}>43%</span>
          </div>
        </div>
        
        <div className="flex-col" style={{ gap: '1rem' }}>
          <h3 className="holo-text">Network Comm</h3>
          <div className="flex-between">
             <span style={{ color: 'var(--color-text-muted)' }}>GitHub Uplink</span>
             <span style={{ color: githubData ? 'var(--color-accent)' : '#ffcc00' }}>
               {githubData ? 'SYNCED' : 'FETCHING...'}
             </span>
          </div>
          <div className="flex-between">
             <span style={{ color: 'var(--color-text-muted)' }}>Public Repos</span>
             <span style={{ color: 'var(--color-primary)' }}>{githubData ? githubData.public_repos : '--'}</span>
          </div>
          <div className="flex-between">
             <span style={{ color: 'var(--color-text-muted)' }}>Followers</span>
             <span style={{ color: 'var(--color-primary)' }}>{githubData ? githubData.followers : '--'}</span>
          </div>
        </div>

        <nav className="flex-col" style={{ gap: '1rem' }}>
          <h3 className="holo-text">Navigation</h3>
          {['overview', 'projects', 'skills', 'history', 'contact'].map((section) => (
            <motion.button
              key={section}
              className={`cyber-btn flex-between ${activeSection === section ? 'active' : ''}`}
              onClick={() => {
                setActiveSection(section)
                window.dispatchEvent(new Event('page-transition'))
              }}
              whileHover={{ scale: 1.05, textShadow: "0 0 8px rgb(0, 243, 255)", boxShadow: "0 0 15px rgba(0, 243, 255, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: activeSection === section ? 'rgba(0, 243, 255, 0.1)' : 'transparent',
                borderColor: activeSection === section ? '#00f3ff' : 'rgba(0, 243, 255, 0.2)',
                color: activeSection === section ? '#00f3ff' : '#94a3b8'
              }}
            >
              <span style={{ textTransform: 'capitalize' }}>{section === 'history' ? 'About' : section === 'overview' ? 'Display Core' : section}</span>
              {section === 'overview' && <Activity size={16} />}
              {section === 'projects' && <Monitor size={16} />}
              {section === 'skills' && <Cpu size={16} />}
              {section === 'history' && <Activity size={16} />}
              {section === 'contact' && <ShieldCheck size={16} />}
            </motion.button>
          ))}
        </nav>
      </aside>

      {/* Center - Viewport */}
      <main className="layout-main data-stream-bg" style={{ position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center', pointerEvents: isProjectViewing ? 'none' : 'auto' }}>
        <AnimatePresence mode="wait">
          {!isProjectViewing ? (
            <motion.div
              key="sections"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, filter: 'blur(10px)' }}
              transition={{ duration: 0.5 }}
              style={{ height: '100%', width: '100%' }}
            >
              <AnimatePresence mode="wait">
                {activeSection === 'overview' && (
                  <motion.div 
                    key="overview"
                    initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                    transition={{ duration: 0.5 }}
                    className="flex-center flex-col glass-panel"
                    style={{ 
                      textAlign: 'center', 
                      pointerEvents: 'none',
                      padding: '3rem 4rem',
                      background: 'rgba(5, 8, 16, 0.85)',
                      border: '1px solid rgba(0, 243, 255, 0.2)',
                      boxShadow: '0 0 30px rgba(0, 0, 0, 0.5)'
                    }}
                  >
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <h2 className="holo-header" style={{ fontSize: '3rem', marginBottom: '0.5rem', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>KRISH VASOYA</h2>
                    </motion.div>
                    <motion.p 
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      style={{ color: '#00f3ff', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 'bold', textShadow: '0 2px 5px rgba(0,0,0,0.8)' }}
                    >
                      Computer Science Student
                    </motion.p>
                  </motion.div>
                )}
                {activeSection === 'projects' && (
                  <motion.div key="projects" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} style={{ height: '100%' }}>
                    <Projects />
                  </motion.div>
                )}
                {activeSection === 'skills' && (
                  <motion.div key="skills" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} style={{ height: '100%' }}>
                    <Skills />
                  </motion.div>
                )}
                {activeSection === 'history' && (
                   <motion.div key="history" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} style={{ height: '100%' }}>
                    <History />
                  </motion.div>
                )}
                {activeSection === 'contact' && (
                   <motion.div key="contact" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} style={{ height: '100%' }}>
                    <Contact />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
             <motion.div
                key="project-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 100, pointerEvents: 'auto' }}
             >
                <button 
                  className="cyber-btn"
                  onClick={() => window.dispatchEvent(new CustomEvent('project-clear'))}
                  style={{ background: 'rgba(5, 8, 16, 0.9)', boxShadow: '0 0 20px rgba(0,243,255,0.4)' }}
                >
                  [ REVERT TO MAIN VIEW ]
                </button>
             </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Right Sidebar - Info/Widgets */}
      <aside className="glass-panel flex-col layout-aside" style={{ gap: '1.5rem' }}>
        <div className="flex-col" style={{ gap: '0.5rem' }}>
          <ShieldCheck size={24} color="#00f3ff" />
          <h3 className="holo-text">Security Level</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>MAXIMUM - Class 4 Encryption Active</p>
        </div>
        
        <Terminal onNavigate={(section) => {
          setActiveSection(section)
          window.dispatchEvent(new Event('page-transition'))
        }} />
      </aside>

      {/* Footer */}
      <footer style={{ gridColumn: '1 / -1' }} className="glass-panel flex-between layout-footer">
        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>KRISH.EXE v2.0.24</span>
        <div className="flex-center" style={{ gap: '1rem' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#00f3ff', boxShadow: '0 0 5px #00f3ff' }}></span>
          <span className="holo-text" style={{ fontSize: '0.8rem' }}>Operational</span>
        </div>
      </footer>
      
      <CommandPalette 
        onNavigate={(section) => {
          setActiveSection(section)
          window.dispatchEvent(new Event('page-transition'))
        }}
        onToggleAudio={toggleAudio}
      />
      <FloatingAI
        onNavigate={(section) => {
          setActiveSection(section)
          window.dispatchEvent(new Event('page-transition'))
        }}
      />
      </motion.div>
    </div>
  )
}

export default MainLayout
