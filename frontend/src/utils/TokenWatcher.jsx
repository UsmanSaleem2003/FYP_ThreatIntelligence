import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { isTokenExpired } from "./checkTokenExpiry";
import AuthContext from "../context/AuthContext";

const TokenWatcher = ({ children }) => {
    const navigate = useNavigate();
    const { setIsLoggedIn } = useContext(AuthContext);

    useEffect(() => {
        isTokenExpired(() => {
            setIsLoggedIn(false);
            navigate("/login");
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate, setIsLoggedIn]);

    return children;
};

export default TokenWatcher;
