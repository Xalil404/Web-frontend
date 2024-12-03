import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchTasks, createTask, updateTask, deleteTask, fetchUserProfile } from '../services/api';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [editId, setEditId] = useState(null);
    const [error, setError] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null); // For delete confirmation
    const token = localStorage.getItem('authToken');
    const navigate = useNavigate();

    // Load user profile and tasks when the component mounts
    useEffect(() => {
        const loadProfileAndTasks = async () => {
            try {
                const profileData = await fetchUserProfile(token);
                setUserProfile(profileData);

                const taskData = await fetchTasks(token);
                setTasks(taskData);
            } catch (err) {
                setError(err.detail || 'Error fetching data');
                console.error('Error fetching data:', err);
            }
        };

        loadProfileAndTasks();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Prepare task data with user ID
        const taskData = {
            user: userProfile ? userProfile.id : null,
            title: title,
            description: description,
        };

        try {
            if (editId) {
                // Update existing task
                await updateTask(editId, taskData, token);
                setEditId(null);
            } else {
                // Create new task
                await createTask(taskData, token);
            }
            setTitle('');
            setDescription('');
            const data = await fetchTasks(token);
            setTasks(data);
        } catch (error) {
            const errorMessage = error.user ? error.user[0] : 'Error saving task: ' + (error.detail || 'An error occurred.');
            setError(errorMessage);
            console.error('Error saving task:', error);
        }
    };

    const handleEdit = (task) => {
        setTitle(task.title);
        setDescription(task.description);
        setEditId(task.id);
    };

    const confirmDeleteTask = (id) => {
        setConfirmDelete(id);
    };

    const handleDelete = async () => {
        if (confirmDelete) {
            try {
                await deleteTask(confirmDelete, token);
                const data = await fetchTasks(token);
                setTasks(data);
                setConfirmDelete(null); // Reset confirmation
            } catch (error) {
                setError('Error deleting task: ' + (error.detail || 'An error occurred.'));
                console.error('Error deleting task:', error);
            }
        }
    };

    const handleLogout = () => {
        // Redirect to the Logout component
        navigate('/logout');
    };

    return (
        <div className='dashboard-background-task'>
            <div className='container-fluid'>
                {error && <div style={{ color: 'red' }}>{error}</div>}
                <div className="row">
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

                        <div className="sidebar-user-info mt-4 text-center fw-bold">
                            {userProfile && (
                                <p>Welcome, {userProfile.username}!</p>
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
                            <h1 className="d-inline mb-0">Tasks</h1>
                        </div>

                        {/* Task Form */}
                        <form onSubmit={handleSubmit} className="mb-4 mx-auto" style={{ maxWidth: '400px' }}>
                            <div className="mb-2">
                                <input
                                    type="text"
                                    placeholder="Title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    className="form-control"
                                />
                            </div>
                            <div className="mb-2">
                                <textarea
                                    placeholder="Description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                    className="form-control"
                                    rows={3}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100">
                                {editId ? 'Update Task' : 'Add Task'}
                            </button>
                        </form>

                        {/* Task cards */}
                        <div className="row">
                            {tasks.length === 0 ? (
                                <div className="col-12 text-center">
                                    <p><strong>No tasks added yet.</strong></p>
                                    <p>Click the button above to add your first task!</p>
                                    <img
                                        src="https://res.cloudinary.com/dnbbm9vzi/image/upload/v1729520568/Group_27_yp99rq.png"
                                        alt="No Birthdays"
                                        className="img-fluid mb-3"
                                        style={{ width: '300px' }} // Optional: Adjust the size of the image
                                    />
                                </div>
                            ) : (
                                tasks.map((task) => (
                                    <div key={task.id} className="col-md-4 mb-4 fw-bold">
                                        <div className="card task-card text-center">
                                            <div className="card-body">
                                                <h5 className="card-title fw-bold">{task.title}</h5>
                                                <p className="card-text">{task.description}</p>
                                                <div className="button-container">
                                                    <button onClick={() => handleEdit(task)} className="btn btn-warning btn-sm me-2">Edit</button>
                                                    <button onClick={() => confirmDeleteTask(task.id)} className="btn btn-danger btn-sm">Delete</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Edit Task Modal */}
                        <div
                            className={`modal fade ${editId ? 'show' : ''}`}
                            style={{ display: editId ? 'block' : 'none' }}
                            id="editTaskModal"
                            tabIndex="-1"
                            role="dialog"
                            aria-labelledby="editTaskModalLabel"
                            aria-hidden={!editId}
                        >
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title fw-bold text-center w-100" id="editTaskModalLabel">
                                            Edit Task
                                        </h5>
                                        <button
                                            type="button"
                                            className="btn-close"
                                            onClick={() => setEditId(null)}
                                            aria-label="Close"
                                        ></button>
                                    </div>
                                    <form onSubmit={handleSubmit}>
                                        <div className="modal-body">
                                            <input
                                                type="text"
                                                placeholder="Title"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                required
                                                className="form-control mb-2"
                                            />
                                            <textarea
                                                placeholder="Description"
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                required
                                                className="form-control mb-2"
                                                rows={3}
                                            />
                                        </div>
                                        <div className="modal-footer justify-content-between">
                                            <button
                                                type="button"
                                                className="btn btn-secondary"
                                                onClick={() => setEditId(null)}
                                            >
                                                Cancel
                                            </button>
                                            <button type="submit" className="btn btn-primary">
                                                Update Task
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        {/* Confirmation Pop-up for Deletion */}
                        {confirmDelete && (
                            <div className="modal fade show text-center" style={{ display: 'block' }} id="confirmDeleteModal" tabIndex="-1" role="dialog" aria-labelledby="confirmDeleteModalLabel" aria-hidden="true">
                                <div className="modal-dialog" role="document">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title fw-bold text-center w-100" id="confirmDeleteModalLabel">Confirm Deletion</h5>
                                            <button type="button" className="btn-close" onClick={() => setConfirmDelete(null)} aria-label="Close">

                                            </button>
                                        </div>
                                        <div className="modal-body">
                                            Are you sure you want to delete this birthday?
                                        </div>
                                        <div className="modal-footer justify-content-between">
                                            <button type="button" className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>Cancel</button>
                                            <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete</button>
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

export default Tasks;
