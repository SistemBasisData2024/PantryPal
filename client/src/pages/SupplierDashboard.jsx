import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext.jsx";

export default function SupplierDashboard() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [productSearch, setProductSearch] = useState([]);
  const [searchValue, setSearchValue] = useState(products);
  const [isLoading, setIsLoading] = useState(true);

  const deleteProduct = async (id) => {
    try {
      await axios.delete("/products/delete/" + id, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      setProducts((products) => products.filter((product) => product.product_id !== id));
      setProductSearch((products) => products.filter((product) => product.product_id !== id));
      toast.success(`Deleted Succesfully`, { position: "top-center" });
    } catch(error) {
      toast.error(error)
    }
  };

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get("/products/myproducts", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setProducts(response.data);
        setProductSearch(response.data);
        setIsLoading(false);
        console.log(response.data);
      } catch (error) {
        setIsLoading(false);
        toast(`Error ${error}`, { position: "bottom-right" });
      }
    };

    getProducts();
  }, []);

  useEffect(() => {
    const filteredData = products.filter((item) =>
      item.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setProductSearch(filteredData);
  }, [searchValue]);
  return (
    <div>
      <div className="flex m-5 mx-36 items-center justify-between">
        <h1 className="font-bold">My Products</h1>
        <span className="text-2xl m-3">
          <Link to={`/product/add`}>
            <ion-icon name="add-circle-outline"></ion-icon>
          </Link>
        </span>
      </div>
      <div className="flex flex-col items-center">
        <input
          className="w-96 mb-4 border-2"
          type="text"
          placeholder="Search..."
          onChange={(e) => setSearchValue(e.target.value)}
          value={searchValue}
        />
        <div className="grid grid-cols-4 px-32 py-5">
          {products.length === 0 && !isLoading && <p>No products available</p>}
          {!isLoading ? (
            productSearch.map((product) => (
              <div
                className="p-10 border-3 border-black border-2 m-3 rounded-md"
                key={product.product_id}
              >
                <Link to={`/product/${product.product_id}`}>
                  <img
                    src={
                      product.image !== null
                        ? product.image
                        : "https://t4.ftcdn.net/jpg/04/00/24/31/360_F_400243185_BOxON3h9avMUX10RsDkt3pJ8iQx72kS3.jpg"
                    }
                    alt={product.name}
                  />
                  <h4 className="font-bold">{product.name}</h4>
                  <p>Rating: {product.avg_rating}</p>
                  <p>Rp {product.price}</p>
                </Link>
                <button
                  className="text-sm mt-3 py-1 w-full bg-blue-400 rounded-md"
                  onClick={() =>
                    navigate(`/product/update/${product.product_id}`)
                  }
                >
                  Update
                </button>
                <button
                  className="text-sm mt-3 py-1 w-full bg-red-500 rounded-md"
                  onClick={() => deleteProduct(product.product_id)}
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
}
