// NotFound.js
import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap styles are imported

const NotFound = () => {
    return (
        <div className="container mt-5">
            <div className="row">

                {/* Left Column for Image */}
                <div className="col-md-6 d-flex justify-content-center align-items-center">
                    <img 
                        src="https://res.cloudinary.com/dnbbm9vzi/image/upload/v1729351193/Group_307_zosemf.png" 
                        className="img-fluid" 
                        alt="404" 
                    />
                </div>

                {/* Right Column for Text and Button */}
                <div className="col-md-6 d-flex align-items-center">
                    <div className="content-wrapper px-5">
                        <div>
                            <h1 className="display-1 fw-bold">404</h1>
                            <h2 className="mb-4">Whooops, that page is gone ... </h2>
                            <Link to="/" className="btn btn-custom" style={{ backgroundColor: '#E8BF73', color: 'black' }}>
                                Go Home
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default NotFound;