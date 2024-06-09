import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthContext } from "../hooks/useAuthContext";

export default function UpdateProduct() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { productId } = useParams();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [expired, setExpired] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("");
  const [image, setImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await axios.put("/products/update/" + productId, { 
        name: name,
        description: description,
        brand: brand,
        expired: expired,
        stock: stock,
        price: price,
        type: type,
        image: image
      }, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      setIsLoading(false);
      toast("Success!", { position: "top-center"});
      navigate("/supplier/dashboard");
    } catch (error) {
      toast("Error: " + error, { position: "top-center"});
    }
  };

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await axios.get(`/products/${productId}`);
        setName(response.data.payload.name);
        setDescription(response.data.payload.description);
        setBrand(response.data.payload.brand);
        setExpired(response.data.payload.expired);
        setStock(response.data.payload.stock);
        setPrice(response.data.payload.price);
        setType(response.data.payload.type);
        setImage(response.data.payload.image);
      } catch (error) {}
    };
    getProduct();
  }, []);

  return (
    <div className="flex flex-col items-center p-10">
      <form
        action="/login"
        method="POST"
        className="w-full flex flex-col items-center"
        onSubmit={handleUpdateProduct}
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
            type="text"
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
        <button className="bg-slate-400 rounded-lg my-5 w-52">{isLoading? "Updating...":"Update"}</button>
      </form>
    </div>
  );
}
