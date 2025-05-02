import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./registration_portal.css";
import axios from 'axios';
import { getCSRFToken } from '../../utils/csrf';

const RegistrationPortal = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    });

    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const csrfToken = getCSRFToken();
        try {
            const response = await axios.post(
                "http://localhost:8000/api/user/register/",
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": csrfToken,
                    },
                    withCredentials: true,
                }
            );

            if (response.status === 201) {
                navigate("/login");
            } else {
                setError(true);
                setErrorMessage(response.data?.email || response.data?.username || "Registration failed.");
            }
        } catch (error) {
            setError(true);
            if (error.response?.data) {
                const errorData = error.response.data;
                setErrorMessage(
                    errorData.email ||
                    errorData.username?.[0] ||
                    errorData.password?.[0] ||
                    "Registration failed."
                );
            } else {
                setErrorMessage("An unexpected error occurred.");
            }
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-box">
                <h2>User Registration</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" className="signup-btn">Signup</button>
                    {error && <div className="error-message">{errorMessage}</div>}
                </form>
                <p className="signup-link">
                    Already have an account? <Link to="/login">Login Here</Link>
                </p>
            </div>
        </div>
    );
};

export default RegistrationPortal;
