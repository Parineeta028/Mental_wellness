import React, { useState } from "react";
import HeroImage from "../assets/blueLogo.png";

const HeroSection = () => {
  const [showMore, setShowMore] = useState(false);

  const handleLearnMore = () => {
    setShowMore(!showMore);
  };

  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-8 py-16 gap-10 bg-[#fdfcfa]">
      <div className="md:w-1/2 space-y-6">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
          Your Mental Health <br /> <span className="text-purple-600">Matters</span>
        </h1>
        <p className="text-gray-600 text-lg">
          You don’t have to <span className="font-semibold">struggle</span> in silence. We’re here to listen.
        </p>
        <button
          onClick={handleLearnMore}
          className="px-6 py-3 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700"
        >
          {showMore ? "Hide" : "Learn More"}
        </button>

        {showMore && (
          <div className="mt-6 bg-white border border-purple-200 rounded-lg p-5 shadow-md text-gray-700">
            <h3 className="text-xl font-bold mb-2">Why Mental Health is Important</h3>
            <p className="mb-4 text-sm">
              Mental health affects how we think, feel, and act. It helps determine how we handle stress, relate to others, and make choices.
              Prioritizing mental well-being leads to better relationships, improved performance, and a higher quality of life.
            </p>
            <h4 className="text-lg font-semibold mb-1">Solutions We Offer</h4>
            <ul className="list-disc list-inside text-sm">
              <li>Daily journaling to reflect and heal</li>
              <li>AI-powered support chatbot for anytime conversations</li>
              <li>Resources and exercises for emotional resilience</li>
              <li>Safe space to share and grow</li>
            </ul>
          </div>
        )}
      </div>

      <div className="md:w-1/2">
        <img
          src={HeroImage}
          alt="Mental Health Illustration"
          className="w-full max-w-md mx-auto"
        />
      </div>
    </section>
  );
};

export default HeroSection;