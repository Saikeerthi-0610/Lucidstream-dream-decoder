import React, { useState, useEffect } from "react";
import "./AccountSettings.css";
import "../styles/dark-theme-background.css";
import { authService } from "../api/auth";

const AccountSettings = () => {
  const [profileData, setProfileData] = useState({
    dreamerHandle: 'Loading...',
    email: 'Loading...'
  });
  
  const [deviceSettings, setDeviceSettings] = useState({
    autoSyncOnSleep: true,
    realTimeStream: false
  });

  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        if (authService.isAuthenticated()) {
          const user = await authService.getCurrentUser();
          setProfileData({
            dreamerHandle: user.profile?.dreamerHandle || user.fullName,
            email: user.email
          });
        } else {
          // If not authenticated, use stored user data
          const storedUser = authService.getStoredUser();
          if (storedUser) {
            setProfileData({
              dreamerHandle: storedUser.profile?.dreamerHandle || storedUser.fullName,
              email: storedUser.email
            });
          }
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
        // Fallback to stored user data
        const storedUser = authService.getStoredUser();
        if (storedUser) {
          setProfileData({
            dreamerHandle: storedUser.profile?.dreamerHandle || storedUser.fullName,
            email: storedUser.email
          });
        }
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDeviceToggle = (setting) => {
    setDeviceSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handlePairDevice = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('Device pairing initiated! 📱');
    }, 2000);
  };

  const handleWipeMemories = () => {
    const confirmed = window.confirm('⚠️ Are you sure you want to wipe all memories? This action cannot be undone!');
    if (confirmed) {
      alert('🗑️ Memories wiped successfully!');
    }
  };

  const handleTerminateSession = () => {
    const confirmed = window.confirm('🔒 Are you sure you want to terminate your session?');
    if (confirmed) {
      alert('👋 Session terminated. Goodbye!');
    }
  };

  if (loading) {
    return (
      <section className="control-center">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh',
          color: '#ffffff',
          fontSize: '18px'
        }}>
          Loading your profile...
        </div>
      </section>
    );
  }

  return (
    <section className="control-center">
      {/* Dark Theme Background Elements */}
      <div className="dark-theme-background"></div>
      <div className="dark-particles">
        <div className="dark-particle"></div>
        <div className="dark-particle"></div>
        <div className="dark-particle"></div>
        <div className="dark-particle"></div>
        <div className="dark-particle"></div>
        <div className="dark-particle"></div>
      </div>
      <div className="dark-grid-overlay"></div>
      <div className="dark-connections">
        <div className="dark-connection-line"></div>
        <div className="dark-connection-line"></div>
        <div className="dark-connection-line"></div>
        <div className="dark-connection-line"></div>
        <div className="dark-glow-spot"></div>
        <div className="dark-glow-spot"></div>
        <div className="dark-glow-spot"></div>
      </div>

      {/* HEADER */}
      <div className="control-header">
        <div className="header-icon">⚙️</div>
        <div className="header-content">
          <h1>Control Center</h1>
          <p>Manage your identity and synchronization.</p>
        </div>
      </div>

      {/* PROFILE SETTINGS */}
      <div className="control-section profile-section">
        <div className="section-header">
          <div className="section-icon">👤</div>
          <div className="section-title">
            <h2>Profile Settings</h2>
            <p>How the community sees you.</p>
          </div>
        </div>

        <div className="profile-fields">
          <div className="field-group">
            <label>Dreamer Handle</label>
            <input
              type="text"
              value={profileData.dreamerHandle}
              onChange={(e) => handleProfileChange('dreamerHandle', e.target.value)}
              className="profile-input"
            />
          </div>

          <div className="field-group">
            <label>Email</label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => handleProfileChange('email', e.target.value)}
              className="profile-input"
            />
          </div>
        </div>
      </div>

      {/* DEVICE CONFIGURATION */}
      <div className="control-section device-section">
        <div className="section-header">
          <div className="section-icon">📱</div>
          <div className="section-title">
            <h2>Device Configuration</h2>
            <p>EEG Hardware Integration.</p>
          </div>
        </div>

        <div className="device-controls">
          <div className="control-item">
            <div className="control-info">
              <h3>Auto-Sync on Sleep</h3>
              <p>Automatically import data when you wake up.</p>
            </div>
            <div 
              className={`toggle-switch ${deviceSettings.autoSyncOnSleep ? 'active' : ''}`}
              onClick={() => handleDeviceToggle('autoSyncOnSleep')}
            >
              <div className="toggle-slider"></div>
            </div>
          </div>

          <div className="control-item">
            <div className="control-info">
              <h3>Real-time Stream</h3>
              <p>Broadcast raw data to dashboard during REM.</p>
            </div>
            <div 
              className={`toggle-switch ${deviceSettings.realTimeStream ? 'active' : ''}`}
              onClick={() => handleDeviceToggle('realTimeStream')}
            >
              <div className="toggle-slider"></div>
            </div>
          </div>

          <button 
            className={`pair-device-button ${isLoading ? 'loading' : ''}`}
            onClick={handlePairDevice}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                <span>Pairing...</span>
              </>
            ) : (
              <span>Pair New Device</span>
            )}
          </button>
        </div>
      </div>

      {/* DANGER ZONE */}
      <div className="control-section danger-section">
        <div className="danger-header">
          <div className="danger-icon">⚠️</div>
          <h2>Danger Zone</h2>
        </div>

        <div className="danger-buttons">
          <button className="wipe-button" onClick={handleWipeMemories}>
            <span className="wipe-icon">🗑️</span>
            <span>Wipe My Memories</span>
          </button>

          <button className="terminate-button" onClick={handleTerminateSession}>
            <span className="terminate-icon">🔒</span>
            <span>Terminate Session</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default AccountSettings;