import React, { useContext } from "react";
import { Link, NavLink, Navigate } from "react-router-dom";
import { UserContext } from "../UserContextProvider";
import axios from "axios"; // Import axios

export default function Header() {
  const { user, ready, setUser } = useContext(UserContext); // Import and use setUser

  const handleLogout = async () => {
    setUser(null);
    localStorage.removeItem("user");
    try {
      await axios.post("/logout");
    } catch (error) {
      console.error("Logout error:", error);
    }
    window.location.href = "/login";
  };

  if (!ready) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (user) {
    return (
      <header className="bg-white shadow-md">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/home" className="text-lg font-semibold text-blue-600 hover:text-blue-800">
                Home
              </Link>

              <div>
  <div className="ml-10 flex items-baseline space-x-4">
    <NavLink to="/myquizzes" className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium">
      My Quizzes 
    </NavLink>

    <NavLink to="/communityquizzes" className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium">
      Community Quizzes
    </NavLink>

    <NavLink to="/apiquizzes" className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium">
      API Quizzes
    </NavLink>
  </div>
</div>
            </div>

            <div className="flex items-center">
              <span className="text-gray-800 text-sm font-medium mr-4">{user.firstName} {user.lastName}</span>
              <button onClick={handleLogout} className="text-red-600 hover:text-red-800 px-3 py-2 rounded-md text-sm font-medium">
                Logout
              </button>
            </div>
          </div>
        </nav>
      </header>
    );
  } else {
    return <Navigate to="/" />;
  }
}
