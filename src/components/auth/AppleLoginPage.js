import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AppleLoginPage = () => {
  const navigate = useNavigate();  // Hook for navigation

  // Load Apple Sign-In SDK and initialize
  useEffect(() => {
    const initializeAppleSignIn = () => {
      if (window.AppleID) {
        window.AppleID.auth.init({
          clientId: 'com.template.applicationwebproject', // Replace with your Apple client ID
          scope: 'name email',
          redirectURI: 'https://web-frontend-dun.vercel.app/auth/callback', // Replace with your redirect URI
          state: 'state', // Optional: Used for CSRF protection
          usePopup: true, // Use popup for better UX
        });
        console.log('AppleID SDK initialized');
      }
    };

    // Ensure SDK loads after component mounts
    initializeAppleSignIn();
  }, []);

  // Handle Apple login process
  const handleAppleLogin = () => {
    if (!window.AppleID) {
      console.error('AppleID SDK not loaded');
      return;
    }

    window.AppleID.auth
      .signIn()
      .then((response) => {
        const { id_token } = response.authorization;
        console.log('Sending token:', id_token);

        if (id_token) {
          authenticateWithBackend(id_token);
        } else {
          console.error('Error: id_token is missing');
        }
      })
      .catch((error) => {
        console.error('Apple Sign-In error:', error);
      });
  };

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
          
          // Store the token under 'authToken' for all login types
          localStorage.setItem('authToken', data.token); 
          console.log('Auth Token:', localStorage.getItem('authToken')); // Check if token is saved
          
          // Redirect to the specified location (e.g., dashboard)
          window.location.href = data.redirect;
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
      {/* Custom Apple Button */}
      <button
        onClick={handleAppleLogin}
        className="apple-signin-button"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '300px', // Width of the button
          height: '50px', // Height of the button
          backgroundColor: '#000', // Black background
          color: '#fff', // White text color
          fontFamily: 'Roboto, sans-serif', // Apple font family
          fontSize: '16px', // Font size
          fontWeight: '500', // Medium font weight
          borderRadius: '25px', // Rounded corners for pill shape
          border: 'none', // No border
          cursor: 'pointer', // Pointer cursor on hover
        }}
      >
        {/* Apple Logo */}
        <img
          src="https://res.cloudinary.com/dnbbm9vzi/image/upload/v1733920625/Screenshot_2024-12-11_at_11.18.52_AM-removebg-preview_fb6w8s.png"
          alt="Apple logo"
          style={{
            width: '20px', // Apple logo size
            height: '20px', // Apple logo size
            marginRight: '10px', // Space between logo and text
          }}
        />
        Sign in with Apple
      </button>
    </div>
    /*
    <div className="apple-login-container">
      <h2>Login with Apple</h2>
      <button onClick={handleAppleLogin} className="apple-signin-button">
        Sign in with Apple
      </button>
    </div>
    */
  );
};

export default AppleLoginPage;
