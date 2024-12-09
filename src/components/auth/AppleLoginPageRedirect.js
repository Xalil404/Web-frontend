import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AppleLoginRedirectPage = () => {
  const navigate = useNavigate(); // Hook for navigation

  // Parse query parameters after redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code'); // Extract code from query string

    if (code) {
      console.log('Authorization code received from Apple:', code);
      authenticateWithBackend(code);  // Send the authorization code to backend
    }
  }, []);

  // Send code to backend for token exchange
  const authenticateWithBackend = (code) => {
    fetch(`https://backend-django-9c363a145383.herokuapp.com/api/auth/apple/web/?code=${code}`, {  // Use GET and pass the code as a query param
      method: 'GET',
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

