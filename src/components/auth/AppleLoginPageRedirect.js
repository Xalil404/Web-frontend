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
            <a href={`https://appleid.apple.com/auth/authorize?client_id=com.template.applicationwebproject&redirect_uri=https://web-frontend-dun.vercel.app/auth/callback&response_type=code&scope=name email&state=state&response_mode=form_post`}>
                Sign in with Apple
            </a>
        </div>
    );
};

export default AppleRedirectLoginPage;
