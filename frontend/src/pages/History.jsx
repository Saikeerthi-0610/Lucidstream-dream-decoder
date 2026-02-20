import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getHistory } from "../api/api";
import { 
  TrendingUp, Calendar, Moon, Cloud, Sun, CloudRain, 
  Filter, Download, Lock, Unlock, RefreshCw, Mic,
  Search, BarChart3, Zap, Heart, Users, Eye
} from "lucide-react";
import "./History.css";
import "../styles/dark-theme-background.css";

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [selectedDream, setSelectedDream] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // New state for advanced features
  const [isGhostMode, setIsGhostMode] = useState(false);
  const [showTrendAnalytics, setShowTrendAnalytics] = useState(true);
  const [filterEmotion, setFilterEmotion] = useState("all");
  const [filterCharacter, setFilterCharacter] = useState("all");
  const [filterIntensity, setFilterIntensity] = useState("all");
  const [showCalendarView, setShowCalendarView] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  // Mock data for trend analytics (Spotify Wrapped style)
  const trendAnalytics = {
    adventurousness: 30,
    topThemes: ["Ocean Landscapes", "Work Stress", "Flying"],
    dreamFrequency: 12,
    avgIntensity: 7.5,
    lucidDreams: 3,
    comparison: "30% more adventurous than last month"
  };

  // Mock lunar and weather data
  const getLunarPhase = (date) => {
    const phases = ["🌑 New Moon", "🌒 Waxing Crescent", "🌓 First Quarter", "🌔 Waxing Gibbous", 
                    "🌕 Full Moon", "🌖 Waning Gibbous", "🌗 Last Quarter", "🌘 Waning Crescent"];
    return phases[Math.floor(Math.random() * phases.length)];
  };

  const getWeather = () => {
    const weather = [
      { icon: <Sun size={16} />, text: "Clear" },
      { icon: <Cloud size={16} />, text: "Cloudy" },
      { icon: <CloudRain size={16} />, text: "Rainy" }
    ];
    return weather[Math.floor(Math.random() * weather.length)];
  };

  // Get dream type and intensity based on content
  const getDreamInfo = (dreamText) => {
    const text = dreamText.toLowerCase();
    
    let emotion = "Mystery";
    let character = "Strangers";
    
    if (text.includes('fear') || text.includes('nightmare') || text.includes('chase')) {
      emotion = "Fear";
    } else if (text.includes('joy') || text.includes('happy') || text.includes('love')) {
      emotion = "Joy";
    }
    
    if (text.includes('family') || text.includes('mother') || text.includes('father')) {
      character = "Family";
    } else if (text.includes('animal') || text.includes('dog') || text.includes('cat')) {
      character = "Animals";
    }
    
    if (text.includes('lucid') || text.includes('library') || text.includes('ocean')) {
      return { 
        type: 'Lucid Dream', 
        intensity: 'HIGH INTENSITY',
        intensityColor: '#ff9f43',
        emotion,
        character,
        intensityLevel: 8
      };
    }
    if (text.includes('memory') || text.includes('rems') || text.includes('consolidation')) {
      return { 
        type: 'REMS Stage 3', 
        intensity: 'MODERATE INTENSITY',
        intensityColor: '#2ed573',
        emotion,
        character,
        intensityLevel: 5
      };
    }
    if (text.includes('nightmare') || text.includes('shadow') || text.includes('chase')) {
      return { 
        type: 'Nightmare', 
        intensity: 'VERY HIGH INTENSITY',
        intensityColor: '#ff4757',
        emotion: "Fear",
        character,
        intensityLevel: 10
      };
    }
    
    return { 
      type: 'Dream State', 
      intensity: 'MODERATE INTENSITY',
      intensityColor: '#2ed573',
      emotion,
      character,
      intensityLevel: 5
    };
  };

  // Format date
  const getFormattedDate = (id) => {
    const dates = ['Oct 24, 2023', 'Oct 21, 2023', 'Oct 18, 2023', 'Oct 15, 2023', 'Oct 12, 2023'];
    return dates[(id - 1) % dates.length] || 'Oct 24, 2023';
  };

  // Ghost Mode (Privacy Lock)
  const toggleGhostMode = async () => {
    if (!isGhostMode) {
      // In production, this would trigger biometric authentication
      const confirmed = window.confirm("Enable Ghost Mode? This will require biometric authentication to view dreams.");
      if (confirmed) {
        setIsGhostMode(true);
      }
    } else {
      setIsGhostMode(false);
    }
  };

  // AI Re-Generation (Remaster)
  const handleRemaster = async (dreamId) => {
    alert(`Remastering dream ${dreamId} with latest 2026 AI models... This will take a moment.`);
    // In production, this would call the backend API
  };

  // Export as Memory Art
  const handleExportArt = (dream) => {
    alert(`Exporting "${dream.dream.substring(0, 30)}..." as high-quality poster. Check your downloads!`);
    // In production, this would generate and download an image
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await getHistory();
        setHistory(response.data);
        setFilteredHistory(response.data);
        setLoading(false);
      } catch (error) {
        console.error("History fetch error:", error);
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  useEffect(() => {
    let filtered = history.filter(item =>
      item.dream.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply emotion filter
    if (filterEmotion !== "all") {
      filtered = filtered.filter(item => {
        const info = getDreamInfo(item.dream);
        return info.emotion === filterEmotion;
      });
    }

    // Apply character filter
    if (filterCharacter !== "all") {
      filtered = filtered.filter(item => {
        const info = getDreamInfo(item.dream);
        return info.character === filterCharacter;
      });
    }

    // Apply intensity filter
    if (filterIntensity !== "all") {
      filtered = filtered.filter(item => {
        const info = getDreamInfo(item.dream);
        if (filterIntensity === "low") return info.intensityLevel <= 4;
        if (filterIntensity === "medium") return info.intensityLevel >= 5 && info.intensityLevel <= 7;
        if (filterIntensity === "high") return info.intensityLevel >= 8;
        return true;
      });
    }

    setFilteredHistory(filtered);
  }, [searchTerm, history, filterEmotion, filterCharacter, filterIntensity]);

  const handleViewDetails = (item) => {
    if (isGhostMode) {
      alert("Ghost Mode is active. Please authenticate to view dream details.");
      return;
    }
    setSelectedDream(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDream(null);
  };

  if (loading) {
    return (
      <div className="history-loading">
        <div className="loading-spinner"></div>
        <p>Loading your dream vault...</p>
      </div>
    );
  }

  return (
    <section className="history-page">
      {/* Dark Theme Background Elements */}
      <div className="dark-theme-background"></div>
      <div className="dark-particles">
        <div className="dark-particle"></div>
        <div className="dark-particle"></div>
        <div className="dark-particle"></div>
        <div className="dark-particle"></div>
        <div className="dark-particle"></div>
        <div className="dark-particle"></div>
      </div>
      <div className="dark-grid-overlay"></div>
      <div className="dark-connections">
        <div className="dark-connection-line"></div>
        <div className="dark-connection-line"></div>
        <div className="dark-connection-line"></div>
        <div className="dark-connection-line"></div>
        <div className="dark-glow-spot"></div>
        <div className="dark-glow-spot"></div>
        <div className="dark-glow-spot"></div>
      </div>

      {/* HEADER */}
      <div className="history-header">
        <div className="header-left">
          <div className="vault-icon">🕰️</div>
          <div className="header-text">
            <h1>Dream Analysis Vault</h1>
            <p>Revisit the shadows of your past nights</p>
          </div>
        </div>
        
        <div className="header-actions">
          <motion.button
            className={`ghost-mode-btn ${isGhostMode ? 'active' : ''}`}
            onClick={toggleGhostMode}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isGhostMode ? <Lock size={18} /> : <Unlock size={18} />}
            <span>{isGhostMode ? 'Ghost Mode ON' : 'Ghost Mode'}</span>
          </motion.button>
        </div>
      </div>

      {/* SUBCONSCIOUS TREND ANALYTICS (Spotify Wrapped Style) */}
      <AnimatePresence>
        {showTrendAnalytics && (
          <motion.div
            className="trend-analytics-card"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <button 
              className="close-analytics"
              onClick={() => setShowTrendAnalytics(false)}
            >
              ×
            </button>
            
            <div className="analytics-header">
              <TrendingUp size={32} />
              <h2>Your Subconscious Trends</h2>
              <p>This Month's Dream Wrapped</p>
            </div>

            <div className="analytics-grid">
              <div className="analytics-stat">
                <div className="stat-icon-large">🚀</div>
                <div className="stat-number">+{trendAnalytics.adventurousness}%</div>
                <div className="stat-text">More Adventurous</div>
                <div className="stat-subtext">than last month</div>
              </div>

              <div className="analytics-stat">
                <div className="stat-icon-large">🌙</div>
                <div className="stat-number">{trendAnalytics.lucidDreams}</div>
                <div className="stat-text">Lucid Dreams</div>
                <div className="stat-subtext">this month</div>
              </div>

              <div className="analytics-stat">
                <div className="stat-icon-large">⚡</div>
                <div className="stat-number">{trendAnalytics.avgIntensity}/10</div>
                <div className="stat-text">Avg Intensity</div>
                <div className="stat-subtext">dream power level</div>
              </div>
            </div>

            <div className="top-themes">
              <h3>🎯 Top Recurring Themes</h3>
              <div className="themes-list">
                {trendAnalytics.topThemes.map((theme, index) => (
                  <div key={index} className="theme-badge">
                    #{index + 1} {theme}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QUICK-SEARCH FILTERS */}
      <div className="filters-section">
        <div className="filters-header">
          <Filter size={20} />
          <span>Quick Filters</span>
        </div>
        
        <div className="filters-grid">
          <div className="filter-group">
            <label>Emotion</label>
            <select 
              value={filterEmotion} 
              onChange={(e) => setFilterEmotion(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Emotions</option>
              <option value="Fear">Fear</option>
              <option value="Joy">Joy</option>
              <option value="Mystery">Mystery</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Character</label>
            <select 
              value={filterCharacter} 
              onChange={(e) => setFilterCharacter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Characters</option>
              <option value="Family">Family</option>
              <option value="Strangers">Strangers</option>
              <option value="Animals">Animals</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Intensity</label>
            <select 
              value={filterIntensity} 
              onChange={(e) => setFilterIntensity(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Intensities</option>
              <option value="low">Low (1-4)</option>
              <option value="medium">Medium (5-7)</option>
              <option value="high">High (8-10)</option>
            </select>
          </div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="search-container">
        <Search size={20} />
        <input
          type="text"
          placeholder="Search dreams by keywords..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* STATISTICS CARDS */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{history.length}</div>
            <div className="stat-label">Total Dreams</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <div className="stat-value">7</div>
            <div className="stat-label">Day Streak</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <div className="stat-value">85%</div>
            <div className="stat-label">Avg Confidence</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🌙</div>
          <div className="stat-content">
            <div className="stat-value">12</div>
            <div className="stat-label">This Month</div>
          </div>
        </div>
      </div>

      {/* DREAM CARDS */}
      <div className="dreams-container">
        {filteredHistory.length === 0 ? (
          <div className="empty-state">
            <h3>No dreams found</h3>
            <p>Try adjusting your filters or decode more dreams</p>
          </div>
        ) : (
          filteredHistory.map((item) => {
            const dreamInfo = getDreamInfo(item.dream);
            const lunar = getLunarPhase(item.id);
            const weather = getWeather();
            
            return (
              <motion.div 
                className="dream-card-enhanced" 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
              >
                {isGhostMode && <div className="ghost-overlay">🔒 Locked</div>}
                
                <div className="card-header-enhanced">
                  <div className="date-section">
                    <Calendar size={16} />
                    <span>{getFormattedDate(item.id)}</span>
                  </div>
                  
                  <div className="environmental-data">
                    <div className="env-item">
                      <Moon size={14} />
                      <span>{lunar}</span>
                    </div>
                    <div className="env-item">
                      {weather.icon}
                      <span>{weather.text}</span>
                    </div>
                  </div>
                </div>

                <div className="card-body-enhanced">
                  <h3 className="dream-title-enhanced">{dreamInfo.type}</h3>
                  <p className="dream-description-enhanced">
                    {isGhostMode ? "••••••••••••••••••••" : item.dream}
                  </p>
                  
                  <div className="dream-meta">
                    <span className="meta-tag emotion">{dreamInfo.emotion}</span>
                    <span className="meta-tag character">{dreamInfo.character}</span>
                    <span 
                      className="meta-tag intensity" 
                      style={{ backgroundColor: dreamInfo.intensityColor }}
                    >
                      {dreamInfo.intensityLevel}/10
                    </span>
                  </div>
                </div>

                <div className="card-actions-enhanced">
                  <motion.button
                    className="action-btn-icon"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleRemaster(item.id)}
                    title="Remaster with 2026 AI"
                  >
                    <RefreshCw size={18} />
                  </motion.button>

                  <motion.button
                    className="action-btn-icon"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleExportArt(item)}
                    title="Export as Memory Art"
                  >
                    <Download size={18} />
                  </motion.button>

                  <motion.button
                    className="action-btn-primary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleViewDetails(item)}
                  >
                    View Details →
                  </motion.button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* DETAILS MODAL (Enhanced) */}
      {showModal && selectedDream && (
        <div className="modal-overlay" onClick={closeModal}>
          <motion.div 
            className="modal-content-enhanced" 
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <button className="modal-close" onClick={closeModal}>✕</button>
            
            <div className="modal-header">
              <h2>Dream Analysis Details</h2>
              <div className="modal-date">📅 {getFormattedDate(selectedDream.id)}</div>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <div className="detail-label">
                  <span className="detail-icon">🌙</span>
                  <span>Dream Type</span>
                </div>
                <div className="detail-value">{getDreamInfo(selectedDream.dream).type}</div>
              </div>

              <div className="detail-section">
                <div className="detail-label">
                  <span className="detail-icon">📊</span>
                  <span>Confidence Level</span>
                </div>
                <div className="detail-value">
                  <div className="confidence-bar">
                    <div 
                      className="confidence-fill" 
                      style={{ width: `${selectedDream.confidence}%` }}
                    ></div>
                  </div>
                  <span className="confidence-text">{selectedDream.confidence}%</span>
                </div>
              </div>

              <div className="detail-section">
                <div className="detail-label">
                  <span className="detail-icon">⚡</span>
                  <span>Intensity</span>
                </div>
                <div className="detail-value">
                  <span 
                    className="intensity-tag" 
                    style={{ backgroundColor: getDreamInfo(selectedDream.dream).intensityColor }}
                  >
                    {getDreamInfo(selectedDream.dream).intensity}
                  </span>
                </div>
              </div>

              <div className="detail-section full-width">
                <div className="detail-label">
                  <span className="detail-icon">📝</span>
                  <span>Dream Description</span>
                </div>
                <div className="detail-value description">
                  {selectedDream.dream}
                </div>
              </div>

              <div className="detail-section full-width">
                <div className="detail-label">
                  <span className="detail-icon">🧠</span>
                  <span>Neural Analysis</span>
                </div>
                <div className="detail-value analysis">
                  <div className="analysis-item">
                    <strong>Alpha Waves:</strong> Elevated during REM phase, indicating heightened awareness
                  </div>
                  <div className="analysis-item">
                    <strong>Theta Activity:</strong> Strong presence in prefrontal cortex, associated with memory processing
                  </div>
                  <div className="analysis-item">
                    <strong>Beta Waves:</strong> Moderate spikes correlating with emotional content
                  </div>
                  <div className="analysis-item">
                    <strong>Gamma Synchronization:</strong> Brief periods detected, suggesting lucid moments
                  </div>
                </div>
              </div>

              <div className="detail-section full-width">
                <div className="detail-label">
                  <span className="detail-icon">💡</span>
                  <span>Interpretation</span>
                </div>
                <div className="detail-value interpretation">
                  This dream pattern suggests active memory consolidation with elements of creative problem-solving. 
                  The neural signature indicates a healthy REM cycle with strong emotional processing. 
                  Consider journaling these experiences to enhance dream recall and lucidity potential.
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="modal-btn secondary" onClick={closeModal}>Close</button>
              <button className="modal-btn primary" onClick={() => handleExportArt(selectedDream)}>
                <Download size={18} />
                Export as Art
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default History;
