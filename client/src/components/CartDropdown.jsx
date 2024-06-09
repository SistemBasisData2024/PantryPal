import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { useDeleteCart } from '../hooks/useDeleteCart';

const CartDropdown = () => {
  const navigate = useNavigate();
  const { deleteCart, isLoading } = useDeleteCart()
  const { user } = useAuthContext()
  const [cart, setCart] = useState([]);

  const removeFromCart = async (product_id) => {
    await deleteCart(product_id);
  }

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get("/user/getcart", {
          headers: {
            "Content-Type": "json/application",
            Authorization: `Bearer ${user.token}`
          }
        });
        setCart(response.data.items);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };

    fetchCart();
  }, []);

  return (
    <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10">
      <div className="py-2">
        {cart.length > 0 ? (
          cart.map((item) => (
            <div key={item.product_id} className="flex items-center px-4 py-2 hover:bg-gray-100">
              <div className="flex-1">
                <h4 className="font-bold">{item.name}</h4>
                <p>Product Id: {item.product_id}</p>
                <p>Quantity: {item.quantity}</p>
              </div>
              <button
                onClick={() => removeFromCart(item.product_id)}
                className="bg-red-500 text-white px-2 py-1 rounded-md"
              >
                Remove
              </button>
            </div>
          ))
        ) : (
          <div className="px-4 py-2">Your cart is empty</div>
        )}
      </div>
      <div className="px-4 py-2">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
          onClick={() => navigate('/cart')}
        >
          View Cart
        </button>
      </div>
    </div>
  );
};

export default CartDropdown;
