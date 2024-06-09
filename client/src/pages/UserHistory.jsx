import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthContext } from "../hooks/useAuthContext";

export default function UserHistory() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const {user} = useAuthContext();

  useEffect(() => {
    const getOrders = async () => {
      try {
        const response = await axios.get("/orders", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });
        setOrders(response.data.payload);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        toast(`Error ${error}`, { position: "bottom-right" });
      }
    };
    getOrders();
  }, []);

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Order History</h2>
      {orders.length === 0 && !isLoading && <p>No orders found</p>}
      {!isLoading ? (
        <div className="grid grid-cols-1 gap-4 w-full">
          {orders.map((order) => (
            <div key={order.order_id} className="p-4 w-full border rounded-md">
              <h4 className="font-bold">Order ID: {order.order_id}</h4>
              <p>
                Order Date: {new Date(order.order_date).toLocaleDateString()}
              </p>
              <p>Status: {order.status}</p>
              <Link to={`/order/${order.order_id}`}>
                <button className="mt-3 p-2 bg-slate-400 rounded-md" disabled={order.status === "cancelled"}>
                  View Order Details
                </button>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
