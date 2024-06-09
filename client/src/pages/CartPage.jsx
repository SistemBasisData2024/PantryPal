import axios from "axios";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { toast } from 'react-toastify';

const CartPage = () => {
  const navigate = useNavigate()
  const { user } = useAuthContext();
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [method, setMethod] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');

  useEffect(() => {
    const getCart = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/user/getcart', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setCart(response.data.items);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        toast.error(error.message);
      }
    };

    const getProducts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/products");
        setProducts(response.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        toast.error(`Error: ${error.message}`, { position: "bottom-right" });
      }
    };

    getCart();
    getProducts();
  }, [user.token]);

  useEffect(() => {
    if (cart.length > 0 && products.length > 0) {
      let totalPrice = 0;
      cart.forEach(item => {
        const product = products.find(prod => prod.product_id === item.product_id);
        if (product) {
          totalPrice += item.quantity * product.price;
        }
      });
      setTotalAmount(totalPrice);
    }
  }, [cart, products]);

  const handleCheckout = async () => {
    try {
      console.log("clicked");
      setIsLoading(true);
      const response = await axios.post("/orders/makeorder", { 
        products: cart,
        method: method,
        total_amount: totalAmount,
        street: street,
        city: city,
        country: country,
      }, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      setIsLoading(false);
      if(response.status === 201) {
        toast("Order Success!", { position: "top-center"});
      }
    } catch (error) {
      setIsLoading(false);
      toast("Error: " + error, { position: "top-center"});
    }
  }

  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {cart && cart.length > 0 ? (
        cart.map((item) => {
          const product = products.find(prod => prod.product_id === item.product_id);
          const totalPrice = product ? item.quantity * product.price : 0;

          return (
            <div key={item.product_id} className="flex items-center mb-4 border p-5 w-full">
              <div>
                <p>Product Id: {item.product_id}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Price: Rp {totalPrice}</p> {/* Display total price */}
              </div>
            </div>
          );
        })
      ) : (
        <p>Your cart is empty</p>
      )}
      <h3 className="my-5 font-bold text-xl">Total Price: <span className="font-normal">Rp{totalAmount}</span></h3>
      <form
        method="POST"
        action="/"
        className="w-full flex flex-col items-center"
        onSubmit={handleCheckout}
      >
        <div className="flex flex-col w-full border-2 border-black rounded-xl p-10">
          <label className="font-bold">Method</label>
          <input
            type="text"
            className="rounded-lg my-1 border-2"
            value={method}
            onChange={(event) => setMethod(event.target.value)}
          />
          <label className="font-bold">Street</label>
          <input
            type="text"
            className="rounded-lg my-1 border-2"
            value={street}
            onChange={(event) => setStreet(event.target.value)}
          />
          <label className="font-bold">City</label>
          <input
            type="text"
            className="rounded-lg my-1 border-2"
            value={city}
            onChange={(event) => setCity(event.target.value)}
          />
          <label className="font-bold">Country</label>
          <input
            type="text"
            className="rounded-lg my-1 border-2"
            value={country}
            onChange={(event) => setCountry(event.target.value)}
          />
        </div>
        <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md">{isLoading? "Checking Out...":"Checkout"}</button>
      </form>
    </div>
  );
};

export default CartPage;
