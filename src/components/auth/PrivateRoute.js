// src/components/PrivateRoute.js
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const [authToken, setAuthToken] = useState(localStorage.getItem('authToken')); // For Gmail
    const [appleAuthToken, setAppleAuthToken] = useState(localStorage.getItem('apple_auth_token')); // For Apple login

    useEffect(() => {
        const gmailToken = localStorage.getItem('authToken');
        const appleToken = localStorage.getItem('apple_auth_token');
        setAuthToken(gmailToken);
        setAppleAuthToken(appleToken);
    }, []);

    // Check if either token exists
    return authToken || appleAuthToken ? children : <Navigate to="/" />;
};

export default PrivateRoute;

/*
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const authToken = localStorage.getItem('authToken'); // Check for token in localStorage

    return authToken ? children : <Navigate to="/" />; // Redirect to home if not logged in
};

export default PrivateRoute;
*/