import { useState, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { predictDream } from "../api/api";
import EmotionalValenceMap from "../components/EmotionalValenceMap";
import NeuralScanAnimation from "../components/NeuralScanAnimation";
import { useMoodSync } from "../hooks/useMoodSync";
import "../styles/Decode.css";
import "../styles/global-background.css";

export default function Decode() {
  const MotionDiv = motion.div;
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const [expanded, setExpanded] = useState(null);
  const [dreamImage, setDreamImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  
  // Mood sync hook - changes background based on brain waves
  useMoodSync(result?.bands, !!result);

  const handleUpload = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    
    // Start neural scan animation
    setScanning(true);
    setScanProgress(0);
    setError(null);
    setDreamImage(null);
    
    // Simulate scanning progress
    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + 5;
      });
    }, 200);
    
    try {
      const res = await predictDream(f);
      setScanProgress(100);
      setTimeout(() => {
        setResult(res.data);
        setScanning(false);
      }, 500);
    } catch (err) {
      clearInterval(progressInterval);
      setScanning(false);
      setError(
        err?.response?.data?.detail ||
        "Failed to analyze file. Ensure backend is running and data format is valid."
      );
    }
  };

  const generateDreamImage = async () => {
    if (!result) return;
    
    setImageLoading(true);
    setImageError(null);
    
    try {
      const response = await fetch('http://localhost:8000/dream-image/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dream_type: result.dream,
          confidence: result.confidence,
          bands: result.bands,
          probabilities: result.probabilities
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setDreamImage(data);
      } else {
        setImageError(data.error || 'Failed to generate dream image');
      }
    } catch (err) {
      console.error('Dream image generation error:', err);
      setImageError('Failed to connect to image generation service');
    } finally {
      setImageLoading(false);
    }
  };

  const signalStats = (arr = []) => {
    if (!arr.length) return { mean: 0, std: 0 };
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    const std = Math.sqrt(arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / arr.length);
    return { mean, std };
  };

  const stats = result ? signalStats(result.signal || []) : { mean: 0, std: 0 };
  const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 25;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return (
      <g>
        <text
          x={x}
          y={y}
          fill="#ffffff"
          fontSize={13}
          fontWeight={700}
          textAnchor={x > cx ? "start" : "end"}
          dominantBaseline="central"
        >
          {name}
        </text>
        <text
          x={x}
          y={y + 16}
          fill="#4cc9f0"
          fontSize={12}
          fontWeight={600}
          textAnchor={x > cx ? "start" : "end"}
          dominantBaseline="central"
        >
          {`${(percent * 100).toFixed(1)}%`}
        </text>
      </g>
    );
  };

  return (
    <div className="decode-page">
      {/* Background Elements */}
      <div className="page-background"></div>
      <div className="neural-particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>
      <div className="neural-connections">
        <div className="connection-line"></div>
        <div className="connection-line"></div>
        <div className="connection-line"></div>
      </div>

      <motion.div 
        className="decode-header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1>🔬 Neural Architecture Decoding</h1>
        <p>Upload your telemetry data to translate biometric brainwaves into psychological narratives.</p>
      </motion.div>

      <MotionDiv
        className="upload-card"
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        whileHover={{ scale: 1.02, y: -5 }}
      >
        <motion.div 
          className="upload-icon"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5, type: "spring", stiffness: 200 }}
        >
          ⬆️
        </motion.div>
        <motion.div 
          className="upload-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          Initialize Data Stream
        </motion.div>
        <motion.div 
          className="upload-sub"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          Accepted formats: .csv, .txt (microvolt values). Secure, local-first processing.
        </motion.div>
        <motion.button 
          className="upload-btn" 
          onClick={() => fileInputRef.current?.click()}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Select Data Node
        </motion.button>
        <input ref={fileInputRef} type="file" accept=".csv,.txt" hidden onChange={handleUpload} />
      </MotionDiv>

      {error && (
        <motion.div 
          className="error-card"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <strong>Upload Error</strong> — {error}
        </motion.div>
      )}

      {loading && (
        <motion.div 
          className="loading-box"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="loader"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            style={{ marginTop: 12 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Analyzing your dream data…
          </motion.div>
        </motion.div>
      )}

      {result && !loading && (
        <>
          {/* MAIN RESULT CARD */}
          <motion.div 
            className="result-hero"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="result-hero-content">
              <div className="result-icon">🧠</div>
              <div className="result-text">
                <h2>Dream Analysis Complete</h2>
                <p className="dream-type">{result.dream}</p>
              </div>
              <div className="confidence-circle">
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8"/>
                  <motion.circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    fill="none" 
                    stroke="url(#confidenceGradient)" 
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - result.confidence / 100)}`}
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 45 * (1 - result.confidence / 100) }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                  <defs>
                    <linearGradient id="confidenceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#4cc9f0" />
                      <stop offset="100%" stopColor="#7b2ff7" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="confidence-text">
                  <span className="confidence-value">{result.confidence}%</span>
                  <span className="confidence-label">Confidence</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* STATS OVERVIEW */}
          <motion.div 
            className="stats-overview"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.div 
              className="stat-box"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <span className="stat-value">{stats.mean.toFixed(3)}</span>
                <span className="stat-label">Mean μV</span>
              </div>
            </motion.div>

            <motion.div 
              className="stat-box"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="stat-icon">📈</div>
              <div className="stat-content">
                <span className="stat-value">{stats.std.toFixed(3)}</span>
                <span className="stat-label">Std Deviation</span>
              </div>
            </motion.div>

            <motion.div 
              className="stat-box"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="stat-icon">🔢</div>
              <div className="stat-content">
                <span className="stat-value">{(result.signal || []).length}</span>
                <span className="stat-label">Data Points</span>
              </div>
            </motion.div>

            <motion.div 
              className="stat-box"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="stat-icon">⚡</div>
              <div className="stat-content">
                <span className="stat-value">{Object.entries(result.bands).sort((a,b)=>b[1]-a[1])[0][0].toUpperCase()}</span>
                <span className="stat-label">Dominant Band</span>
              </div>
            </motion.div>
          </motion.div>

          {/* CHARTS SECTION */}
          <motion.div 
            className="analysis-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.h2 
              className="section-title"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              Neural Activity Analysis
            </motion.h2>

            <div className="charts-container">
              {/* EEG CHART - FULL WIDTH */}
              <motion.div 
                className="chart-wrapper full-width" 
                onClick={() => setExpanded("eeg")}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                whileHover={{ scale: 1.01, y: -5 }}
              >
                <div className="chart-header">
                  <div className="chart-title">
                    <span className="chart-icon">📈</span>
                    <h3>EEG Signal Waveform</h3>
                  </div>
                  <button className="expand-btn">🔍 Expand</button>
                </div>
                <div className="chart-body">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={result.signal.map((v, i) => ({ x: i, y: v }))}>
                      <defs>
                        <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#4cc9f0" />
                          <stop offset="50%" stopColor="#7b2ff7" />
                          <stop offset="100%" stopColor="#ff006e" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                      <XAxis dataKey="x" stroke="#8892b0" fontSize={12} />
                      <YAxis stroke="#8892b0" fontSize={12} />
                      <Tooltip
                        contentStyle={{ 
                          background: "rgba(255, 255, 255, 0.95)", 
                          border: "2px solid rgba(76, 201, 240, 0.5)", 
                          borderRadius: 12, 
                          color: "#000000",
                          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                          padding: "12px 16px",
                          fontWeight: 600
                        }}
                        labelStyle={{ color: "#000000", fontWeight: 700, fontSize: 14 }}
                        itemStyle={{ color: "#000000", fontWeight: 600 }}
                        cursor={{ stroke: "#4cc9f0", strokeWidth: 2 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="y" 
                        stroke="url(#lineGradient)" 
                        strokeWidth={2.5} 
                        dot={false}
                        animationDuration={2000}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* BAND CHART AND PIE CHART - SIDE BY SIDE */}
              <motion.div 
                className="chart-wrapper" 
                onClick={() => setExpanded("bands")}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                whileHover={{ scale: 1.01, y: -5 }}
              >
                <div className="chart-header">
                  <div className="chart-title">
                    <span className="chart-icon">📊</span>
                    <h3>Frequency Bands</h3>
                  </div>
                  <button className="expand-btn">🔍 Expand</button>
                </div>
                <div className="chart-body">
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart
                      data={Object.keys(result.bands).map(k => ({ 
                        name: k.toUpperCase(), 
                        value: result.bands[k],
                        fill: k === 'delta' ? '#4cc9f0' : k === 'theta' ? '#7b2ff7' : k === 'alpha' ? '#ffbe0b' : k === 'beta' ? '#ff006e' : '#00d4ff'
                      }))}
                    >
                      <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                      <XAxis dataKey="name" stroke="#ffffff" fontSize={13} fontWeight={600} />
                      <YAxis stroke="#8892b0" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          background: "rgba(255, 255, 255, 0.95)", 
                          border: "2px solid rgba(76, 201, 240, 0.5)", 
                          borderRadius: 12, 
                          color: "#000000",
                          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                          padding: "12px 16px",
                          fontWeight: 600
                        }}
                        labelStyle={{ color: "#000000", fontWeight: 700, fontSize: 14 }}
                        itemStyle={{ color: "#000000", fontWeight: 600 }}
                      />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]} animationDuration={1500}>
                        {Object.keys(result.bands).map((k, index) => (
                          <Cell 
                            key={index} 
                            fill={k === 'delta' ? '#4cc9f0' : k === 'theta' ? '#7b2ff7' : k === 'alpha' ? '#ffbe0b' : k === 'beta' ? '#ff006e' : '#00d4ff'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  
                  {/* Custom Legend for Bands */}
                  <div className="custom-legend">
                    {Object.keys(result.bands).map((band, index) => (
                      <div key={band} className="legend-item">
                        <div 
                          className="legend-color" 
                          style={{ 
                            backgroundColor: band === 'delta' ? '#4cc9f0' : band === 'theta' ? '#7b2ff7' : band === 'alpha' ? '#ffbe0b' : band === 'beta' ? '#ff006e' : '#00d4ff'
                          }}
                        ></div>
                        <span className="legend-label">{band.toUpperCase()}</span>
                        <span className="legend-value">{result.bands[band].toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="chart-wrapper" 
                onClick={() => setExpanded("pie")}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                whileHover={{ scale: 1.01, y: -5 }}
              >
                <div className="chart-header">
                  <div className="chart-title">
                    <span className="chart-icon">🥧</span>
                    <h3>Dream Classification</h3>
                  </div>
                  <button className="expand-btn">🔍 Expand</button>
                </div>
                <div className="chart-body">
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie
                        data={Object.keys(result.probabilities).map((k, i) => ({ 
                          name: k, 
                          value: result.probabilities[k],
                          fill: ["#4cc9f0", "#7b2ff7", "#ffbe0b", "#ff006e"][i]
                        }))}
                        innerRadius={60}
                        outerRadius={95}
                        dataKey="value"
                        label={renderPieLabel}
                        labelLine={{ stroke: 'rgba(255,255,255,0.5)', strokeWidth: 1 }}
                        animationDuration={1500}
                      >
                        {["#4cc9f0", "#7b2ff7", "#ffbe0b", "#ff006e"].map((c, i) => (
                          <Cell key={i} fill={c} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          background: "rgba(255, 255, 255, 0.95)", 
                          border: "2px solid rgba(76, 201, 240, 0.5)", 
                          borderRadius: 12, 
                          color: "#000000",
                          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                          padding: "12px 16px",
                          fontWeight: 600
                        }}
                        labelStyle={{ color: "#000000", fontWeight: 700, fontSize: 14 }}
                        itemStyle={{ color: "#000000", fontWeight: 600 }}
                        formatter={(value) => `${(value * 100).toFixed(1)}%`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  
                  {/* Custom Legend for Pie Chart */}
                  <div className="custom-legend">
                    {Object.keys(result.probabilities).map((prob, index) => (
                      <div key={prob} className="legend-item">
                        <div 
                          className="legend-color" 
                          style={{ 
                            backgroundColor: ["#4cc9f0", "#7b2ff7", "#ffbe0b", "#ff006e"][index]
                          }}
                        ></div>
                        <span className="legend-label">{prob}</span>
                        <span className="legend-value">{(result.probabilities[prob] * 100).toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* NEW: Emotional Valence Map */}
          <EmotionalValenceMap 
            bands={result.bands} 
            dreamType={result.dream} 
          />

          {/* PDF Report Download Button */}
          <motion.div
            className="pdf-report-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <motion.button
              className="pdf-report-btn"
              onClick={() => {
                const patterns = JSON.parse(localStorage.getItem('dreamPatterns') || '[]');
                const lexicon = JSON.parse(localStorage.getItem('dreamLexicon') || '[]');
                
                // Import and call PDF generator
                import('../utils/pdfReport').then(module => {
                  module.generateDreamReportPDF(result, patterns, lexicon);
                });
              }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="pdf-icon">📄</span>
              <span className="pdf-text">
                <strong>Download Dream Analysis Report</strong>
                <small>Complete pattern analytics & insights in PDF format</small>
              </span>
            </motion.button>
          </motion.div>

          {/* DREAM IMAGE GENERATION SECTION */}
          <motion.div 
            className="dream-image-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
          >
            <motion.h2 
              className="section-title"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
            >
              🎨 Dream Visualization
            </motion.h2>

            {!dreamImage && !imageLoading && (
              <motion.div 
                className="generate-image-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.3 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="generate-image-content">
                  <div className="generate-icon">🌌</div>
                  <h3>Generate AI Dream Image</h3>
                  <p>Create a visual representation of your dream based on your brain wave patterns</p>
                  <motion.button 
                    className="generate-image-btn"
                    onClick={generateDreamImage}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ✨ Generate Dream Image
                  </motion.button>
                  <p className="generate-note">
                    Uses AI to interpret your EEG data (alpha, beta, theta, delta waves) into visual imagery
                  </p>
                </div>
              </motion.div>
            )}

            {imageLoading && (
              <motion.div 
                className="image-loading-box"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div 
                  className="loader"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <p>Generating your dream image...</p>
                <p className="loading-subtext">This may take 10-30 seconds</p>
              </motion.div>
            )}

            {imageError && (
              <motion.div 
                className="image-error-card"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <strong>⚠️ Image Generation Error</strong>
                <p>{imageError}</p>
                <button onClick={generateDreamImage} className="retry-btn">
                  🔄 Try Again
                </button>
              </motion.div>
            )}

            {dreamImage && dreamImage.success && (
              <motion.div 
                className="dream-image-result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="dream-image-container">
                  <img 
                    src={dreamImage.image_base64 || dreamImage.image_url} 
                    alt="AI Generated Dream Visualization" 
                    className="dream-image"
                  />
                  <div className="image-overlay">
                    <span className="image-provider">Generated by {dreamImage.provider}</span>
                  </div>
                </div>

                <div className="dream-image-details">
                  <div className="detail-section">
                    <h4>🧠 AI Prompt Used</h4>
                    <p className="prompt-text">{dreamImage.prompt}</p>
                  </div>

                  <div className="detail-section">
                    <h4>📊 Interpretation</h4>
                    <pre className="interpretation-text">{dreamImage.interpretation}</pre>
                  </div>

                  <div className="image-actions">
                    <button 
                      onClick={generateDreamImage} 
                      className="action-btn regenerate"
                    >
                      🔄 Generate Another
                    </button>
                    <a 
                      href={dreamImage.image_base64 || dreamImage.image_url} 
                      download="dream-visualization.png"
                      className="action-btn download"
                    >
                      💾 Download Image
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          <AnimatePresence>
            {expanded && (
              <MotionDiv
                className="modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setExpanded(null)}
              >
                <MotionDiv
                  className="modal-content-decode"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button className="close-btn-decode" onClick={() => setExpanded(null)}>✕</button>
                  {expanded === "eeg" && (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={result.signal.map((v, i) => ({ x: i, y: v }))}>
                        <defs>
                          <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#4cc9f0" />
                            <stop offset="50%" stopColor="#7b2ff7" />
                            <stop offset="100%" stopColor="#ff006e" />
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />
                        <XAxis dataKey="x" stroke="#c7d2fe" />
                        <YAxis stroke="#c7d2fe" />
                        <Tooltip contentStyle={{ background: "rgba(255, 255, 255, 0.95)", border: "2px solid #4cc9f0", borderRadius: 12, color: "#000000", fontWeight: 600 }} labelStyle={{ color: "#000000", fontWeight: 700 }} itemStyle={{ color: "#000000" }} cursor={{ stroke: "#4cc9f0", strokeWidth: 2 }} />
                        <Line type="monotone" dataKey="y" stroke="url(#lineGradient)" strokeWidth={3} dot={false} isAnimationActive />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                  {expanded === "bands" && (
                    <>
                      <ResponsiveContainer width="100%" height="80%">
                        <BarChart data={Object.keys(result.bands).map(k => ({ name: k.toUpperCase(), value: result.bands[k] }))}>
                          <CartesianGrid stroke="rgba(255,255,255,0.1)" />
                          <XAxis dataKey="name" stroke="#ffffff" fontSize={16} fontWeight={600} />
                          <YAxis stroke="#c7d2fe" fontSize={14} />
                          <Tooltip 
                            contentStyle={{ 
                              background: "rgba(255, 255, 255, 0.95)", 
                              borderRadius: 12, 
                              border: "2px solid #4cc9f0", 
                              color: "#000000",
                              fontSize: 16,
                              fontWeight: 600
                            }}
                            labelStyle={{ color: "#000000", fontWeight: 700 }}
                            itemStyle={{ color: "#000000", fontWeight: 600 }}
                          />
                          <Bar dataKey="value" radius={[10, 10, 0, 0]} isAnimationActive>
                            {Object.keys(result.bands).map((k, index) => (
                              <Cell 
                                key={index} 
                                fill={k === 'delta' ? '#4cc9f0' : k === 'theta' ? '#7b2ff7' : k === 'alpha' ? '#ffbe0b' : k === 'beta' ? '#ff006e' : '#00d4ff'}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                      <div className="modal-legend">
                        {Object.keys(result.bands).map((band, index) => (
                          <div key={band} className="modal-legend-item">
                            <div 
                              className="modal-legend-color" 
                              style={{ 
                                backgroundColor: band === 'delta' ? '#4cc9f0' : band === 'theta' ? '#7b2ff7' : band === 'alpha' ? '#ffbe0b' : band === 'beta' ? '#ff006e' : '#00d4ff'
                              }}
                            ></div>
                            <span className="modal-legend-label">{band.toUpperCase()}</span>
                            <span className="modal-legend-value">{result.bands[band].toFixed(3)}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  {expanded === "pie" && (
                    <>
                      <ResponsiveContainer width="100%" height="80%">
                        <PieChart>
                          <Pie 
                            data={Object.keys(result.probabilities).map(k => ({ name: k, value: result.probabilities[k] }))} 
                            innerRadius={120} 
                            outerRadius={200} 
                            dataKey="value"
                            label={renderPieLabel}
                            labelLine={{ stroke: 'rgba(255,255,255,0.5)', strokeWidth: 2 }}
                          >
                            {["#4cc9f0", "#7b2ff7", "#ffbe0b", "#ff006e"].map((c, i) => (
                              <Cell key={i} fill={c} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ 
                              background: "rgba(255, 255, 255, 0.95)", 
                              border: "2px solid #4cc9f0", 
                              borderRadius: 12, 
                              color: "#000000",
                              fontSize: 16,
                              fontWeight: 600
                            }}
                            labelStyle={{ color: "#000000", fontWeight: 700 }}
                            itemStyle={{ color: "#000000", fontWeight: 600 }}
                            formatter={(value) => `${(value * 100).toFixed(1)}%`}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="modal-legend">
                        {Object.keys(result.probabilities).map((prob, index) => (
                          <div key={prob} className="modal-legend-item">
                            <div 
                              className="modal-legend-color" 
                              style={{ 
                                backgroundColor: ["#4cc9f0", "#7b2ff7", "#ffbe0b", "#ff006e"][index]
                              }}
                            ></div>
                            <span className="modal-legend-label">{prob}</span>
                            <span className="modal-legend-value">{(result.probabilities[prob] * 100).toFixed(1)}%</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </MotionDiv>
              </MotionDiv>
            )}
          </AnimatePresence>
        </>
      )}

      {/* NEW: Neural Scan Animation */}
      <NeuralScanAnimation 
        isScanning={scanning} 
        progress={scanProgress} 
      />
    </div>
  );
}
