import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./reset_password.css";

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const uid = searchParams.get("uid");
    const token = searchParams.get("token");

    useEffect(() => {
        if (!uid || !token) {
            setError("Invalid password reset link.");
        }
    }, [uid, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const res = await axios.post("http://localhost:8000/api/reset-confirm/", {
                uid,
                token,
                new_password: newPassword,
            });

            if (res.status === 200) {
                toast.success("✅ Password changed! You can now log in.", {
                    position: "top-center",
                });
                setTimeout(() => navigate("/login"), 1000);
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || "Reset failed.");
        }
    };

    return (
        <div className="reset-password-container">
            <h2>Reset Your Password</h2>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button type="submit">Reset Password</button>
            </form>
        </div>
    );
};

export default ResetPassword;
