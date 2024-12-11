import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { loginUser } from '../../services/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState({ emailPassword: null, google: null, apple: null });
    const [authLoading, setAuthLoading] = useState({ emailPassword: false, google: false, apple: false });
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
    const handleEmailPasswordLogin = async (e) => {
        e.preventDefault();
        setAuthLoading((prev) => ({ ...prev, emailPassword: true }));
        setAuthError((prev) => ({ ...prev, emailPassword: null }));

        try {
            const response = await loginUser({ email, password });
            localStorage.setItem('authToken', response.token);
            navigate('/dashboard');
        } catch (error) {
            const errorMessage = error.non_field_errors
                ? error.non_field_errors[0]
                : 'Login failed. Please try again.';
            setAuthError((prev) => ({ ...prev, emailPassword: errorMessage }));
        } finally {
            setAuthLoading((prev) => ({ ...prev, emailPassword: false }));
        }
    };

    // Handle Apple login
    const handleAppleLogin = () => {
        setAuthLoading((prev) => ({ ...prev, apple: true }));
        setAuthError((prev) => ({ ...prev, apple: null }));

        if (!window.AppleID) {
            console.error('AppleID SDK not loaded');
            setAuthError((prev) => ({ ...prev, apple: 'Apple SDK not loaded.' }));
            setAuthLoading((prev) => ({ ...prev, apple: false }));
            return;
        }

        window.AppleID.auth
            .signIn()
            .then((response) => {
                const { id_token } = response.authorization;
                authenticateWithBackend(id_token, 'apple', 'apple');
            })
            .catch((error) => {
                console.error('Apple Sign-In error:', error);
                setAuthError((prev) => ({ ...prev, apple: 'Apple login failed. Please try again.' }));
                setAuthLoading((prev) => ({ ...prev, apple: false }));
            });
    };

    // Handle Google login
    const handleGoogleLogin = (response) => {
        setAuthLoading((prev) => ({ ...prev, google: true }));
        setAuthError((prev) => ({ ...prev, google: null }));

        const token = response.credential;
        authenticateWithBackend(token, 'google', 'google');
    };

    // Authenticate token with the backend
    const authenticateWithBackend = (token, provider, errorKey) => {
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
                    setAuthError((prev) => ({ ...prev, [errorKey]: 'Authentication failed. Please try again.' }));
                }
            })
            .catch((error) => {
                console.error('Error during authentication:', error);
                setAuthError((prev) => ({ ...prev, [errorKey]: 'An error occurred. Please try again.' }));
            })
            .finally(() => {
                setAuthLoading((prev) => ({ ...prev, [errorKey]: false }));
            });
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
                                disabled={authLoading.apple}
                            >
                                <img
                                    src="https://res.cloudinary.com/dnbbm9vzi/image/upload/v1733920625/Screenshot_2024-12-11_at_11.18.52_AM-removebg-preview_fb6w8s.png"
                                    alt="Apple logo"
                                    style={{ width: '20px', height: '20px', marginRight: '10px' }}
                                />
                                {authLoading.apple ? 'Signing in with Apple...' : 'Sign in with Apple'}
                            </button>
                            {authError.apple && <p style={{ color: 'red' }}>{authError.apple}</p>}

                            {/* Google Login */}
                            <GoogleOAuthProvider clientId="26271032790-djnijd5ookmvg0d58pneg2l8l6bdgvbn.apps.googleusercontent.com">
                                <GoogleLogin
                                    onSuccess={handleGoogleLogin}
                                    onError={() =>
                                        setAuthError((prev) => ({ ...prev, google: 'Google login failed.' }))
                                    }
                                    className="mb-3 w-100"
                                    ux_mode="popup"
                                />
                            </GoogleOAuthProvider>
                            {authError.google && <p style={{ color: 'red' }}>{authError.google}</p>}

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
                            <form onSubmit={handleEmailPasswordLogin}>
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
                                    disabled={authLoading.emailPassword}
                                >
                                    {authLoading.emailPassword ? 'Logging in...' : 'Sign In'}
                                </button>
                            </form>
                            {authError.emailPassword && <p style={{ color: 'red' }}>{authError.emailPassword}</p>}

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

