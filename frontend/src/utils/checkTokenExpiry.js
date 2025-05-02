// frontend/src/utils/tokenWatcher.js
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const messages = [
    "Even time needs a break... Your session expired. Let’s pick up the mission from where we left off. 🛡️",
    "Heroes never rest… but tokens do. Please log in again to continue your quest. 🧭"
];

export const isTokenExpired = (logoutCallback) => {
    const checkToken = () => {
        const token = localStorage.getItem("access");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const now = Math.floor(Date.now() / 1000);
                if (decoded.exp < now) {
                    localStorage.removeItem("access");
                    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
                    toast.info(randomMessage, {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        theme: "colored",
                    });
                    logoutCallback?.();
                }
            } catch (err) {
                console.error("Token decode failed:", err);
                localStorage.removeItem("access");
                logoutCallback?.();
            }
        }
    };

    // Run every 15 seconds
    setInterval(checkToken, 15000);
};
