import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AppleLoginPageRedirect = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");

        if (token) {
            localStorage.setItem("authToken", token); // Store the token locally
            navigate("/dashboard"); // Redirect to the dashboard
        } else {
            console.error("Token missing or authentication failed.");
        }
    }, [navigate]);

    const handleAppleLogin = () => {
        const appleRedirectUrl =
            "https://backend-django-9c363a145383.herokuapp.com/api/auth/apple/redirect"; // Backend endpoint for starting Apple login
        window.location.href = appleRedirectUrl; // Redirect user to start Apple login
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "20px" }}>
            <h2>Sign in with Apple</h2>
            <button
                onClick={handleAppleLogin}
                style={{
                    padding: "10px 20px",
                    backgroundColor: "#000",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
            >
                Sign in with Apple
            </button>
        </div>
    );
};

export default AppleLoginPageRedirect;

