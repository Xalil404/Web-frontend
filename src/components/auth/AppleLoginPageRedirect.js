import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AppleRedirectLoginPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
            authenticateWithBackend(code);
        }
    }, []);

    const authenticateWithBackend = (code) => {
        fetch('https://backend-django-9c363a145383.herokuapp.com/api/auth/apple/web/redirect/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            if (data.token) {
                console.log('Authentication successful:', data);

                // Store the token under 'authToken' for all login types
                localStorage.setItem('authToken', data.token);
                console.log('Auth Token:', localStorage.getItem('authToken')); // Check if token is saved

                // Redirect to the specified location (e.g., dashboard)
                console.log('Redirecting to:', data.redirect);
                window.location.href = data.redirect;
            } else {
                console.error('Error during authentication:', data.error);
            }
        })
        .catch((error) => {
            console.error('Error during fetch:', error.message);
        });
    };

    return (
        <div className="apple-login-container">
  <h2>Login with Apple</h2>
  <a 
    href={`https://appleid.apple.com/auth/authorize?client_id=com.template.applicationwebproject&redirect_uri=https://web-frontend-dun.vercel.app/auth/callback&response_type=code&scope=name email&state=state&response_mode=form_post`}
    style={{
      display: 'inline-block',
      width: '300px',
      height: '40px',
      backgroundColor: '#000', // Apple button color
      color: '#fff', // Text color
      textAlign: 'center', // Center text
      lineHeight: '40px', // Vertically center text
      borderRadius: '10px', // Rounded corners
      fontSize: '16px', // Adjust text size
      textDecoration: 'none', // Remove underline
      fontWeight: 'bold', // Bold text
    }}
  >
    {/* Apple Logo */}
    <img
          src="https://res.cloudinary.com/dnbbm9vzi/image/upload/v1733915956/Screenshot_2024-12-11_at_11.18.52_AM_em2xfe.png"
          alt="Apple logo"
          style={{
            width: '20px', // Apple logo size
            height: '20px', // Apple logo size
            marginRight: '10px', // Space between logo and text
          }}
        />
    Sign in with Apple
  </a>
</div>

        /*
        <div className="apple-login-container">
            <h2>Login with Apple</h2>
            <a href={`https://appleid.apple.com/auth/authorize?client_id=com.template.applicationwebproject&redirect_uri=https://web-frontend-dun.vercel.app/auth/callback&response_type=code&scope=name email&state=state&response_mode=form_post`}>
                Sign in with Apple
            </a>
        </div>
        */
    );
};

export default AppleRedirectLoginPage;
