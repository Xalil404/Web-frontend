// src/components/auth/AppleLoginPageRedirect.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AppleLoginPageRedirect = () => {
  const navigate = useNavigate();

  // Initialize Apple Login Redirect Flow (Optional)
  useEffect(() => {
    // This ensures the page has loaded completely before any interactions
    console.log('Apple Login Page is ready for redirect flow.');
  }, []);

  const handleAppleLoginRedirect = () => {
    // Redirect to the Apple login page using the redirect authorization flow
    const clientID = 'com.template.applicationwebproject'; // Replace with your Apple client ID
    const redirectURI = 'https://web-frontend-dun.vercel.app/auth/callback'; // Your redirect URI
    const state = Math.random().toString(36).substring(2); // Optional: CSRF protection state
    const scope = 'name email'; // Define what data you want from the user (e.g., name, email)

    // Redirect to Apple's authorization endpoint
    window.location.href = `https://appleid.apple.com/auth/authorize?client_id=${clientID}&redirect_uri=${redirectURI}&response_type=code&scope=${scope}&state=${state}&response_mode=form_post`;
  };

  // Handle the callback from Apple after redirect
  useEffect(() => {
    // Check if we're on the callback URL and if the code is present in the query params
    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get('code');
    const error = queryParams.get('error'); // Handle errors if they occur

    if (error) {
      console.error('Apple Login Error:', error);
      return;
    }

    if (code) {
      // Send the code to the backend to exchange for the JWT token
      authenticateWithBackend(code);
    }
  }, []); // Runs only once when the component mounts (when redirected back to this page)

  // Function to send the authorization code to the backend
  const authenticateWithBackend = (code) => {
    fetch('https://backend-django-9c363a145383.herokuapp.com/api/auth/apple/web-redirect/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }), // Send the code received from Apple
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.token) {
          // Store the JWT token if authentication is successful
          localStorage.setItem('authToken', data.token);
          
          // Redirect to the specified location (e.g., dashboard)
          window.location.href = data.redirect; // Redirect URL from the backend
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
      <h2>Login with Apple Redirect</h2>
      <button onClick={handleAppleLoginRedirect} className="apple-signin-button">
        Sign in with Apple (Redirect Flow)
      </button>
    </div>
  );
};

export default AppleLoginPageRedirect;
