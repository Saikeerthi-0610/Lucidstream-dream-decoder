import { useState, useEffect, useRef } from "react";
import { 
  Mic, MicOff, Pencil, Lock, Unlock, Moon, Sun, 
  Heart, Brain, Zap, Eye, Sparkles, Tag, Clock,
  Thermometer, AlertCircle, CheckCircle, X, Save, Trash2
} from "lucide-react";
import "./DreamJournal.css";
import "../styles/dark-theme-background.css";

const DreamJournal = () => {
  // Core state
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    atmosphere: 'bright',
    title: '',
    narrative: '',
    voiceMemo: null,
    sketch: null
  });
  
  // UI state
  const [entries, setEntries] = useState([]);
  const [showEntries, setShowEntries] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [etherealMode, setEtherealMode] = useState(false);
  const [ghostMode, setGhostMode] = useState(false);
  const [privacyLocked, setPrivacyLocked] = useState(false);
  
  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const recordingIntervalRef = useRef(null);
  
  // Sketch state
  const [showSketchpad, setShowSketchpad] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);
  const [sketchData, setSketchData] = useState(null);
  
  // Smart tagging state
  const [autoTags, setAutoTags] = useState({
    emotions: [],
    themes: [],
    entities: []
  });
  
  // Neural metadata state
  const [neuralData, setNeuralData] = useState({
    remCycle: null,
    heartRate: null,
    sleepQuality: null,
    moonPhase: null,
    weather: null,
    temperature: null
  });
  
  // AI prompts state
  const [aiPrompt, setAiPrompt] = useState(null);
  const [dailyIntention, setDailyIntention] = useState(null);

  // Sample entries
  const sampleEntries = [
    {
      id: 1,
      date: '2024-02-03',
      title: 'Flying Over Mountains',
      atmosphere: 'bright',
      narrative: 'I was soaring above snow-capped peaks with complete control over my flight...',
      timestamp: '2024-02-03T08:30:00Z'
    }
  ];

  // Check time for ethereal mode
  useEffect(() => {
    const checkTime = () => {
      const hour = new Date().getHours();
      if (hour >= 22 || hour < 6) {
        setEtherealMode(true);
      } else {
        setEtherealMode(false);
      }
    };
    
    checkTime();
    const interval = setInterval(checkTime, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Simulate neural data sync
  useEffect(() => {
    setNeuralData({
      remCycle: 'REM 3',
      heartRate: 62,
      sleepQuality: 85,
      moonPhase: 'Waxing Gibbous 🌔',
      weather: 'Clear ☀️',
      temperature: 18
    });
    setEntries(sampleEntries);
  }, []);

  // Voice recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const audioChunks = [];
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        setFormData(prev => ({ ...prev, voiceMemo: audioBlob }));
        
        setTimeout(() => {
          analyzeVoiceContent("I was flying over mountains with a giant red bird");
        }, 1000);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      clearInterval(recordingIntervalRef.current);
      
      if (navigator.vibrate) {
        navigator.vibrate([50, 100, 50]);
      }
    }
  };

  const analyzeVoiceContent = (text) => {
    const entities = extractEntities(text);
    const emotions = detectEmotions(text);
    const themes = detectThemes(text);
    
    setAutoTags({ entities, emotions, themes });
    generateAIPrompt(text, entities);
  };

  const extractEntities = (text) => {
    const keywords = [];
    if (text.includes('flying')) keywords.push({ text: 'flying', color: '#4cc9f0' });
    if (text.includes('mountains')) keywords.push({ text: 'mountains', color: '#7b2ff7' });
    if (text.includes('red bird')) keywords.push({ text: 'red bird', color: '#ff006e' });
    return keywords;
  };

  const detectEmotions = (text) => {
    const emotions = [];
    if (text.includes('incredible') || text.includes('freedom')) {
      emotions.push({ name: 'Euphoria', icon: '😊', color: '#2ed573' });
    }
    return emotions;
  };

  const detectThemes = (text) => {
    const themes = [];
    if (text.includes('flying') || text.includes('soaring')) {
      themes.push({ name: 'Flight', icon: '🕊️' });
    }
    return themes;
  };

  const generateAIPrompt = (text, entities) => {
    if (entities.length > 0) {
      setAiPrompt(`Was the ${entities[0].text} the same as in your previous dreams?`);
    }
    setDailyIntention("Your dream of flying suggests a desire for freedom. Take one step toward a goal today.");
  };

  // Sketch functions
  const startDrawing = (e) => {
    if (!canvasRef.current) return;
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.strokeStyle = etherealMode ? '#ff9f43' : '#4cc9f0';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL();
      setSketchData(dataUrl);
      setFormData(prev => ({ ...prev, sketch: dataUrl }));
    }
  };

  const clearSketch = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setSketchData(null);
    }
  };

  const handleNarrativeChange = (e) => {
    const text = e.target.value;
    setFormData(prev => ({ ...prev, narrative: text }));
    
    if (text.length > 20) {
      const entities = extractEntities(text);
      const emotions = detectEmotions(text);
      const themes = detectThemes(text);
      setAutoTags({ entities, emotions, themes });
      
      if (text.length > 50 && !aiPrompt) {
        generateAIPrompt(text, entities);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAtmosphereChange = (atmosphere) => {
    setFormData(prev => ({ ...prev, atmosphere }));
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
  };

  const togglePrivacyLock = () => {
    setPrivacyLocked(!privacyLocked);
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const handleSaveEntry = async () => {
    if (!formData.title.trim() || !formData.narrative.trim()) {
      alert('Please fill in both the title and narrative! 📝');
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      const newEntry = {
        id: Date.now(),
        ...formData,
        autoTags,
        neuralData,
        timestamp: new Date().toISOString(),
        ghostMode: ghostMode
      };
      
      setEntries(prev => [newEntry, ...prev]);
      
      setFormData({
        date: new Date().toISOString().split('T')[0],
        atmosphere: 'bright',
        title: '',
        narrative: '',
        voiceMemo: null,
        sketch: null
      });
      setAutoTags({ emotions: [], themes: [], entities: [] });
      setAudioBlob(null);
      setSketchData(null);
      setAiPrompt(null);
      setIsLoading(false);
      
      if (navigator.vibrate) {
        navigator.vibrate([50, 100, 50, 100, 50]);
      }
      alert('Dream entry saved successfully! 🌟');
    }, 1000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <section className={`dream-journal ${etherealMode ? 'ethereal-mode' : ''}`}>
      <div className="dark-theme-background"></div>
      <div className="misty-background"></div>
      
      {/* Bento Grid Header */}
      <div className="journal-header-bento">
        <div className="bento-grid">
          <div className="bento-card bento-title">
            <div className="glass-card">
              <div className="header-icon-wrapper">
                <Brain size={48} className="header-icon" />
                <div className="icon-glow"></div>
              </div>
              <div>
                <h1>Dream Journal</h1>
                <p>Multi-Modal Quick Capture</p>
              </div>
            </div>
          </div>
          
          <div className="bento-card bento-mode">
            <div className="glass-card">
              <button className="mode-toggle" onClick={() => setEtherealMode(!etherealMode)}>
                {etherealMode ? <Moon size={24} /> : <Sun size={24} />}
                <span>{etherealMode ? 'Ethereal' : 'Day'} Mode</span>
              </button>
            </div>
          </div>
          
          <div className="bento-card bento-privacy">
            <div className="glass-card">
              <button className="privacy-toggle" onClick={togglePrivacyLock}>
                {privacyLocked ? <Lock size={24} /> : <Unlock size={24} />}
                <span>{privacyLocked ? 'Locked' : 'Unlocked'}</span>
              </button>
            </div>
          </div>
          
          <div className="bento-card bento-view">
            <div className="glass-card">
              <button className="view-toggle" onClick={() => setShowEntries(!showEntries)}>
                <Sparkles size={24} />
                <span>{showEntries ? 'New Entry' : 'Past Entries'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="journal-content-enhanced">
        {!showEntries ? (
          <div className="new-entry-container">
            <div className="form-bento-grid">
              {/* Voice Recording */}
              <div className="bento-form-card voice-card">
                <div className="glass-card">
                  <div className="card-header">
                    <Mic size={20} />
                    <h3>Voice Memo</h3>
                  </div>
                  <div className="voice-controls">
                    {!isRecording ? (
                      <button className="record-btn" onClick={startRecording}>
                        <Mic size={24} />
                        <span>Start Recording</span>
                      </button>
                    ) : (
                      <button className="record-btn recording" onClick={stopRecording}>
                        <MicOff size={24} />
                        <span>{formatTime(recordingTime)}</span>
                        <div className="recording-pulse"></div>
                      </button>
                    )}
                    {audioBlob && (
                      <div className="audio-indicator">
                        <CheckCircle size={16} />
                        <span>Voice memo captured</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sketch */}
              <div className="bento-form-card sketch-card">
                <div className="glass-card">
                  <div className="card-header">
                    <Pencil size={20} />
                    <h3>Dream Sketch</h3>
                  </div>
                  <button className="sketch-btn" onClick={() => setShowSketchpad(!showSketchpad)}>
                    <Pencil size={20} />
                    <span>{showSketchpad ? 'Close' : 'Open'} Sketchpad</span>
                  </button>
                  {sketchData && (
                    <div className="sketch-preview">
                      <img src={sketchData} alt="Sketch" />
                    </div>
                  )}
                </div>
              </div>

              {/* Date & Atmosphere */}
              <div className="bento-form-card date-atmosphere-card">
                <div className="glass-card">
                  <div className="card-header">
                    <Clock size={20} />
                    <h3>When & How</h3>
                  </div>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="date-input-enhanced"
                  />
                  <div className="atmosphere-grid">
                    {['bright', 'night', 'eerie', 'mystical', 'serene'].map(atm => (
                      <button
                        key={atm}
                        className={`atm-btn-enhanced ${formData.atmosphere === atm ? 'active' : ''}`}
                        onClick={() => handleAtmosphereChange(atm)}
                      >
                        {atm === 'bright' && '☀️'}
                        {atm === 'night' && '🌙'}
                        {atm === 'eerie' && '👻'}
                        {atm === 'mystical' && '🔮'}
                        {atm === 'serene' && '🌿'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Neural Metadata */}
              <div className="bento-form-card neural-card">
                <div className="glass-card">
                  <div className="card-header">
                    <Zap size={20} />
                    <h3>Neural Context</h3>
                  </div>
                  <div className="neural-data">
                    <div className="neural-item">
                      <Heart size={16} />
                      <span>{neuralData.heartRate} BPM</span>
                    </div>
                    <div className="neural-item">
                      <Eye size={16} />
                      <span>{neuralData.remCycle}</span>
                    </div>
                    <div className="neural-item">
                      <Moon size={16} />
                      <span>{neuralData.moonPhase}</span>
                    </div>
                    <div className="neural-item">
                      <Thermometer size={16} />
                      <span>{neuralData.temperature}°C</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="bento-form-card title-card">
                <div className="glass-card">
                  <div className="card-header">
                    <Sparkles size={20} />
                    <h3>Dream Title</h3>
                  </div>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Name your dream..."
                    className="title-input-enhanced"
                  />
                </div>
              </div>

              {/* Narrative */}
              <div className="bento-form-card narrative-card">
                <div className="glass-card">
                  <div className="card-header">
                    <Brain size={20} />
                    <h3>The Narrative</h3>
                    <button className="ghost-mode-btn" onClick={() => setGhostMode(!ghostMode)}>
                      {ghostMode ? '👻' : '📝'}
                    </button>
                  </div>
                  <textarea
                    name="narrative"
                    value={formData.narrative}
                    onChange={handleNarrativeChange}
                    placeholder="Describe your dream in detail..."
                    className="narrative-textarea-enhanced"
                    rows="6"
                  />
                  {ghostMode && (
                    <div className="ghost-mode-warning">
                      <AlertCircle size={14} />
                      <span>Ghost Mode: Will delete in 24h unless saved</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Auto Tags */}
              {(autoTags.emotions.length > 0 || autoTags.themes.length > 0 || autoTags.entities.length > 0) && (
                <div className="bento-form-card tags-card">
                  <div className="glass-card">
                    <div className="card-header">
                      <Tag size={20} />
                      <h3>Smart Tags</h3>
                    </div>
                    <div className="auto-tags">
                      {autoTags.emotions.map((emotion, i) => (
                        <span key={i} className="tag emotion-tag" style={{ borderColor: emotion.color }}>
                          {emotion.icon} {emotion.name}
                        </span>
                      ))}
                      {autoTags.themes.map((theme, i) => (
                        <span key={i} className="tag theme-tag">
                          {theme.icon} {theme.name}
                        </span>
                      ))}
                      {autoTags.entities.map((entity, i) => (
                        <span key={i} className="tag entity-tag" style={{ color: entity.color }}>
                          {entity.text}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* AI Prompt */}
              {aiPrompt && (
                <div className="bento-form-card ai-prompt-card">
                  <div className="glass-card ai-glow">
                    <div className="card-header">
                      <Sparkles size={20} />
                      <h3>AI Reflection</h3>
                    </div>
                    <p className="ai-prompt-text">{aiPrompt}</p>
                  </div>
                </div>
              )}

              {/* Daily Intention */}
              {dailyIntention && (
                <div className="bento-form-card intention-card">
                  <div className="glass-card intention-glow">
                    <div className="card-header">
                      <Sun size={20} />
                      <h3>Daily Intention</h3>
                    </div>
                    <p className="intention-text">{dailyIntention}</p>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="bento-form-card save-card">
                <button className={`save-btn-enhanced ${isLoading ? 'loading' : ''}`} onClick={handleSaveEntry} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="loading-spinner"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      <span>Save Dream Entry</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="past-entries-enhanced">
            <h2 className="entries-title">Past Dream Entries 📚</h2>
            <div className="entries-bento-grid">
              {entries.map((entry, index) => (
                <div key={entry.id} className="entry-bento-card">
                  <div className="glass-card">
                    <div className="entry-header-enhanced">
                      <span className="entry-date-enhanced">{formatDate(entry.date)}</span>
                      <span className="entry-atmosphere-enhanced">
                        {entry.atmosphere === 'bright' && '☀️'}
                        {entry.atmosphere === 'night' && '🌙'}
                        {entry.atmosphere === 'eerie' && '👻'}
                      </span>
                    </div>
                    <h3 className="entry-title-enhanced">{entry.title}</h3>
                    <p className="entry-preview-enhanced">{entry.narrative.substring(0, 100)}...</p>
                    <button className="read-more-btn-enhanced">Read Full Entry →</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sketchpad Modal */}
      {showSketchpad && (
        <div className="sketchpad-modal">
          <div className="sketchpad-container">
            <div className="sketchpad-header">
              <h3>Dream Sketchpad</h3>
              <button onClick={() => setShowSketchpad(false)}>
                <X size={24} />
              </button>
            </div>
            <canvas
              ref={canvasRef}
              width={600}
              height={400}
              className="sketch-canvas"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />
            <div className="sketchpad-controls">
              <button onClick={clearSketch} className="clear-btn">
                <Trash2 size={18} />
                Clear
              </button>
              <button onClick={() => setShowSketchpad(false)} className="done-btn">
                <CheckCircle size={18} />
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default DreamJournal;
