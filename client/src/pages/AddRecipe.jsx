import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuthContext } from "../hooks/useAuthContext";
import { toast } from "react-toastify";

export default function AddRecipe() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { foodId } = useParams();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/products");
        setProducts(response.data);
      } catch (error) {
        toast.error(`Error: ${error.message}`, { position: "bottom-right" });
      }
    };

    fetchProducts();
  }, []);

  const handleAddRecipe = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.post(`/foods/${foodId}/addrecipe`, { 
        name,
        description,
        ingredients,
        instructions,
        products: selectedProducts
      }, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      setIsLoading(false);
      if (response.status === 201) {
        toast("Success!", { position: "top-center" });
        navigate(`/food/${foodId}`);
      }
    } catch (error) {
      setIsLoading(false);
      toast("Error: " + error, { position: "top-center" });
    }
  };

  const handleProductChange = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  return (
    <div className="flex flex-col items-center p-10">
      <form
        method="POST"
        className="w-full flex flex-col items-center"
        onSubmit={handleAddRecipe}
      >
        <div className="flex flex-col w-full border-2 border-black rounded-xl p-10">
          <label className="font-bold">Name</label>
          <input
            type="text"
            className="rounded-lg my-1 border-2"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <label className="font-bold">Description</label>
          <textarea
            className="rounded-lg my-1 border-2"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <label className="font-bold">Ingredients</label>
          <textarea
            className="rounded-lg my-1 border-2"
            value={ingredients}
            onChange={(event) => setIngredients(event.target.value)}
          />
          <label className="font-bold">Instructions</label>
          <textarea
            className="rounded-lg my-1 border-2"
            value={instructions}
            onChange={(event) => setInstructions(event.target.value)}
          />
          <label className="font-bold">Products</label>
          <div className="flex flex-col">
            {products.map((product) => (
              <div key={product.product_id} className="flex items-center">
                <input
                  type="checkbox"
                  id={product.product_id}
                  checked={selectedProducts.includes(product.product_id)}
                  onChange={() => handleProductChange(product.product_id)}
                />
                <label htmlFor={product.product_id} className="ml-2">
                  {product.name}
                </label>
              </div>
            ))}
          </div>
        </div>
        <button className="bg-slate-400 rounded-lg my-5 w-52">
          {isLoading ? "Adding..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
