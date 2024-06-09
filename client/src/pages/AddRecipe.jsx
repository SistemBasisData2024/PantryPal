import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthContext } from "../hooks/useAuthContext";

export default function AddRecipe() {
  const navigate = useNavigate();
  const { foodId } = useParams();
  const { user } = useAuthContext();
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddRecipe = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.post("/foods/addrecipe", { 
        name: name,
        foodId: foodId,
        product: []
      }, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      setIsLoading(false);
      if(response.status === 201) {
        toast("Success!", { position: "top-center"});
        navigate("/recipe");
      }
    } catch (error) {
      toast("Error: " + error, { position: "top-center"});
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
        </div>
        <button className="bg-slate-400 rounded-lg my-5 w-52">{isLoading? "Adding...":"Submit"}</button>
      </form>
    </div>
  );
}
