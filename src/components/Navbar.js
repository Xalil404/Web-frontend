import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Header = () => {
    const location = useLocation();
    const isAuthenticated = Boolean(localStorage.getItem('authToken')); // Replace with your auth logic

    // Check if the current path is the home page
    const isHomePage = location.pathname === '/';

    // Render nothing if not on the home page
    if (!isHomePage) return null;

    return (
        <div className="navcolor">
            <nav className="navbar navbar-expand-lg navbar-light py-3 sticky-top">
                <div className="container-fluid">
                    {/* Logo (Top Left) */}
                    <Link className="navbar-brand ms-5 order-2 order-lg-1" to="/">
                        <img 
                            src="https://res.cloudinary.com/dnbbm9vzi/image/upload/v1732205459/Screenshot_2024-11-21_at_4.10.09_PM-removebg-preview_fj4w6b.png" 
                            alt="Logo" 
                            className="logo-image" 
                            style={{ width: '200px' }} 
                        />
                    </Link>

                    {/* Navbar Links (Top Left) */}
                    <div className="collapse navbar-collapse order-3 order-lg-2" id="navbarText">
                        <ul className="navbar-nav mb-2 mb-lg-0 me-auto">
                            {isAuthenticated && (
                                <>
                                    <li className="nav-item mx-2">
                                        <Link className="nav-link-nav active text-dark" 
                                        style={{ marginRight: '10px', textDecoration: 'none' }}
                                        to="/dashboard">Dashboard</Link>
                                    </li>
                                    <li className="nav-item mx-2">
                                        <Link className="nav-link-nav active text-dark" 
                                        style={{ marginRight: '10px', textDecoration: 'none' }}
                                        to="/logout">Logout</Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>

                    {/* Sign In and Sign Up Buttons (Top Right) */}
                    <div className="d-flex order-2 order-lg-3 align-items-center gap-3">
                        {!isAuthenticated && (
                            <>
                                <Link
                                    className="nav-link-a d-none d-lg-block text-dark"
                                    style={{ marginRight: '10px', textDecoration: 'none' }}
                                    to="/login"
                                >
                                    Sign in
                                </Link>
                                {/* 
                                <Link
                                    className="nav-link-a d-none d-lg-block text-dark"
                                    style={{ marginRight: '10px', textDecoration: 'none' }}
                                    to="/google-login" // Adjust this to the path of your Google login page
                                >
                                    Sign in with Google
                                </Link>
                                */}
                                <Link
                                    className="nav-link btn btn-sm rounded-pill px-4"
                                    style={{
                                        backgroundColor: '#E8BF73',
                                        color: 'black',
                                        padding: '10px 20px', // Increase padding for larger button
                                        marginRight: '10px',
                                        marginLeft: '5px',
                                    }}
                                    to="/register"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                </div>
            </nav>
        </div>
    );
};

export default Header;