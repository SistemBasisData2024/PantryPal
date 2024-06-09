import axios from "axios";
import { useCartContext } from "./useCartContext";
import { useAuthContext } from "./useAuthContext";
import { useState } from "react";
import { toast } from "react-toastify";

export const useAddToCart = () => {
  const { user } = useAuthContext()
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useCartContext();

  const addToCart = async (product) => {
    try {
      setIsLoading(true);
  
      const response = await axios.post("/user/postcart", {
        product_id: product.product_id,
        seller_id: product.seller_id
      }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer: ${user.token}`
        }
      });
      
      if(response.status !== 200) {
        setIsLoading(false);
        setError(response.data.error);
      } else{
        console.log("success");
        dispatch({ type: "ADD_TO_CART", payload: response.data});
        setIsLoading(false);
        toast.success("added to cart");
      }
    } catch(error) {
      setIsLoading(false);
      toast.error(error.message)
    }
  }
  return { addToCart, isLoading };
}
