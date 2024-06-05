import { Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
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
import SearchIngredient from "./pages/SearchIngredient.jsx";
import SupplierDashboard from "./pages/SupplierDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import UpdateProduct from "./pages/UpdateProduct.jsx";
import AddProduct from "./pages/AddProduct.jsx";

export default function App() {
  const { user } = useAuthContext();
  const location = useLocation();

  const showSidebar = () => {
    const paths = ["/recipe", "/login", "/register"];
    return (
      location.pathname === "/" ||
      location.pathname.startsWith("/food") ||
      location.pathname.startsWith("/supplier") ||
      location.pathname.startsWith("/admin")
    );
  };

  return (
    <div>
      <Navbar />
      <div className={showSidebar() ? "grid grid-cols-7" : ""}>
        {showSidebar() && (
          <div className="col-span-1 p-10">
            <div className="fixed">
              <Link to="/">
                <p className="mb-5">Products</p>
              </Link>
              <Link to="/food">
                <p className="mb-5">Foods</p>
              </Link>
              {user && user.payload.role === "user" && (
                <div>
                  <Link to="/order">
                    <p className="mb-5">History</p>
                  </Link>
                  <Link to="/payments">
                    <p className="mb-5">Payments</p>
                  </Link>
                </div>
              )}
              {user && user.payload.role === "supplier" && (
                <div>
                  <Link to="/order/myorders">
                    <p className="mb-5">My Orders</p>
                  </Link>
                  <Link to="/supplier/dashboard">
                    <p className="mb-5">Dashboard</p>
                  </Link>
                </div>
              )}
              {user && user.payload.role === "admin" && (
                <Link to="/admin/dashboard">
                  <p className="mb-5">Dashboard</p>
                </Link>
              )}
              {user && (
                <Link to="/profile">
                  <p className="mb-5">Profile</p>
                </Link>
              )}
            </div>
          </div>
        )}
        <div className={showSidebar() ? "col-span-6" : ""}>
          <Routes>
            <Route path="/food" element={<Foods />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
            <Route path="/review/:reviewId" element={<Reviews />} />
            <Route path="/food/:foodId" element={<FoodDetail />} />
            <Route
              path="/recipe/:recipeId"
              element={<SearchIngredient />}
            ></Route>
            <Route
              path="/supplier/dashboard"
              element={
                user && user.payload.role === "supplier" ? (
                  <SupplierDashboard />
                ) : (
                  <Navigate to="/" />
                )
              }
            ></Route>
            <Route
              path="/product/update/:productId"
              element={
                user && user.payload.role === "supplier" ? (
                  <UpdateProduct />
                ) : (
                  <Navigate to="/" />
                )
              }
            ></Route>
            <Route
              path="/product/add"
              element={
                user && user.payload.role === "supplier" ? (
                  <AddProduct/>
                ) : (
                  <Navigate to="/" />
                )
              }
            ></Route>
            <Route
              path="/admin/dashboard"
              element={
                user && user.payload.role === "admin" ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/" />
                )
              }
            ></Route>
          </Routes>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
