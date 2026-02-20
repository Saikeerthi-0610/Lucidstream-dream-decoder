# 🌙 LucidStream - AI Dream Decoder

An AI-powered dream analysis platform that uses EEG signals to decode and interpret dreams. Built with React, FastAPI, and Machine Learning.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?logo=fastapi)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb)

## 🚀 Features

### Core Features
- 🧠 **AI Dream Prediction** - Analyze EEG signals using SVM machine learning
- 📊 **Brainwave Visualization** - Real-time visualization of brain activity
- 📖 **Dream Journal** - Multi-modal dream logging with voice and sketch
- 👥 **Community Platform** - Share and explore dreams with others
- 📈 **History Tracking** - Track sleep patterns and dream analysis over time
- 💡 **Expert Insights** - Educational articles on sleep science and lucid dreaming

### Technical Features
- 🔐 JWT Authentication with OAuth 2.0 (Google, GitHub)
- ⚡ Real-time EEG data processing
- 🎨 Modern Cyber-Zen UI with glassmorphism design
- 📱 Fully responsive design
- 🔒 Privacy-focused with encryption options
- 📄 PDF report generation

## 🛠️ Technology Stack

### Frontend
- **React 19.2.0** - UI library
- **Vite** - Build tool
- **Framer Motion** - Animations
- **Recharts** - Data visualization
- **Axios** - HTTP client

### Backend
- **FastAPI** - Python web framework
- **MongoDB** - NoSQL database
- **Scikit-learn** - Machine learning
- **NumPy & SciPy** - Scientific computing
- **PyJWT** - Authentication

### Machine Learning
- **Algorithm:** Support Vector Machine (SVM)
- **Features:** 7-feature extraction from EEG signals
- **Accuracy:** ~85% on test data

## 📋 Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- MongoDB 4.4+
- Git

## 🔧 Installation

### 1. Clone the repository
```bash
git clone https://github.com/Saikeerthi-0610/lucidstream-dream-decoder.git
cd lucidstream-dream-decoder
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your configuration

# Create ML model
python app/ml/create_model.py

# Start backend server
python -m uvicorn app.main:app --reload
```

Backend will run on: http://localhost:8000

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on: http://localhost:5173

## 🌐 Environment Variables

### Backend (.env)
```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=dream_decoder
SECRET_KEY=your-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-secret
```

## 📖 Usage

### 1. Create an Account
- Navigate to the signup page
- Complete the 3-step onboarding process
- Choose your intent and archetype

### 2. Analyze Dreams
- Go to the Decode page
- Upload an EEG CSV file
- View real-time brainwave analysis
- Get AI-powered dream state predictions

### 3. Keep a Dream Journal
- Record dreams with voice or text
- Add sketches to visualize dreams
- Track emotions and themes
- Enable privacy mode for sensitive entries

### 4. Explore Community
- Share your dream stories
- Read others' experiences
- Like and comment on stories
- Join dream quests

## 🧪 API Documentation

Once the backend is running, visit:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

### Key Endpoints
```
POST   /auth/signup          - Register new user
POST   /auth/login           - Login user
POST   /predict              - Analyze EEG and predict dream
POST   /eeg/upload           - Upload EEG CSV file
GET    /stories              - Get community stories
GET    /history              - Get user's dream history
```

## 🧠 Machine Learning Pipeline

### Feature Extraction
1. **Input:** Raw EEG signal (CSV format)
2. **Processing:** Welch's method for Power Spectral Density
3. **Features:** Extract 5 frequency bands + 2 statistical features
   - Delta (0.5-4 Hz) - Deep sleep
   - Theta (4-8 Hz) - Light sleep
   - Alpha (8-13 Hz) - Relaxed wakefulness
   - Beta (13-30 Hz) - Active thinking
   - Gamma (30-40 Hz) - High-level cognition
   - Mean and Standard Deviation

### Classification
- **Model:** Support Vector Machine (SVM)
- **Output:** 4 dream states (REM, NREM1, NREM2, NREM3)
- **Confidence:** Probability scores for each state

## 📁 Project Structure
```
lucidstream-dream-decoder/
├── frontend/
│   ├── src/
│   │   ├── pages/          # React pages
│   │   ├── components/     # Reusable components
│   │   ├── styles/         # CSS files
│   │   ├── api/            # API client
│   │   └── utils/          # Utility functions
│   └── package.json
├── backend/
│   ├── app/
│   │   ├── api/            # API routes
│   │   ├── db/             # Database models
│   │   ├── ml/             # ML models
│   │   ├── middleware/     # Middleware
│   │   └── utils/          # Utilities
│   └── requirements.txt
├── .gitignore
└── README.md
```

## 🔒 Security Features

- **Password Hashing:** Bcrypt with salt
- **JWT Tokens:** 24-hour expiration
- **Rate Limiting:** 100 requests/minute
- **OAuth 2.0:** Google and GitHub integration
- **Data Encryption:** Optional zero-knowledge encryption
- **Privacy Mode:** Anonymous usage and auto-delete options

## 🎨 UI/UX Features

- **Cyber-Zen Aesthetic:** Modern, futuristic design
- **Glassmorphism:** Frosted glass effects
- **Neural Animations:** Dynamic particle systems
- **Responsive Design:** Works on all devices
- **Dark Theme:** Eye-friendly interface
- **Smooth Transitions:** Framer Motion animations

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📊 Performance

- **Frontend:** Lighthouse score 90+
- **Backend:** <100ms average response time
- **ML Prediction:** <2 seconds for analysis
- **Database:** Indexed queries <50ms

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy dist/ folder
```

### Backend (Heroku/Railway)
```bash
# Use Procfile for deployment
web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Saikeerthi**
- GitHub: [@Saikeerthi-0610](https://github.com/Saikeerthi-0610)

## 🙏 Acknowledgments

- EEG signal processing inspired by neuroscience research
- UI/UX design inspired by modern web applications
- Machine learning techniques from scikit-learn documentation

## 📞 Support

For support, email udayagirikeerthi06@gmail.com or open an issue on GitHub.

## 🗺️ Roadmap

- [ ] Real-time EEG streaming
- [ ] Mobile app (React Native)
- [ ] Advanced ML models (LSTM, Transformers)
- [ ] Integration with more EEG devices
- [ ] Social features expansion
- [ ] Multi-language support

---
