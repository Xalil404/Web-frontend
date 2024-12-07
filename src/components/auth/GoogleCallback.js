import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GoogleCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('credential');

        if (token) {
            // Send the token to the backend for verification
            fetch('https://backend-django-9c363a145383.herokuapp.com/api/auth/google-redirect/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.token) {
                        localStorage.setItem('authToken', data.token);
                        navigate('/dashboard'); // Redirect to dashboard
                    }
                })
                .catch((error) => {
                    console.error('Error verifying token:', error);
                });
        } else {
            console.error('Token not found in redirect URI');
        }
    }, [navigate]);

    return <div>Processing login...</div>;
};

export default GoogleCallback;
