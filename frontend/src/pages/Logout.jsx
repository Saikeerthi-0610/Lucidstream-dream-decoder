import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../api/auth";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await authService.logout();
        console.log('Logout successful');
        
        // Redirect to home page
        navigate('/');
      } catch (error) {
        console.error('Logout error:', error);
        // Even if logout fails, redirect to home
        navigate('/');
      }
    };

    handleLogout();
  }, [navigate]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      color: '#ffffff',
      fontSize: '18px',
      background: '#000000'
    }}>
      Logging out...
    </div>
  );
}
