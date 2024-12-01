import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; 

const ContactForm = () => {
    const [formData, setFormData] = useState({
        inquiry_type: 'general_inquiry',
        email: '',
        username: '',
        message: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Handle form field change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Reset error
        setSuccess(''); // Reset success message

        try {
            const response = await axios.post('https://backend-django-9c363a145383.herokuapp.com/api/contact/', formData, {
                headers: {
                    'Content-Type': 'application/json', // Ensure content type is JSON
                },
            });

            setSuccess('Message sent successfully!');
            setFormData({
                inquiry_type: 'general_inquiry',
                email: '',
                username: '',
                message: '',
            });
        } catch (err) {
            setError('There was an issue sending your message. Please try again later.');
        }
    };

    return (
        <div className="container mt-5 mb-5">
            <h1 className="text-center pb-3">Contact Us @ Project name</h1>
            <p className="text-center pb-3">
                If you have any questions or inquiries, feel free to reach out to us using the form below.
            </p>

            <div className="row justify-content-center">
                <div className="col-md-6">
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}

                    <form onSubmit={handleSubmit} method="POST" noValidate>
                        <div className="form-group">
                            <label htmlFor="inquiry_type">Inquiry Type</label>
                            <select
                                id="inquiry_type"
                                name="inquiry_type"
                                className="form-control"
                                value={formData.inquiry_type}
                                onChange={handleChange}
                            >
                                <option value="account_closure">Account closure & deletion</option>
                                <option value="general_inquiry">General inquiry</option>
                                <option value="feature_request">Feature request</option>
                            </select>
                        </div>

                        <div className="form-group mt-3">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="form-control"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group mt-3">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                className="form-control"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group mt-3">
                            <label htmlFor="message">Message</label>
                            <textarea
                                id="message"
                                name="message"
                                className="form-control"
                                rows="4"
                                value={formData.message}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mt-5">
                            <button type="submit" className="btn btn-dark mx-auto d-block">
                                Submit
                            </button>
                            {/* Home Button */}
                            <div className="mt-5">
                                <Link to="/" className="btn btn-secondary mx-auto d-block w-50">
                                    Back to Home Page
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactForm;