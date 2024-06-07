import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthContext } from "../hooks/useAuthContext";

export default function UpdateFood() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { foodId } = useParams();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [image, setImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateFood = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await axios.put("/foods/updatefood/" + foodId, { 
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
      toast("Success!", { position: "top-center"});
      navigate("/food");
    } catch (error) {
      toast("Error: " + error, { position: "top-center"});
    }
  };

  useEffect(() => {
    const getFood = async () => {
      try {
        const response = await axios.get(`/foods/${foodId}`);
        setName(response.data.name);
        setDescription(response.data.description);
        setCuisine(response.data.cuisine);
        setImage(response.data.image);
        console.log(response.data);
      } catch (error) {}
    };
    getFood();
  }, []);

  return (
    <div className="flex flex-col items-center p-10">
      <form
        action="/login"
        method="POST"
        className="w-full flex flex-col items-center"
        onSubmit={handleUpdateFood}
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
          <input
            type="text"
            className="rounded-lg my-1 border-2"
            value={cuisine}
            onChange={(event) => setCuisine(event.target.value)}
          />
          <label className="font-bold">Image</label>
          <input
            type="text"
            className="rounded-lg my-1 border-2"
            value={image}
            onChange={(event) => setImage(event.target.value)}
          />
        </div>
        <button className="bg-slate-400 rounded-lg my-5 w-52">{isLoading? "Updating...":"Update"}</button>
      </form>
    </div>
  );
}
