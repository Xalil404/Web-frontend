import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AppleLoginPage = () => {
  const navigate = useNavigate();
  const [authMethod, setAuthMethod] = useState('popup');  // Initial method

  // Load Apple Sign-In SDK and initialize
  useEffect(() => {
    const initializeAppleSignIn = () => {
      if (window.AppleID) {
        window.AppleID.auth.init({
          clientId: 'com.template.applicationwebproject', // Replace with your client ID
          scope: 'name email',
          redirectURI: 'https://web-frontend-dun.vercel.app/auth/callback', // Replace with your redirect URI
          state: 'state', // Optional: Used for CSRF protection
        });
        console.log('AppleID SDK initialized');
      }
    };

    // Ensure SDK loads after component mounts
    initializeAppleSignIn();
  }, []);

  const handleAppleLogin = () => {
    if (!window.AppleID) {
      console.error('AppleID SDK not loaded');
      return;
    }

    if (authMethod === 'popup') {
      handlePopupLogin();
    } else {
      handleRedirectLogin();
    }
  };

  const handlePopupLogin = async () => {
    try {
      const response = await window.AppleID.auth.signIn();
      const { id_token } = response.authorization;
      authenticateWithBackend(id_token);
    } catch (error) {
      console.error('Apple Sign-In error:', error);
    }
  };

  const handleRedirectLogin = () => {
    navigate('/auth/apple/redirect'); // Navigate to redirect endpoint
  };

  const authenticateWithBackend = (id_token) => {
    // ... Same logic as before for sending token and handling response
  };

  return (
    <div className="apple-login-container">
      <h2>Login with Apple</h2>
      <div className="button-container">
        <button
          onClick={() => setAuthMethod('popup')}
          className={`apple-signin-button ${authMethod === 'popup' ? 'active' : ''}`}
        >
          Sign in with Apple (Popup)
        </button>
        <button
          onClick={() => setAuthMethod('redirect')}
          className={`apple-signin-button ${authMethod === 'redirect' ? 'active' : ''}`}
        >
          Sign in with Apple (Redirect)
        </button>
      </div>
    </div>
  );
};

export default AppleLoginPage;

