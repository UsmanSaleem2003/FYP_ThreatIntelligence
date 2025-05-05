import React, { useState } from "react";
import axios from "axios";
import "./ForgotPassword.css";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post("http://localhost:8000/api/password-reset/", { email });
            toast.success("📧 Reset link sent! Check your email.", { position: "top-center" });
            setEmail("");
        } catch (err) {
            toast.error(err?.response?.data?.error || "Failed to send reset email", { position: "top-center" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password-wrapper">
            <div className="forgot-password-container">
                <div className="forgot-password-box">
                    <h2>Forgot Password</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button type="submit" disabled={loading}>
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>
                        <button className="backToLogin" onClick={() => navigate('/')}>
                            Back To Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );

};

export default ForgotPassword;
