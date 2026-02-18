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

export const Projects = () => (
  <motion.div 
    initial="hidden"
    animate="visible"
    variants={{
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    }}
    className="glass-panel" 
    style={{ height: '100%', overflowY: 'auto' }}
  >
    <h2 className="holo-header">My Projects</h2>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
        <motion.div 
          key={project.id} 
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: { y: 0, opacity: 1 }
          }}
          whileHover={{ scale: 1.02, borderColor: '#00f3ff', boxShadow: '0 0 15px rgba(0, 243, 255, 0.3)' }}
          style={{ padding: '1rem', border: '1px solid rgba(0,243,255,0.2)', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', cursor: 'pointer', transition: 'all 0.3s ease' }}
        >
          <h3 style={{ color: '#e0e6ed', marginBottom: '0.5rem' }}>{project.name}</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.4' }}>
            {project.id === 1 ? <Typewriter text={project.description} delay={10} /> : project.description}
          </p>
        </motion.div>
      ))}
    </div>
  </motion.div>
)

export const Skills = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} 
    animate={{ opacity: 1, y: 0 }} 
    className="glass-panel" 
    style={{ height: '100%', overflowY: 'auto' }}
  >
    <h2 className="holo-header">Technical Skills</h2>
    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {[
        { name: "React / Frontend", level: "98%" },
        { name: "HTML / CSS", level: "95%" },
        { name: "Python", level: "85%" },
        { name: "2D Animation (Adobe Photoshop)", level: "90%" },
        { name: "Video Editing (DaVinci Resolve)", level: "88%" }
      ].map((skill, index) => (
        <li key={index}>
          <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
            <span>{skill.name}</span>
            <span style={{ color: '#00f3ff' }}>{skill.level}</span>
          </div>
          <div style={{ width: '100%', height: '4px', background: '#0f172a' }}>
            <motion.div 
              initial={{ width: 0 }} 
              animate={{ width: skill.level }} 
              transition={{ duration: 1, delay: 0.2 + (index * 0.1) }}
              style={{ height: '100%', background: '#00f3ff' }} 
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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = `Portfolio Contact from ${formData.name}`;
    const body = `${formData.message}\n\nFrom: ${formData.name} (${formData.email})`;
    window.location.href = `mailto:krishvasoy6@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="glass-panel" 
      style={{ height: '100%', overflowY: 'auto' }}
    >
      <h2 className="holo-header">Contact Me</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input 
          type="text" 
          name="name"
          placeholder="Your Name" 
          value={formData.name}
          onChange={handleChange}
          required
          style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid #1e293b', padding: '1rem', color: 'white', outline: 'none' }}
        />
        <input 
          type="email" 
          name="email"
          placeholder="Your Email" 
          value={formData.email}
          onChange={handleChange}
          required
          style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid #1e293b', padding: '1rem', color: 'white', outline: 'none' }}
        />
        <textarea 
          name="message"
          placeholder="Message" 
          rows={5}
          value={formData.message}
          onChange={handleChange}
          required
          style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid #1e293b', padding: '1rem', color: 'white', outline: 'none' }}
        />
        <button type="submit" className="cyber-btn" style={{ width: 'fit-content' }}>Send Message</button>
      </form>
    </motion.div>
  );
}
