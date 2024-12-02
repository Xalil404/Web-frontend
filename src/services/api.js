// src/services/api.js
import axios from 'axios';

const AUTH_URL = 'https://backend-django-9c363a145383.herokuapp.com/auth'; // Authentication base URL
const API_URL = 'https://backend-django-9c363a145383.herokuapp.com/api'; // API base URL for actions

// Set up Axios instance
const api = axios.create({
    baseURL: API_URL,
});

// Add a request interceptor
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken'); // Retrieve the token from local storage
    if (token) {
        config.headers.Authorization = `Token ${token}`; // Assuming your backend uses 'Token' scheme
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Function to register a new user
export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${AUTH_URL}/registration/`, userData);
        return response.data; // Returns the user data from the response
    } catch (error) {
        throw error.response.data; // Customize this based on your needs
    }
};

// Function to log in a user
export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(`${AUTH_URL}/login/`, credentials);
        console.log('Login Response:', response.data); // Log the response data
        // Store user ID in local storage
        localStorage.setItem('user', response.data.user); // Use 'userId' for consistency
        console.log('User ID saved:', response.data.user);
        return { token: response.data.key }; // Return the token
    } catch (error) {
        throw error.response.data;
    }
};

// Function to fetch user profile
export const fetchUserProfile = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/profile/`, {
            headers: { Authorization: `Token ${token}` }
        });
        return response.data; // Returns the user profile data
    } catch (error) {
        throw error.response.data; // Handle the error response
    }
};