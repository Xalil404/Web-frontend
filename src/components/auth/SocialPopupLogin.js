// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/api';
import GoogleLoginPagePopup from '../auth/GoogleLoginPagePopup'; // Import Google Login
import AppleLoginPage from '../auth/AppleLoginPage'; // Import Apple Login

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await loginUser({ email, password });
            localStorage.setItem('authToken', response.token);
            navigate('/dashboard');
        } catch (error) {
            const errorMessage = error.non_field_errors
                ? error.non_field_errors[0]
                : 'Login failed. Please try again.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row">
                {/* Left Column for Image */}
                <div className="col-md-6 d-none d-md-block">
                    <img
                        src="https://res.cloudinary.com/dnbbm9vzi/image/upload/v1732203242/a_uc4bwg.png"
                        className="img-fluid"
                        alt="Login"
                    />
                </div>

                {/* Right Column for Login Form */}
                <div className="col-md-6">
                    <div className="card" style={{ border: 'none' }}>
                        <div className="card-header-a text-center card-header-custom">
                            <h2>Sign in to Project Name</h2>
                        </div>

                        {/* Divider with text */}
                        <div className="text-center my-3">
                            <div className="d-flex align-items-center justify-content-center">
                                <hr className="flex-grow-1 border-top border-secondary" />
                                <span className="mx-3 text-dark" style={{ whiteSpace: 'nowrap' }}>
                                    or sign in with
                                </span>
                                <hr className="flex-grow-1 border-top border-secondary" />
                            </div>
                        </div>

                        <div className="card-body">
                            {/* Google and Apple Login Buttons */}
                            <div className="social-login-buttons mb-3">
                                <GoogleLoginPagePopup />
                                <AppleLoginPage />
                            </div>

                            {/* Divider */}
                            <div className="text-center my-3">
                                <div className="d-flex align-items-center justify-content-center">
                                    <hr className="flex-grow-1 border-top border-secondary" />
                                    <span className="mx-3 text-dark" style={{ whiteSpace: 'nowrap' }}>
                                        or sign in with email
                                    </span>
                                    <hr className="flex-grow-1 border-top border-secondary" />
                                </div>
                            </div>

                            {/* Email/Password Login Form */}
                            <form onSubmit={handleSubmit}>
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
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <div className="social-login-buttons">
                                    <button
                                        type="submit"
                                        className="btn btn-lg mx-auto d-block w-100 py-3 rounded-button"
                                        style={{ backgroundColor: '#E8BF73', color: 'black' }}
                                        disabled={loading}
                                    >
                                        {loading ? 'Logging in...' : 'Sign In'}
                                    </button>
                                </div>
                            </form>

                            {/* Error Message */}
                            {error && <p style={{ color: 'red' }}>{error}</p>}

                            <hr />

                            {/* Links for Forgot Password and Sign Up */}
                            <p className="text-center">
                                <a href="https://backend-django-9c363a145383.herokuapp.com/accounts/password/reset/" className="text-dark">
                                    Forgot Password?
                                </a>
                            </p>
                            <p className="text-center">
                                Don't have an account?{' '}
                                <a href="/register" className="text-dark">
                                    Sign up
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;


