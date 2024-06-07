import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";
import CartDropdown from "./CartDropdown";

export default function Navbar({ cart, removeFromCart }) {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  return (
    <div className="p-7 w-full flex">
      <Link to="/">
        <h3 className="font-bold ml-20 text-xl">PantryPal</h3>
      </Link>
      <div>
        <ul className="position absolute top-7 right-10 flex items-center">
          {user && user.payload.role === "user" && (
            <div className="relative">
              <button onClick={toggleDropdown} className="mx-6 text-xl">
                <ion-icon name="cart-outline"></ion-icon>
                <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs ml-2">
                  {cart && cart.length}
                </span>
              </button>
              {dropdownVisible && (
                <CartDropdown cart={cart} removeFromCart={removeFromCart} />
              )}
            </div>
          )}
          {!user ? (
            <div className="flex">
              <Link to="/login">
                <li className="mx-6">Login</li>
              </Link>
              <Link to="/register">
                <li className="mx-6">Register</li>
              </Link>
            </div>
          ) : (
            <>
              <button onClick={handleLogout} className="mx-6">
                Logout
              </button>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
