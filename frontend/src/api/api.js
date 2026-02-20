import axios from "axios";

// Create axios instance with optimized settings
const api = axios.create({
  baseURL: "http://localhost:8000",
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
  const formData = new FormData();
  formData.append("file", file);

  try {
    return await axios.post(
      "http://localhost:8000/predict",
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
  try {
    const response = await api.get("/history/");
    return response;
  } catch (error) {
    console.error('History fetch error:', error);
    // Return demo data if API fails
    return {
      data: [
        {
          id: 1,
          dream: "Exploration of an ancient library beneath the ocean. Strong alpha waves detected during REM phase.",
          confidence: 87,
          date: "2024-02-03",
          type: "Water Dream",
          intensity: "HIGH INTENSITY",
          intensityColor: "#ff6b6b"
        },
        {
          id: 2,
          dream: "Standard memory consolidation during deep sleep. Higher theta activity noted in prefrontal cortex.",
          confidence: 73,
          date: "2024-02-02",
          type: "REM Stage", 
          intensity: "MODERATE INTENSITY",
          intensityColor: "#4ecdc4"
        },
        {
          id: 3,
          dream: "Rapid pulse and beta wave spikes. Correlated with physiological stress response patterns.",
          confidence: 92,
          date: "2024-02-01",
          type: "Nightmare",
          intensity: "EXTREME INTENSITY",
          intensityColor: "#ff4757"
        }
      ]
    };
  }
};

export const getRecentHistory = async () => {
  try {
    const response = await api.get("/history/recent");
    return response;
  } catch (error) {
    console.error('Recent history fetch error:', error);
    // Return demo data if API fails
    return {
      data: [
        {
          id: 1,
          dream: "Recent lucid dream analysis completed",
          confidence: 89,
          type: "Lucid Dream"
        }
      ]
    };
  }
};
