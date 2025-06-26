
import React, { useState, useRef, useEffect } from "react";
import {
  FaRobot,
  FaUser,
  FaArrowLeft,
  FaPaperPlane,
  FaTrash,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { db } from "../services/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import BackgroundLogo from "../components/BgLogo";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const chatEndRef = useRef(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const saveMessageToFirestore = async (message, role) => {
    if (!currentUser) return;
    try {
      await addDoc(collection(db, "chats", currentUser.uid, "messages"), {
        content: message,
        role,
        timestamp: serverTimestamp(),
      });
    } catch (err) {
      console.error("Failed to save chat message:", err);
    }
  };

  const saveEmotionToFirestore = async (emotionData) => {
    if (!currentUser) return;
    try {
      await addDoc(collection(db, "emotions", currentUser.uid, "logs"), {
        emotion: emotionData.emotion,
        score: emotionData.score,
        timestamp: serverTimestamp(),
      });
    } catch (err) {
      console.error("Failed to save emotion data:", err);
    }
  };

  const fetchSuggestions = async (emotion) => {
    try {
      const res = await fetch("http://localhost:5000/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emotion }),
      });
      const data = await res.json();
      setSuggestions(data.suggestions);
      setShowSuggestions(true);
    } catch (err) {
      console.error("Suggestion fetch error:", err);
    }
  };

  const fetchMessages = async () => {
    if (!currentUser) return;
    const q = query(
      collection(db, "chats", currentUser.uid, "messages"),
      orderBy("timestamp")
    );
    const snapshot = await getDocs(q);
    const loadedMessages = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        timestamp:
          data.timestamp instanceof Timestamp ? data.timestamp : Timestamp.now(),
      };
    });
    setMessages(loadedMessages);
  };

  const clearChat = async () => {
    const confirmClear = window.confirm(
      "Are you sure you want to clear all chat history?"
    );
    if (!confirmClear) return;
    const q = query(collection(db, "chats", currentUser.uid, "messages"));
    const snapshot = await getDocs(q);
    for (const docSnap of snapshot.docs) {
      await deleteDoc(doc(db, "chats", currentUser.uid, "messages", docSnap.id));
    }
    setMessages([]);
  };

  const groupMessagesByDate = (msgs) => {
    const grouped = {};
    msgs.forEach((msg) => {
      let dateObj;
      try {
        dateObj = msg.timestamp.toDate();
      } catch {
        dateObj = new Date();
      }
      const date = dateObj.toDateString();
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(msg);
    });
    return grouped;
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const now = Timestamp.now();
    const userMessage = {
      role: "user",
      content: input,
      timestamp: now,
    };
    setMessages((prev) => [...prev, userMessage]);
    saveMessageToFirestore(input, "user");
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("http://localhost:5000/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();

      const aiMessage = {
        role: "assistant",
        content: data.reply || "I'm here for you.",
        timestamp: Timestamp.now(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      saveMessageToFirestore(aiMessage.content, "assistant");

      if (data.emotion) {
        saveEmotionToFirestore({ emotion: data.emotion, score: data.score });
        fetchSuggestions(data.emotion);
      }
    } catch (error) {
      const fallbackMessage = {
        role: "assistant",
        content: "Sorry, something went wrong.",
        timestamp: Timestamp.now(),
      };
      setMessages((prev) => [...prev, fallbackMessage]);
      saveMessageToFirestore(fallbackMessage.content, "assistant");
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [currentUser]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-100 to-purple-200 p-4">
      <BackgroundLogo />

      <div className="relative z-10 max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl flex flex-col h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-purple-600 text-white rounded-t-3xl">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FaRobot className="text-white" /> Mental Health Assistant
          </h2>
          <div className="flex gap-2">
            <button
              onClick={clearChat}
              className="bg-white text-red-500 px-3 py-1 rounded-full hover:bg-red-100 transition"
            >
              <FaTrash />
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-1 bg-white text-purple-600 px-3 py-1 rounded-full hover:bg-purple-100 transition"
            >
              <FaArrowLeft /> Dashboard
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-purple-50">
          {Object.entries(groupedMessages).map(([date, msgs], idx) => (
            <div key={idx}>
              <div className="text-center text-sm text-gray-500 mb-2">{date}</div>
              {msgs.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs px-4 py-3 rounded-xl shadow-sm text-sm relative whitespace-pre-wrap break-words ${
                      msg.role === "user"
                        ? "bg-purple-600 text-white"
                        : "bg-purple-200 text-gray-800"
                    }`}
                  >
                    {msg.content}
                    <div className="text-[10px] mt-1 text-right text-gray-400">
                      {msg.timestamp?.toDate
                        ? msg.timestamp.toDate().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-purple-200 text-gray-800 px-4 py-2 rounded-xl shadow-sm text-sm flex items-center gap-1">
                <span className="typing-dot animate-bounce delay-0">.</span>
                <span className="typing-dot animate-bounce delay-100">.</span>
                <span className="typing-dot animate-bounce delay-200">.</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Suggestions */}
        {showSuggestions && (
          <div className="p-4 border-t bg-white">
            <h3 className="text-md font-semibold text-purple-800 mb-2">Based on how you feel, try:</h3>
            <ul className="list-disc pl-5 text-sm text-gray-700">
              {suggestions.map((sug, i) => (
                <li key={i}>{sug}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-4 border-t bg-white">
          <div className="flex items-center gap-2">
            <textarea
              rows="1"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
            <button
              onClick={handleSend}
              className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 flex items-center gap-1"
            >
              <FaPaperPlane /> Send
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .typing-dot {
          font-size: 1.5rem;
          line-height: 1;
        }
        .delay-0 { animation-delay: 0s; }
        .delay-100 { animation-delay: 0.2s; }
        .delay-200 { animation-delay: 0.4s; }
      `}</style>
    </div>
  );
};

export default Chat;
