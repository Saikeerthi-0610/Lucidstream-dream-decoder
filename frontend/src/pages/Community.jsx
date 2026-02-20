import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Share, Volume2, VolumeX, Eye, Sparkles, TrendingUp, Users, Moon } from "lucide-react";
import "../styles/Community.css";

// Sample dream data with AI-generated images
const initialDreams = [
  {
    id: 1,
    dreamer: "StellarNavigator42",
    avatar: "🚀",
    time: "2 hours ago",
    dreamType: "Lucid Dream",
    title: "Flying Through Liquid Glass Galaxy",
    description: "I was soaring through a galaxy made of liquid glass. Everything shimmered with impossible colors.",
    imageUrl: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80",
    neuralPattern: { delta: 0.3, theta: 0.7, alpha: 0.8, beta: 0.4 },
    tags: ["flying", "space", "lucid"],
    resonance: 142,
    comments: 23,
    isPublic: true,
    lunarPhase: "Full Moon"
  },
  {
    id: 2,
    dreamer: "OceanWhisperer",
    avatar: "🌊",
    time: "5 hours ago",
    dreamType: "Memory Recall",
    title: "Underwater Cathedral",
    description: "Deep beneath the waves, I found an ancient cathedral. The water was breathing.",
    imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
    neuralPattern: { delta: 0.6, theta: 0.5, alpha: 0.4, beta: 0.3 },
    tags: ["water", "architecture", "mystery"],
    resonance: 98,
    comments: 15,
    isPublic: true,
    lunarPhase: "Waning Gibbous"
  },
  {
    id: 3,
    dreamer: "NeuroExplorer",
    avatar: "🧠",
    time: "1 day ago",
    dreamType: "Nightmare",
    title: "The Endless Corridor",
    description: "Running through corridors that never end. Doors that lead to more doors.",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80",
    neuralPattern: { delta: 0.2, theta: 0.4, alpha: 0.3, beta: 0.9 },
    tags: ["anxiety", "running", "maze"],
    resonance: 67,
    comments: 31,
    isPublic: true,
    lunarPhase: "Full Moon",
    needsRescripting: true
  }
];

// Global dream trends
const globalTrends = [
  { theme: "Water", percentage: 54, color: "#4cc9f0" },
  { theme: "Flying", percentage: 38, color: "#7b2ff7" },
  { theme: "Falling", percentage: 29, color: "#ff006e" },
  { theme: "Being Chased", percentage: 24, color: "#ffbe0b" },
  { theme: "Lost", percentage: 19, color: "#00d4ff" }
];

// Lucid Quest challenges
const lucidQuests = [
  {
    id: 1,
    title: "The Great Moon Flight",
    description: "Try to have a lucid dream about flying to the moon",
    participants: 1247,
    successRate: 23,
    endsIn: "3 days",
    reward: "Lunar Explorer Badge"
  }
];

export default function Community() {
  const [dreams, setDreams] = useState(initialDreams);
  const [composer, setComposer] = useState("");
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);
  const [selectedLunarPhase, setSelectedLunarPhase] = useState("all");
  const [showGlobalPulse, setShowGlobalPulse] = useState(true);
  const [filterTag, setFilterTag] = useState("all");
  const [hasJoinedQuest, setHasJoinedQuest] = useState(false);
  const [questParticipants, setQuestParticipants] = useState(1247);
  const [showQuestModal, setShowQuestModal] = useState(false);

  // Load quest participation from localStorage on mount
  useEffect(() => {
    const savedQuestState = localStorage.getItem('hasJoinedQuest');
    const savedParticipants = localStorage.getItem('questParticipants');
    
    if (savedQuestState === 'true') {
      setHasJoinedQuest(true);
    }
    if (savedParticipants) {
      setQuestParticipants(parseInt(savedParticipants));
    }
  }, []);

  // Toggle ambient sound
  const toggleAmbient = () => {
    setIsAmbientPlaying(!isAmbientPlaying);
    // In production, this would control actual audio playback
  };

  // Handle Join Quest
  const handleJoinQuest = () => {
    if (hasJoinedQuest) {
      // Already joined, show modal
      setShowQuestModal(true);
      return;
    }

    // Join the quest
    setHasJoinedQuest(true);
    const newParticipantCount = questParticipants + 1;
    setQuestParticipants(newParticipantCount);
    
    // Save to localStorage
    localStorage.setItem('hasJoinedQuest', 'true');
    localStorage.setItem('questParticipants', newParticipantCount.toString());
    
    // Show success modal
    setShowQuestModal(true);
  };

  // Handle Leave Quest
  const handleLeaveQuest = () => {
    setHasJoinedQuest(false);
    const newParticipantCount = Math.max(1247, questParticipants - 1);
    setQuestParticipants(newParticipantCount);
    
    // Update localStorage
    localStorage.setItem('hasJoinedQuest', 'false');
    localStorage.setItem('questParticipants', newParticipantCount.toString());
    
    // Close modal
    setShowQuestModal(false);
  };

  // Close quest modal
  const closeQuestModal = () => {
    setShowQuestModal(false);
  };

  // Share dream
  const shareDream = () => {
    const text = composer.trim();
    if (!text) return;
    
    const newDream = {
      id: Date.now(),
      dreamer: "You",
      avatar: "✨",
      time: "just now",
      dreamType: "Normal Sleep",
      title: text.substring(0, 50),
      description: text,
      imageUrl: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=800&q=80",
      neuralPattern: { delta: 0.5, theta: 0.5, alpha: 0.5, beta: 0.5 },
      tags: ["new"],
      resonance: 0,
      comments: 0,
      isPublic: true,
      lunarPhase: "New Moon"
    };
    
    setDreams([newDream, ...dreams]);
    setComposer("");
  };

  // Toggle resonance (like)
  const toggleResonance = (id) => {
    setDreams(dreams.map(d => 
      d.id === id 
        ? { ...d, resonated: !d.resonated, resonance: d.resonated ? d.resonance - 1 : d.resonance + 1 }
        : d
    ));
  };

  // Filter by lunar phase
  const filteredDreams = selectedLunarPhase === "all" 
    ? dreams 
    : dreams.filter(d => d.lunarPhase === selectedLunarPhase);

  return (
    <div className="community-page-new">
      {/* Background */}
      <div className="cosmic-background">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>

      {/* Ambient Sound Toggle */}
      <motion.button
        className="ambient-toggle"
        onClick={toggleAmbient}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isAmbientPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
        <span>{isAmbientPlaying ? "Dream Beats On" : "Dream Beats Off"}</span>
      </motion.button>

      <div className="community-container-new">
        {/* Header */}
        <motion.div
          className="community-header-new"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>🌌 The Dream Stream</h1>
          <p>A collective gallery of the subconscious</p>
        </motion.div>

        {/* Global Dream Pulse */}
        <AnimatePresence>
          {showGlobalPulse && (
            <motion.div
              className="global-pulse"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.6 }}
            >
              <div className="pulse-header">
                <div className="pulse-title">
                  <TrendingUp size={24} />
                  <h3>Global Dream Pulse</h3>
                </div>
                <button 
                  className="pulse-close"
                  onClick={() => setShowGlobalPulse(false)}
                >
                  ×
                </button>
              </div>
              
              <div className="pulse-subtitle">
                What the world is dreaming about right now
              </div>

              <div className="trends-grid">
                {globalTrends.map((trend, index) => (
                  <motion.div
                    key={trend.theme}
                    className="trend-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="trend-info">
                      <span className="trend-theme">{trend.theme}</span>
                      <span className="trend-percentage">{trend.percentage}%</span>
                    </div>
                    <div className="trend-bar-container">
                      <motion.div
                        className="trend-bar"
                        style={{ backgroundColor: trend.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${trend.percentage}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="pulse-footer">
                <Eye size={16} />
                <span>Live data from 12,847 dreamers worldwide</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lucid Quest Challenge */}
        <motion.div
          className="lucid-quest"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="quest-badge">🏆 Active Quest</div>
          <h3>{lucidQuests[0].title}</h3>
          <p>{lucidQuests[0].description}</p>
          
          <div className="quest-stats">
            <div className="quest-stat">
              <Users size={18} />
              <span>{questParticipants} participants</span>
            </div>
            <div className="quest-stat">
              <Sparkles size={18} />
              <span>{lucidQuests[0].successRate}% success rate</span>
            </div>
          </div>

          <motion.button 
            className={`quest-join-btn ${hasJoinedQuest ? 'joined' : ''}`}
            onClick={handleJoinQuest}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {hasJoinedQuest ? (
              <>
                <Sparkles size={18} />
                Quest Active
              </>
            ) : (
              'Join Quest'
            )}
          </motion.button>
        </motion.div>

        {/* Time-Travel Slider (Lunar Phase Filter) */}
        <motion.div
          className="lunar-filter"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="lunar-header">
            <Moon size={20} />
            <span>Time-Travel: Filter by Lunar Cycle</span>
          </div>
          
          <div className="lunar-phases">
            {["all", "New Moon", "Waxing Crescent", "Full Moon", "Waning Gibbous"].map(phase => (
              <button
                key={phase}
                className={`lunar-phase-btn ${selectedLunarPhase === phase ? 'active' : ''}`}
                onClick={() => setSelectedLunarPhase(phase)}
              >
                {phase === "all" ? "All Phases" : phase}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Dream Composer */}
        <motion.div
          className="dream-composer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <textarea
            className="composer-input"
            placeholder="Share your dream journey... 🌙"
            value={composer}
            onChange={(e) => setComposer(e.target.value)}
            rows={4}
          />
          
          <div className="composer-footer">
            <div className="privacy-toggle">
              <input type="checkbox" id="public" defaultChecked />
              <label htmlFor="public">Public</label>
            </div>
            
            <button className="share-dream-btn" onClick={shareDream}>
              <Sparkles size={18} />
              Share Dream
            </button>
          </div>
        </motion.div>

        {/* Quest Modal */}
        <AnimatePresence>
          {showQuestModal && (
            <>
              <motion.div
                className="quest-modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeQuestModal}
              />
              <motion.div
                className="quest-modal"
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 50 }}
                transition={{ type: "spring", duration: 0.5 }}
              >
                <button className="modal-close" onClick={closeQuestModal}>×</button>
                
                {hasJoinedQuest ? (
                  <>
                    <div className="modal-icon success">
                      <Sparkles size={48} />
                    </div>
                    <h2>Quest Active! 🌙</h2>
                    <p>You've joined <strong>The Great Moon Flight</strong></p>
                    
                    <div className="modal-quest-info">
                      <div className="modal-info-item">
                        <span className="info-label">Your Mission:</span>
                        <span className="info-value">Have a lucid dream about flying to the moon</span>
                      </div>
                      <div className="modal-info-item">
                        <span className="info-label">Time Remaining:</span>
                        <span className="info-value">{lucidQuests[0].endsIn}</span>
                      </div>
                      <div className="modal-info-item">
                        <span className="info-label">Reward:</span>
                        <span className="info-value">🏆 {lucidQuests[0].reward}</span>
                      </div>
                    </div>

                    <div className="modal-tips">
                      <h4>💡 Tips for Success:</h4>
                      <ul>
                        <li>Set your intention before sleep: "I will fly to the moon"</li>
                        <li>Practice reality checks during the day</li>
                        <li>Keep a dream journal by your bed</li>
                        <li>Look for the moon in your dreams as a trigger</li>
                      </ul>
                    </div>

                    <div className="modal-actions">
                      <button className="modal-btn primary" onClick={closeQuestModal}>
                        Start Dreaming
                      </button>
                      <button className="modal-btn secondary" onClick={handleLeaveQuest}>
                        Leave Quest
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="modal-icon">
                      <Moon size={48} />
                    </div>
                    <h2>You've Left the Quest</h2>
                    <p>You can rejoin anytime before it ends!</p>
                    <button className="modal-btn primary" onClick={closeQuestModal}>
                      Close
                    </button>
                  </>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Dream Feed */}
        <div className="dream-feed-new">
          {filteredDreams.map((dream, index) => (
            <motion.div
              key={dream.id}
              className="dream-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              {/* Dream Image */}
              <div className="dream-image-container">
                <img 
                  src={dream.imageUrl} 
                  alt={dream.title}
                  className="dream-image"
                />
                <div className="dream-type-badge">{dream.dreamType}</div>
                {dream.needsRescripting && (
                  <div className="rescript-badge">💭 Needs Rescripting</div>
                )}
              </div>

              {/* Dream Content */}
              <div className="dream-content">
                <div className="dreamer-info">
                  <div className="dreamer-avatar">{dream.avatar}</div>
                  <div className="dreamer-details">
                    <h4>{dream.dreamer}</h4>
                    <span>{dream.time} • {dream.lunarPhase}</span>
                  </div>
                </div>

                <h3 className="dream-title">{dream.title}</h3>
                <p className="dream-description">{dream.description}</p>

                {/* Neural Pattern */}
                <div className="neural-pattern">
                  <span className="pattern-label">Neural Pattern:</span>
                  <div className="pattern-bars">
                    {Object.entries(dream.neuralPattern).map(([wave, value]) => (
                      <div key={wave} className="pattern-bar-item">
                        <div 
                          className="pattern-bar"
                          style={{ 
                            width: `${value * 100}%`,
                            backgroundColor: wave === 'delta' ? '#4cc9f0' : 
                                           wave === 'theta' ? '#7b2ff7' : 
                                           wave === 'alpha' ? '#ffbe0b' : '#ff006e'
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="dream-tags">
                  {dream.tags.map(tag => (
                    <span key={tag} className="dream-tag">#{tag}</span>
                  ))}
                </div>

                {/* Actions */}
                <div className="dream-actions">
                  <button
                    className={`action-btn resonance ${dream.resonated ? 'active' : ''}`}
                    onClick={() => toggleResonance(dream.id)}
                  >
                    <Heart size={18} fill={dream.resonated ? "currentColor" : "none"} />
                    <span>{dream.resonance} Resonance</span>
                  </button>

                  <button className="action-btn">
                    <MessageCircle size={18} />
                    <span>{dream.comments}</span>
                  </button>

                  <button className="action-btn">
                    <Share size={18} />
                  </button>

                  {dream.needsRescripting && (
                    <button className="action-btn rescript">
                      <Sparkles size={18} />
                      <span>Help Rescript</span>
                    </button>
                  )}
                </div>

                {/* Similar Dreamers */}
                {index === 0 && (
                  <motion.div
                    className="similar-dreamers"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ delay: 1 }}
                  >
                    <Users size={16} />
                    <span>3 dreamers had similar neural patterns last night</span>
                    <button className="sync-btn">Connect</button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
