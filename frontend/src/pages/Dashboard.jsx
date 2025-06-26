import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import BackgroundLogo from "../components/BgLogo";
import {
  FaBook,
  FaSmile,
  FaRobot,
  FaHome,
  FaPenFancy,
  FaComments,
  FaLeaf,
  FaSignOutAlt,
  FaPlusCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { db } from "../services/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  onSnapshot,
  doc,
  getDoc,
  orderBy,
} from "firebase/firestore";
import JournalModal from "../components/JournalModal";
import MoodChart from "../components/MoodChart";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [journalCount, setJournalCount] = useState(0);
  const [chatCount, setChatCount] = useState(0);
  const [userName, setUserName] = useState("");
  const [journals, setJournals] = useState([]);
  const [view, setView] = useState("dashboard");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [moodLogs, setMoodLogs] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserName(userSnap.data().name);
        }
      }
    };
    fetchUserData();
  }, [currentUser]);

  const handleSaveJournal = async (content) => {
    try {
      await addDoc(collection(db, "journals", currentUser.uid, "entries"), {
        content,
        timestamp: serverTimestamp(),
      });
    } catch (err) {
      console.error("Error saving journal:", err);
    }
  };

  useEffect(() => {
    if (!currentUser) return;

    const journalQuery = query(
      collection(db, "journals", currentUser.uid, "entries"),
      orderBy("timestamp", "desc")
    );
    const unsubscribeJournals = onSnapshot(journalQuery, (snapshot) => {
      setJournalCount(snapshot.size);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setJournals(data);
    });

    const chatQuery = query(
      collection(db, "chats", currentUser.uid, "messages"),
      orderBy("timestamp", "desc")
    );
    const unsubscribeChats = onSnapshot(chatQuery, (snapshot) => {
      setChatCount(snapshot.size);
    });

    const moodQuery = query(
      collection(db, "emotions", currentUser.uid, "logs"),
      orderBy("timestamp", "asc")
    );
    const unsubscribeMoods = onSnapshot(moodQuery, (snapshot) => {
      const moods = snapshot.docs.map((doc) => {
        const { emotion, timestamp } = doc.data();
        return {
          date: timestamp?.toDate().toDateString(),
          emotion,
        };
      });
      setMoodLogs(moods);

      if (moods.length > 0) {
        const latest = moods[moods.length - 1].emotion;
        fetchSuggestions(latest);
      }
    });

    return () => {
      unsubscribeJournals();
      unsubscribeChats();
      unsubscribeMoods();
    };
  }, [currentUser]);

  const fetchSuggestions = async (emotion) => {
    try {
      const res = await fetch("http://localhost:5000/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emotion }),
      });
      const data = await res.json();
      setSuggestions(data.suggestions || []);
    } catch (err) {
      console.error("Failed to fetch suggestions:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const getTileContent = ({ date, view }) => {
    if (view !== "month") return null;
    const mood = moodLogs.find((log) => log.date === date.toDateString());
    if (!mood) return null;

    const emojiMap = {
      happy: "😊",
      neutral: "😐",
      frustrated: "😣",
      sad: "😢",
    };

    return <div className="text-sm text-center mt-1">{emojiMap[mood.emotion] || "🧠"}</div>;
  };

  return (
    <>
      <BackgroundLogo />
      <div className="min-h-screen flex bg-gradient-to-br from-purple-100 via-purple-200 to-purple-300">
        <aside className="hidden md:flex flex-col w-64 p-6 bg-white bg-opacity-90 backdrop-blur-md shadow-xl rounded-r-3xl text-gray-800">
          <h2 className="text-3xl font-bold text-purple-700 mb-10 text-center">MindCare</h2>
          <nav className="flex flex-col gap-6 text-lg">
            <button onClick={() => setView("dashboard")} className={`flex items-center gap-3 hover:text-purple-600 transition-colors text-left ${view === "dashboard" ? "text-purple-700 font-semibold" : ""}`}>
              <FaHome /> Dashboard
            </button>
            <button onClick={() => setView("journals")} className={`flex items-center gap-3 hover:text-purple-600 transition-colors text-left ${view === "journals" ? "text-purple-700 font-semibold" : ""}`}>
              <FaPenFancy /> Journals
            </button>
            <button onClick={() => navigate("/chat")} className="flex items-center gap-3 hover:text-purple-600 transition-colors text-left">
              <FaComments /> AI Chat
            </button>
            <button onClick={() => navigate("/resources")} className="flex items-center gap-3 hover:text-purple-600 transition-colors text-left">
              <FaLeaf /> Resources
            </button>
            <button onClick={handleLogout} className="flex items-center gap-3 text-red-500 hover:underline transition-colors mt-12">
              <FaSignOutAlt /> Logout
            </button>
          </nav>
        </aside>

        <main className="flex-1 p-6 md:p-10">
          <div className="bg-white bg-opacity-80 backdrop-blur-lg p-6 rounded-3xl shadow-xl">
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-purple-800">Hello, {userName || "User"} 🌿</h1>
                <p className="text-gray-600 mt-1">Let’s take care of your mind today.</p>
              </div>
              {view === "journals" && (
                <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl shadow-md">
                  <FaPlusCircle /> Write Journal
                </button>
              )}
            </div>

            {view === "dashboard" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                  <div className="relative p-6 rounded-3xl shadow-md bg-[#E6E6FA]/60 backdrop-blur-sm text-purple-900 hover:scale-105 transition-all">
                    <FaBook className="text-3xl mb-3 text-purple-600" />
                    <h3 className="text-md font-medium">Journals Written</h3>
                    <p className="text-4xl font-bold mt-1">{journalCount}</p>
                    <span className="absolute bottom-3 right-4 text-xs text-purple-700 opacity-60">+ mindful entries</span>
                  </div>

                  <div onClick={() => setView("journals")} className="relative p-6 rounded-3xl shadow-md bg-[#E6E6FA]/60 backdrop-blur-sm text-purple-900 hover:scale-105 transition-all cursor-pointer">
                    <FaSmile className="text-3xl mb-3 text-pink-500" />
                    <h3 className="text-md font-medium">Mood Logs</h3>
                    <p className="text-4xl font-bold mt-1">{moodLogs.length}</p>
                    <span className="absolute bottom-3 right-4 text-xs text-pink-600 opacity-60">+ emotional logs</span>
                  </div>

                  <div className="relative p-6 rounded-3xl shadow-md bg-[#E6E6FA]/60 backdrop-blur-sm text-purple-900 hover:scale-105 transition-all">
                    <FaRobot className="text-3xl mb-3 text-indigo-600" />
                    <h3 className="text-md font-medium">Chats with AI</h3>
                    <p className="text-4xl font-bold mt-1">{chatCount}</p>
                    <span className="absolute bottom-3 right-4 text-xs text-indigo-700 opacity-60">+ insights shared</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                  <div className="bg-white bg-opacity-70 p-6 rounded-2xl shadow-md">
                    <MoodChart userId={currentUser?.uid} />
                  </div>
                  <div className="bg-[#E6E6FA]/60 p-6 rounded-2xl shadow-md backdrop-blur-sm">
                    <h2 className="text-xl font-bold text-purple-800 mb-2">AI Suggestions Based on Mood 💡</h2>
                    <ul className="text-gray-700 list-disc pl-5">
                      {suggestions.length === 0 ? (
                        <li>No suggestions yet.</li>
                      ) : (
                        suggestions.map((s, i) => <li key={i}>{s}</li>)
                      )}
                    </ul>
                  </div>
                </div>

                <div className="bg-[#E6E6FA]/60 p-6 rounded-2xl shadow-md backdrop-blur-sm">
                  <h2 className="text-lg font-bold text-purple-800 mb-4">Mood Journal Calendar</h2>
                  <Calendar
                    onChange={setSelectedDate}
                    value={selectedDate}
                    tileContent={getTileContent}
                    className="w-full"
                  />
                </div>
              </>
            )}

            {view === "journals" && (
              <div>
                <h2 className="text-2xl font-bold text-purple-800 mb-4">Your Journals 📝</h2>
                <div className="grid gap-4">
                  {journals.length === 0 ? (
                    <p className="text-gray-500">No journal entries yet.</p>
                  ) : (
                    journals.map((entry) => (
                      <div key={entry.id} className="bg-white border border-purple-200 p-4 rounded-xl shadow-md">
                        <p className="text-gray-700 whitespace-pre-line">{entry.content}</p>
                        <p className="text-sm text-right text-gray-500 mt-2">{entry.timestamp?.toDate().toLocaleString() || ""}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          <JournalModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveJournal}
          />
        </main>
      </div>
    </>
  );
};

export default Dashboard;
