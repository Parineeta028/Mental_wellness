import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../services/firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import BackgroundLogo from "../components/BgLogo"; // ✅ import background component

import {
  FaSpa,
  FaHeadphones,
  FaDumbbell,
  FaWind,
  FaHeart,
  FaArrowLeft,
} from "react-icons/fa";

const categories = [
  {
    name: "Meditation",
    icon: <FaSpa className="text-2xl text-purple-700" />,
    description: "Guided sessions to calm your mind.",
    bg: "bg-indigo-100",
    embed: "https://www.youtube.com/embed/inpok4MKVLM",
  },
  {
    name: "Music",
    icon: <FaHeadphones className="text-2xl text-pink-600" />,
    description: "Uplifting playlists to boost your mood.",
    bg: "bg-pink-100",
    embed: "https://www.youtube.com/embed/5qap5aO4i9A",
  },
  {
    name: "Exercise",
    icon: <FaDumbbell className="text-2xl text-green-700" />,
    description: "Simple routines to move your body.",
    bg: "bg-green-100",
    embed: "https://www.youtube.com/embed/X655B4ISakg",
  },
  {
    name: "Breathing",
    icon: <FaWind className="text-2xl text-blue-700" />,
    description: "Deep breathing techniques for relaxation.",
    bg: "bg-blue-100",
    embed: "https://www.youtube.com/embed/odADwWzHR24",
  },
  {
    name: "Affirmations",
    icon: <FaHeart className="text-2xl text-yellow-600" />,
    description: "Positive reminders to uplift your spirit.",
    bg: "bg-yellow-100",
    quotes: [
      "I am in charge of how I feel today.",
      "I am calm and in control.",
      "Every day is a new beginning.",
    ],
  },
];

export default function Resources() {
  const { currentUser } = useAuth();
  const [latestEmotion, setLatestEmotion] = useState(null);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatestEmotion = async () => {
      if (!currentUser) return;
      const moodQuery = query(
        collection(db, "emotions", currentUser.uid, "logs"),
        orderBy("timestamp", "desc"),
        limit(1)
      );
      const snapshot = await getDocs(moodQuery);
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        setLatestEmotion(data.emotion);
        fetchSuggestions(data.emotion);
      }
    };
    fetchLatestEmotion();
  }, [currentUser]);

  const fetchSuggestions = async (emotion) => {
    try {
      const res = await fetch("http://localhost:5000/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emotion }),
      });
      const data = await res.json();
      setAiSuggestions(data.suggestions || []);
    } catch (err) {
      console.error("Failed to fetch AI suggestions:", err);
    }
  };

  return (
    <div className="min-h-screen relative">
      <BackgroundLogo /> {/* ✅ background component */}
      <div className="relative z-10 max-w-6xl mx-auto p-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-6 flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition"
        >
          <FaArrowLeft /> Back to Dashboard
        </button>

        <h1 className="text-4xl font-bold text-purple-800 mb-6 flex items-center gap-3">
          <FaHeart className="text-pink-500" /> Personalized Resources for You
        </h1>

        {latestEmotion && (
          <div className="bg-white rounded-2xl shadow-md p-5 mb-10">
            <h2 className="text-xl font-semibold text-purple-700 mb-2">
              Based on your mood: <span className="italic">{latestEmotion}</span>
            </h2>
            <ul className="list-disc pl-6 text-gray-700">
              {aiSuggestions.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <div
              key={i}
              className={`rounded-2xl shadow-md p-4 ${cat.bg} flex flex-col gap-3`}
            >
              <h3 className="flex items-center gap-2 text-xl font-semibold text-gray-800">
                {cat.icon} {cat.name}
              </h3>
              <p className="text-gray-600 text-sm">{cat.description}</p>

              {cat.embed && (
                <iframe
                  src={cat.embed}
                  title={cat.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-xl w-full aspect-video"
                />
              )}

              {cat.quotes && (
                <ul className="list-disc pl-5 text-sm text-gray-700">
                  {cat.quotes.map((q, idx) => (
                    <li key={idx}>{q}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
