import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Home from "./pages/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import Reviews from "./pages/Reviews.jsx";
import Foods from "./pages/Foods.jsx";
import FoodDetail from "./pages/FoodDetail.jsx";

export default function App() {
  const { user } = useAuthContext();
  return (
    <BrowserRouter>
      <div className="">
        <Navbar />
        <div className="grid grid-cols-7">
          <div className="col-span-1 p-10">
            <div className="fixed">
              <Link to="/">
                <p className="mb-5">Products</p>
              </Link>
              <Link to="/food">
                <p className="mb-5">Foods</p>
              </Link>
              <Link to="/order">
                <p className="mb-5">History</p>
              </Link>
              <Link to="/order/myorders">
                <p className="mb-5">My Orders</p>
              </Link>
              <Link to="/payments">
                <p className="mb-5">Payments</p>
              </Link>
              <Link to="/profile">
                <p className="mb-5">Profile</p>
              </Link>
            </div>
          </div>
          <div className="col-span-6">
            <Routes>
              <Route path="/food" element={<Foods />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Home />} />
              <Route path="/product/:productId" element={<ProductDetail />} />
              <Route path="/review/:reviewId" element={<Reviews />} />
              <Route path="/food/:foodId" element={<FoodDetail/>} />
            </Routes>
          </div>
        </div>
        <ToastContainer />
      </div>
    </BrowserRouter>
  );
}
