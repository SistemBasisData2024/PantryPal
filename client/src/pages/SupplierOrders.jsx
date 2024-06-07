import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

export default function SupplierOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthContext();
  useEffect(() => {
    const getSupplierOrders = async () => {
      setIsLoading(true);
      const response = await axios.get("/orders/myorders", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setIsLoading(false);
      setOrders(response.data);
      console.log(response.data);
    };
    getSupplierOrders();
  }, []);
  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {!isLoading &&
        orders &&
        orders.length > 0 &&
        orders.map((order, idx) => (
          <div key={idx} className="p-4 flex items-center justify-between border rounded-md">
            <Link to={`/supplier/orderitem/${order.order_id}`}>
              <h3 className="text-xl font-bold text-yellow-600 mb-2">Order #{idx+1}</h3>
              <h4 className="font-bold">Product Id: {order.product_id}</h4>
              <p>Quantity: {order.quantity}</p>
            </Link>
            <button className="px-5 py-1 h-fit bg-blue-500 text-white rounded-md">Information</button>
          </div>
        ))}
    </div>
  );
}
