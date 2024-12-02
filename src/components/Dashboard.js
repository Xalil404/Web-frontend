import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { fetchUserProfile } from '../services/api'; // Import the API function

const Dashboard = () => {
    const location = useLocation();
    const [userProfile, setUserProfile] = useState(null); // State to store user profile
    const [error, setError] = useState(null); // To store any error messages
    const token = localStorage.getItem('authToken'); // Retrieve token from local storage
    const navigate = useNavigate(); // Initialize navigate function

    // Load user profile when the component mounts
    useEffect(() => {
        const loadProfile = async () => {
            try {
                const profileData = await fetchUserProfile(token);
                setUserProfile(profileData); // Set user profile
            } catch (err) {
                setError(err.detail || 'Error fetching user profile');
                console.error('Error fetching user profile:', err);
            }
        };

        loadProfile(); // Call the fetch function when component mounts
    }, [token]); // Dependencies: token

    const handleLogout = () => {
        // Redirect to the Logout component
        navigate('/logout');
    };

    // Determine the background class based on the current route
    const getClassName = () => {
        return location.pathname === '/birthdays' ? 'body-birthdays' : '';
    };

    return (
        <div className='dashboard-background'>
            <div className={`container-fluid ${getClassName()}`}>
              {/* Show error message if it exists */}
              {error && <div style={{ color: 'red' }}>{error}</div>}
                <div className="row">
                    {/* Sidebar */}
                    <nav className="col-md-2 d-none d-md-block sidebar">
                        <h2 className="sidebar-heading text-center">Menu</h2>
                        <ul className="nav flex-column">
                        <hr className="divider" />
                            <li className="nav-item">
                                <Link className="nav-link text-dark"
                                 to="/dashboard">Dashboard</Link>
                            </li>
                            <hr className="divider" />
                            <li className="nav-item">
                                <Link className="nav-link text-dark" to="/birthdays">Tasks</Link>
                            </li>
                            <hr className="divider" />
                            <li className="nav-item">
                                <Link className="nav-link text-dark" to="/anniversaries">Profile</Link>
                            </li>
                            <hr className="divider" />
                            <li className="nav-item">
                                <Link className="nav-link text-dark" to="/holidays">Feature 1</Link>
                            </li>
                            <hr className="divider" />
                        </ul>
                        
                        {/* User Info and Logout Section */}
                        <div className="sidebar-user-info mt-4 text-center fw-bold">
                            {userProfile && (
                                <p>Welcome, {userProfile.username}! {/* (ID: {userProfile.id}) */}</p>
                            )}
                            <button 
                                onClick={handleLogout} 
                                className="btn btn-sm btn-danger"
                            >
                                Logout
                            </button>
                        </div>
                    </nav>

                    {/* Main Content */}
                    <main className="col-md-9 ms-sm-auto col-lg-10 px-4 d-flex flex-column justify-content-center" style={{ minHeight: '80vh' }}>
                        <div className="text-center mb-4 d-flex align-items-center justify-content-center">
                            <img
                                src="https://res.cloudinary.com/dnbbm9vzi/image/upload/v1729505462/static/favicon_io/apple-touch-icon.234aad4ee54e.png"
                                alt="Logo"
                                style={{ width: '50px', height: '50px', marginRight: '10px' }}
                            />
                            <h1 className="d-inline mb-0">Project Name</h1>
                        </div>

                        {/* Welcome section for the homepage */}
                        {location.pathname === '/dashboard' && (
                            <div className="row align-items-center justify-content-center" style={{ flex: 1 }}>
                                <div className="col-md-6">
                                    <h1 className="mb-3 fw-bold">Welcome to Project Name!</h1>
                                    <h6 className="fw-bold">Sed accumsan sit amet magna fringilla accumsan. Sed accumsan sit amet magna fringilla accumsan.</h6>
                                </div>
                                <div className="col-md-6 text-center">
                                    <img
                                        src="https://res.cloudinary.com/dnbbm9vzi/image/upload/v1729520568/Group_27_yp99rq.png"
                                        alt="Welcome"
                                        className="img-fluid"
                                        style={{ maxWidth: '100%', height: 'auto' }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Render child routes */}
                        <Outlet context={{ userProfile, handleLogout }} />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
