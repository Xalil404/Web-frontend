// GoogleRedirectHandler.jsx
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const GoogleRedirectHandler = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Extract 'code' and 'state' from the query string
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        const state = params.get('state');

        if (code) {
            console.log("Authorization Code:", code);

            // Send the code and state to your backend to get the token
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
                    // Store the token in localStorage
                    localStorage.setItem('authToken', data.token);

                    // Redirect to dashboard after successful login
                    navigate('/dashboard');
                }
            })
            .catch((error) => console.error('Error:', error));
        } else {
            console.error('Authorization code missing');
        }
    }, [location, navigate]);

    return <div>Redirecting...</div>;
};

export default GoogleRedirectHandler;
