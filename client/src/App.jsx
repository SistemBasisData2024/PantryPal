import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Navbar from "./components/Navbar.jsx";
import { useAuthContext } from "./hooks/useAuthContext.jsx";
import Home from "./pages/Home.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const { user } = useAuthContext();
  return (
    <BrowserRouter>
      <div>
        <Navbar />
        {/* comment for auth */}
        <Home />
        <Routes>
          {/* uncomment for auth */}
          {/* <Route path="/register" element={user ? <Navigate to="/" /> : <Register/>} /> */}
          {/* <Route path="/login" element={user ? <Navigate to="/" /> : <Login/>} /> */}
          {/* <Route path="/" element={!user ? <Navigate to="/login" /> : <Home/>} /> */}
        </Routes>
        <ToastContainer />
      </div>
    </BrowserRouter>
  );
}
