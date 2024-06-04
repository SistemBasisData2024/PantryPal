import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

export default function FoodDetail() {
  const [food, setFood] = useState([]);
  const { foodId } = useParams();
  useEffect(() => {
    const getFood = async () => {
      try {
        const response = await axios.get(`/foods/${foodId}`);
        setFood(response.data);
        console.log(response.data);
      } catch (error) {}
    };
    getFood();
  }, []);
  return (
    <div>
      <img src={food.image} alt="" className="w-full h-56 object-cover" />
      <div className="m-10 p-10 border-2">
        <h1 className="font-bold text-4xl">{food.name}</h1>
        <div className="p-5">
          <p>{food.cuisine}</p>
          <p className="font-semibold mt-5">Description</p>
          <p>{food.description}</p>
          <h2 className="font-bold text-xl">{food.price}</h2>
        </div>
        <div>
          <h3 className="font-bold">Available Recipes:</h3>
          {food.recipes && food.recipes.length > 0 ? (
            food.recipes.map((recipe) => (
              <div className="border-2 border-black mt-3 p-3 rounded-lg">
                <Link to={`/recipe/${recipe._id}`}>
                  <h3 className="font-semibold">{recipe.name}</h3>
                  <h3>Rating: {recipe.avg_rating.toFixed(2)}</h3>
                </Link>
              </div>
            ))
          ) : (
            <p>No recipes available</p>
          )}
        </div>
      </div>
    </div>
  );
}
