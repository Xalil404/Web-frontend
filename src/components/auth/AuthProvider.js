// src/components/auth/AuthProvider.js
import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

const AuthProvider = ({ children }) => {
    return (
        <GoogleOAuthProvider clientId="26271032790-djnijd5ookmvg0d58pneg2l8l6bdgvbn.apps.googleusercontent.com">
            {children}
        </GoogleOAuthProvider>
    );
};

export default AuthProvider;
