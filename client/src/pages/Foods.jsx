import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export default function Foods() {
  const [searchValue, setSearchValue] = useState("");
  const [foods, setFoods] = useState([]);
  const [searchFood, setSearchFood] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getFood = async () => {
      try {
        const response = await axios.get("/foods");
        setFoods(response.data);
        setSearchFood(response.data);
        setIsLoading(false);
        console.log(response.data);
      } catch (error) {
        toast.error(error.message, { position: "bottom-right" });
        setIsLoading(false);
      }
    };

    getFood();
  }, []);

  useEffect(() => {
    const filteredData = foods.filter((food) => 
      food.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setSearchFood(filteredData);
  }, [searchValue, foods]);

  return (
    <div className="flex flex-col items-center px-16">
      <input
        value={searchValue}
        onChange={(event) => setSearchValue(event.target.value)}
        placeholder="Search..."
        className="w-96 border-2 mb-4"
      />
      {foods.length === 0 && !isLoading && <p>No Foods Found</p>}
      {!isLoading ? (
        <div className="mt-10 w-full grid grid-cols-2 gap-3">
          {searchFood.map((food) => (
            <div
              key={food._id}
              className="w-full rounded-lg border-2 border-black flex justify-between"
            >
              <div className="p-5">
                <Link to={`/food/${food._id}`}>
                  <h2 className="font-bold text-xl mb-3">{food.name}</h2>
                  <p>{food.cuisine}</p>
                  <p>{food.recipes.length} recipes available</p>
                </Link>
              </div>
              <img
                src={
                  food.image !== undefined
                    ? food.image
                    : "https://t4.ftcdn.net/jpg/04/00/24/31/360_F_400243185_BOxON3h9avMUX10RsDkt3pJ8iQx72kS3.jpg"
                }
                alt={food.name}
                className="h-36 w-44 object-cover"
              />
            </div>
          ))}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}