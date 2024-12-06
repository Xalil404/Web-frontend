import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AppleCallbackPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleAppleCallback = async () => {
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get('code');  // The authorization code from Apple
      const id_token = urlParams.get('id_token');  // The ID token from Apple

      if (code || id_token) {
        try {
          // Send the token or code to the backend to authenticate the user
          const response = await fetch('/api/auth/apple/web/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ apple_token: id_token }),  // Or send 'code' if needed
          });

          const data = await response.json();
          if (data.token) {
            // If authentication is successful, store the token and redirect
            localStorage.setItem('auth_token', data.token);
            navigate('/dashboard');
          } else {
            console.error('Authentication failed');
          }
        } catch (error) {
          console.error('Error handling Apple callback:', error);
        }
      }
    };

    handleAppleCallback();
  }, [location, navigate]);

  return <div>Loading...</div>;  // You can add a loading spinner or similar here
};

export default AppleCallbackPage;
