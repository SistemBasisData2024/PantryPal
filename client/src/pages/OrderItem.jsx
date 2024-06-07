import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { toast } from "react-toastify";

export default function OrderItem() {
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState([]);
  const [orderAddress, setOrderAddress] = useState([]);
  const { orderId } = useParams();
  const { user } = useAuthContext();

  const handleProcessing = async () => {
    try {
      const response = await axios.put(`/orders/acceptorder/${orderId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      response.status === 200 && toast.success("Order Accepeted");
    } catch (error) {
      toast.error(error);
    }
  };
  const handleDeliver = async () => {
    try {
      const response = await axios.put(`/orders/deliverorder/${orderId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      response.status === 200 && toast.success("Order Accepeted");
    } catch (error) {
      toast.error(error);
    }
  };
  const handleCancel = async () => {
    try {
      console.log("clicked");
      const response = await axios.put(
        `/orders/cancelorder/${orderId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log(response);
      response.status === 200 ? toast.success("Order Cancelled") : toast("Failed");
    } catch (error) {
      toast.error(error.message);
    }
  };

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
      {!isLoading && orderAddress && order && (
        <div className="p-16">
          <div className="p-5 mb-3 rounded-md border-2">
            <h3 className="font-bold">Status</h3>
            <p>Status: {order.status}</p>
          </div>
          <div className="p-5 mb-3 rounded-md border-2">
            <h3 className="font-bold">Address</h3>
            <p>Country: {orderAddress.country}</p>
            <p>City: {orderAddress.city}</p>
            <p>Address: {orderAddress.street}</p>
          </div>
          {order.status !== "completed" && (
            <div className="flex justify-evenly p-5 rounded-md border-2">
              {order.status === "pending" && (
                <button
                  className="px-5 py-1 bg-slate-400 text-white rounded-md"
                  onClick={handleProcessing}
                >
                  Accept
                </button>
              )}
              {order.status === "processing" && (
                <button
                  className="px-5 py-1 bg-slate-400 text-white rounded-md"
                  onClick={handleDeliver}
                >
                  Deliver
                </button>
              )}
              <button
                className="px-5 py-1 bg-red-400 text-white rounded-md disabled:bg-slate-400"
                disabled={order.status === "cancelled"}
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
