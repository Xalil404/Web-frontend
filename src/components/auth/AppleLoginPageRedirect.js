import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AppleRedirectHandler = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    handleAppleAuth();
  }, []);

  // Function to handle the POST request from Apple
  const handleAppleAuth = async () => {
    try {
      // Extract the form data from the POST request
      const form = document.getElementById('apple-auth-form');
      const formData = new FormData(form);
      const code = formData.get('code');
      const user = formData.get('user'); // Apple may include user information
      const state = formData.get('state');

      if (!code) {
        throw new Error('Authorization code is missing');
      }

      setLoading(true);

      // Send the code and user information to the backend for verification
      const response = await fetch('https://backend-django-9c363a145383.herokuapp.com/api/auth/apple/web/redirect/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, user, state }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the token in localStorage for persistent login
        if (data.token) {
          localStorage.setItem('authToken', data.token);
        }

        // Redirect the user to the /dashboard page
        if (data.redirect) {
          window.location.href = data.redirect;
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

  return (
    <div>
      <h1>Apple Redirect Handler</h1>
      <form id="apple-auth-form" method="post">
        <input type="hidden" name="code" />
        <input type="hidden" name="user" />
        <input type="hidden" name="state" />
      </form>
      {loading && <p>Authenticating...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default AppleRedirectHandler;


