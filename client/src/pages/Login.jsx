import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useLogin();
  const handleLogin = async (e) => {
    e.preventDefault();
    await login(email, password);
  };
  
  return (
    <div className="flex justify-center">
      <div className="flex flex-col items-center p-10 mt-20 w-96 bg-slate-600 rounded-lg">
        <h3>LOGIN</h3>
        <form
          action="/login"
          method="POST"
          className="flex flex-col w-full"
          onSubmit={handleLogin}
        >
          <label>Email</label>
          <input
            type="text"
            placeholder="Enter your email"
            className="rounded-sm my-1"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className="rounded-sm my-1"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <button className="bg-slate-400 rounded-lg my-5" disabled={isLoading}>
          {isLoading ? "Loggin In..." : "Log in"}
          </button>
          <Link to="/register">
            <p>Don&#39;t have an account?</p>
          </Link>
          { error && <div className="flex justify-center bg-red-300 border-2 border-red-500 px-5 mt-2 text-red-800  rounded-md">{error}</div>}
        </form>
      </div>
    </div>
  );
}
