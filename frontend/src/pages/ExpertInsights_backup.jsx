import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, Activity, TrendingUp, AlertTriangle, 
  ToggleLeft, ToggleRight, Zap, Heart, Eye,
  Sparkles, BarChart3, Radio, Waves
} from "lucide-react";
import "./ExpertInsights.css";
import "../styles/dark-theme-background.css";

const ExpertInsights = () => {
  const [loading, setLoading] = useState(true);
  const [activeBrainRegion, setActiveBrainRegion] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Expert articles
  const expertArticles = [
    {
      id: 1,
      category: "NEUROSCIENCE",
      icon: "🧠",
      color: "#4cc9f0",
      title: "Understanding REM Sleep Cycles",
      description: "Learn how REM sleep affects dream vividness and memory consolidation.",
      readTime: "5 min read",
      author: "Dr. Sarah Chen"
    },
    {
      id: 2,
      category: "PSYCHOLOGY",
      icon: "🎭",
      color: "#7b2ff7",
      title: "Jungian Dream Symbolism",
      description: "Explore archetypes and the collective unconscious in your dreams.",
      readTime: "8 min read",
      author: "Prof. Michael Torres"
    },
    {
      id: 3,
      category: "RESEARCH",
      icon: "🔬",
      color: "#ff006e",
      title: "Lucid Dreaming Techniques",
      description: "Scientific methods to achieve consciousness during dreams.",
      readTime: "6 min read",
      author: "Dr. Emily Watson"
    },
    {
      id: 4,
      category: "WELLNESS",
      icon: "✨",
      color: "#2ed573",
      title: "Sleep Hygiene Best Practices",
      description: "Optimize your sleep environment for better dream recall.",
      readTime: "4 min read",
      author: "Dr. James Park"
    },
    {
      id: 5,
      category: "TECHNOLOGY",
      icon: "⚡",
      color: "#ffbe0b",
      title: "EEG Technology in Dream Research",
      description: "How modern brain monitoring is revolutionizing dream science.",
      readTime: "7 min read",
      author: "Dr. Lisa Kumar"
    },
    {
      id: 6,
      category: "THERAPY",
      icon: "💭",
      color: "#ff9f43",
      title: "Nightmare Rescripting Methods",
      description: "Clinical approaches to transforming recurring nightmares.",
      readTime: "6 min read",
      author: "Dr. Robert Martinez"
    }
  ];

  // Mock brain activity data
  const brainRegions = [
    { 
      name: "Amygdala", 
      activity: 85, 
      color: "#ff006e",
      description: "High activity suggests emotional processing event",
      position: { top: "55%", left: "50%" }
    },
    { 
      name: "Prefrontal Cortex", 
      activity: 72, 
      color: "#4cc9f0",
      description: "Elevated during lucid awareness and decision-making",
      position: { top: "25%", left: "50%" }
    },
    { 
      name: "Hippocampus", 
      activity: 68, 
      color: "#7b2ff7",
      description: "Active memory consolidation and spatial navigation",
      position: { top: "50%", left: "45%" }
    },
    { 
      name: "Visual Cortex", 
      activity: 91, 
      color: "#ffbe0b",
      description: "Very high activity indicates vivid visual dream content",
      position: { top: "70%", left: "50%" }
    }
  ];

  // Waveform PSD data
  const waveformData = [
    { wave: "Delta", frequency: "0.5-4 Hz", power: 45, color: "#4cc9f0", description: "Deep sleep, healing" },
    { wave: "Theta", frequency: "4-8 Hz", power: 68, color: "#7b2ff7", description: "REM sleep, creativity" },
    { wave: "Alpha", frequency: "8-13 Hz", power: 52, color: "#2ed573", description: "Relaxation, awareness" },
    { wave: "Beta", frequency: "13-30 Hz", power: 38, color: "#ff9f43", description: "Active thinking" },
    { wave: "Gamma", frequency: "30-100 Hz", power: 25, color: "#ff006e", description: "Lucid consciousness" }
  ];

  // Cognitive scores
  const cognitiveScores = {
    clarityVsChaos: 73,
    creativeSpark: 85,
    emotionalIntensity: 62,
    narrativeCoherence: 78
  };

  // Mental health markers
  const mentalHealthAlerts = [
    {
      type: "info",
      severity: "low",
      title: "Stress Pattern Detected",
      message: "Your theta/beta ratio suggests mild cognitive stress. Consider relaxation techniques.",
      icon: <Activity size={20} />
    },
    {
      type: "success",
      severity: "positive",
      title: "Healthy REM Cycle",
      message: "Strong gamma synchronization indicates good sleep quality and dream recall.",
      icon: <Heart size={20} />
    }
  ];

  // Theory interpretations
  const theoryInterpretations = {
    jungian: {
      title: "Jungian Analysis",
      icon: "🎭",
      color: "#7b2ff7",
      content: {
        archetypes: ["The Hero", "The Shadow", "The Anima"],
        interpretation: "Your dream reveals a confrontation with the Shadow archetype, representing repressed aspects of your personality. The recurring water imagery symbolizes the collective unconscious and emotional depth.",
        symbols: [
          { symbol: "Water", meaning: "The unconscious mind, emotions, transformation" },
          { symbol: "Journey", meaning: "Individuation process, self-discovery" },
          { symbol: "Darkness", meaning: "The Shadow, unknown aspects of self" }
        ]
      }
    },
    freudian: {
      title: "Freudian Analysis",
      icon: "🧠",
      color: "#ff006e",
      content: {
        archetypes: ["Ego", "Id", "Superego"],
        interpretation: "The dream content suggests unresolved childhood memories and repressed desires. The symbolic imagery represents wish fulfillment and defense mechanisms at work.",
        symbols: [
          { symbol: "Falling", meaning: "Loss of control, anxiety about failure" },
          { symbol: "Flying", meaning: "Sexual liberation, freedom from constraints" },
          { symbol: "Being Chased", meaning: "Avoidance of confronting difficult emotions" }
        ]
      }
    },
    neurobiological: {
      title: "Neuro-Biological Analysis",
      icon: "⚡",
      color: "#4cc9f0",
      content: {
        archetypes: ["Threat Simulation", "Memory Consolidation", "Problem Solving"],
        interpretation: "Your neural patterns indicate active memory consolidation with elements of threat simulation. The high amygdala activity suggests emotional memory processing, while prefrontal engagement shows cognitive integration.",
        symbols: [
          { symbol: "Repetitive Scenarios", meaning: "Memory consolidation and skill rehearsal" },
          { symbol: "Threatening Situations", meaning: "Evolutionary threat simulation training" },
          { symbol: "Problem Solving", meaning: "Offline cognitive processing and creativity" }
        ]
      }
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  const getScoreColor = (score) => {
    if (score >= 80) return "#2ed573";
    if (score >= 60) return "#ffbe0b";
    return "#ff006e";
  };

  if (loading) {
    return (
      <div className="insights-loading-lab">
        <div className="neural-network-loader">
          <div className="network-node"></div>
          <div className="network-node"></div>
          <div className="network-node"></div>
          <div className="network-node"></div>
          <div className="network-pulse"></div>
        </div>
        <p className="loading-text">Analyzing neural patterns...</p>
        <div className="loading-progress">
          <div className="progress-bar"></div>
        </div>
      </div>
    );
  }

  return (
    <section className="expert-insights-lab">
      {/* Dark Lab Background */}
      <div className="lab-background"></div>
      <div className="lab-grid"></div>
      <div className="lab-particles">
        <div className="lab-particle"></div>
        <div className="lab-particle"></div>
        <div className="lab-particle"></div>
      </div>

      {/* Header */}
      <motion.div 
        className="lab-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="header-icon-lab">
          <Brain size={40} />
        </div>
        <div className="header-content-lab">
          <h1>Expert Insights</h1>
          <p>Professional dream analysis and neuroscience research</p>
        </div>
      </motion.div>

      {/* Mental Health Alerts */}
      <div className="alerts-section">
        {mentalHealthAlerts.map((alert, index) => (
          <motion.div
            key={index}
            className={`health-alert ${alert.severity}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <div className="alert-icon">{alert.icon}</div>
            <div className="alert-content">
              <h4>{alert.title}</h4>
              <p>{alert.message}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="lab-content-grid">
        
        {/* Brain Region Heatmap */}
        <motion.div 
          className="lab-card brain-heatmap-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="card-header-lab">
            <Brain size={24} />
            <h3>Neural Activity Analysis</h3>
          </div>
          
          <div className="brain-visualization">
            <div className="brain-model">
              {/* Simplified brain SVG representation */}
              <svg viewBox="0 0 200 200" className="brain-svg">
                <ellipse cx="100" cy="100" rx="80" ry="90" fill="rgba(76, 201, 240, 0.1)" stroke="#4cc9f0" strokeWidth="2"/>
                <path d="M 60 80 Q 100 60, 140 80" fill="none" stroke="rgba(76, 201, 240, 0.3)" strokeWidth="1"/>
                <path d="M 60 120 Q 100 140, 140 120" fill="none" stroke="rgba(76, 201, 240, 0.3)" strokeWidth="1"/>
              </svg>
              
              {/* Activity hotspots */}
              {brainRegions.map((region, index) => (
                <motion.div
                  key={region.name}
                  className="brain-hotspot"
                  style={{
                    top: region.position.top,
                    left: region.position.left,
                    backgroundColor: region.color,
                    boxShadow: `0 0 ${region.activity / 2}px ${region.color}`
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  onMouseEnter={() => setActiveBrainRegion(region)}
                  onMouseLeave={() => setActiveBrainRegion(null)}
                  whileHover={{ scale: 1.3 }}
                >
                  <div className="hotspot-pulse" style={{ borderColor: region.color }}></div>
                </motion.div>
              ))}
            </div>

            {/* Region details */}
            <div className="brain-regions-list">
              {brainRegions.map((region) => (
                <div 
                  key={region.name}
                  className={`region-item ${activeBrainRegion?.name === region.name ? 'active' : ''}`}
                >
                  <div className="region-info">
                    <div className="region-name">
                      <div 
                        className="region-color-dot" 
                        style={{ backgroundColor: region.color }}
                      ></div>
                      {region.name}
                    </div>
                    <div className="region-activity">{region.activity}%</div>
                  </div>
                  <div className="region-bar">
                    <motion.div 
                      className="region-bar-fill"
                      style={{ backgroundColor: region.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${region.activity}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    ></motion.div>
                  </div>
                  {activeBrainRegion?.name === region.name && (
                    <motion.p 
                      className="region-description"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                    >
                      {region.description}
                    </motion.p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Cognitive Correlation Scores */}
        <motion.div 
          className="lab-card cognitive-scores-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="card-header-lab">
            <BarChart3 size={24} />
            <h3>Cognitive Correlation Scores</h3>
          </div>
          
          <div className="scores-grid">
            <div className="score-card">
              <div className="score-icon">
                <Eye size={32} style={{ color: getScoreColor(cognitiveScores.clarityVsChaos) }} />
              </div>
              <div className="score-value" style={{ color: getScoreColor(cognitiveScores.clarityVsChaos) }}>
                {cognitiveScores.clarityVsChaos}
              </div>
              <div className="score-label">Clarity vs. Chaos</div>
              <div className="score-bar">
                <motion.div 
                  className="score-bar-fill"
                  style={{ backgroundColor: getScoreColor(cognitiveScores.clarityVsChaos) }}
                  initial={{ width: 0 }}
                  animate={{ width: `${cognitiveScores.clarityVsChaos}%` }}
                  transition={{ duration: 1, delay: 1 }}
                ></motion.div>
              </div>
              <p className="score-description">Dream narrative organization</p>
            </div>

            <div className="score-card">
              <div className="score-icon">
                <Sparkles size={32} style={{ color: getScoreColor(cognitiveScores.creativeSpark) }} />
              </div>
              <div className="score-value" style={{ color: getScoreColor(cognitiveScores.creativeSpark) }}>
                {cognitiveScores.creativeSpark}
              </div>
              <div className="score-label">Creative Spark</div>
              <div className="score-bar">
                <motion.div 
                  className="score-bar-fill"
                  style={{ backgroundColor: getScoreColor(cognitiveScores.creativeSpark) }}
                  initial={{ width: 0 }}
                  animate={{ width: `${cognitiveScores.creativeSpark}%` }}
                  transition={{ duration: 1, delay: 1.1 }}
                ></motion.div>
              </div>
              <p className="score-description">Novel idea associations</p>
            </div>

            <div className="score-card">
              <div className="score-icon">
                <Heart size={32} style={{ color: getScoreColor(cognitiveScores.emotionalIntensity) }} />
              </div>
              <div className="score-value" style={{ color: getScoreColor(cognitiveScores.emotionalIntensity) }}>
                {cognitiveScores.emotionalIntensity}
              </div>
              <div className="score-label">Emotional Intensity</div>
              <div className="score-bar">
                <motion.div 
                  className="score-bar-fill"
                  style={{ backgroundColor: getScoreColor(cognitiveScores.emotionalIntensity) }}
                  initial={{ width: 0 }}
                  animate={{ width: `${cognitiveScores.emotionalIntensity}%` }}
                  transition={{ duration: 1, delay: 1.2 }}
                ></motion.div>
              </div>
              <p className="score-description">Affective engagement level</p>
            </div>

            <div className="score-card">
              <div className="score-icon">
                <TrendingUp size={32} style={{ color: getScoreColor(cognitiveScores.narrativeCoherence) }} />
              </div>
              <div className="score-value" style={{ color: getScoreColor(cognitiveScores.narrativeCoherence) }}>
                {cognitiveScores.narrativeCoherence}
              </div>
              <div className="score-label">Narrative Coherence</div>
              <div className="score-bar">
                <motion.div 
                  className="score-bar-fill"
                  style={{ backgroundColor: getScoreColor(cognitiveScores.narrativeCoherence) }}
                  initial={{ width: 0 }}
                  animate={{ width: `${cognitiveScores.narrativeCoherence}%` }}
                  transition={{ duration: 1, delay: 1.3 }}
                ></motion.div>
              </div>
              <p className="score-description">Story structure quality</p>
            </div>
          </div>
        </motion.div>

        {/* Theorist Toggle - Multi-School Interpretations */}
        <motion.div 
          className="lab-card theorist-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="card-header-lab">
            <div className="theorist-icon">{theoryInterpretations[selectedTheory].icon}</div>
            <h3>Multi-School Interpretation</h3>
          </div>

          {/* Theory Toggle */}
          <div className="theory-toggle">
            {Object.keys(theoryInterpretations).map((theory) => (
              <button
                key={theory}
                className={`theory-btn ${selectedTheory === theory ? 'active' : ''}`}
                onClick={() => setSelectedTheory(theory)}
                style={{
                  borderColor: selectedTheory === theory ? theoryInterpretations[theory].color : 'transparent',
                  color: selectedTheory === theory ? theoryInterpretations[theory].color : '#8892b0'
                }}
              >
                <span className="theory-icon">{theoryInterpretations[theory].icon}</span>
                <span>{theoryInterpretations[theory].title}</span>
              </button>
            ))}
          </div>

          {/* Theory Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTheory}
              className="theory-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="theory-archetypes">
                <h4>Key Concepts:</h4>
                <div className="archetype-tags">
                  {theoryInterpretations[selectedTheory].content.archetypes.map((archetype, index) => (
                    <span 
                      key={index}
                      className="archetype-tag"
                      style={{ borderColor: theoryInterpretations[selectedTheory].color }}
                    >
                      {archetype}
                    </span>
                  ))}
                </div>
              </div>

              <div className="theory-interpretation">
                <h4>Interpretation:</h4>
                <p>{theoryInterpretations[selectedTheory].content.interpretation}</p>
              </div>

              <div className="theory-symbols">
                <h4>Symbol Analysis:</h4>
                {theoryInterpretations[selectedTheory].content.symbols.map((item, index) => (
                  <div key={index} className="symbol-item">
                    <div className="symbol-name" style={{ color: theoryInterpretations[selectedTheory].color }}>
                      {item.symbol}
                    </div>
                    <div className="symbol-meaning">{item.meaning}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

      </div>

      {/* Expert Articles Section */}
      <motion.div
        className="articles-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="articles-header">
          <h2>📚 Expert Articles & Research</h2>
          <p>Curated insights from leading neuroscientists and dream researchers</p>
        </div>

        <div className="articles-grid">
          {expertArticles.map((article, index) => (
            <motion.div
              key={article.id}
              className="article-card-expert"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <div className="article-category-badge" style={{ backgroundColor: article.color }}>
                <span className="article-icon">{article.icon}</span>
                <span>{article.category}</span>
              </div>

              <h3 className="article-title-expert">{article.title}</h3>
              <p className="article-description-expert">{article.description}</p>

              <div className="article-footer-expert">
                <div className="article-meta">
                  <span className="article-author">{article.author}</span>
                  <span className="article-read-time">{article.readTime}</span>
                </div>
                <button className="article-read-btn">
                  Read Article →
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default ExpertInsights;
