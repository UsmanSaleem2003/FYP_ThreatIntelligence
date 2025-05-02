import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import home_icon from "../Assets/home_icon.png";
import network_traffic_icon from "../Assets/network_traffic_icon.png";
import threat_history_icon from "../Assets/activity_history_icon.png";
import phishing_email_icon from "../Assets/phishing_email_icon.png";
import logout_icon from "../Assets/logout_icon.png";
import profile_icon from "../Assets/profile_icon.png";

export default function Sidebar() {
    const [user, setUser] = useState(null);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("access");
            if (!token) return;

            try {
                const response = await fetch("http://localhost:8000/api/profile/", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                if (response.ok) {
                    setUser(data);
                } else {
                    console.error("Error fetching user profile:", data);
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };

        fetchUserData();
    }, [refresh]);

    const logout = () => {
        localStorage.removeItem("access");
        window.location.href = "/login";
        sessionStorage.removeItem("verifiedToastShown");
    };

    const refreshUserData = () => {
        setRefresh((prev) => !prev);
    };

    return (
        <div className="sidebar">
            <div className="profile-section">
                <h2 className="user-name">{user?.username || "Guest"}</h2>
                <p className="user-email">{user?.email || "Not logged in"}</p>
            </div>

            <div className="sidebar-btns">
                <Link to={"/"} onClick={refreshUserData}><img src={home_icon} alt="home" /><span>Home</span></Link>
                <Link to={"/"} onClick={refreshUserData}><img src={phishing_email_icon} alt="file" /><span>Phishing Detection</span></Link>
                <Link to={"/"} onClick={refreshUserData}><img src={network_traffic_icon} alt="messages" /><span>Network Traffic</span></Link>
                <Link to={"/"} onClick={refreshUserData}><img src={threat_history_icon} alt="notifications" /><span>Threat History</span></Link>
                <Link to={"/"} onClick={refreshUserData}><img src={profile_icon} alt="location" /><span>Profile</span></Link>
                <button onClick={logout} className="logout-btn">
                    <img src={logout_icon} alt="logout" className="logout-icon" />
                    <span className="logout-text">Logout</span>
                </button>
            </div>
        </div>
    );
}
