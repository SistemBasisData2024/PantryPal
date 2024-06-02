import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const useRegister = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const navigate = useNavigate();

  const register = async (name, email, password, role) => {
    console.log("register: ", name, email, password);
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.post(
        "/auth/register",
        {
          name: name,
          email: email,
          password: password,
          role: role
        },
        {
          "Content-Type": "appication/json",
        }
      );

      if (response.status !== 201) {
        setIsLoading(false);
        setError(response.data.error);
      } else {
        setIsLoading(false);
        toast.success("successful", { autoClose: 3000, position:"top-center" });
        navigate("/login");
      }
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
    }
  };
  return { register, isLoading, error };
};
