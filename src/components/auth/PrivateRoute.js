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
