import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

export default function OrderItem() {
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState([]);
  const [orderAddress, setOrderAddress] = useState([]);
  const { orderId } = useParams();
  const { user } = useAuthContext();

  useEffect(() => {
    const getOrder = async () => {
      setIsLoading(true);
      const response = await axios.get(`/orders/getorder/${orderId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      setIsLoading(false);
      setOrder(response.data.rows[0]);
      console.log("order: ", response.data.rows[0]);
    };
    const getOrderAddress = async () => {
      setIsLoading(true);
      const response = await axios.get(`/orders/orderaddress/${orderId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      setIsLoading(false);
      setOrderAddress(response.data[0]);
    };
    getOrder();
    getOrderAddress();
  }, []);

  return (
    <div>
      {! isLoading && orderAddress && order && (
        <div className="p-16">
          <h3 className="font-bold">Status</h3>
          <p>Status: {order.status}</p>
          <h3 className="font-bold">Address</h3>
          <p>Country: {orderAddress.country}</p>
          <p>City: {orderAddress.city}</p>
          <p>Address: {orderAddress.street}</p>
        </div>
      )}
    </div>
  );
}
