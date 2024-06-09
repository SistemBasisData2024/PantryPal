import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function ProductDetail({ cart, addToCart }) {
  const [product, setProduct] = useState([]);
  const { productId } = useParams();

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await axios.get(`/products/${productId}`);
        setProduct(response.data.payload);
      } catch (error) {
        toast.error(error);
      }
    };
    getProduct();
  }, [productId]);

  return (
    <div>
      <img src={product.image} alt="" className="w-full h-56 object-cover" />
      <div className="m-10 p-10 border-2">
        <h1 className="font-bold text-4xl">{product.name}</h1>
        <div className="p-5">
          <p>{product.expired}</p>
          <Link to={`/review/${product.product_id}`}>
            <h5>Rating: {product.avg_rating}</h5>
          </Link>
          <p>Brand: {product.brand}</p>
          <p>{product.description}</p>
          <h2 className="font-bold text-xl">{product.price}</h2>
        </div>
        <button
          className="py-1 px-6 rounded-md bg-slate-500"
          onClick={() => addToCart(product)}
        >
          Add To Cart
        </button>
      </div>
    </div>
  );
}
