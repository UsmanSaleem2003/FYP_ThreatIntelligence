import { createContext, useEffect, useState } from "react";
import { isTokenExpired } from "../utils/checkTokenExpiry";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        const access = localStorage.getItem("access");
        return access && !isTokenExpired();
    });

    useEffect(() => {
        const interval = setInterval(() => {
            if (isTokenExpired()) {
                localStorage.removeItem("access");
                setIsLoggedIn(false);
                toast.info("⏰ Your session expired! Please log in again to continue saving the world. 🛡️", {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "colored",
                });
                setTimeout(() => {
                    window.location.href = "/login";
                }, 5000);
            }
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
