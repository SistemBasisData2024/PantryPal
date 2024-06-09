import { Link } from "react-router-dom";
import { useRegister } from "../hooks/useRegister";
import { useState } from "react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const { register, isLoading, error } = useRegister();
  const handleRegister = async (e) => {
    e.preventDefault();
    await register(name, email, password, role);
  };
  
  return (
    <div className="flex justify-center">
      <div className="flex flex-col items-center p-10 mt-20 w-96 bg-slate-600 rounded-lg">
        <h3>REGISTER</h3>
        <form
          action="/register"
          method="POST"
          className="flex flex-col w-full"
          onSubmit={handleRegister}
        >
          <label>Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            className="rounded-sm my-1"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <label>Email</label>
          <input
            type="email"
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
          <label>Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="rounded-sm my-1"
          >
            <option value="user">User</option>
            <option value="supplier">Supplier</option>
          </select>
          <button className="bg-slate-400 rounded-lg my-5" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register"}
          </button>
          <Link to="/login">
            <p>Already have an account?</p>
          </Link>
          {error && (
            <div className="flex justify-center bg-red-300 border-2 border-red-500 px-5 mt-2 text-red-800  rounded-md">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
