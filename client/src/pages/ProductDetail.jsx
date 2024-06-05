import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

export default function ProductDetail() {
  const [product, setProduct] = useState([]);
  const { productId } = useParams();

  useEffect(() => {
    console.log("hello");
    const getProduct = async () => {
      try {
        const response = await axios.get(`/products/${productId}`);
        setProduct(response.data.payload);
        console.log(response.data.payload);
      } catch (error) {}
    };
    getProduct();
  }, []);

  return (
    <div>
      <img src={product.image} alt="" className="w-full h-56 object-cover" />
      <div className="m-10 p-10 border-2">
        <h1 className="font-bold text-4xl">{product.name}</h1>
        <div className="p-5">
          <p>{product.expired}</p>
          <Link to={`/reviews/${product.product_id}`}>
            <h5>Rating: {product.avg_rating}</h5>
          </Link>
          <p>Brand: {product.brand}</p>
          <p>{product.description}</p>
          <h2 className="font-bold text-xl">{product.price}</h2>
        </div>
        <button className="py-1 px-6 rounded-md bg-slate-500">Add To Cart</button>
      </div>
    </div>
  );
}
