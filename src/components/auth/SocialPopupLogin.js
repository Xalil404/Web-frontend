import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { loginUser } from '../../services/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Initialize Apple Sign-In SDK
    useEffect(() => {
        if (window.AppleID) {
            window.AppleID.auth.init({
                clientId: 'com.template.applicationwebproject',
                scope: 'name email',
                redirectURI: 'https://web-frontend-dun.vercel.app/auth/callback',
                state: 'state',
                usePopup: true,
            });
        }
    }, []);

    // Handle email/password login
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

    // Handle Apple login
    const handleAppleLogin = () => {
        if (!window.AppleID) return console.error('AppleID SDK not loaded');

        window.AppleID.auth
            .signIn()
            .then((response) => {
                const { id_token } = response.authorization;
                authenticateWithBackend(id_token, 'apple');
            })
            .catch((error) => console.error('Apple Sign-In error:', error));
    };

    // Handle Google login
    const handleGoogleLogin = (response) => {
        const token = response.credential;
        authenticateWithBackend(token, 'google');
    };

    // Authenticate token with the backend
    const authenticateWithBackend = (token, provider) => {
        fetch(`https://backend-django-9c363a145383.herokuapp.com/api/auth/${provider}/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.token) {
                    localStorage.setItem('authToken', data.token);
                    navigate('/dashboard');
                } else {
                    console.error('Authentication failed:', data.error);
                }
            })
            .catch((error) => console.error('Error during authentication:', error));
    };

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-6 d-none d-md-block">
                    <img
                        src="https://res.cloudinary.com/dnbbm9vzi/image/upload/v1732203242/a_uc4bwg.png"
                        className="img-fluid"
                        alt="Login"
                    />
                </div>
                <div className="col-md-6">
                    <div className="card" style={{ border: 'none' }}>
                        <div className="card-header-a text-center card-header-custom">
                            <h2>Sign in to Project Name</h2>
                        </div>
                        <div className="card-body">
                            {/* Apple Login */}
                            <button
                                onClick={handleAppleLogin}
                                className="btn btn-dark mb-3 w-100"
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <img
                                    src="https://res.cloudinary.com/dnbbm9vzi/image/upload/v1733920625/Screenshot_2024-12-11_at_11.18.52_AM-removebg-preview_fb6w8s.png"
                                    alt="Apple logo"
                                    style={{ width: '20px', height: '20px', marginRight: '10px' }}
                                />
                                Sign in with Apple
                            </button>

                            {/* Google Login */}
                            <GoogleOAuthProvider clientId="26271032790-djnijd5ookmvg0d58pneg2l8l6bdgvbn.apps.googleusercontent.com">
                                <GoogleLogin
                                    onSuccess={handleGoogleLogin}
                                    onError={() => console.error('Google Login Failed')}
                                    className="mb-3 w-100"
                                    ux_mode="popup"
                                />
                            </GoogleOAuthProvider>

                            {/* Divider with text */}
                            <div className="text-center my-3">
                                <div className="d-flex align-items-center justify-content-center">
                                    <hr className="flex-grow-1 border-top border-secondary" />
                                    <span className="mx-3 text-dark" style={{ whiteSpace: 'nowrap' }}>
                                        or sign in with email
                                    </span>
                                    <hr className="flex-grow-1 border-top border-secondary" />
                                </div>
                            </div>


                            {/* Email/Password Login */}
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
                                <button
                                    type="submit"
                                    className="btn btn-lg mx-auto d-block w-100 py-3 rounded-button"
                                    style={{ backgroundColor: '#E8BF73', color: 'black' }}
                                    disabled={loading}
                                >
                                    {loading ? 'Logging in...' : 'Sign In'}
                                </button>
                            </form>

                            {error && <p style={{ color: 'red' }}>{error}</p>}

                            <p className="text-center mt-3">
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
