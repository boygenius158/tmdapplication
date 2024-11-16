// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4 text-white">
      <ul className="flex space-x-4">
        <li>
          <Link to="/home" className="hover:text-gray-400">
            Home
          </Link>
        </li>
        <li>
          <Link to="/tasks" className="hover:text-gray-400">
            Tasks
          </Link>
        </li>
        <li>
          <Link to="/login" className="hover:text-gray-400">
            Login
          </Link>
        </li>
        <li>
          <Link to="/register" className="hover:text-gray-400">
            Register
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
