import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Decode from "./pages/Decode";
import Community from "./pages/Community";
import History from "./pages/History";
import ExpertInsights from "./pages/ExpertInsights";
import DreamJournal from "./pages/DreamJournal";
import AccountSettings from "./pages/AccountSettings";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Logout from "./pages/Logout";
import Stream from "./pages/Stream";
import OAuthCallback from "./pages/OAuthCallback";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div style={{ backgroundColor: '#0a0e27', minHeight: '100vh' }}>
      <Header />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/auth/callback" element={<OAuthCallback />} />
        
        {/* Protected Routes */}
        <Route path="/stream" element={<ProtectedRoute><Stream /></ProtectedRoute>} />
        <Route path="/decode" element={<ProtectedRoute><Decode /></ProtectedRoute>} />
        <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
        <Route path="/expert-insights" element={<ProtectedRoute><ExpertInsights /></ProtectedRoute>} />
        <Route path="/dream-journal" element={<ProtectedRoute><DreamJournal /></ProtectedRoute>} />
        <Route path="/account-settings" element={<ProtectedRoute><AccountSettings /></ProtectedRoute>} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
      
      <Footer />
    </div>
  );
}
