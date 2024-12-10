import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AppleFormHandler = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle the form POST request from Apple
  const handleAppleFormSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const code = formData.get('code');

    if (!code) {
      setError('Authorization code is missing');
      return;
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
    <form onSubmit={handleAppleFormSubmit}>
      <input type="hidden" name="code" />
      <input type="hidden" name="state" />
      <button type="submit" disabled={loading}>
        {loading ? 'Authenticating...' : 'Submit'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default AppleFormHandler;
