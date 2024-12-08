// src/components/PrivateRoute.js
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const [authToken, setAuthToken] = useState(localStorage.getItem('authToken')); // Use the same token for all login types (Gmail, Apple, etc.)

    useEffect(() => {
        // Fetch the token from localStorage
        const token = localStorage.getItem('authToken');
        setAuthToken(token);
    }, []);

    // Check if the authToken exists, if it does, render the children, otherwise redirect to the home page
    return authToken ? children : <Navigate to="/" />;
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