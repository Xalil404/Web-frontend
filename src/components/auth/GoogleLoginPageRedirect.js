



import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const GoogleLoginPageRedirect = () => {
    const navigate = useNavigate();  // Initialize navigate function

    return (
        <GoogleOAuthProvider clientId="26271032790-djnijd5ookmvg0d58pneg2l8l6bdgvbn.apps.googleusercontent.com">
            <div>
                <h1>Sign in with Google</h1>
                <GoogleLogin
                    ux_mode="redirect"  // Use redirect mode for this flow
                    redirectUri="https://backend-django-9c363a145383.herokuapp.com/api/auth/google-redirect/"  // The redirect URI to handle the authorization response
                    onSuccess={(response) => {
                        console.log('Success', response);
                        // If we successfully get the response, handle login success.
                        navigate('/dashboard'); // Redirect after successful login
                    }}
                    onError={() => console.error('Login Failed')}
                />
            </div>
        </GoogleOAuthProvider>
    );
};

export default GoogleLoginPageRedirect;


