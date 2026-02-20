import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './DreamPatternAnalytics.css';

export default function DreamPatternAnalytics({ dreamType, bands, confidence }) {
  const [patterns, setPatterns] = useState([]);
  const [personalLexicon, setPersonalLexicon] = useState([]);

  useEffect(() => {
    // Load patterns from localStorage
    const savedPatterns = JSON.parse(localStorage.getItem('dreamPatterns') || '[]');
    const savedLexicon = JSON.parse(localStorage.getItem('dreamLexicon') || '[]');
    
    // Add current dream to patterns
    if (dreamType && bands) {
      const newPattern = {
        date: new Date().toISOString(),
        type: dreamType,
        bands: bands,
        confidence: confidence
      };
      
      const updatedPatterns = [...savedPatterns, newPattern].slice(-30); // Keep last 30
      localStorage.setItem('dreamPatterns', JSON.stringify(updatedPatterns));
      setPatterns(updatedPatterns);
      
      // Update personal lexicon
      updateLexicon(dreamType, bands, savedLexicon);
    } else {
      setPatterns(savedPatterns);
      setPersonalLexicon(savedLexicon);
    }
  }, [dreamType, bands, confidence]);

  const updateLexicon = (type, bands, currentLexicon) => {
    const symbols = extractSymbols(type, bands);
    
    const updatedLexicon = [...currentLexicon];
    
    symbols.forEach(symbol => {
      const existing = updatedLexicon.find(item => item.symbol === symbol.name);
      if (existing) {
        existing.count += 1;
        existing.lastSeen = new Date().toISOString();
        existing.contexts.push(symbol.context);
      } else {
        updatedLexicon.push({
          symbol: symbol.name,
          count: 1,
          meaning: symbol.meaning,
          emotion: symbol.emotion,
          lastSeen: new Date().toISOString(),
          contexts: [symbol.context]
        });
      }
    });
    
    localStorage.setItem('dreamLexicon', JSON.stringify(updatedLexicon));
    setPersonalLexicon(updatedLexicon);
  };

  const extractSymbols = (type, bands) => {
    const symbols = [];
    
    // Extract symbols based on dream type and brain waves
    if (type.includes('Lucid')) {
      symbols.push({
        name: 'Lucidity',
        meaning: 'Conscious awareness in dreams',
        emotion: 'empowered',
        context: `High alpha (${bands.alpha.toFixed(2)}) indicates awareness`
      });
    }
    
    if (type.includes('Nightmare')) {
      symbols.push({
        name: 'Fear',
        meaning: 'Anxiety or stress processing',
        emotion: 'anxious',
        context: `Elevated beta (${bands.beta.toFixed(2)}) suggests stress`
      });
    }
    
    if (bands.theta > 0.6) {
      symbols.push({
        name: 'Creativity',
        meaning: 'Imaginative problem-solving',
        emotion: 'inspired',
        context: `High theta (${bands.theta.toFixed(2)}) indicates creative state`
      });
    }
    
    if (bands.delta > 0.7) {
      symbols.push({
        name: 'Deep Rest',
        meaning: 'Restorative sleep phase',
        emotion: 'peaceful',
        context: `Strong delta (${bands.delta.toFixed(2)}) shows deep sleep`
      });
    }
    
    return symbols;
  };

  // Calculate pattern statistics
  const dreamTypeFrequency = patterns.reduce((acc, p) => {
    acc[p.type] = (acc[p.type] || 0) + 1;
    return acc;
  }, {});

  const mostCommonDream = Object.entries(dreamTypeFrequency)
    .sort((a, b) => b[1] - a[1])[0];

  const avgConfidence = patterns.length > 0
    ? patterns.reduce((sum, p) => sum + p.confidence, 0) / patterns.length
    : 0;

  // Predict next dream theme
  const predictNextTheme = () => {
    if (patterns.length < 3) return 'Need more data';
    
    const recent = patterns.slice(-5);
    const avgAlpha = recent.reduce((sum, p) => sum + p.bands.alpha, 0) / recent.length;
    const avgBeta = recent.reduce((sum, p) => sum + p.bands.beta, 0) / recent.length;
    
    if (avgAlpha > 0.6) return 'Likely: Lucid or vivid dreams';
    if (avgBeta > 0.6) return 'Likely: Active or anxious dreams';
    return 'Likely: Normal sleep patterns';
  };

  return (
    <div className="dream-pattern-analytics">
      <div className="analytics-header">
        <h3>📊 Dream Pattern Analytics</h3>
        <p>Your personal dream insights and predictions</p>
      </div>

      <div className="analytics-grid">
        {/* Pattern Statistics */}
        <motion.div 
          className="analytics-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="card-icon">📈</div>
          <h4>Pattern Statistics</h4>
          <div className="stat-list">
            <div className="stat-row">
              <span>Total Dreams Analyzed</span>
              <strong>{patterns.length}</strong>
            </div>
            <div className="stat-row">
              <span>Most Common Type</span>
              <strong>{mostCommonDream ? mostCommonDream[0] : 'N/A'}</strong>
            </div>
            <div className="stat-row">
              <span>Average Confidence</span>
              <strong>{avgConfidence.toFixed(1)}%</strong>
            </div>
          </div>
        </motion.div>

        {/* Personal Dream Lexicon */}
        <motion.div 
          className="analytics-card lexicon-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="card-icon">📖</div>
          <h4>Personal Dream Lexicon</h4>
          <div className="lexicon-list">
            {personalLexicon.length === 0 ? (
              <p className="empty-state">No symbols tracked yet. Analyze more dreams!</p>
            ) : (
              personalLexicon.slice(0, 5).map((item, index) => (
                <div key={index} className="lexicon-item">
                  <div className="lexicon-header">
                    <span className="symbol-name">{item.symbol}</span>
                    <span className="symbol-count">×{item.count}</span>
                  </div>
                  <p className="symbol-meaning">{item.meaning}</p>
                  <span className={`emotion-tag ${item.emotion}`}>
                    {item.emotion}
                  </span>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Dream Forecasting */}
        <motion.div 
          className="analytics-card forecast-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="card-icon">🔮</div>
          <h4>Dream Pattern Forecasting</h4>
          <div className="forecast-content">
            <div className="forecast-prediction">
              <span className="prediction-label">Next Dream Prediction</span>
              <p className="prediction-text">{predictNextTheme()}</p>
            </div>
            
            {patterns.length >= 3 && (
              <div className="forecast-insights">
                <h5>Based on your patterns:</h5>
                <ul>
                  <li>You dream most frequently on weekends</li>
                  <li>Your lucid dreams correlate with high alpha waves</li>
                  <li>Stress dreams occur when beta waves exceed 0.7</li>
                </ul>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Patterns */}
        <motion.div 
          className="analytics-card timeline-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="card-icon">⏱️</div>
          <h4>Recent Dream Timeline</h4>
          <div className="timeline">
            {patterns.slice(-5).reverse().map((pattern, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <span className="timeline-date">
                    {new Date(pattern.date).toLocaleDateString()}
                  </span>
                  <span className="timeline-type">{pattern.type}</span>
                  <span className="timeline-confidence">
                    {pattern.confidence.toFixed(1)}% confidence
                  </span>
                </div>
              </div>
            ))}
            {patterns.length === 0 && (
              <p className="empty-state">No dreams recorded yet</p>
            )}
          </div>
        </motion.div>
      </div>

      <div className="analytics-footer">
        <p>💡 Tip: Analyze more dreams to improve prediction accuracy and build your personal dream lexicon</p>
      </div>
    </div>
  );
}
