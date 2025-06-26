
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import loginArt from "../assets/stress2.png"; 
import { FaHome } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#faf6fd] relative">
      
    <button
      onClick={() => navigate("/")}
      className="absolute top-4 right-4 flex items-center gap-2 text-purple-700 font-medium hover:underline"
    >
      <FaHome /> Home
    </button>

   
    <div className="hidden md:flex w-1/2 items-center justify-center p-10 bg-gradient-to-br from-purple-100 to-purple-200">
      <img
        src={loginArt}
        alt="Mental Health Illustration"
        className="max-w-md w-full"
      />
    </div>

    
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-6 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome Back</h2>
        <p className="text-gray-600 mb-8">Log in to continue your wellness journey ✨</p>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-md font-medium hover:bg-purple-700"
          >
            Log In
          </button>

          <p className="text-sm text-center text-gray-600">
            Don’t have an account?{' '}
            <span
              className="text-purple-600 font-semibold cursor-pointer hover:underline"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;