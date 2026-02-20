import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Brain, Sparkles, Zap, Activity, ChevronRight } from "lucide-react";
import "../styles/welcome.css";

export default function Home() {
  const navigate = useNavigate();
  const [currentQuote, setCurrentQuote] = useState(0);
  const [timeOfDay, setTimeOfDay] = useState('day');
  const [scrollY, setScrollY] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const parallaxRef = useRef(null);

  // Dreamer's Wisdom Quotes
  const quotes = [
    "The mind is the only universe that expands while you sleep",
    "Your synapses are the brushes, your soul is the canvas",
    "Dreams are the whispers of your future self",
    "In the architecture of sleep, we build tomorrow's reality",
    "The subconscious speaks in symbols, not sentences",
    "Every dream is a letter from your deeper mind",
    "Sleep is the laboratory where consciousness experiments",
    "Your neural pathways are highways to infinite worlds",
    "The night is when your mind becomes an artist",
    "Dreams are the bridge between who you are and who you'll become"
  ];

  // Rotate quotes every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Detect time of day for Luma Glow
  useEffect(() => {
    const updateTimeOfDay = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) {
        setTimeOfDay('morning'); // Amber
      } else if (hour >= 12 && hour < 18) {
        setTimeOfDay('day'); // Cyan
      } else if (hour >= 18 && hour < 22) {
        setTimeOfDay('evening'); // Purple
      } else {
        setTimeOfDay('night'); // Deep Purple
      }
    };
    
    updateTimeOfDay();
    const interval = setInterval(updateTimeOfDay, 60000);
    return () => clearInterval(interval);
  }, []);

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleEnterStream = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    
    // Dream-state transition
    setIsTransitioning(true);
    
    setTimeout(() => {
      if (token && user) {
        navigate("/stream");
      } else {
        navigate("/login");
      }
    }, 1000);
  };

  const handleStartDecoding = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      navigate("/signup");
    }, 1000);
  };

  const getLumaGlowColor = () => {
    switch(timeOfDay) {
      case 'morning': return 'rgba(255, 159, 67, 0.4)';
      case 'day': return 'rgba(76, 201, 240, 0.4)';
      case 'evening': return 'rgba(123, 47, 247, 0.4)';
      case 'night': return 'rgba(88, 28, 135, 0.5)';
      default: return 'rgba(76, 201, 240, 0.4)';
    }
  };

  return (
    <section className={`hero-cyber-zen ${isTransitioning ? 'dream-state-transition' : ''}`} data-time={timeOfDay}>
      {/* Parallax Neural Layers */}
      <div className="parallax-container" ref={parallaxRef}>
        <div 
          className="parallax-layer layer-1" 
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        />
        <div 
          className="parallax-layer layer-2" 
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        />
        <div 
          className="parallax-layer layer-3" 
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        />
      </div>

      {/* Nebula Background with Overlay */}
      <div className="nebula-background">
        <div className="nebula-overlay"></div>
      </div>

      {/* Floating Neural Network */}
      <div className="neural-network-bg">
        <div className="neural-node"></div>
        <div className="neural-node"></div>
        <div className="neural-node"></div>
        <div className="neural-node"></div>
        <div className="neural-node"></div>
      </div>

      {/* Main Content */}
      <div className="hero-content-zen">
        {/* Dreamer's Wisdom Quote */}
        <div className="wisdom-quote">
          <Sparkles size={20} className="quote-icon" />
          <p className="quote-text">{quotes[currentQuote]}</p>
        </div>

        {/* Main Hero Section */}
        <div className="hero-main">
          {/* Luma Glow Brain Icon */}
          <div 
            className="luma-brain-icon"
          >
            <Brain size={80} />
          </div>

          {/* Badge */}
          <div className="hero-badge-zen">
            <Activity size={14} />
            <span>AI-DRIVEN NEURO-ANALYSIS V2.5</span>
            <div className="badge-pulse"></div>
          </div>

          {/* Title */}
          <h1 className="hero-title-zen">
            Unlock the Architecture of Your{" "}
            <span className="gradient-text">Dreams</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle-zen">
            Transcend standard sleep tracking. LucidStream uses medical-grade signal
            processing to decode the narrative of your subconscious.
          </p>

          {/* Actions */}
          <div className="hero-actions-zen">
            <button 
              className="primary-btn-zen"
              onClick={handleEnterStream}
            >
              <Zap size={20} />
              <span>Enter the Stream</span>
              <ChevronRight size={20} className="btn-arrow" />
              <div className="btn-ripple"></div>
            </button>
            
            <button 
              className="secondary-btn-zen"
              onClick={handleStartDecoding}
            >
              <Brain size={20} />
              <span>Start Decoding</span>
            </button>
          </div>

          {/* Features Grid */}
          <div className="features-bento">
            <div className="feature-card">
              <div className="feature-icon">🧠</div>
              <h3>Neural Mapping</h3>
              <p>Real-time brainwave analysis</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✨</div>
              <h3>Dream Decoding</h3>
              <p>AI-powered interpretation</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌙</div>
              <h3>Sleep Insights</h3>
              <p>Deep REM cycle tracking</p>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="scroll-indicator">
          <div className="scroll-line"></div>
          <span>Explore</span>
        </div>
      </div>

      {/* Ripple Effect Overlay for Transition */}
      {isTransitioning && (
        <div className="ripple-overlay">
          <div className="ripple-circle"></div>
          <div className="ripple-circle delay-1"></div>
          <div className="ripple-circle delay-2"></div>
        </div>
      )}
    </section>
  );
}
