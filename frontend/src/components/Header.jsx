import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "../styles/Header.css";
import AppIcon from "../assets/Final app icon.png";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Check if user is logged in by checking for token
    const token = localStorage.getItem('token');
    const isUserLoggedIn = !!token;
    
    // Only update state if it changed
    if (isUserLoggedIn !== isLoggedIn) {
      setIsLoggedIn(isUserLoggedIn);
    }
    
    // Load user data from localStorage
    if (token) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setUserData(user);
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }
    } else {
      setUserData(null);
    }
  }, [location.pathname]); // Only re-run when route changes

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    if (showProfileDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showProfileDropdown]);

  // Close dropdown when route changes
  useEffect(() => {
    setShowProfileDropdown(false);
  }, [location.pathname]);

  const handleLogout = () => {
    // Clear all user data and redirect to home
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserData(null);
    setShowProfileDropdown(false);
    navigate('/');
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="logo">
          <img src={AppIcon} alt="DreamDecoder logo" />
          <span>LucidStream</span>
        </div>

        <nav className="nav-links">
          <NavLink to="/">🏠 Home</NavLink>
          <NavLink to="/decode">🔬 Decode</NavLink>
          <NavLink to="/community">👥 Community</NavLink>
          <NavLink to="/history">📊 History</NavLink>
          <NavLink to="/expert-insights">💡 Expert Insights</NavLink>
          <NavLink to="/dream-journal">📖 Dream Journal</NavLink>
        </nav>

        <div className="header-actions">
          {isLoggedIn ? (
            <div className="profile-section" ref={dropdownRef}>
              <button onClick={toggleProfileDropdown} className="profile-btn">
                <div className="profile-avatar">
                  {userData?.fullName ? getInitials(userData.fullName) : '👤'}
                </div>
                <span className="profile-name">{userData?.fullName || 'User'}</span>
                <span className="dropdown-arrow">{showProfileDropdown ? '▲' : '▼'}</span>
              </button>

              {showProfileDropdown && (
                <div className="profile-dropdown">
                  <div className="profile-header">
                    <div className="profile-avatar-large">
                      {userData?.fullName ? getInitials(userData.fullName) : '👤'}
                    </div>
                    <div className="profile-info">
                      <h3>{userData?.fullName || 'User'}</h3>
                      <p className="profile-handle">@{userData?.profile?.dreamerHandle || 'dreamer'}</p>
                      <p className="profile-email">{userData?.email || ''}</p>
                    </div>
                  </div>

                  <div className="profile-stats">
                    <div className="stat-item">
                      <span className="stat-icon">🌙</span>
                      <div className="stat-info">
                        <span className="stat-value">{userData?.profile?.totalDreams || 0}</span>
                        <span className="stat-label">Dreams</span>
                      </div>
                    </div>
                    <div className="stat-item">
                      <span className="stat-icon">🔬</span>
                      <div className="stat-info">
                        <span className="stat-value">{userData?.profile?.totalAnalyses || 0}</span>
                        <span className="stat-label">Analyses</span>
                      </div>
                    </div>
                  </div>

                  <div className="profile-bio">
                    <p>{userData?.profile?.bio || 'Welcome to the dreamscape! 🌌'}</p>
                  </div>

                  <div className="profile-actions">
                    <button onClick={() => { navigate('/account-settings'); setShowProfileDropdown(false); }} className="profile-action-btn">
                      <span className="action-emoji">⚙️</span> Account Settings
                    </button>
                    <button onClick={() => { navigate('/history'); setShowProfileDropdown(false); }} className="profile-action-btn">
                      <span className="action-emoji">📊</span> View History
                    </button>
                    <button onClick={handleLogout} className="profile-action-btn logout">
                      <span className="action-emoji">🚪</span> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <NavLink to="/login" className="login-btn">🔐 Login</NavLink>
              <NavLink to="/signup" className="signup-btn">✨ Signup</NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
