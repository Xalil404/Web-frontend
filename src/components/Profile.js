import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { fetchProfile, updateProfile, deleteProfile } from '../services/api'; 

const Profile = () => {
    const [profile, setProfile] = useState(null); 
    const [bio, setBio] = useState('');
    const [profilePicture, setProfilePicture] = useState(null); 
    const [editMode, setEditMode] = useState(false);
    const [error, setError] = useState(null); 
    const [confirmDelete, setConfirmDelete] = useState(false); 
    const token = localStorage.getItem('authToken'); 
    const navigate = useNavigate(); 

    // Load user profile when the component mounts
    useEffect(() => {
        const loadProfile = async () => {
            try {
                const profileData = await fetchProfile(token);
                setProfile(profileData); 
                setBio(profileData.bio);
                setProfilePicture(profileData.profile_picture);
            } catch (err) {
                setError(err.detail || 'Error fetching profile');
                console.error('Error fetching profile:', err);
            }
        };

        loadProfile(); 
    }, [token]); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); 
        
        // Prepare updated profile data
        const formData = new FormData();
        formData.append('bio', bio);
        if (profilePicture) formData.append('profile_picture', profilePicture);

        try {
            // Update user profile
            await updateProfile(formData, token);
            setEditMode(false); 
            setProfile({ ...profile, bio, profile_picture: profilePicture }); 
        } catch (error) {
            setError('Error updating profile');
            console.error('Error updating profile:', error);
        }
    };

    const handleEdit = () => {
        setEditMode(true); // Enable edit mode
    };

    const confirmDeleteProfile = () => {
        setConfirmDelete(true); // Show delete confirmation modal
    };

    const handleDelete = async () => {
        if (confirmDelete) {
            try {
                await deleteProfile(token);

                // Clear user token from localStorage to log them out
                localStorage.removeItem('authToken');

                navigate('/'); // Redirect to homepage after profile deletion
            } catch (error) {
                setError('Error deleting profile');
                console.error('Error deleting profile:', error);
            }
        }
    };

    const handleLogout = () => {
        // Redirect to the Logout component
        navigate('/logout');
    };

    return (
        <div className='dashboard-background-profile'>
            <div className='container-fluid'>
                {/* Show error message if it exists */}
                {error && <div style={{ color: 'red' }}>{error}</div>}
                <div className="row">
                    {/* Sidebar */}
                    <nav className="col-md-2 d-none d-md-block sidebar">
                        <h2 className="sidebar-heading text-center">Menu</h2>
                        <ul className="nav flex-column">
                            <hr className="divider" />
                            <li className="nav-item">
                                <Link className="nav-link text-dark" to="/dashboard">Dashboard</Link>
                            </li>
                            <hr className="divider" />
                            <li className="nav-item">
                                <Link className="nav-link text-dark" to="/tasks">Tasks</Link>
                            </li>
                            <hr className="divider" />
                            <li className="nav-item">
                                <Link className="nav-link text-dark" to="/profile">Profile</Link>
                            </li>
                            <hr className="divider" />
                            <li className="nav-item">
                                <Link className="nav-link text-dark" to="/feature1">Feature 1</Link>
                            </li>
                            <hr className="divider" />
                        </ul>
                        
                        {/* User Info and Logout Section */}
                        <div className="sidebar-user-info mt-4 text-center fw-bold">
                            {profile && (
                                <p>Welcome, {profile.username}!</p>
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
                                src={profilePicture ? profilePicture : "https://res.cloudinary.com/dnbbm9vzi/image/upload/v1726685042/Group_949_oufsqq.png"}
                                alt="Profile"
                                style={{ width: '100px', height: '100px', borderRadius: '50%', marginRight: '10px' }}
                            />
                            <h1 className="d-inline mb-0">Profile</h1>
                        </div>

                        {/* Profile Details */}
                        <div className="text-center mb-4">
                            <p><strong>Bio:</strong> {bio}</p>
                        </div>

                        {/* Edit and Delete buttons */}
                        <div className="d-flex justify-content-center">
                            <button onClick={handleEdit} className="btn btn-warning mx-2">Edit</button>
                            <button onClick={confirmDeleteProfile} className="btn btn-danger mx-2">Delete</button>
                        </div>

                        {/* Edit Profile Modal */}
                        {editMode && (
                            <div className="modal fade show" id="editProfileModal" tabIndex="-1" style={{ display: 'block' }} aria-hidden="false">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title">Edit Profile</h5>
                                            <button type="button" className="btn-close" onClick={() => setEditMode(false)} aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <form onSubmit={handleSubmit}>
                                                <div className="mb-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Bio"
                                                        value={bio}
                                                        onChange={(e) => setBio(e.target.value)}
                                                        required
                                                        className="form-control"
                                                    />
                                                </div>
                                                <div className="mb-2">
                                                    <input
                                                        type="file"
                                                        onChange={(e) => setProfilePicture(e.target.files[0])}
                                                        className="form-control"
                                                    />
                                                </div>
                                                <div className="modal-footer">
                                                    <button type="button" className="btn btn-secondary" onClick={() => setEditMode(false)}>Cancel</button>
                                                    <button type="submit" className="btn btn-primary">Save Changes</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Delete Profile Confirmation */}
                        {confirmDelete && (
                            <div className="modal fade show" id="deleteConfirmationModal" tabIndex="-1" style={{ display: 'block' }} aria-hidden="false">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title">Confirm Deletion</h5>
                                            <button type="button" className="btn-close" onClick={() => setConfirmDelete(false)} aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <p>Are you sure you want to delete your profile?</p>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" onClick={() => setConfirmDelete(false)}>Cancel</button>
                                            <button type="button" className="btn btn-danger" onClick={handleDelete}>Confirm</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Profile;

