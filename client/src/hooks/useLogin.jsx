import axios from "axios";
import { useAuthContext } from "./useAuthContext.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      setError(null);
  
      const response = await axios.post("/auth/login", {
        email: email,
        password: password
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      if(response.status !== 200) {
        setIsLoading(false);
        console.log(response.error);
        setError(response.data.error);
      } else{
        localStorage.setItem("user", JSON.stringify(response.data));
        dispatch({ type: "LOGIN", payload: response.data});
        navigate("/");
        setIsLoading(false);
      }
    } catch(error) {
      setIsLoading(false);
      setError(error.message);
    }
  }
  return { login, isLoading, error };
}
