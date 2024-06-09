import axios from "axios";
import { useCartContext } from "./useCartContext";
import { useAuthContext } from "./useAuthContext";
import { useState } from "react";
import { toast } from "react-toastify";

export const useDeleteCart = () => {
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useCartContext();

  const deleteCart = async (product_id) => {
    try {
      console.log(product_id);
      setIsLoading(true);

      const response = await axios.post(
        `/user/deleteproduct`,
        { product_id: product_id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (response.status !== 200) {
        toast.error(
          response.data.error || "Failed to remove product from cart"
        );
      } else {
        console.log("success");
        dispatch({ type: "REMOVE_CART", payload: { product_id } });
        toast.success("Product removed from cart");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteCart, isLoading };
};
