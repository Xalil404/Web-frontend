import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AppleLoginRedirectPage = () => {
  const navigate = useNavigate(); // Hook for navigation

  // Initialize Apple Sign-In SDK
  useEffect(() => {
    const initializeAppleSignIn = () => {
      if (window.AppleID) {
        window.AppleID.auth.init({
          clientId: 'com.template.applicationwebproject', // Replace with your Apple client ID
          scope: 'name email',
          redirectURI: 'https://web-frontend-dun.vercel.app/auth/callback', // Your redirect URI
          state: 'state', // Optional: CSRF protection
          usePopup: false, // Switch to redirect method
        });
        console.log('AppleID SDK initialized for redirect');
      }
    };

    initializeAppleSignIn();
  }, []);

  // Parse query parameters after redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id_token = params.get('id_token'); // Extract id_token from query string

    if (id_token) {
      console.log('Token received from Apple:', id_token);
      authenticateWithBackend(id_token);
    }
  }, []);

  // Send id_token to backend for verification
  const authenticateWithBackend = (id_token) => {
    fetch('https://backend-django-9c363a145383.herokuapp.com/api/auth/apple/web/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: id_token }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.token) {
          console.log('Authentication successful:', data);
          localStorage.setItem('authToken', data.token); // Save token
          window.location.href = data.redirect; // Redirect user
        } else {
          console.error('Error during authentication:', data.error);
        }
      })
      .catch((error) => {
        console.error('Error during fetch:', error.message);
      });
  };

  return (
    <div className="apple-login-container">
      <h2>Login with Apple</h2>
      <a
  href="https://appleid.apple.com/auth/authorize?client_id=com.template.applicationwebproject&scope=name%20email&response_type=code%20id_token&redirect_uri=https://web-frontend-dun.vercel.app/auth/callback&response_mode=form_post&state=state"
  className="apple-signin-button"
>

        Sign in with Apple
      </a>
    </div>
  );
};

export default AppleLoginRedirectPage;

