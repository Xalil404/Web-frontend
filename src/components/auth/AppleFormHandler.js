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
    const state = formData.get('state');

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
        body: JSON.stringify({ code, state }),
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');

    if (code && state) {
      const form = document.getElementById('apple-auth-form');
      const codeInput = document.createElement('input');
      codeInput.type = 'hidden';
      codeInput.name = 'code';
      codeInput.value = code;
      form.appendChild(codeInput);

      const stateInput = document.createElement('input');
      stateInput.type = 'hidden';
      stateInput.name = 'state';
      stateInput.value = state;
      form.appendChild(stateInput);

      form.submit();
    }
  }, []);

  return (
    <form id="apple-auth-form" onSubmit={handleAppleFormSubmit}>
      <button type="submit" disabled={loading}>
        {loading ? 'Authenticating...' : 'Submit'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default AppleFormHandler;
