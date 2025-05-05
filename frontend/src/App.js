import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar/Sidebar";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import RegistrationPortal from "./pages/registration_portal/registration_portal";
import VerifyEmail from "./pages/VerifyEmail/VerifyEmail";
// import ResetPassword from "./pages/reset_password/reset_password";
import ResetPassword from "./pages/reset_password/reset_password";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";

import PrivateRoute from "./utils/PrivateRoute";
import AuthContext from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './toastStyles.css';
import TokenWatcher from "./utils/TokenWatcher";

function App() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <TokenWatcher>
        <div className="app-container">
          {isLoggedIn && <Sidebar />}
          <div className="routess" style={{ marginLeft: isLoggedIn ? "200px" : "0px" }}>
            <Routes>
              <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
              <Route path="/login" element={isLoggedIn ? <Navigate to="/" replace /> : <Login />} />
              <Route path="/registration-portal" element={isLoggedIn ? <Navigate to="/" replace /> : <RegistrationPortal />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route
                path="/reset-password"
                element={
                  window.location.search.includes("uid") && window.location.search.includes("token")
                    ? <ResetPassword />
                    : <ForgotPassword />
                }
              />
              <Route path="*" element={<Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
            </Routes>
            <ToastContainer
              position="top-center"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              pauseOnHover
              draggable
              pauseOnFocusLoss
              theme="colored"
            />
          </div>
        </div>
      </TokenWatcher>
    </BrowserRouter>
  );
}

export default App;
