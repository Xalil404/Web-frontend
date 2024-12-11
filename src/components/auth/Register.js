// src/components/Register.js
import React, { useState } from 'react';
import { registerUser } from '../../services/api'; // Import the registerUser function
import { loginUser } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [error, setError] = useState('');
    const [showEmailFields, setShowEmailFields] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear any previous errors
        try {
            // Register the user
            const response = await registerUser({ username, email, password1, password2 });
            console.log('Registration Response:', response); // Log the registration response
    
            // Automatically log in the user after registration
            const loginResponse = await loginUser({ username, password: password1 });
            localStorage.setItem('authToken', loginResponse.token); // Save token for authentication
    
            // Redirect to the dashboard
            navigate('/dashboard');
        } catch (error) {
            console.error('Error during registration/login:', error);
            setError('Registration failed. Please check your details.');
        }
    };
    

    return (
        <div className="container mt-5">
            <div className="row">
                {/* Left Column for Image */}
                <div className="col-md-6 d-none d-md-block">
                    <img 
                        src="https://res.cloudinary.com/dnbbm9vzi/image/upload/v1732204366/Group_32932_uditd0.png" 
                        className="img-fluid" 
                        alt="Register" 
                    />
                </div>

                <div className="col-md-6">
                    <div className="card" style={{ border: 'none' }}>
                        <div className="card-header-1 text-center card-header-custom">
                            <h2>Sign Up to Project Name</h2>
                        </div>
                         {/* Divider with text */}
                         <div className="text-center my-3">
                                <div className="d-flex align-items-center justify-content-center">
                                    <hr className="flex-grow-1 border-top border-secondary" />
                                    <span className="mx-3 text-dark" style={{ whiteSpace: 'nowrap' }}>
                                        or sign up with email
                                    </span>
                                    <hr className="flex-grow-1 border-top border-secondary" />
                                </div>
                            </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                {/* Continue with email button */}
                                <div className="social-login-buttons text-center mb-3">
                                    <button 
                                        type="button" 
                                        className="btn btn-lg mx-auto d-block w-100 py-3 rounded-button" 
                                        id="email-button" 
                                        style={{ backgroundColor: '#E8BF73', color: 'black' }}
                                        onClick={() => setShowEmailFields(true)}
                                    >
                                        Continue with Email
                                    </button>
                                </div>

                                {/* Email registration fields (initially hidden) */}
                                {showEmailFields && (
                                    <div id="email-fields">
                                        <input
                                            type="text"
                                            className="form-control mb-3"
                                            placeholder="Username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                        />
                                        <input
                                            type="email"
                                            className="form-control mb-3"
                                            placeholder="Email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                        <input
                                            type="password"
                                            className="form-control mb-3"
                                            placeholder="Password"
                                            value={password1}
                                            onChange={(e) => setPassword1(e.target.value)}
                                            required
                                        />
                                        <input
                                            type="password"
                                            className="form-control mb-3"
                                            placeholder="Confirm Password"
                                            value={password2}
                                            onChange={(e) => setPassword2(e.target.value)}
                                            required
                                        />
                                        <div className="social-login-buttons">
                                            <button 
                                                type="submit" 
                                                className="btn btn-lg mx-auto d-block w-100 py-3 rounded-button" 
                                                id="signup-button" 
                                                style={{ backgroundColor: '#E8BF73', color: 'black' }}
                                            >
                                                Sign Up
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {error && <p style={{ color: 'red' }}>{error}</p>}
                            </form>
                            <hr />
                            <p className="text-center">
                                Already have an account? <a href="/login" className="text-dark">Sign in</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
