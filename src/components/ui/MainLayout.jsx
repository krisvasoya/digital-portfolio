import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Monitor, Cpu, Activity, ShieldCheck } from 'lucide-react'
import { Projects, Skills, History, Contact } from './ContentSections'

const MainLayout = () => {
  const [activeSection, setActiveSection] = useState('overview')

  return (
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
      <header style={{ gridColumn: '1 / -1' }} className="flex-between glass-panel layout-header">
        <div className="flex-col">
          <h1 className="holo-header" style={{ margin: 0 }}>SI AI SYSTEM</h1>
          <span className="holo-text" style={{ fontSize: '0.8rem' }}>Computer Science Student</span>
        </div>
        <div className="flex-center" style={{ gap: '1rem' }}>
          <Activity size={20} color="#00f3ff" />
          <span className="holo-text">SYSTEM ONLINE</span>
        </div>
      </header>

      {/* Left Sidebar - Navigation/Stats */}
      <aside className="glass-panel flex-col layout-nav" style={{ gap: '2rem' }}>
        <div className="flex-col" style={{ gap: '1rem' }}>
          <h3 className="holo-text">System Status</h3>
          <div className="flex-between">
             <span style={{ color: '#94a3b8' }}>CPU Load</span>
             <span style={{ color: '#00f3ff' }}>12%</span>
          </div>
          <div className="flex-between">
             <span style={{ color: '#94a3b8' }}>Memory</span>
             <span style={{ color: '#00f3ff' }}>43%</span>
          </div>
        </div>

        <nav className="flex-col" style={{ gap: '1rem' }}>
          <h3 className="holo-text">Navigation</h3>
          {['overview', 'projects', 'skills', 'history', 'contact'].map((section) => (
            <motion.button
              key={section}
              className={`cyber-btn flex-between ${activeSection === section ? 'active' : ''}`}
              onClick={() => setActiveSection(section)}
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
      <main className="layout-main" style={{ position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
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
              <h2 className="holo-header" style={{ fontSize: '3rem', marginBottom: '0.5rem', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>KRISH VASOYA</h2>
              <p style={{ color: '#00f3ff', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 'bold', textShadow: '0 2px 5px rgba(0,0,0,0.8)' }}>Computer Science Student</p>
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
      </main>

      {/* Right Sidebar - Info/Widgets */}
      <aside className="glass-panel flex-col layout-aside" style={{ gap: '1.5rem' }}>
        <div className="flex-col" style={{ gap: '0.5rem' }}>
          <ShieldCheck size={24} color="#00f3ff" />
          <h3 className="holo-text">Security Level</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>MAXIMUM - Class 4 Encryption Active</p>
        </div>
        
        <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '1rem' }}>
          <h4 className="holo-text" style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>System Log</h4>
          <ul style={{ listStyle: 'none', fontSize: '0.8rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>{">"} [10:42:01] Neural network initialized</li>
            <li>{">"} [10:42:05] Rendering graphics engine</li>
            <li>{">"} [10:42:08] Connecting to user node</li>
          </ul>
        </div>
      </aside>

      {/* Footer */}
      <footer style={{ gridColumn: '1 / -1' }} className="glass-panel flex-between layout-footer">
        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>KRISH.EXE v2.0.24</span>
        <div className="flex-center" style={{ gap: '1rem' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#00f3ff', boxShadow: '0 0 5px #00f3ff' }}></span>
          <span className="holo-text" style={{ fontSize: '0.8rem' }}>Operational</span>
        </div>
      </footer>
    </motion.div>
  )
}

export default MainLayout
