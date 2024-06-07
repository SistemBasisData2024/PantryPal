import React from 'react';
import { useNavigate } from 'react-router-dom';

const CartPage = ({ cart }) => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {cart.length > 0 ? (
        cart.map((item) => (
          <div key={item.product_id} className="flex items-center mb-4">
            <img
              src={item.image}
              alt={item.name}
              className="w-20 h-20 object-cover rounded-md mr-4"
            />
            <div>
              <h4 className="font-bold">{item.name}</h4>
              <p>Quantity: {item.quantity}</p>
              <p>Price: Rp {item.price}</p>
            </div>
          </div>
        ))
      ) : (
        <p>Your cart is empty</p>
      )}
      <button
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
        onClick={() => navigate('/')}
      >
        Continue Shopping
      </button>
    </div>
  );
};

export default CartPage;
