import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AppleLoginPageRedirect = () => {
  const navigate = useNavigate(); // Hook for navigation

  // Initialize Apple Login Redirect Flow (Optional)
  useEffect(() => {
    console.log('Apple Login Page is ready for redirect flow.');
  }, []);

  // Handle Apple Login Redirect Flow
  const handleAppleLoginRedirect = () => {
    const clientID = 'com.template.applicationwebproject'; // Your Apple client ID
    const redirectURI = 'https://web-frontend-dun.vercel.app/auth/callback'; // Your redirect URI
    const state = Math.random().toString(36).substring(2); // Optional: CSRF protection state
    const scope = 'name email'; // Define what data you want from the user (e.g., name, email)

    // Redirect to Apple's authorization endpoint
    window.location.href = `https://appleid.apple.com/auth/authorize?client_id=${clientID}&redirect_uri=${redirectURI}&response_type=code&scope=${scope}&state=${state}&response_mode=form_post`;
  };

  // Handle the callback from Apple after redirect
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get('code'); // Extract the 'code' parameter
    const error = queryParams.get('error'); // Handle errors if they occur

    if (error) {
      console.error('Apple Login Error:', error);
      return;
    }

    if (code) {
      // Send the authorization code to the backend to exchange for a JWT token
      authenticateWithBackend(code);
    }
  }, []); // This effect runs only once when the component mounts

  // Function to send the authorization code to the backend
  const authenticateWithBackend = (code) => {
    fetch('https://backend-django-9c363a145383.herokuapp.com/api/auth/apple/web-redirect/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }), // Send the authorization code received from Apple
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); // Parse the response JSON
      })
      .then((data) => {
        if (data.token) {
          // Store the JWT token in localStorage if authentication is successful
          localStorage.setItem('authToken', data.token);

          // Redirect to the page specified in the response (e.g., dashboard)
          window.location.href = data.redirect || '/dashboard'; // Default to '/dashboard' if no redirect is provided
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
      <h2>Login with Apple Redirect Flow</h2>
      <button onClick={handleAppleLoginRedirect} className="apple-signin-button">
        Sign in with Apple (Redirect Flow)
      </button>
    </div>
  );
};

export default AppleLoginPageRedirect;
