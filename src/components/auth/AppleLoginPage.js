import React, { useEffect } from 'react';

const AppleLoginPage = () => {
  
  // Ensure the Apple Sign-In script is loaded
  useEffect(() => {
    const loadAppleSignIn = () => {
      if (window.AppleID) {
        window.AppleID.auth.init({
          clientId: 'com.template.applicationwebproject', // Your Apple client ID
          scope: 'name email', // Define the scope (email and name)
          redirectURI: 'https://web-frontend-dun.vercel.app/auth/callback', // The redirect URI you set in Apple Developer Console
          state: 'state', // Optional: Pass a state parameter to verify in the backend
          usePopup: true, // Optional: Open in a popup for a smoother UX
        });
      }
    };

    loadAppleSignIn();
  }, []);

  // Handle the sign-in process
  const handleAppleLogin = () => {
    window.AppleID.auth.signIn()
      .then(response => {
        console.log('Apple Sign-In Response:', response); // Log the full response
        // On success, send the response token to your backend
        const { id_token } = response;
        authenticateWithBackend(id_token);
      })
      .catch(error => {
        console.error('Apple Sign-In error:', error);
      });
  };

  // Send the Apple ID token to the backend for validation and user authentication
  const authenticateWithBackend = (id_token) => {
    fetch('https://backend-django-9c363a145383.herokuapp.com/api/auth/apple/web/', { // Make sure this URL matches your Django endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: id_token }), // Send the token to the backend
    })
      .then(response => response.json())
      .then(data => {
        if (data.token) {
          // Token received, store it in localStorage or state
          localStorage.setItem('auth_token', data.token);

          // Optionally, redirect the user to another page (e.g., dashboard)
          window.location.href = data.redirect;
        } else {
          console.error('Error during authentication:', data.error);
        }
      })
      .catch(error => console.error('Error during fetch:', error));
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
