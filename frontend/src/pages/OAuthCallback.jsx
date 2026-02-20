import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const provider = searchParams.get('provider');
    const error = searchParams.get('error');

    if (error) {
      console.error(`OAuth error: ${error}`);
      navigate('/login?error=' + error);
      return;
    }

    if (token) {
      // Store token
      localStorage.setItem('token', token);
      localStorage.setItem('authToken', token);
      
      console.log(`${provider} OAuth successful`);
      
      // Redirect to decode page
      window.location.href = '/decode';
    } else {
      navigate('/login?error=no_token');
    }
  }, [searchParams, navigate]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0a0e27',
      color: '#ffffff'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '3px solid rgba(102, 126, 234, 0.3)',
          borderTopColor: '#667eea',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px'
        }}></div>
        <p>Completing authentication...</p>
      </div>
    </div>
  );
}
