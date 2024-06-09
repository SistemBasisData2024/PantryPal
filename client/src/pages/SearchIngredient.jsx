import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAddToCart } from "../hooks/useAddCart";

export default function SearchIngredient() {
  const { recipeId } = useParams();
  const [products, setProducts] = useState([]);
  const { addToCart, isLoading } = useAddToCart();
  const [recipes, setRecipes] = useState({});
  const [searchValue, setSearchValue] = useState("");
  const [productSearch, setProductSearch] = useState([]);
  const [isWaiting, setIsWaiting] = useState(true);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get("/products");
        setProducts(response.data);
        setProductSearch(response.data);
        setIsWaiting(false);
      } catch (error) {
        setIsWaiting(false);
        toast(`Error ${error}`, { position: "bottom-right" });
      }
    };

    const getRecipeById = async () => {
      try {
        const response = await axios.get(`/foods/getrecipe/${recipeId}`);
        setRecipes(response.data);
        setSearchValue(response.data.products[0].name);
      } catch (error) {
        toast(`Error ${error}`, { position: "bottom-right" });
      }
    };

    getProducts();
    getRecipeById();
  }, [recipeId]);

  useEffect(() => {
    const filteredData = products.filter((item) =>
      item.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setProductSearch(filteredData);
  }, [searchValue, products]);

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product);
    } catch(error) {
      toast.error(error.message)
    }
  };

  return (
    <div className="grid grid-cols-6">
      <div className="col-span-1 p-6">
        <p className="font-bold">{recipes.name}</p>
        <Link to={`/review/${recipes._id}`}>
            <h5>Rating: {Number(recipes.avg_rating).toFixed(2)}</h5>
          </Link>
        <div className="flex flex-col">
        {recipes.products && recipes.products.length > 0 && recipes.products.map((product) => (
          <button key={product._id} className="p-3 rounded-md bg-slate-400 text-white mt-3" onClick={() => setSearchValue(product.name)}>{product.name}</button>
        ))}

        </div>
      </div>
      <div className="col-span-5">
        <div className="grid grid-cols-4 px-32 py-5">
          {isLoading && isWaiting ? (
            <p>Loading...</p>
          ) : productSearch.length === 0 ? (
            <p>No products available</p>
          ) : (
            productSearch.map((product) => (
              <div
                key={product.product_id}
                className="p-10 border-3 border-black border-2 m-3 rounded-md"
              >
                <Link to={`/product/${product.product_id}`}>
                  <img
                    src={
                      product.image ||
                      "https://t4.ftcdn.net/jpg/04/00/24/31/360_F_400243185_BOxON3h9avMUX10RsDkt3pJ8iQx72kS3.jpg"
                    }
                    alt={product.name}
                  />
                  <h4 className="font-bold">{product.name}</h4>
                  <p>Rating: {product.avg_rating}</p>
                </Link>
                <button
                  className="mt-3 p-2 bg-slate-400 rounded-md"
                  onClick={() => handleAddToCart({product_id: product.product_id, seller_id: product.seller_id})}
                >
                  Add to cart
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
