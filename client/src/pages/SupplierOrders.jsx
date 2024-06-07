import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

export default function SupplierOrders() {
  const [orders, setOrders] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthContext();

  useEffect(() => {
    const getSupplierOrders = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("/orders/myorders", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        // Group orders by order_id
        const groupedOrders = response.data.reduce((acc, order) => {
          if (!acc[order.order_id]) {
            acc[order.order_id] = [];
          }
          acc[order.order_id].push(order);
          return acc;
        }, {});

        setOrders(groupedOrders);
        console.log(groupedOrders);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    getSupplierOrders();
  }, [user.token]);

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {!isLoading &&
        orders &&
        Object.keys(orders).length > 0 &&
        Object.keys(orders).map((orderId) => (
          <div key={orderId} className="p-4 border-2 border-black rounded-md mb-4 mx-4">
            <Link to={`/supplier/orderitem/${orderId}`}>
              <h3 className="text-xl font-bold text-yellow-600 mb-2">
                Order #{orderId}
              </h3>
            </Link>
            {orders[orderId].map((product, idx) => (
              <div key={idx} className="pl-4 mb-2 border-2 rounded-md flex items-center justify-between">
                <Link to={`/product/${product.product_id}`}>
                <h4 className="font-bold">Product Id: {product.product_id}</h4>
                <p>Quantity: {product.quantity}</p>
                </Link>
              </div>
            ))}
          </div>
        ))}
    </div>
  );
}
