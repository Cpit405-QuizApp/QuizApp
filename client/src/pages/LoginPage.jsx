import React, { useState,useContext } from "react";
import { Link, useNavigate} from "react-router-dom";
import axios from "axios";
import { UserContext } from "../UserContextProvider";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  async function login(ev) {
    ev.preventDefault();
    try {
      const { data } = await axios.post("/login", { email, password });
    
      setUser(data); 
       alert("Login successful");
      navigate("/home"); 
    } catch (e) {
     
      alert("Login Failed: " + e);
    }
  }

  return (
    <div>
      <form
        onSubmit={login}
        className="w-full max-w-md bg-white p-8 rounded-lg bg-opacity-50 shadow-md"
      >
        <h1 className="text-4xl font-bold mb-8 text-center">Login</h1>

        {/* Email */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            placeholder="example@gmail.com"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Login
        </button>
        <div className="flex justify-center mt-2">
          <span className="primary">
            Don't have an account?{" "}
            <Link to="/register" className="underline">
              Sign up
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
}
