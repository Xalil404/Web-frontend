import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AppleLoginPage = () => {
  const navigate = useNavigate();  // Hook for navigation

  // This effect captures the authorization code from the URL after the redirect from Apple
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    // If we have the authorization code, send it to the backend
    if (code) {
      authenticateWithBackend(code);
    }

    if (error) {
      console.error('Apple Sign-In Error:', error);
    }
  }, []);

  // Handle Apple login process (Step 1 - redirect to Apple)
  const handleAppleLogin = () => {
    const clientId = 'com.template.applicationwebproject'; // Your Apple client ID
    const redirectUri = 'https://web-frontend-dun.vercel.app/auth/callback'; // Your redirect URI
    const state = 'state'; // Optional: Used for CSRF protection

    // Construct the Apple Auth URL with the necessary parameters
    const appleAuthUrl = `https://appleid.apple.com/auth/authorize?response_type=code&response_mode=form_post&client_id=com.template.applicationwebproject&redirect_uri=https://backend-django-9c363a145383.herokuapp.com/api/auth/apple/callback&scope=name%20email&state=state`;

    // Redirect the user to Apple’s login page
    window.location.href = appleAuthUrl;
  };

  // Send the authorization code to the backend to authenticate the user
  const authenticateWithBackend = (code) => {
    fetch('https://backend-django-9c363a145383.herokuapp.com/api/auth/apple/web/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: code }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.token) {
          console.log('Authentication successful:', data);
          
          // Store the token under 'authToken' and redirect
          localStorage.setItem('authToken', data.token);
          window.location.href = data.redirect; // Redirect the user to a specified page (e.g., dashboard)
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
      <button onClick={handleAppleLogin} className="apple-signin-button">
        Sign in with Apple
      </button>
    </div>
  );
};

export default AppleLoginPage;
