import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuthContext } from "../hooks/useAuthContext";

export default function UserPayments() {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthContext();

  const payOrder = async (id) => {
    try {
      const response = await axios.put("/orders/payorder/" + id, {}, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        }
      });
      if(response.status === 200) {
        toast("Payment Success!")
      }
    } catch(error) {
      toast.error(error);
    }
  }

  useEffect(() => {
    const getPayments = async () => {
      try {
        const response = await axios.get("/orders/payments", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });
        setPayments(response.data.payload.rows);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        toast(`Error ${error.message}`, { position: "bottom-right" });
      }
    };

    getPayments();
  }, [user.token]);

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Payment History</h2>
      {!payments && !isLoading && <p>No payments found</p>}
      {!isLoading && payments ? (
        <div className="grid grid-cols-1 gap-4 w-full">
          {payments.map((payment) => (
            <div key={payment.payment_id} className="p-4 px-24 border rounded-md flex justify-between items-center">
              <div>
                <h4 className="font-bold">Payment ID: {payment.payment_id}</h4>
                <p>Order ID: {payment.order_id}</p>
                <p>
                  Payment Date:{" "}
                  {new Date(payment.payment_date).toLocaleDateString()}
                </p>
                <p>Amount: Rp {payment.total_amount}</p>
                <p>Status: {payment.payment_status}</p>
              </div>
              <button className="px-7 py-1 bg-slate-500 h-fit rounded-md" onClick={() => payOrder(payment.payment_id)} disabled={payment.payment_status !== "awaiting_payment"}>{payment.payment_status === "awaiting_payment" && "Pay Now"}
              {payment.payment_status === "failed" && "Cancelled"}
              {(payment.payment_status === "success") && "Paid"}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
