import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AppleRedirectLogin = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Load Apple Sign-In SDK and initialize
  useEffect(() => {
    const initializeAppleSignIn = () => {
      if (window.AppleID) {
        window.AppleID.auth.init({
          clientId: 'com.template.applicationwebproject', // Replace with your Apple client ID
          scope: 'name email',
          redirectURI: 'https://web-frontend-dun.vercel.app/apple-redirect', // Replace with your redirect URI
          state: 'state', // Optional: Used for CSRF protection
          usePopup: false, // Use redirect method
        });
        console.log('AppleID SDK initialized');
      }
    };

    // Ensure SDK loads after component mounts
    initializeAppleSignIn();
  }, []);

  // Handle Apple login process for redirect
  const handleAppleLoginRedirect = () => {
    if (!window.AppleID) {
      console.error('AppleID SDK not loaded');
      return;
    }

    window.AppleID.auth.signIn();
  };

  // Process the code received in the callback URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');

    if (code) {
      // Send code to backend for verification
      fetch('https://backend-django-9c363a145383.herokuapp.com/api/auth/apple/web/redirect/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (data.token) {
            localStorage.setItem('authToken', data.token);
            navigate(data.redirect); // Navigate to the redirect URL
          } else {
            console.error('Error during authentication:', data.error);
          }
        })
        .catch((error) => {
          console.error('Error during fetch:', error.message);
        });
    }
  }, [location, navigate]);

  return (
    <div className="apple-login-container">
      <h2>Login with Apple</h2>
      <button onClick={handleAppleLoginRedirect} className="apple-signin-button">
        Sign in with Apple (Redirect)
      </button>
    </div>
  );
};

export default AppleRedirectLogin;





