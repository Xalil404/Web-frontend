import React from 'react';
import { useNavigate } from 'react-router-dom';

const AppleLoginPage = () => {
  const navigate = useNavigate();  // Hook for navigation

  // Handle Apple login process
  const handleAppleLogin = () => {
    const clientId = 'com.template.applicationwebproject'; // Your Apple client ID
    const redirectUri = 'https://web-frontend-dun.vercel.app/auth/callback'; // Your redirect URI
    const state = 'state'; // Optional: Used for CSRF protection

    const appleAuthUrl = `https://appleid.apple.com/auth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=name%20email&state=${state}`;

    // Redirect the user to Apple’s login page
    window.location.href = appleAuthUrl;
  };

  return (
    <div className="apple-login-container">
      <h2>Login with Apple</h2>
      <button onClick={handleAppleLogin} className="apple-signin-button">
        Sign in with Apple
      </button>
    </div>
  );
};

export default AppleLoginPage;
