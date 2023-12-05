import React, { useState,useContext } from "react";
import { Link, useNavigate} from "react-router-dom";
import axios from "axios";
import { UserContext } from "../UserContextProvider";
import styles from './IndexPage.module.css'; // Make sure the path is correct

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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={login} className="w-full max-w-md bg-white p-8 rounded-lg shadow-md border border-black">
        <h1 className="text-4xl font-bold mb-8 text-center text-black">Login</h1>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-black">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            placeholder="example@gmail.com"
            className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:ring-black focus:border-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-black">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="*************"

            required
            className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:ring-black focus:border-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Login Button */}
        <button type="submit" className={`w-full py-2 px-4 rounded-md ${styles.loginButton}`}>
          Login
        </button>

        {/* Sign Up Link */}
        <div className="flex justify-center mt-2">
          <span className="text-black">
            Don't have an account?{" "}
            <Link to="/register" className="underline text-black hover:text-opacity-70">
              Sign up
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
}