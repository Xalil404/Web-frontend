import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AppleSignInPage = () => {
    const navigate = useNavigate();  // Initialize navigate function

    useEffect(() => {
        const initializeAppleSignIn = () => {
            if (window.AppleID && window.AppleID.auth) {
                window.AppleID.auth.init({
                    clientId: 'com.template.applicationwebproject', // Your Apple Service ID
                    scope: 'email name',
                    redirectURI: 'https://web-frontend-dun.vercel.app/auth/callback', // Your callback URL
                    state: 'some-state', // Optional for CSRF protection
                    nonce: 'random-nonce', // Optional for extra security
                });

                window.AppleID.auth.onSuccess = (response) => {
                    handleAppleSignIn(response);
                };

                window.AppleID.auth.onFailure = (error) => {
                    console.error('Apple Sign-In Error: ', error);
                };
            } else {
                console.error('AppleID.auth is not available');
            }
        };

        if (!window.AppleID) {
            const script = document.createElement('script');
            script.src = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
            script.onload = initializeAppleSignIn;
            script.onerror = () => console.error('Failed to load Apple Sign-In SDK');
            document.body.appendChild(script);
        } else {
            initializeAppleSignIn();
        }
    }, []);

    const handleAppleSignIn = (response) => {
        const appleToken = response.authorization.id_token;

        // Send token to backend to authenticate the user
        fetch('/api/auth/apple/web/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ apple_token: appleToken }),
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.token) {
                // Save the token locally
                localStorage.setItem('authToken', data.token);

                // Redirect to dashboard or home page
                navigate('/dashboard');
            } else {
                console.error('Authentication failed');
            }
        })
        .catch((error) => {
            console.error('Error during Apple authentication:', error);
        });
    };

    return (
        <div>
            <h1>Apple Login</h1>
            <div id="appleid-signin" onClick={() => window.AppleID.auth.signIn()}></div>
        </div>
    );
};

export default AppleSignInPage;
