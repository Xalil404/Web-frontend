import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AppleRedirectLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = () => {
    setLoading(true);
    
    const clientId = 'com.template.applicationwebproject';
    const redirectUri = 'https://web-frontend-dun.vercel.app/apple-redirect';
    const appleAuthUrl = `https://appleid.apple.com/auth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&response_mode=form_post&scope=name%20email&state=random_state`;

    window.location.href = appleAuthUrl; // Redirect the user to Apple login page
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


