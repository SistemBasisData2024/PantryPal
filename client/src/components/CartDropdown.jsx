import React from 'react';
import { useNavigate } from 'react-router-dom';

const CartDropdown = ({ cart, removeFromCart }) => {
  const navigate = useNavigate();

  const handleViewCart = () => {
    navigate('/getcart');
  };

  return (
    <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10">
      <div className="py-2">
        {cart && cart.length > 0 ? (
          cart.map((item) => (
            <div key={item.product_id} className="flex items-center px-4 py-2 hover:bg-gray-100">
              <img
                src={item.image}
                alt={item.name}
                className="w-12 h-12 object-cover rounded-md mr-4"
              />
              <div className="flex-1">
                <h4 className="font-bold">{item.name}</h4>
                <p>Quantity: {item.quantity}</p>
                <p>Price: Rp {item.price}</p>
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
          onClick={handleViewCart}
        >
          View Cart
        </button>
      </div>
    </div>
  );
};

export default CartDropdown;
