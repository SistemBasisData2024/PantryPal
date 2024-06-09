import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthContext } from "../hooks/useAuthContext";

export default function AddFood() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [image, setImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddFood = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.post("/foods/addfood", { 
        name: name,
        description: description,
        cuisine: cuisine,
        image: image
      }, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      setIsLoading(false);
      if(response.status === 201) {
        toast("Success!", { position: "top-center"});
        navigate("/food");
      }
    } catch (error) {
      toast("Error: " + error, { position: "top-center"});
    }
  };

  return (
    <div className="flex flex-col items-center p-10">
      <form
        action="/login"
        method="POST"
        className="w-full flex flex-col items-center"
        onSubmit={handleAddFood}
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
          <input
            type="text"
            className="rounded-lg my-1 border-2"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <label className="font-bold">Cuisine</label>
          <select
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
            className="rounded-lg my-2 border-2"
          >
            <option value="Italian">Italian</option>
            <option value="French">French</option>
            <option value="Indonesian">Indonesian</option>
            <option value="Korean">Korean</option>
            <option value="Thai">Thai</option>
            <option value="Mexican">Mexican</option>
            <option value="Indian">Indian</option>
            <option value="American">American</option>
            <option value="Chinese">Chinese</option>
            <option value="Vietnamese">Vietnamese</option>
            <option value="Arab">Arab</option>
            <option value="Japanese">Japanese</option>
            <option value="Others">Others</option>
          </select>
          <label className="font-bold">Image</label>
          <input
            type="text"
            className="rounded-lg my-1 border-2"
            value={image}
            onChange={(event) => setImage(event.target.value)}
          />
        </div>
        <button className="bg-slate-400 rounded-lg my-5 w-52">{isLoading? "Adding...":"Submit"}</button>
      </form>
    </div>
  );
}
