import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Only needed if using React Router

const AppleRedirectLogin = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Only needed if using React Router

  // Function to handle the redirect response from Apple
  const handleAppleRedirect = async () => {
    // Parse the URL query for the code parameter (Apple sends the code in the URL query)
    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get('code'); // Apple provides the authorization code in the query params

    if (!code) {
      return; // Exit the function if there's no authorization code
    }

    try {
      setLoading(true);

      // Send the authorization code to the backend for verification
      const response = await fetch('https://backend-django-9c363a145383.herokuapp.com/api/auth/apple/web-redirect/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }), // Send the authorization code received from Apple
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
          // OR use React Router for smoother navigation
          // navigate(data.redirect);
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

  // Function to initiate the Apple login redirect
  const handleLogin = () => {
    const clientId = 'com.template.applicationwebproject'; // Your Apple client ID
    const redirectUri = 'https://web-frontend-dun.vercel.app/auth/callback'; // Your frontend redirect URI
    const state = Math.random().toString(36).substring(2); // Optional: CSRF protection state
    const scope = 'name email'; // Define what data you want from the user (e.g., name, email)

    // Redirect to Apple's authorization page
    window.location.href = `https://appleid.apple.com/auth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}&response_mode=form_post`;
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
