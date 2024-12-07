import React from 'react';
import { GoogleLogin } from '@react-oauth/google'; // Use the GoogleLogin component
import { useNavigate } from 'react-router-dom';
import AuthProvider from './AuthProvider'; // Import the AuthProvider

const GoogleRedirectLogin = () => {
    const navigate = useNavigate();

    const handleSuccess = async (response) => {
        console.log('Google Response:', response);

        const userData = {
            token: response.credential,
        };

        // Send token to the Django backend
        fetch('https://backend-django-9c363a145383.herokuapp.com/api/auth/google-redirect/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log('Backend Response:', data);
                if (data.token) {
                    localStorage.setItem('authToken', data.token);
                    navigate('/dashboard');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    const handleError = (error) => {
        console.error('Login Failed:', error);
    };

    return (
        <div>
            <h1>Google Redirect Login</h1>
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
                ux_mode="redirect"
                redirectUri="https://web-frontend-dun.vercel.app/google-redirect/google/callback/" // Update for your app's domain
            />
        </div>
    );
};

// Wrap with AuthProvider and export
const WrappedGoogleRedirectLogin = () => (
    <AuthProvider>
        <GoogleRedirectLogin />
    </AuthProvider>
);

export default WrappedGoogleRedirectLogin;
