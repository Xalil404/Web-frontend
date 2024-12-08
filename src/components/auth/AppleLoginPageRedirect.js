import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // If using React Router for navigation

const AppleRedirectLogin = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Only needed if using React Router

  // Function to handle Apple login
  const handleLogin = () => {
    const clientId = 'com.template.applicationwebproject'; // Your Apple client ID
    const redirectUri = 'https://web-frontend-dun.vercel.app/auth/callback'; // Replace with your frontend redirect URI
    const state = Math.random().toString(36).substring(2); // Optional CSRF protection state
    const scope = 'name email'; // Define the required scopes

    // Redirect to Apple's authorization page
    window.location.href = `https://appleid.apple.com/auth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}&response_mode=form_post`;
  };

  // Function to handle the redirect after successful Apple login
  const handleAppleRedirect = async () => {
    // Extract the code from the query parameters
    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get('code'); // Apple sends the code in the URL query

    if (!code) {
      return; // Exit if no code is found
    }

    try {
      setLoading(true);

      // Send the code to the backend for verification
      const response = await fetch('https://backend-django-9c363a145383.herokuapp.com/api/auth/apple/web-redirect/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }), // Send the code to your backend
      });

      const data = await response.json();

      if (response.ok) {
        // Store the authentication token for persistent login
        if (data.token) {
          localStorage.setItem('authToken', data.token);
        }

        // Redirect the user to the dashboard or home page
        if (data.redirect) {
          window.location.href = data.redirect; // Full-page redirect (or use React Router's navigate)
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
    // If the component loads with a query parameter (i.e., after Apple redirects back)
    if (window.location.search.includes('code')) {
      handleAppleRedirect(); // Handle the redirect with the code
    }
  }, []);

  return (
    <div>
      <h1>Apple Redirect Login</h1>

      {/* Apple Login Button */}
      <button 
        onClick={handleLogin} 
        disabled={loading}
        style={{
          backgroundColor: '#000', 
          color: '#fff', 
          fontSize: '16px', 
          padding: '12px 24px', 
          borderRadius: '10px',
          width: '100%',
          maxWidth: '400px',
          cursor: 'pointer'
        }}
      >
        {loading ? 'Redirecting...' : 'Login with Apple'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default AppleRedirectLogin;
