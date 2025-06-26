import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import QuoteCard from "../components/QuoteCard";
import InfoCard from "../components/InfoCard";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#fcfbf9] min-h-screen">
      <Navbar />
      <HeroSection />
      <div className="flex flex-col md:flex-row justify-center items-center gap-8 px-6 py-12">
        <QuoteCard />
        <InfoCard />
      </div>

      {/* Get Started Section */}
      <section
        id="get-started-section"
        className="bg-white px-6 py-16 text-center flex flex-col items-center gap-6"
      >
        <h2 className="text-3xl font-bold text-gray-800">
          “Healing takes time, and asking for help is a courageous step.”
        </h2>
        <p className="text-gray-600 max-w-xl">
          Take charge of your emotional wellness today. We're here for you — with tools, journaling, and support.
        </p>
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700"
          >
            Log In
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-full font-medium hover:bg-purple-100"
          >
            Sign Up
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
