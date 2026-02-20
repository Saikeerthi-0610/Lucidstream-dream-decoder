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
      author: "Dr. Sarah Chen",
      fullContent: `
        <h2>🧠 The Science Behind REM Sleep</h2>
        <p>REM (Rapid Eye Movement) sleep represents one of the most fascinating states of human consciousness. During this stage, our brains exhibit heightened activity similar to waking states, making it the optimal window for vivid dreaming.</p>
        
        <h3>The REM Sleep Cycle</h3>
        <p>A typical night's sleep includes 4-6 REM cycles, each lasting progressively longer:</p>
        <ul>
          <li><strong>First REM:</strong> 10 minutes (90 minutes after falling asleep)</li>
          <li><strong>Second REM:</strong> 20 minutes</li>
          <li><strong>Third REM:</strong> 30-40 minutes</li>
          <li><strong>Final REM:</strong> Up to 60 minutes (most vivid dreams)</li>
        </ul>

        <h3>Why REM Matters for Dreams</h3>
        <p>During REM sleep, your brain processes emotions, consolidates memories, and creates the vivid narratives we experience as dreams. The prefrontal cortex (logical thinking) is less active, allowing for the surreal, illogical nature of dreams.</p>

        <h3>Optimizing Your REM Sleep</h3>
        <ul>
          <li>Maintain consistent sleep schedule</li>
          <li>Avoid alcohol before bed (suppresses REM)</li>
          <li>Keep bedroom cool (65-68°F optimal)</li>
          <li>Aim for 7-9 hours total sleep</li>
        </ul>
      `
    },
    {
      id: 2,
      category: "PSYCHOLOGY",
      icon: "🎭",
      color: "#7b2ff7",
      title: "Jungian Dream Symbolism",
      description: "Explore archetypes and the collective unconscious in your dreams.",
      readTime: "8 min read",
      author: "Prof. Michael Torres",
      fullContent: `
        <h2>🎭 Carl Jung's Approach to Dreams</h2>
        <p>Carl Jung believed dreams were messages from the unconscious mind, offering insights into our psyche through universal symbols and archetypes.</p>

        <h3>The Major Archetypes</h3>
        <ul>
          <li><strong>The Shadow:</strong> Repressed aspects of personality</li>
          <li><strong>The Anima/Animus:</strong> Feminine/masculine aspects</li>
          <li><strong>The Self:</strong> Wholeness and integration</li>
          <li><strong>The Hero:</strong> Journey of transformation</li>
        </ul>

        <h3>Common Jungian Symbols</h3>
        <p><strong>Water:</strong> The unconscious mind, emotions, transformation</p>
        <p><strong>Mountains:</strong> Obstacles, spiritual ascent, goals</p>
        <p><strong>Snakes:</strong> Transformation, healing, hidden knowledge</p>
        <p><strong>Houses:</strong> The self, different rooms represent different aspects</p>

        <h3>Working with Your Dreams</h3>
        <p>Jung recommended active imagination - engaging with dream symbols while awake to understand their personal meaning. Keep a dream journal and look for recurring themes.</p>
      `
    },
    {
      id: 3,
      category: "RESEARCH",
      icon: "🔬",
      color: "#ff006e",
      title: "Lucid Dreaming Techniques",
      description: "Scientific methods to achieve consciousness during dreams.",
      readTime: "6 min read",
      author: "Dr. Emily Watson",
      fullContent: `
        <h2>🔬 The Science of Lucid Dreaming</h2>
        <p>Lucid dreaming - becoming aware you're dreaming while still asleep - is a learnable skill backed by scientific research.</p>

        <h3>Proven Techniques</h3>
        <p><strong>1. Reality Checks:</strong> Question reality 10+ times daily. Look at your hands, try to push finger through palm, check text twice.</p>
        
        <p><strong>2. MILD (Mnemonic Induction):</strong> Before sleep, repeat "I will know I'm dreaming" while visualizing becoming lucid.</p>
        
        <p><strong>3. WBTB (Wake Back to Bed):</strong> Wake after 5-6 hours, stay awake 20-30 minutes, return to sleep with lucid intent.</p>
        
        <p><strong>4. WILD (Wake Initiated):</strong> Maintain awareness while body falls asleep. Advanced technique.</p>

        <h3>What Research Shows</h3>
        <ul>
          <li>55% of people have had at least one lucid dream</li>
          <li>Regular practice increases frequency significantly</li>
          <li>Lucid dreamers show increased gamma wave activity</li>
          <li>Skills practiced in lucid dreams can improve waking performance</li>
        </ul>
      `
    },
    {
      id: 4,
      category: "WELLNESS",
      icon: "✨",
      color: "#2ed573",
      title: "Sleep Hygiene Best Practices",
      description: "Optimize your sleep environment for better dream recall.",
      readTime: "4 min read",
      author: "Dr. James Park",
      fullContent: `
        <h2>✨ Creating the Perfect Sleep Environment</h2>
        <p>Quality sleep is the foundation for vivid, memorable dreams. Here's how to optimize your sleep hygiene.</p>

        <h3>The Ideal Bedroom</h3>
        <ul>
          <li><strong>Temperature:</strong> 65-68°F (18-20°C)</li>
          <li><strong>Darkness:</strong> Blackout curtains or eye mask</li>
          <li><strong>Quiet:</strong> White noise machine if needed</li>
          <li><strong>Comfort:</strong> Quality mattress and pillows</li>
        </ul>

        <h3>Pre-Sleep Routine</h3>
        <p><strong>2 Hours Before:</strong> No heavy meals, dim lights, avoid screens</p>
        <p><strong>1 Hour Before:</strong> Relaxing activity (reading, meditation, gentle stretching)</p>
        <p><strong>30 Minutes Before:</strong> Journal, set dream intentions, prepare dream journal</p>

        <h3>What to Avoid</h3>
        <ul>
          <li>Caffeine after 2 PM</li>
          <li>Alcohol (disrupts REM sleep)</li>
          <li>Blue light from screens</li>
          <li>Intense exercise close to bedtime</li>
          <li>Stressful conversations or content</li>
        </ul>
      `
    },
    {
      id: 5,
      category: "TECHNOLOGY",
      icon: "⚡",
      color: "#ffbe0b",
      title: "EEG Technology in Dream Research",
      description: "How modern brain monitoring is revolutionizing dream science.",
      readTime: "7 min read",
      author: "Dr. Lisa Kumar",
      fullContent: `
        <h2>⚡ The Evolution of Brain Monitoring</h2>
        <p>EEG (Electroencephalography) technology has transformed from bulky hospital equipment to sleek consumer devices, opening new frontiers in dream research.</p>

        <h3>How EEG Works</h3>
        <p>EEG measures electrical activity in the brain through sensors placed on the scalp. Different brain states produce distinct wave patterns:</p>
        <ul>
          <li><strong>Delta (0.5-4 Hz):</strong> Deep sleep</li>
          <li><strong>Theta (4-8 Hz):</strong> Light sleep, REM</li>
          <li><strong>Alpha (8-13 Hz):</strong> Relaxed wakefulness</li>
          <li><strong>Beta (13-30 Hz):</strong> Active thinking</li>
          <li><strong>Gamma (30-100 Hz):</strong> Heightened awareness, lucid dreaming</li>
        </ul>

        <h3>Consumer Devices</h3>
        <p>Modern EEG headbands like Muse, Dreem, and NeuroSky offer:</p>
        <ul>
          <li>Real-time sleep stage tracking</li>
          <li>Dream detection algorithms</li>
          <li>Lucid dream induction cues</li>
          <li>Detailed sleep analytics</li>
        </ul>

        <h3>The Future</h3>
        <p>Researchers are developing AI systems that can decode dream content from brain activity patterns, potentially allowing us to "record" and replay dreams.</p>
      `
    },
    {
      id: 6,
      category: "THERAPY",
      icon: "💭",
      color: "#ff9f43",
      title: "Nightmare Rescripting Methods",
      description: "Clinical approaches to transforming recurring nightmares.",
      readTime: "6 min read",
      author: "Dr. Robert Martinez",
      fullContent: `
        <h2>💭 Transforming Nightmares Through Therapy</h2>
        <p>Imagery Rehearsal Therapy (IRT) is a proven clinical technique for reducing nightmare frequency and intensity.</p>

        <h3>The IRT Process</h3>
        <p><strong>Step 1:</strong> Write down the nightmare in detail</p>
        <p><strong>Step 2:</strong> Identify the most distressing part</p>
        <p><strong>Step 3:</strong> Rewrite the ending with a positive resolution</p>
        <p><strong>Step 4:</strong> Visualize the new version 10-20 minutes daily</p>
        <p><strong>Step 5:</strong> Practice for 1-2 weeks consistently</p>

        <h3>Success Rates</h3>
        <ul>
          <li>70% reduction in nightmare frequency</li>
          <li>Improvements often seen within 1 week</li>
          <li>Particularly effective for PTSD-related nightmares</li>
          <li>Benefits maintained long-term</li>
        </ul>

        <h3>Additional Techniques</h3>
        <p><strong>Lucid Dreaming:</strong> Become aware during nightmare and consciously change it</p>
        <p><strong>Exposure Therapy:</strong> Gradually confront nightmare themes while awake</p>
        <p><strong>Medication:</strong> Prazosin can reduce nightmare intensity in some cases</p>

        <h3>When to Seek Help</h3>
        <p>If nightmares occur more than once per week, cause significant distress, or interfere with daily functioning, consult a sleep specialist or therapist trained in nightmare treatment.</p>
      `
    }
  ];

  // useEffect must be called before any conditional returns
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  const handleReadArticle = (article) => {
    setSelectedArticle(article);
  };

  const handleBackToList = () => {
    setSelectedArticle(null);
  };

  // Show full article view
  if (selectedArticle) {
    return (
      <section className="expert-insights-lab full-article-page">
        <div className="lab-background"></div>
        <div className="lab-grid"></div>

        <div className="article-page-container">
          <button className="back-button-article" onClick={handleBackToList}>
            ← Back to Articles
          </button>
          
          <div className="full-article-wrapper">
            <div className="article-header-full">
              <span className="article-category-small" style={{ color: selectedArticle.color }}>
                {selectedArticle.icon} {selectedArticle.category}
              </span>
              
              <h1 className="full-article-title">{selectedArticle.title}</h1>
              
              <div className="article-meta-full">
                <span className="article-author-full">By {selectedArticle.author}</span>
                <span className="article-divider">•</span>
                <span className="article-read-time-full">{selectedArticle.readTime}</span>
              </div>
            </div>

            <div 
              className="article-content-full"
              dangerouslySetInnerHTML={{ __html: selectedArticle.fullContent }}
            />
          </div>
        </div>
      </section>
    );
  }

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
              <div className="article-category-badge" style={{ borderColor: article.color, color: article.color }}>
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
                <button className="article-read-btn" onClick={() => handleReadArticle(article)}>
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
