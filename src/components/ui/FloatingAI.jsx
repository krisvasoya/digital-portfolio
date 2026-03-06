import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquareText, ShieldAlert, Cpu, X, Send } from 'lucide-react';
import Typewriter from 'typewriter-effect';
import { audioSys } from '../../utils/AudioSystem';

const FloatingAI = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Welcome user. I am the SI AI Assistant. How can I help you explore this core?' }
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    audioSys.playHover();
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    audioSys.playType();
    
    const userMessage = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');

    // Mock AI responses based on keywords
    setTimeout(() => {
      audioSys.playHover();
      let aiResponse = "Processing... I'm afraid I don't have that data in my databanks.";
      const lowerInput = userMessage.toLowerCase();

      if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
        aiResponse = "Greetings. Security level is optimal. What would you like to see?";
      } else if (lowerInput.includes('project') || lowerInput.includes('built')) {
        aiResponse = "Krish has built several impressive systems. Shall I open the Projects module?";
        setTimeout(() => onNavigate('projects'), 2000);
      } else if (lowerInput.includes('skill') || lowerInput.includes('tech') || lowerInput.includes('know')) {
        aiResponse = "Accessing technical capabilities matrix. Opening Skills module.";
         setTimeout(() => onNavigate('skills'), 2000);
      } else if (lowerInput.includes('contact') || lowerInput.includes('hire') || lowerInput.includes('email')) {
        aiResponse = "Establishing secure comms channel to Krish.";
         setTimeout(() => onNavigate('contact'), 2000);
      } else if (lowerInput.includes('who') || lowerInput.includes('about')) {
        aiResponse = "Retrieving personal logs for Krish Vasoya, Computer Science Student.";
         setTimeout(() => onNavigate('history'), 2000);
      } else if (lowerInput.includes('joke')) {
        aiResponse = "Why do programmers prefer dark mode? Because light attracts bugs. Ha. Ha. Ha.";
      }

      setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
    }, 800);
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        className="cyber-btn"
        onClick={toggleChat}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 999,
          background: 'rgba(5, 8, 16, 0.9)',
          boxShadow: isOpen ? '0 0 20px #00f3ff' : '0 0 10px rgba(0,243,255,0.3)',
          border: '1px solid #00f3ff'
        }}
      >
        {isOpen ? <X size={24} color="#00f3ff" /> : <MessageSquareText size={24} color="#00f3ff" />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            style={{
              position: 'fixed',
              bottom: '6rem',
              right: '2rem',
              width: '350px',
              height: '450px',
              background: 'rgba(5, 8, 16, 0.95)',
              border: '1px solid rgba(0, 243, 255, 0.4)',
              borderRadius: '12px',
              boxShadow: '0 0 30px rgba(0, 0, 0, 0.8)',
              zIndex: 998,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              backdropFilter: 'blur(10px)'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '1rem',
              borderBottom: '1px solid rgba(0, 243, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: 'rgba(0, 243, 255, 0.05)'
            }}>
              <div style={{ position: 'relative', width: 24, height: 24 }}>
                <Cpu size={20} color="#00f3ff" style={{ position: 'relative', zIndex: 2 }} />
                <motion.div 
                   animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
                   transition={{ duration: 2, repeat: Infinity }}
                   style={{ 
                     position: 'absolute', top: -2, left: -2, width: 24, height: 24, 
                     borderRadius: '50%', background: '#00f3ff', filter: 'blur(8px)', zIndex: 1 
                   }} 
                />
              </div>
              <span className="holo-text" style={{ fontSize: '1rem', fontWeight: 'bold' }}>SI AI Core</span>
              <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.7rem', color: '#00ff41' }}>
                <motion.span 
                  animate={{ scale: [1, 1.3, 1] }} 
                  transition={{ duration: 1, repeat: Infinity }}
                  style={{ width: 6, height: 6, borderRadius: '50%', background: '#00ff41', boxShadow: '0 0 5px #00ff41' }} 
                />
                ONLINE
              </span>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {messages.map((msg, i) => (
                <div key={i} style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%'
                }}>
                  {msg.sender === 'ai' && (
                    <div style={{ fontSize: '0.7rem', color: '#00f3ff', marginBottom: '4px', letterSpacing: '1px' }}>AI &gt;</div>
                  )}
                  <div style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    background: msg.sender === 'user' ? 'rgba(0, 243, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${msg.sender === 'user' ? 'rgba(0, 243, 255, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
                    color: msg.sender === 'user' ? '#fff' : '#00f3ff',
                    fontSize: '0.9rem',
                    lineHeight: 1.5,
                    fontFamily: msg.sender === 'ai' ? 'monospace' : 'inherit'
                  }}>
                    {msg.sender === 'ai' && i === messages.length - 1 ? (
                      <Typewriter
                        options={{ delay: 20, cursor: '█' }}
                        onInit={(typewriter) => {
                          typewriter.typeString(msg.text).start();
                        }}
                      />
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} style={{
              padding: '1rem',
              borderTop: '1px solid rgba(0, 243, 255, 0.2)',
              display: 'flex',
              gap: '0.5rem',
              background: 'rgba(0,0,0,0.5)'
            }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask AI Core..."
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#fff',
                  fontSize: '0.9rem'
                }}
              />
              <button 
                type="submit"
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#00f3ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.2rem'
                }}
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingAI;
