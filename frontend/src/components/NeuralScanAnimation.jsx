import { motion } from 'framer-motion';
import './NeuralScanAnimation.css';

export default function NeuralScanAnimation({ isScanning, progress = 0 }) {
  const scanStages = [
    { label: 'Initializing Neural Interface', threshold: 0 },
    { label: 'Reading Brainwave Patterns', threshold: 20 },
    { label: 'Analyzing Delta Waves', threshold: 35 },
    { label: 'Processing Theta Frequencies', threshold: 50 },
    { label: 'Decoding Alpha Rhythms', threshold: 65 },
    { label: 'Interpreting Beta Activity', threshold: 80 },
    { label: 'Generating Dream Profile', threshold: 95 }
  ];

  const currentStage = scanStages.filter(stage => progress >= stage.threshold).pop();

  if (!isScanning) return null;

  return (
    <motion.div 
      className="neural-scan-animation"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <div className="scan-container">
        {/* Central Brain Visualization */}
        <div className="brain-scan">
          <motion.div 
            className="brain-core"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 360]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <div className="brain-hemisphere left"></div>
            <div className="brain-hemisphere right"></div>
          </motion.div>

          {/* Scanning Rings */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="scan-ring"
              animate={{
                scale: [1, 2, 1],
                opacity: [0.8, 0, 0.8]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 1,
                ease: "easeOut"
              }}
            />
          ))}

          {/* Neural Particles */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="neural-particle"
              style={{
                left: `${50 + 40 * Math.cos((i * 30 * Math.PI) / 180)}%`,
                top: `${50 + 40 * Math.sin((i * 30 * Math.PI) / 180)}%`
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="scan-progress">
          <div className="progress-bar-container">
            <motion.div 
              className="progress-bar-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
            <div className="progress-glow"></div>
          </div>
          <div className="progress-text">{progress}%</div>
        </div>

        {/* Current Stage */}
        <motion.div 
          className="scan-stage"
          key={currentStage?.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <div className="stage-indicator">
            <motion.div 
              className="stage-dot"
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [1, 0.5, 1]
              }}
              transition={{ 
                duration: 1,
                repeat: Infinity
              }}
            />
          </div>
          <span className="stage-label">{currentStage?.label || 'Initializing...'}</span>
        </motion.div>

        {/* Wave Indicators */}
        <div className="wave-indicators">
          {['Delta', 'Theta', 'Alpha', 'Beta'].map((wave, index) => (
            <motion.div 
              key={wave}
              className={`wave-indicator ${progress > 20 + (index * 20) ? 'active' : ''}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <div className="wave-dot"></div>
              <span>{wave}</span>
            </motion.div>
          ))}
        </div>

        {/* Scanning Lines */}
        <div className="scan-lines">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="scan-line"
              animate={{
                y: ['-100%', '200%']
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "linear"
              }}
            />
          ))}
        </div>
      </div>

      <div className="scan-footer">
        <p>🧠 Neural scan in progress... Please wait</p>
      </div>
    </motion.div>
  );
}
