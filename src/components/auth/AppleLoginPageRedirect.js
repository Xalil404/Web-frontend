import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AppleRedirectLogin = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Function to handle the redirect response from Apple
  const handleAppleRedirect = async () => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code'); // Apple provides the authorization code in the URL

    if (!code) {
      return; // Exit the function if there's no authorization code
    }

    try {
      setLoading(true);

      // Send the code to the backend for verification
      const response = await fetch('https://backend-django-9c363a145383.herokuapp.com/api/auth/apple/web/redirect/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the token in localStorage for persistent login
        if (data.token) {
          localStorage.setItem('authToken', data.token);
        }

        // Redirect the user to the /dashboard page
        if (data.redirect) {
          window.location.href = data.redirect; // Full-page reload
        }
      } else {
        throw new Error(data.error || 'Authentication failed.');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error during authentication:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleAppleRedirect(); // Call the function when the component mounts
  }, []);

  const handleLogin = () => {
    // Redirect the user to Apple's login page
    const clientId = 'com.template.applicationwebproject';
    const redirectUri = 'https://web-frontend-dun.vercel.app/apple-redirect';
    const appleAuthUrl = `https://appleid.apple.com/auth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code%20id_token&response_mode=form_post&scope=name%20email&state=random_state`;

    window.location.href = appleAuthUrl; // Redirect the user
  };

  return (
    <div>
      <h1>Apple Redirect Login</h1>

      <button onClick={handleLogin} disabled={loading}>
        {loading ? 'Redirecting...' : 'Login with Apple'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default AppleRedirectLogin;





