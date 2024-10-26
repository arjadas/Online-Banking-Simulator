import { useEffect } from 'react';
import { useNavigate, useLocation } from '@remix-run/react';

const SessionCheck = () => {
    const navigate = useNavigate();
    const location = useLocation();
  
    useEffect(() => {
      let timeoutId: NodeJS.Timeout;
  
      const checkSession = async () => {
        try {
          const response = await fetch('/api/sessionCheck');
          
          if (!response.ok) {
            // Session is invalid/expired
            localStorage.removeItem('uid');
            if (!location.pathname.startsWith('/login')) {
              navigate('/login');
            }
          }
        } catch (error) {
          console.error('Session check failed:', error);
        }
      };
  
      // Check session every 10 seconds
      const startSessionCheck = () => {
        timeoutId = setInterval(checkSession, 10000);
      };
  
      startSessionCheck();
      
      // Cleanup on unmount
      return () => {
        if (timeoutId) {
          clearInterval(timeoutId);
        }
      };
    }, [navigate, location]);
  
    return null;
  };
  
  export default SessionCheck;