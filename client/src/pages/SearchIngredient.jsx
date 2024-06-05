import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function SearchIngredient() {
  const { recipeId } = useParams();
  const [products, setProducts] = useState([]);
  const [recipes, setRecipes] = useState({});
  const [searchValue, setSearchValue] = useState("");
  const [productSearch, setProductSearch] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get("/products");
        setProducts(response.data);
        setProductSearch(response.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        toast(`Error ${error}`, { position: "bottom-right" });
      }
    };

    const getRecipeById = async () => {
      try {
        const response = await axios.get(`/foods/getrecipe/${recipeId}`);
        setRecipes(response.data);
        setSearchValue(response.data.products[0].name);
        console.log(response.data);
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

  const addToCart = () => {
    // Implement addToCart functionality
  };

  return (
    <div className="grid grid-cols-7">
      <div className="border-2 border-black col-span-1 p-6">
        <p className="font-bold">{recipes.name}</p>
        <p>Rating: {recipes.avg_rating && recipes.avg_rating.toFixed(2)}</p>
        <div className="flex flex-col">
        {recipes.products && recipes.products.length > 0 && recipes.products.map((product) => (
          <button className="p-3 rounded-md bg-slate-400 text-white mt-3" onClick={() => setSearchValue(product.name)}>{product.name}</button>
        ))}

        </div>
      </div>
      <div className="col-span-6">
        <div className="grid grid-cols-4 px-32 py-5">
          {isLoading ? (
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
                  onClick={addToCart}
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
