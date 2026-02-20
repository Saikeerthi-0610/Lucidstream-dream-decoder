import { useEffect } from 'react';

/**
 * Custom hook for syncing background mood with brainwave data
 * Changes page background colors based on dominant brain wave patterns
 */
export const useMoodSync = (bands, isActive = false) => {
  useEffect(() => {
    if (!bands || !isActive) {
      // Reset to default
      document.body.style.setProperty('--mood-primary', 'rgba(76, 201, 240, 0.1)');
      document.body.style.setProperty('--mood-secondary', 'rgba(123, 47, 247, 0.1)');
      return;
    }

    const { delta, theta, alpha, beta } = bands;
    
    // Determine dominant wave
    const waves = { delta, theta, alpha, beta };
    const dominant = Object.entries(waves).sort((a, b) => b[1] - a[1])[0];
    
    let primaryColor, secondaryColor, moodName;
    
    switch (dominant[0]) {
      case 'delta':
        // Deep sleep - Deep blue/purple
        primaryColor = 'rgba(25, 25, 112, 0.2)';
        secondaryColor = 'rgba(75, 0, 130, 0.2)';
        moodName = 'Deep Rest';
        break;
        
      case 'theta':
        // Creativity - Purple/violet
        primaryColor = 'rgba(123, 47, 247, 0.2)';
        secondaryColor = 'rgba(138, 43, 226, 0.2)';
        moodName = 'Creative Flow';
        break;
        
      case 'alpha':
        // Relaxation - Cyan/teal
        primaryColor = 'rgba(76, 201, 240, 0.2)';
        secondaryColor = 'rgba(0, 206, 209, 0.2)';
        moodName = 'Relaxed Awareness';
        break;
        
      case 'beta':
        // Active thinking - Orange/red
        primaryColor = 'rgba(255, 0, 110, 0.2)';
        secondaryColor = 'rgba(255, 69, 0, 0.2)';
        moodName = 'Active Mind';
        break;
        
      default:
        primaryColor = 'rgba(76, 201, 240, 0.1)';
        secondaryColor = 'rgba(123, 47, 247, 0.1)';
        moodName = 'Neutral';
    }
    
    // Apply mood colors with smooth transition
    document.body.style.transition = 'all 2s ease-in-out';
    document.body.style.setProperty('--mood-primary', primaryColor);
    document.body.style.setProperty('--mood-secondary', secondaryColor);
    
    // Optional: Show mood notification
    if (window.moodNotification) {
      window.moodNotification(moodName, dominant[0]);
    }
    
    return () => {
      document.body.style.transition = '';
    };
  }, [bands, isActive]);
};

export default useMoodSync;
