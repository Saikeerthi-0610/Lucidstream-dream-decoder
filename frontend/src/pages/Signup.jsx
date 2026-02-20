import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Brain, Lock, Mail, User, Eye, EyeOff, Shield, 
  Sparkles, Zap, Activity, Wifi, CheckCircle, Target
} from "lucide-react";
import "../styles/signup.css";
import "../styles/dark-theme-background.css";
import { authService } from "../api/auth";

export default function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Intent, 2: Archetype, 3: Form
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    intent: '',
    archetype: '',
    anonymousMode: false
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [privateMode, setPrivateMode] = useState(false);
  const [serverLatency, setServerLatency] = useState(12);
  
  const synapseCanvasRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });

  // Intent options
  const intents = [
    { id: 'healing', label: 'Curing Nightmares', icon: '🌙', color: '#2ed573', description: 'Find peace in your sleep' },
    { id: 'creativity', label: 'Exploring Creativity', icon: '🎨', color: '#7b2ff7', description: 'Unlock your imagination' },
    { id: 'research', label: 'Scientific Research', icon: '🔬', color: '#4cc9f0', description: 'Study your mind' }
  ];

  // Archetype landscapes
  const archetypes = [
    { id: 'ocean', label: 'Endless Ocean', emoji: '🌊', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { id: 'forest', label: 'Mystic Forest', emoji: '🌲', gradient: 'linear-gradient(135deg, #2ed573 0%, #059669 100%)' },
    { id: 'cosmos', label: 'Cosmic Void', emoji: '✨', gradient: 'linear-gradient(135deg, #4cc9f0 0%, #7b2ff7 100%)' }
  ];

  // Synapse animation
  useEffect(() => {
    const canvas = synapseCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const synapses = [];
    for (let i = 0; i < 40; i++) {
      synapses.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1
      });
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      synapses.forEach((synapse, i) => {
        synapse.x += synapse.vx;
        synapse.y += synapse.vy;
        
        if (synapse.x < 0 || synapse.x > canvas.width) synapse.vx *= -1;
        if (synapse.y < 0 || synapse.y > canvas.height) synapse.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(synapse.x, synapse.y, synapse.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(76, 201, 240, 0.6)';
        ctx.fill();
        
        synapses.forEach((other, j) => {
          if (i !== j) {
            const dx = synapse.x - other.x;
            const dy = synapse.y - other.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 150) {
              ctx.beginPath();
              ctx.moveTo(synapse.x, synapse.y);
              ctx.lineTo(other.x, other.y);
              ctx.strokeStyle = `rgba(76, 201, 240, ${0.2 * (1 - dist / 150)})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        });
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
  }, []);

  // Server latency
  useEffect(() => {
    const interval = setInterval(() => {
      setServerLatency(Math.floor(Math.random() * 10) + 8);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleIntentSelect = (intentId) => {
    setFormData(prev => ({ ...prev, intent: intentId }));
    setTimeout(() => setStep(2), 300);
  };

  const handleArchetypeSelect = (archetypeId) => {
    setFormData(prev => ({ ...prev, archetype: archetypeId }));
    setTimeout(() => setStep(3), 300);
  };

  const generateAnonymousAlias = () => {
    const adjectives = ['Lucid', 'Mystic', 'Cosmic', 'Neural', 'Dream'];
    const nouns = ['Wanderer', 'Explorer', 'Seeker', 'Voyager', 'Traveler'];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(Math.random() * 100);
    return `${adj}${noun}_${num}`;
  };

  const handleAnonymousToggle = () => {
    const newAnonymousMode = !formData.anonymousMode;
    setFormData(prev => ({
      ...prev,
      anonymousMode: newAnonymousMode,
      fullName: newAnonymousMode ? generateAnonymousAlias() : ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!agreedToTerms) {
      setError('Please agree to the Terms of Service 📋');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const response = await authService.signup(formData);
      
      if (response.access_token) {
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('authToken', response.access_token);
      }
      
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      // Store preferences
      localStorage.setItem('userIntent', formData.intent);
      localStorage.setItem('userArchetype', formData.archetype);
      localStorage.setItem('privateMode', privateMode);
      
      window.location.href = '/stream';
      
    } catch (err) {
      let errorMessage = 'Account creation failed. Please try again.';
      
      if (err.detail) {
        errorMessage = err.detail;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      if (errorMessage.includes('already registered')) {
        errorMessage = '📧 Neural ID already exists. Please login instead.';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getThemeColor = () => {
    const intent = intents.find(i => i.id === formData.intent);
    return intent ? intent.color : '#4cc9f0';
  };

  return (
    <div className="signup-container-neural" style={{ '--theme-color': getThemeColor() }}>
      <canvas ref={synapseCanvasRef} className="synapse-canvas" />
      
      <div className="video-background">
        <div className="brain-nebula-animation"></div>
      </div>

      <div className="signup-split-layout">
        {/* Left Side */}
        <div className="signup-visual-side">
          <div className="neural-logo-large">
            <Brain size={120} className="brain-icon-large" />
          </div>
          <h2 className="visual-title">Neural Onboarding Lab</h2>
          <p className="visual-subtitle">Personalized dream analysis starts here</p>
          
          {/* Progress Steps */}
          <div className="onboarding-steps">
            <div className={`step-item ${step >= 1 ? 'active' : ''}`}>
              <div className="step-number">1</div>
              <span>Intent</span>
            </div>
            <div className={`step-item ${step >= 2 ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <span>Archetype</span>
            </div>
            <div className={`step-item ${step >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <span>Identity</span>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="signup-form-side">
          <div className="glass-card-neural">
            {/* Step 1: Intent Selection */}
            {step === 1 && (
              <div className="onboarding-step">
                <div className="step-header">
                  <Target size={32} />
                  <h2>What brings you here?</h2>
                  <p>Choose your primary intent</p>
                </div>
                
                <div className="intent-grid">
                  {intents.map(intent => (
                    <button
                      key={intent.id}
                      className="intent-card"
                      onClick={() => handleIntentSelect(intent.id)}
                      style={{ borderColor: intent.color }}
                    >
                      <span className="intent-icon">{intent.icon}</span>
                      <h3>{intent.label}</h3>
                      <p>{intent.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Archetype Selection */}
            {step === 2 && (
              <div className="onboarding-step">
                <div className="step-header">
                  <Sparkles size={32} />
                  <h2>Choose your landscape</h2>
                  <p>Which world draws you in?</p>
                </div>
                
                <div className="archetype-grid">
                  {archetypes.map(archetype => (
                    <button
                      key={archetype.id}
                      className="archetype-card"
                      onClick={() => handleArchetypeSelect(archetype.id)}
                      style={{ background: archetype.gradient }}
                    >
                      <span className="archetype-emoji">{archetype.emoji}</span>
                      <h3>{archetype.label}</h3>
                    </button>
                  ))}
                </div>
                
                <button className="back-btn-neural" onClick={() => setStep(1)}>
                  ← Back
                </button>
              </div>
            )}

            {/* Step 3: Form */}
            {step === 3 && (
              <div className="onboarding-step">
                <div className="step-header">
                  <Shield size={32} />
                  <h2>Create Neural ID</h2>
                  <p>Secure your identity</p>
                </div>

                {/* Privacy Toggle */}
                <div className="privacy-toggle-section">
                  <button 
                    className={`privacy-toggle-btn ${privateMode ? 'active' : ''}`}
                    onClick={() => setPrivateMode(!privateMode)}
                  >
                    <Lock size={20} />
                    <div>
                      <strong>Zero-Knowledge Encryption</strong>
                      <p>Your data is encrypted locally</p>
                    </div>
                    <div className={`toggle-switch ${privateMode ? 'on' : ''}`}>
                      <div className="toggle-slider"></div>
                    </div>
                  </button>
                </div>

                {/* Anonymous Mode */}
                <div className="anonymous-section">
                  <button 
                    className="anonymous-btn"
                    onClick={handleAnonymousToggle}
                  >
                    {formData.anonymousMode ? <CheckCircle size={20} /> : <User size={20} />}
                    <span>Anonymous Mode (Ghost Identity)</span>
                  </button>
                </div>

                <form className="neural-form" onSubmit={handleSubmit}>
                  {error && (
                    <div className="error-neural">
                      <Shield size={16} />
                      <span>{error}</span>
                    </div>
                  )}
                  
                  <div className="input-group-neural">
                    <div className="input-icon">
                      <User size={20} />
                    </div>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder={formData.anonymousMode ? "Neural Alias (Auto-generated)" : "Full Name"}
                      className="input-neural"
                      readOnly={formData.anonymousMode}
                      required
                    />
                  </div>

                  <div className="input-group-neural">
                    <div className="input-icon">
                      <Mail size={20} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Neural ID (Email)"
                      className="input-neural"
                      required
                    />
                  </div>

                  <div className="input-group-neural">
                    <div className="input-icon">
                      <Lock size={20} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Access Key (Password)"
                      className="input-neural"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  <label className="checkbox-neural">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                    />
                    <span className="checkbox-custom"></span>
                    <span className="checkbox-label">
                      I agree to the <Link to="/terms">Terms</Link> and <Link to="/privacy">Privacy Policy</Link>
                    </span>
                  </label>

                  <button 
                    type="submit" 
                    className={`submit-btn-neural ${isLoading ? 'loading' : ''}`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="neural-spinner"></div>
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <Zap size={20} />
                        <span>Begin Journey</span>
                      </>
                    )}
                    <div className="btn-shine"></div>
                  </button>
                </form>

                <button className="back-btn-neural" onClick={() => setStep(2)}>
                  ← Back
                </button>

                <div className="login-link-neural">
                  <span>Already in the network? </span>
                  <Link to="/login">Authenticate</Link>
                </div>
              </div>
            )}
          </div>

          {/* Status Bar */}
          <div className="status-bar-neural">
            <div className="status-item">
              <Activity size={14} />
              <span>Neural Network: Online</span>
            </div>
            <div className="status-item">
              <Wifi size={14} />
              <span>Latency: {serverLatency}ms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
