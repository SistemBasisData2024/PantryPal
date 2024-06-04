import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

export default function FoodDetail() {
  const [food, setFood] = useState([]);
  const { foodId } = useParams();
  console.log(foodId);
  useEffect(() => {
    const getFood = async () => {
      try {
        const response = await axios.get(`/foods/${foodId}`);
        setFood(response.data);
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
          <p>Description</p>
          <p>{food.description}</p>
          <h2 className="font-bold text-xl">{food.price}</h2>
        </div>
      </div>
    </div>
  );
}
