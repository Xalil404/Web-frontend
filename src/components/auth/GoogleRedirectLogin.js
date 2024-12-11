import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Only if using React Router


const GoogleRedirectLogin = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Only needed if using React Router

  // Function to handle the redirect response from Google
  const handleGoogleRedirect = async () => {
    // Parse the URL fragment for the id_token
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const idToken = hashParams.get('id_token'); // Google provides the token in the URL fragment

    if (!idToken) {
      return; // Exit the function if there's no id_token
    }

    try {
      setLoading(true);

      // Send the token to the backend for verification
      const response = await fetch('https://backend-django-9c363a145383.herokuapp.com/api/auth/google-redirect/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: idToken }),
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
      <h1>Google Login</h1>
      <button
        onClick={handleLogin}
        disabled={loading}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#4285F4', // Google blue
          color: '#fff',
          width: '300px', // Rectangle size
          height: '50px',
          borderRadius: '5px', // Rounded corners
          fontSize: '16px',
          fontWeight: 'bold',
          border: 'none',
          cursor: 'pointer',
          paddingLeft: '10px', // Space between the icon and text
          paddingRight: '10px', // Space between the icon and text
        }}
      >
        {/* Google icon */}
        <img
          src="https://res.cloudinary.com/dnbbm9vzi/image/upload/v1733915214/web_neutral_rd_na_4x_ykttf8.png"
          alt="Google Logo"
          style={{ width: '40px', height: '40px', marginRight: '10px' }} // Adjust icon size
        />
        {loading ? 'Redirecting...' : 'Sign in with Google'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>

    /*
    <div>
      <h1>Google Redirect Login</h1>

      <button onClick={handleLogin} disabled={loading}>
        {loading ? 'Redirecting...' : 'Login with Google'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
    */
  );
};

export default GoogleRedirectLogin;
