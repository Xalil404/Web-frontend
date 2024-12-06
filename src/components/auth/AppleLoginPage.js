import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate

const AppleSignInButton = () => {
    const navigate = useNavigate();  // Initialize navigate function
  useEffect(() => {
    const initializeAppleID = () => {
      if (window.AppleID && window.AppleID.auth) {
        window.AppleID.auth.init({
          clientId: 'com.template.applicationwebproject', // Your Apple Service ID
          scope: 'email name',
          redirectURI: 'https://web-frontend-dun.vercel.app/dashboard', // Callback URL
          state: 'some-state', // Optional for CSRF protection
          nonce: 'random-nonce', // Optional for extra security
        });
      } else {
        console.error('AppleID.auth is not available');
      }
    };

    if (!window.AppleID) {
      const script = document.createElement('script');
      script.src = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
      script.onload = initializeAppleID;
      script.onerror = () => console.error('Failed to load Apple Sign-In SDK');
      document.body.appendChild(script);
    } else {
      initializeAppleID();
    }
  }, []);

  const handleAppleSignIn = (response) => {
    const appleToken = response.authorization.id_token;

    fetch('/api/auth/apple/web/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ apple_token: appleToken }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Sign-in successful:', data);
        // Redirect to /dashboard
        navigate('/dashboard');
      })
      .catch((error) => {
        console.error('Error during authentication:', error);
      });
  };

  return (
    <div>
      <div id="appleid-signin" onClick={() => window.AppleID.auth.signIn()}></div>
    </div>
  );
};

export default AppleSignInButton;
