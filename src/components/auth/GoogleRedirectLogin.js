// GoogleRedirectLogin.js (Frontend - React)
// GoogleRedirectLogin.js
import React, { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';

const GoogleRedirectLogin = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userToken, setUserToken] = useState(null);

  // Function to handle redirect response from Google
  const handleGoogleRedirect = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('credential'); // Google returns 'credential' as the query parameter

    if (token) {
      try {
        setLoading(true);

        // Send the token to the backend for verification
        const response = await fetch('https://backend-django-9c363a145383.herokuapp.com/api/auth/google-redirect/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          // Save the token or use it as needed
          setUserToken(data.token);
          console.log('User authenticated successfully:', data);
        } else {
          throw new Error(data.error || 'Authentication failed.');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error during authentication:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    handleGoogleRedirect(); // Call the function when the component mounts
  }, []);

  const handleLogin = () => {
    // Redirect the user to Google's login page
    const clientId = '26271032790-djnijd5ookmvg0d58pneg2l8l6bdgvbn.apps.googleusercontent.com';
    const redirectUri = 'https://web-frontend-dun.vercel.app/google-redirect'; // Replace with your frontend redirect URI
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=id_token&scope=openid%20email%20profile&nonce=random_nonce`;

    window.location.href = googleAuthUrl; // Redirect the user
  };

  return (
    <div>
      <h1>Google Redirect Login</h1>

      <button onClick={handleLogin} disabled={loading}>
        {loading ? 'Redirecting...' : 'Login with Google'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {userToken && <p>Authentication successful. User token: {userToken}</p>}
    </div>
  );
};

export default GoogleRedirectLogin;
