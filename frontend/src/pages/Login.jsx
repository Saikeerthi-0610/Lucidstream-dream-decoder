import React, { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { 
  Brain, Lock, Mail, Eye, EyeOff, Fingerprint, 
  Shield, Zap, Activity, Wifi
} from "lucide-react";
import "../styles/login.css";
import "../styles/dark-theme-background.css";
import { authService } from "../api/auth";

export default function Login() {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [providers, setProviders] = useState({ google: false, github: false, facebook: false, linkedin: false });
  const [neuralScanActive, setNeuralScanActive] = useState(false);
  const [serverLatency, setServerLatency] = useState(12);
  const [isVaultOpening, setIsVaultOpening] = useState(false);
  const [showErrorGlitch, setShowErrorGlitch] = useState(false);
  
  const synapseCanvasRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });

  // Synapse background animation
  useEffect(() => {
    const canvas = synapseCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const synapses = [];
    const numSynapses = 50;
    
    for (let i = 0; i < numSynapses; i++) {
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
      
      // Update and draw synapses
      synapses.forEach((synapse, i) => {
        synapse.x += synapse.vx;
        synapse.y += synapse.vy;
        
        if (synapse.x < 0 || synapse.x > canvas.width) synapse.vx *= -1;
        if (synapse.y < 0 || synapse.y > canvas.height) synapse.vy *= -1;
        
        // Draw synapse
        ctx.beginPath();
        ctx.arc(synapse.x, synapse.y, synapse.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(76, 201, 240, 0.6)';
        ctx.fill();
        
        // Draw connections to nearby synapses
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
        
        // Draw connection to mouse
        const dx = synapse.x - mousePos.current.x;
        const dy = synapse.y - mousePos.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 200) {
          ctx.beginPath();
          ctx.moveTo(synapse.x, synapse.y);
          ctx.lineTo(mousePos.current.x, mousePos.current.y);
          ctx.strokeStyle = `rgba(123, 47, 247, ${0.4 * (1 - dist / 200)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Server latency simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setServerLatency(Math.floor(Math.random() * 10) + 8);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const data = await authService.getProviders();
        setProviders({
          google: !!data.google,
          github: !!data.github,
          facebook: !!data.facebook,
          linkedin: !!data.linkedin
        });
      } catch {
        setProviders({ google: false, github: false, facebook: false, linkedin: false });
      }
    };
    fetchProviders();
  }, []);

  useEffect(() => {
    const err = searchParams.get('error');
    if (err) {
      setShowErrorGlitch(true);
      setTimeout(() => setShowErrorGlitch(false), 500);
      
      if (err === 'google_oauth_not_configured') {
        setError('Google login is not configured on this server.');
      } else if (err === 'github_oauth_not_configured') {
        setError('GitHub login is not configured on this server.');
      } else {
        setError('Authentication error. Please try again.');
      }
    }
  }, [searchParams]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setNeuralScanActive(true);
    setError('');
    
    try {
      const response = await authService.login(formData);
      
      if (response.access_token) {
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('authToken', response.access_token);
      }
      
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      // Vault opening animation
      setIsVaultOpening(true);
      setTimeout(() => {
        window.location.href = '/stream';
      }, 1000);
      
    } catch (err) {
      setShowErrorGlitch(true);
      setTimeout(() => setShowErrorGlitch(false), 500);
      
      let errorMessage = 'Login failed. Please try again.';
      
      if (err.detail) {
        errorMessage = err.detail;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      if (errorMessage.includes('Incorrect') || errorMessage.includes('password')) {
        errorMessage = '🔒 Neural Mismatch: Incorrect credentials';
      } else if (errorMessage.includes('not found')) {
        errorMessage = '👤 Identity not found in neural network';
      } else if (errorMessage.includes('network')) {
        errorMessage = '🌐 Cannot establish neural connection';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setNeuralScanActive(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setIsLoading(true);
    setError('');
    
    try {
      const API_BASE_URL = 'http://localhost:8000';
      
      if (provider === 'Google') {
        window.location.href = `${API_BASE_URL}/auth/google/authorize`;
      } else if (provider === 'GitHub') {
        window.location.href = `${API_BASE_URL}/auth/github/authorize`;
      }
      
    } catch (err) {
      setError(`${provider} authentication failed. Please try again.`);
      setIsLoading(false);
    }
  };

  const handleBiometricLogin = () => {
    setNeuralScanActive(true);
    setTimeout(() => {
      alert('Biometric authentication coming soon! 🔐');
      setNeuralScanActive(false);
    }, 2000);
  };

  return (
    <div className={`login-container-neural ${showErrorGlitch ? 'glitch-effect' : ''}`}>
      {/* Synapse Canvas Background */}
      <canvas ref={synapseCanvasRef} className="synapse-canvas" />
      
      {/* Video Background */}
      <div className="video-background">
        <div className="brain-nebula-animation"></div>
      </div>

      {/* Main Content */}
      <div className="login-split-layout">
        {/* Left Side - Visual */}
        <div className="login-visual-side">
          <div className="neural-logo-large">
            <Brain size={120} className="brain-icon-large" />
          </div>
          <h2 className="visual-title">Neural Signature Authentication</h2>
          <p className="visual-subtitle">Secure biometric-first access to your subconscious data</p>
        </div>

        {/* Right Side - Form */}
        <div className="login-form-side">
          <div className={`glass-card-neural ${isVaultOpening ? 'vault-opening' : ''}`}>
            {/* Header */}
            <div className="neural-header">
              <div className="neural-scan-indicator">
                <Fingerprint size={32} className={neuralScanActive ? 'scanning' : ''} />
                {neuralScanActive && <div className="scan-ring"></div>}
              </div>
              <h1 className="neural-title">Welcome Back</h1>
              <p className="neural-subtitle">Authenticate your neural signature</p>
            </div>

            {/* Biometric Login */}
            <button 
              className="biometric-login-btn"
              onClick={handleBiometricLogin}
              type="button"
            >
              <Fingerprint size={24} />
              <span>Neural Scan Login</span>
              <div className="btn-glow"></div>
            </button>

            <div className="divider-neural">
              <span>or use credentials</span>
            </div>

            {/* Login Form */}
            <form className="neural-form" onSubmit={handleSubmit}>
              {error && (
                <div className="error-neural">
                  <Shield size={16} />
                  <span>{error}</span>
                </div>
              )}
              
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

              <Link to="/forgot-password" className="forgot-link-neural">
                <Zap size={14} />
                Reset Access Key
              </Link>

              <button 
                type="submit" 
                className={`submit-btn-neural ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="neural-spinner"></div>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <Shield size={20} />
                    <span>Authenticate</span>
                  </>
                )}
                <div className="btn-shine"></div>
              </button>
            </form>

            {/* Social Login */}
            <div className="social-neural">
              <p className="social-label">Quick Access</p>
              <div className="social-buttons-neural">
                <button 
                  className="social-btn-neural google"
                  onClick={() => handleSocialLogin('Google')}
                  disabled={isLoading}
                >
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </button>

                <button 
                  className="social-btn-neural github"
                  onClick={() => handleSocialLogin('GitHub')}
                  disabled={isLoading}
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Signup Link */}
            <div className="signup-link-neural">
              <span>New to the network? </span>
              <Link to="/signup">Create Neural ID</Link>
            </div>
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
