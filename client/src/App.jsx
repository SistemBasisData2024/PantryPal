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
import UpdateProduct from "./pages/UpdateProduct.jsx";
import AddProduct from "./pages/AddProduct.jsx";
import UserHistory from "./pages/UserHistory.jsx";
import UserPayments from "./pages/UserPayments.jsx";
import SupplierOrders from "./pages/SupplierOrders.jsx";
import OrderItem from "./pages/OrderItem.jsx";
import UpdateFood from "./pages/UpdateFood.jsx";
import AddFood from "./pages/AddFood.jsx";
import Profile from "./pages/Profile.jsx";
import OrderDetail from "./pages/OrderDetail.jsx";
import AddRecipe from "./pages/AddRecipe.jsx";
import AddReview from "./pages/AddReview.jsx";

export default function App() {
  const { user } = useAuthContext();
  const location = useLocation();

  const showSidebar = () => {
    const paths = ["/recipe", "/login", "/register"];
    return (
      location.pathname === "/" ||
      location.pathname.startsWith("/food") ||
      location.pathname.startsWith("/supplier") ||
      location.pathname.startsWith("/admin") ||
      location.pathname.startsWith("/order") ||
      location.pathname.startsWith("/payments") ||
      location.pathname.startsWith("/profile") ||
      location.pathname.startsWith("/rate") ||
      location.pathname.startsWith("/review")
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
                  <Link to="/supplier/order">
                    <p className="mb-5">My Orders</p>
                  </Link>
                  <Link to="/supplier/dashboard">
                    <p className="mb-5">Dashboard</p>
                  </Link>
                </div>
              )}
              {user && user.payload.role === "admin" && (
                <Link to="/admin/addfood">
                  <p className="mb-5">Add Food</p>
                </Link>
              )}
              {user && user.payload.role !== "admin" && (
                <Link to="/profile">
                  <p className="mb-5">Profile</p>
                </Link>
              )}
            </div>
          </div>
        )}
        <div className={showSidebar() ? "col-span-6" : ""}>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={user ? (
                  <Profile/>
                ) : (
                  <Navigate to="/" />
                )} />
            <Route path="/" element={<Home />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
            <Route path="/review/:entityId" element={<Reviews />} />
            <Route path="/rate/:entityId" element={(user && user.payload.role === "user") && <AddReview/>}/>
            <Route path="/food" element={<Foods />} />
            <Route path="/food/:foodId" element={<FoodDetail />} />
            <Route path="/food/update/:foodId" element={<UpdateFood />} />
            <Route path="/recipe/:recipeId" element={<SearchIngredient />} />
            <Route
              path="/supplier/dashboard"
              element={
                user && user.payload.role === "supplier" ? (
                  <SupplierDashboard />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/product/update/:productId"
              element={
                user && user.payload.role === "supplier" ? (
                  <UpdateProduct />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/product/add"
              element={
                user && user.payload.role === "supplier" ? (
                  <AddProduct />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/order"
              element={user ? <UserHistory /> : <Navigate to="/order" />}
            />
            <Route
              path="/order/:orderId"
              element={user && <OrderDetail/>}
            />
            <Route
              path="/payments"
              element={user ? <UserPayments /> : <Navigate to="/payments" />}
            />
            <Route
              path="/supplier/order"
              element={
                user && user.payload.role === "supplier" ? (
                  <SupplierOrders />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/supplier/orderitem/:orderId"
              element={
                user && user.payload.role === "supplier" ? (
                  <OrderItem />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/admin/addrecipe/:foodId"
              element={
                user && user.payload.role === "admin" ? (
                  <AddRecipe />
                ) : (
                  <Navigate to="/food" />
                )
              }
            />
          </Routes>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
