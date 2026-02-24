import axios from "axios";

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Check if we're in demo mode (no backend available)
const isDemoMode = import.meta.env.VITE_DEMO_MODE === "true" || !import.meta.env.VITE_API_URL;

// Create axios instance with optimized settings
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 second timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
      return Promise.reject(new Error('Request timed out. Please try again.'));
    }
    return Promise.reject(error);
  }
);

export const predictDream = async (file) => {
  // Demo mode: Return mock prediction data
  if (isDemoMode) {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const dreamTypes = [
      { 
        type: "Lucid Dream", 
        confidence: 89, 
        description: "High alpha wave activity detected during REM phase. Strong indicators of conscious awareness within dream state.",
        bands: { delta: 0.15, theta: 0.25, alpha: 0.35, beta: 0.18, gamma: 0.07 },
        probabilities: { "Lucid Dream": 0.89, "REM Dream": 0.06, "Deep Sleep": 0.03, "Nightmare": 0.01, "Prophetic Dream": 0.01 }
      },
      { 
        type: "Nightmare", 
        confidence: 92, 
        description: "Elevated beta waves and rapid pulse detected. Correlated with physiological stress response patterns.",
        bands: { delta: 0.10, theta: 0.15, alpha: 0.20, beta: 0.45, gamma: 0.10 },
        probabilities: { "Nightmare": 0.92, "REM Dream": 0.04, "Lucid Dream": 0.02, "Deep Sleep": 0.01, "Prophetic Dream": 0.01 }
      },
      { 
        type: "Deep Sleep", 
        confidence: 85, 
        description: "Dominant delta waves observed. Optimal conditions for memory consolidation and physical restoration.",
        bands: { delta: 0.55, theta: 0.20, alpha: 0.10, beta: 0.10, gamma: 0.05 },
        probabilities: { "Deep Sleep": 0.85, "REM Dream": 0.08, "Lucid Dream": 0.04, "Nightmare": 0.02, "Prophetic Dream": 0.01 }
      },
      { 
        type: "REM Dream", 
        confidence: 87, 
        description: "Rapid eye movement with theta wave patterns. Active dream narrative processing detected.",
        bands: { delta: 0.12, theta: 0.40, alpha: 0.25, beta: 0.15, gamma: 0.08 },
        probabilities: { "REM Dream": 0.87, "Lucid Dream": 0.07, "Deep Sleep": 0.03, "Nightmare": 0.02, "Prophetic Dream": 0.01 }
      },
      { 
        type: "Prophetic Dream", 
        confidence: 78, 
        description: "Unusual gamma wave synchronization. Enhanced pattern recognition and intuitive processing.",
        bands: { delta: 0.10, theta: 0.20, alpha: 0.25, beta: 0.25, gamma: 0.20 },
        probabilities: { "Prophetic Dream": 0.78, "Lucid Dream": 0.10, "REM Dream": 0.07, "Deep Sleep": 0.03, "Nightmare": 0.02 }
      }
    ];
    
    const randomDream = dreamTypes[Math.floor(Math.random() * dreamTypes.length)];
    
    // Generate mock signal data
    const generateSignal = () => {
      const signal = [];
      for (let i = 0; i < 100; i++) {
        signal.push(Math.sin(i * 0.1) * 50 + Math.random() * 20);
      }
      return signal;
    };
    
    return {
      data: {
        dream: randomDream.type,
        prediction: randomDream.type,
        confidence: randomDream.confidence,
        description: randomDream.description,
        bands: randomDream.bands,
        probabilities: randomDream.probabilities,
        signal: generateSignal(),
        timestamp: new Date().toISOString(),
        demo_mode: true
      }
    };
  }

  // Real backend mode
  const formData = new FormData();
  formData.append("file", file);

  try {
    return await axios.post(
      `${API_BASE_URL}/predict`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000, // 30 seconds for file upload
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload progress: ${percentCompleted}%`);
        },
      }
    );
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Analysis timed out. Please try with a smaller file.');
    }
    throw error;
  }
};

export const getHistory = async () => {
  // Demo mode: Return mock history data
  if (isDemoMode) {
    return {
      data: [
        {
          id: 1,
          dream: "Exploration of an ancient library beneath the ocean. Strong alpha waves detected during REM phase.",
          confidence: 87,
          date: "2024-02-20",
          type: "Lucid Dream",
          intensity: "HIGH INTENSITY",
          intensityColor: "#ff6b6b"
        },
        {
          id: 2,
          dream: "Flying through cosmic nebulae with enhanced gamma wave synchronization. Prophetic elements detected.",
          confidence: 91,
          date: "2024-02-19",
          type: "Prophetic Dream",
          intensity: "EXTREME INTENSITY",
          intensityColor: "#ff4757"
        },
        {
          id: 3,
          dream: "Standard memory consolidation during deep sleep. Higher theta activity noted in prefrontal cortex.",
          confidence: 73,
          date: "2024-02-18",
          type: "Deep Sleep", 
          intensity: "MODERATE INTENSITY",
          intensityColor: "#4ecdc4"
        },
        {
          id: 4,
          dream: "Rapid pulse and beta wave spikes. Correlated with physiological stress response patterns.",
          confidence: 92,
          date: "2024-02-17",
          type: "Nightmare",
          intensity: "EXTREME INTENSITY",
          intensityColor: "#ff4757"
        },
        {
          id: 5,
          dream: "Peaceful meadow with gentle theta waves. Optimal relaxation and creativity indicators.",
          confidence: 85,
          date: "2024-02-16",
          type: "REM Dream",
          intensity: "LOW INTENSITY",
          intensityColor: "#95e1d3"
        }
      ]
    };
  }

  // Real backend mode
  try {
    const response = await api.get("/history/");
    return response;
  } catch (error) {
    console.error('History fetch error:', error);
    throw error;
  }
};

export const getRecentHistory = async () => {
  // Demo mode: Return mock recent history
  if (isDemoMode) {
    return {
      data: [
        {
          id: 1,
          dream: "Flying through cosmic nebulae - Prophetic Dream",
          confidence: 91,
          type: "Prophetic Dream"
        },
        {
          id: 2,
          dream: "Ocean library exploration - Lucid Dream",
          confidence: 87,
          type: "Lucid Dream"
        },
        {
          id: 3,
          dream: "Deep sleep memory consolidation",
          confidence: 73,
          type: "Deep Sleep"
        }
      ]
    };
  }

  // Real backend mode
  try {
    const response = await api.get("/history/recent");
    return response;
  } catch (error) {
    console.error('Recent history fetch error:', error);
    throw error;
  }
};
