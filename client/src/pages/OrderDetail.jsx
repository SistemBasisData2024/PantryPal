import { useEffect, useState } from 'react';
import axios from "axios";
import { useAuthContext } from '../hooks/useAuthContext';
import { useParams, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

export default function OrderDetail() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState({});

  useEffect(() => {
    const getOrders = async () => {
      try {
        const response = await axios.get(`/orders/orderdetails/${orderId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });
        if(response.status === 200) {
          console.log(response.data);
          setOrders(response.data);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching order details:", error);
        setIsLoading(false);
        toast(`Error ${error}`, { position: "bottom-right" });
      }
    };

    if (orderId && user.token) {
      getOrders();
    } else {
      console.warn("orderId or user token is missing");
      setIsLoading(false);
    }
  }, [orderId, user.token]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {orders.length > 0 ? (
        orders.map((order, idx) => (
          <div key={idx} className='border mb-5 flex flex-col'>
            <p>Product: {order.product_id}</p>
            <p>Quantity: {order.quantity}</p>
            {}
            <button className='text-white bg-amber-500 rounded-lg mt-3' onClick={() => navigate("/rate/" + order.product_id)}>Rate</button>
          </div>
        ))
      ) : (
        <div>No orders found</div>
      )}
    </div>
  );
}
