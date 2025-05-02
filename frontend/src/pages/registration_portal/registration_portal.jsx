import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./registration_portal.css";
import axios from 'axios';
import { getCSRFToken } from '../../utils/csrf';

const RegistrationPortal = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        is_staff: false,
        is_active: true
    });

    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== confirmPassword) {
            setError(true);
            setErrorMessage("Passwords do not match.");
            return;
        }

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

    const passwordMatch = confirmPassword === formData.password;

    return (
        <div className="signup-container">
            <div className="signup-box">
                <h2>User Registration</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="first_name"
                        placeholder="First Name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="last_name"
                        placeholder="Last Name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                    />
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
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type={showPassword ? "text" : "password"}
                        name="confirm_password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={confirmPassword ? (passwordMatch ? "valid-password" : "invalid-password") : ""}
                        required
                    />

                    <div className="checkbox-container">
                        <input
                            type="checkbox"
                            id="showPassword"
                            checked={showPassword}
                            onChange={() => setShowPassword(!showPassword)}
                        />
                        <label htmlFor="showPassword">Show Password</label>
                    </div>

                    <div className="checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                name="is_staff"
                                checked={formData.is_staff}
                                onChange={handleChange}
                            />
                            Admin Access
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="is_active"
                                checked={formData.is_active}
                                onChange={handleChange}
                            />
                            Is Active
                        </label>
                    </div>

                    <button type="submit" className="signup-btn">Signup</button>
                    {error && <div className="error-message">{errorMessage}</div>}
                </form>
            </div>
        </div>
    );
};

export default RegistrationPortal;
