import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAddToCart } from "../hooks/useAddCart";

export default function Home({ cart, setCart }) {
  const [searchValue, setSearchValue] = useState("");
  const [products, setProducts] = useState([]);
  const [productSearch, setProductSearch] = useState(products);
  const [isWaiting, setIsWaiting] = useState(true);
  const { addToCart, isLoading } = useAddToCart();

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product);
      setCart((prevCart) => {
        const existingProduct = prevCart.find(
          (item) => item.product_id === product.product_id
        );
        if (existingProduct) {
          return prevCart.map((item) =>
            item.product_id === product.product_id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          return [...prevCart, { ...product, quantity: 1 }];
        }
      });
    } catch(error) {

    }
  };

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get("/products");
        setProducts(response.data);
        setProductSearch(response.data);
        setIsWaiting(false);
      } catch (error) {
        setIsWaiting(false);
        toast.error(`Error: ${error.message}`, { position: "bottom-right" });
      }
    };

    getProducts();
  }, []);

  useEffect(() => {
    const filteredData = products.filter((item) =>
      item.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setProductSearch(filteredData);
  }, [searchValue, products]);

  return (
    <div>
      <div className="flex flex-col items-center">
        <input
          className="w-96 mb-4 border-2"
          type="text"
          placeholder="Search..."
          onChange={(e) => setSearchValue(e.target.value)}
          value={searchValue}
        />
        <div className="grid grid-cols-4 px-32 py-5">
          {products.length === 0 && !isWaiting && <p>No products available</p>}
          {!isWaiting ? (
            productSearch.map((product) => (
              <div
                className="p-10 border-3 border-black border-2 m-3 rounded-md"
                key={product.product_id}
              >
                <Link to={`/product/${product.product_id}`}>
                  <img
                    src={
                      product.image !== null
                        ? product.image
                        : "https://t4.ftcdn.net/jpg/04/00/24/31/360_F_400243185_BOxON3h9avMUX10RsDkt3pJ8iQx72kS3.jpg"
                    }
                    alt={product.name}
                  />
                  <h4 className="font-bold">{product.name}</h4>
                  <p>Rating: {product.avg_rating}</p>
                  <p>Rp {product.price}</p>
                </Link>
                <button
                  className="mt-3 p-2 bg-slate-400 rounded-md"
                  onClick={() => handleAddToCart({product_id: product.product_id, seller_id: product.seller_id})}
                  disabled={isLoading}
                >
                  Add to cart
                </button>
              </div>
            ))
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
}
