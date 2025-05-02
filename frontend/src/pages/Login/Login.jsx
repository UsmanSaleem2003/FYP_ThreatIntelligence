import React, { useEffect, useState, useContext } from "react";
import "./Login.css";
import { getCSRFToken } from "../../utils/csrf";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
import { toast } from "react-toastify";

const Login = () => {
    const { setIsLoggedIn } = useContext(AuthContext);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();
    const location = useLocation();
    const csrfToken = getCSRFToken();

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const verified = query.get("verified");

        if (verified === "true" && !sessionStorage.getItem("verifiedToastShown")) {
            toast.success("✅ Email verified! You can now log in.", {
                position: "top-center"
            });
            sessionStorage.setItem("verifiedToastShown", "true");

            query.delete("verified");
            navigate({ pathname: "/login", search: query.toString() }, { replace: true });
        }
    }, [location.search, navigate]);


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/custom-login/",
                {
                    username: formData.username,
                    password: formData.password,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": csrfToken,
                    },
                    withCredentials: true,
                }
            );

            localStorage.setItem("access", response.data.access);
            setIsLoggedIn(true);
            navigate("/");
        } catch (error) {
            setError(true);
            setErrorMessage(
                error?.response?.data?.error || "Login failed. Check credentials."
            );
            console.error("Login Error:", error);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Log In</h2>
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
                        type={passwordVisible ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <div className="checkbox-container">
                        <input
                            type="checkbox"
                            id="showPassword"
                            checked={passwordVisible}
                            onChange={() => setPasswordVisible(!passwordVisible)}
                        />
                        <label htmlFor="showPassword">Show Password</label>
                    </div>
                    {error && <div className="error-message">{errorMessage}</div>}
                    <button type="submit" className="login-btn">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
