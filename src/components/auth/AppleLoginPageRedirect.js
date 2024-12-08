// src/components/auth/AppleLoginPageRedirect.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AppleLoginPageRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // This effect runs when the component mounts and checks the URL for the 'code' parameter
    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get('code'); // Get the 'code' from URL query parameters

    if (code) {
      // If there is a code, send it to the backend to exchange for a JWT token
      authenticateWithBackend(code);
    }
  }, []); // Empty dependency array means this effect runs once when the component mounts

  const authenticateWithBackend = (code) => {
    fetch('https://backend-django-9c363a145383.herokuapp.com/api/auth/apple/web-redirect/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.token) {
          // Successfully authenticated, store the JWT token in localStorage
          localStorage.setItem('authToken', data.token);

          // Redirect the user to the dashboard or another page
          navigate(data.redirect);
        } else {
          console.error('Error during authentication:', data.error);
        }
      })
      .catch((error) => {
        console.error('Error during fetch:', error.message);
      });
  };

  const handleAppleLoginRedirect = () => {
    // Redirect to the Apple login page (using the redirect authentication flow)
    const clientID = 'com.template.applicationwebproject'; // Replace with your Apple client ID
    const redirectURI = 'https://web-frontend-dun.vercel.app/auth/callback'; // Your redirect URI
    const state = Math.random().toString(36).substring(2); // Optional: CSRF protection state
    const scope = 'name email'; // Define what data you want from the user (e.g., name, email)

    // Redirect to Apple's authentication URL
    window.location.href = `https://appleid.apple.com/auth/authorize?client_id=${clientID}&redirect_uri=${redirectURI}&response_type=code&scope=${scope}&state=${state}&response_mode=form_post`;
  };

  return (
    <div>
      <h1>Google Login</h1>
      <button onClick={handleAppleLoginRedirect}>Login with Apple (Redirect)</button>
    </div>
  );
};

export default AppleLoginPageRedirect;
