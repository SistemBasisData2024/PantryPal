import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthContext } from "../hooks/useAuthContext";

export default function AddProduct() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [expired, setExpired] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("");
  const [image, setImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        "/products/add/",
        {
          name: name,
          description: description,
          brand: brand,
          expired: expired,
          stock: Number(stock),
          price: Number(price),
          type: type,
          avg_rating: 0,
          image: image,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (response.status === 201) {
        toast.success("Product added successfully!", {
          position: "top-center",
        });
        setIsLoading(false);
        navigate("/supplier/dashboard");
      } else {
        setIsLoading(false);
        toast.error(`Failed to add product.`, { position: "top-center" });
      }
    } catch (error) {
      toast.error(`Error: ${error.response?.data?.message || error.message}`, {
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-10">
      <form
        method="POST"
        className="w-full flex flex-col items-center"
        onSubmit={handleAddProduct}
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
          <label className="font-bold">Brand</label>
          <input
            type="text"
            className="rounded-lg my-1 border-2"
            value={brand}
            onChange={(event) => setBrand(event.target.value)}
          />
          <label className="font-bold">Expired</label>
          <input
            type="date"
            className="rounded-lg my-1 border-2"
            value={expired}
            onChange={(event) => setExpired(event.target.value)}
          />
          <label className="font-bold">Stock</label>
          <input
            type="text"
            className="rounded-lg my-1 border-2"
            value={stock}
            onChange={(event) => setStock(event.target.value)}
          />
          <label className="font-bold">Price</label>
          <input
            type="text"
            className="rounded-lg my-1 border-2"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
          />
          <label className="font-bold">Type</label>
          <input
            type="text"
            className="rounded-lg my-1 border-2"
            value={type}
            onChange={(event) => setType(event.target.value)}
          />
          <label className="font-bold">Image</label>
          <input
            type="text"
            className="rounded-lg my-1 border-2"
            value={image}
            onChange={(event) => setImage(event.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-slate-400 rounded-lg my-5 w-52"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Add"}
        </button>
      </form>
    </div>
  );
}
