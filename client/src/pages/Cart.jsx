import React from 'react';

const Cart = ({ cart }) => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cart.length > 0 ? (
        <div>
          {cart.map((item) => (
            <div key={item.product_id} className="flex items-center py-4 border-b">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-md mr-4"
              />
              <div>
                <h4 className="font-bold">{item.name}</h4>
                <p>Quantity: {item.quantity}</p>
                <p>Price: Rp {item.price}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Your cart is empty</p>
      )}
    </div>
  );
};

export default Cart;