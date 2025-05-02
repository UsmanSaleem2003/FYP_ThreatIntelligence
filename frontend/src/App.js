import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Sidebar from "./components/Sidebar/Sidebar";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import RegistrationPortal from "./pages/registration_portal/registration_portal";
import PrivateRoute from "./utils/PrivateRoute";
import { useContext } from "react";
import AuthContext from "./context/AuthContext";

function App() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <div className="app-container">
        {isLoggedIn && <Sidebar />}
        <div className="routess" style={{ marginLeft: isLoggedIn ? "200px" : "0px" }}>
          <Routes>
            <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/login" element={isLoggedIn ? <Navigate to="/" replace /> : <Login />} />
            <Route path="/registration-portal" element={isLoggedIn ? <Navigate to="/" replace /> : <RegistrationPortal />} />
            <Route path="*" element={<Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
