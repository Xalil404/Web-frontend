import React, { useEffect } from 'react';

const AppleLoginPage = () => {
  // Load Apple Sign-In SDK and initialize
  useEffect(() => {
    const initializeAppleSignIn = () => {
      if (window.AppleID) {
        window.AppleID.auth.init({
          clientId: 'com.template.applicationwebproject', // Replace with your Apple client ID
          scope: 'name email',
          redirectURI: 'https://web-frontend-dun.vercel.app/auth/callback', // Replace with your redirect URI
          state: 'state',
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
      .then((response) => response.json())
      .then((data) => {
        if (data.token) {
          console.log('Authentication successful:', data);
          // Save the token to localStorage or manage in your app state
          localStorage.setItem('auth_token', data.token);

          // Redirect to the dashboard or appropriate page
          window.location.href = data.redirect;
        } else {
          console.error('Error during authentication:', data.error);
        }
      })
      .catch((error) => console.error('Error during fetch:', error));
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
