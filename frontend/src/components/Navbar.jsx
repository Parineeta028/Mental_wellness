import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleGetStarted = () => {
    const target = document.getElementById("get-started-section");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
      <div className="text-2xl font-bold text-gray-800">
        <span className="text-purple-600">Mind</span>Care
      </div>
      <ul className="hidden md:flex gap-6 text-gray-700 font-medium">
        <li className="hover:text-purple-600 cursor-pointer">About Us</li>
        <li className="hover:text-purple-600 cursor-pointer">Work With Us</li>
        <li className="hover:text-purple-600 cursor-pointer">Events</li>
        <li className="hover:text-purple-600 cursor-pointer">Contact</li>
      </ul>
      <button
        onClick={handleGetStarted}
        className="px-4 py-2 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700"
      >
        Get Started
      </button>
    </nav>
  );
};

export default Navbar;