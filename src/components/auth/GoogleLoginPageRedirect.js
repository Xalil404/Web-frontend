import React, { useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from '@react-oauth/google';
import { useNavigate, useLocation } from 'react-router-dom';

const GoogleLoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const responseGoogle = (response) => {
        console.log("Google Response:", response);

        const userData = {
            token: response.credential,
        };

        // Send the token to your Django backend
        fetch('https://backend-django-9c363a145383.herokuapp.com/api/auth/google/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })
        .then((res) => res.json())
        .then((data) => {
            console.log("Backend Response:", data);
            if (data.token) {
                localStorage.setItem('authToken', data.token);
                navigate('/dashboard'); // Redirect to dashboard
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    useEffect(() => {
        // Check for Google redirect response
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        const state = params.get('state');

        if (code) {
            console.log("Authorization Code:", code);
            // Exchange the code with your backend to get the token
            fetch('https://backend-django-9c363a145383.herokuapp.com/api/auth/google/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code, state }),
            })
            .then((res) => res.json())
            .then((data) => {
                if (data.token) {
                    localStorage.setItem('authToken', data.token);
                    navigate('/dashboard');
                }
            })
            .catch((error) => console.error('Error:', error));
        }
    }, [location, navigate]);

    return (
        <GoogleOAuthProvider clientId="YOUR_CLIENT_ID">
            <div>
                <h1>Google Login</h1>
                <GoogleLogin
                    ux_mode="redirect"
                    redirectUri="https://web-frontend-dun.vercel.app/google-login-redirect"
                    //redirectUri="http://localhost:3000/google-login-redirect"
                    onSuccess={responseGoogle}
                    onError={() => console.error('Login Failed')}
                />
            </div>
        </GoogleOAuthProvider>
    );
};

export default GoogleLoginPage;
