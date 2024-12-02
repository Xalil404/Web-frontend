// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const authToken = localStorage.getItem('authToken'); // Check for token in localStorage

    return authToken ? children : <Navigate to="/" />; // Redirect to home if not logged in
};

export default PrivateRoute;
