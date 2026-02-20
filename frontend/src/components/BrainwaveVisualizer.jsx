import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './BrainwaveVisualizer.css';

export default function BrainwaveVisualizer({ bands, isActive = true }) {
  const [animatedBands, setAnimatedBands] = useState({
    delta: 0,
    theta: 0,
    alpha: 0,
    beta: 0
  });

  useEffect(() => {
    if (!bands || !isActive) return;

    const interval = setInterval(() => {
      setAnimatedBands(prev => ({
        delta: prev.delta + (Math.random() - 0.5) * 0.1,
        theta: prev.theta + (Math.random() - 0.5) * 0.1,
        alpha: prev.alpha + (Math.random() - 0.5) * 0.1,
        beta: prev.beta + (Math.random() - 0.5) * 0.1
      }));
    }, 100);

    return () => clearInterval(interval);
  }, [bands, isActive]);

  const waveData = [
    { name: 'Delta', value: bands?.delta || 0, color: '#4cc9f0', desc: 'Deep Sleep' },
    { name: 'Theta', value: bands?.theta || 0, color: '#7b2ff7', desc: 'Creativity' },
    { name: 'Alpha', value: bands?.alpha || 0, color: '#ffbe0b', desc: 'Relaxation' },
    { name: 'Beta', value: bands?.beta || 0, color: '#ff006e', desc: 'Active Thinking' }
  ];

  return (
    <div className="brainwave-visualizer">
      <div className="visualizer-header">
        <h3>🧠 Live Neural Oscillations</h3>
        <div className="status-indicator">
          <div className={`status-dot ${isActive ? 'active' : ''}`}></div>
          <span>{isActive ? 'Monitoring' : 'Idle'}</span>
        </div>
      </div>

      <div className="wave-bars">
        {waveData.map((wave, index) => {
          const height = Math.max(5, Math.min(100, (wave.value + (animatedBands[wave.name.toLowerCase()] || 0)) * 100));
          
          return (
            <motion.div 
              key={wave.name} 
              className="wave-bar-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="wave-info">
                <span className="wave-name">{wave.name}</span>
                <span className="wave-desc">{wave.desc}</span>
              </div>
              
              <div className="wave-bar-wrapper">
                <motion.div 
                  className="wave-bar"
                  style={{ 
                    height: `${height}%`,
                    background: `linear-gradient(180deg, ${wave.color}, ${wave.color}88)`
                  }}
                  animate={{ 
                    height: `${height}%`,
                    boxShadow: `0 0 ${height/2}px ${wave.color}88`
                  }}
                  transition={{ 
                    duration: 0.3,
                    ease: "easeOut"
                  }}
                >
                  <div className="wave-glow" style={{ background: wave.color }}></div>
                </motion.div>
                
                <div className="wave-grid">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="grid-line"></div>
                  ))}
                </div>
              </div>
              
              <div className="wave-value" style={{ color: wave.color }}>
                {wave.value.toFixed(2)}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="wave-legend">
        <div className="legend-item">
          <div className="legend-dot" style={{ background: '#4cc9f0' }}></div>
          <span>0.5-4 Hz</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: '#7b2ff7' }}></div>
          <span>4-8 Hz</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: '#ffbe0b' }}></div>
          <span>8-13 Hz</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: '#ff006e' }}></div>
          <span>13-30 Hz</span>
        </div>
      </div>
    </div>
  );
}
