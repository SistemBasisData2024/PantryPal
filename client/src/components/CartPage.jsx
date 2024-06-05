import React from "react";
import { Link } from "react-router-dom";

export default function CartPage({ cart }) {
  return (
    <div className="container mx-auto p-5">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          <ul>
            {cart.map((item) => (
              <li key={item.product_id} className="flex items-center mb-4">
                <img
                  src={item.image || "https://via.placeholder.com/50"}
                  alt={item.name}
                  className="w-16 h-16 mr-4"
                />
                <div className="flex-1">
                  <Link to={`/product/${item.product_id}`}>
                    <h3 className="text-lg">{item.name}</h3>
                  </Link>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: Rp {item.price}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <Link to="/" className="text-blue-500">Continue Shopping</Link>
          </div>
        </div>
      )}
    </div>
  );
}
