import React from 'react';
import { Link } from "react-router-dom";
import logo from "../assets/img/logo.png";
import styles from './IndexPage.module.css'; // Update the path to where your CSS module is located

export default function IndexPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-8">
      {/* Logo */}
      <img src={logo} alt="Quiz App Logo" className="mb-10" style={{ maxWidth: '300px' }} />

      {/* Welcome Message */}
      <h1 className="text-3xl font-bold mb-6 text-center" style={{ color: '#2C2A2D' }}>Welcome to our Quiz app</h1>

      {/* Navigation Buttons */}
      <div className="flex flex-row justify-center items-center gap-4">
        <Link to={'/login'} className={`px-6 py-2 rounded-md font-semibold shadow-md transition duration-300 ${styles.loginButton}`}>
          Login
        </Link>
        <Link to={'/register'} className={`px-6 py-2 rounded-md font-semibold shadow-md transition duration-300 ${styles.signupButton}`}>
          Sign up
        </Link>
      </div>
    </div>
  );
}
