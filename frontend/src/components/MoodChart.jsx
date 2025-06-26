
import React, { useEffect, useState } from "react";
import { db } from "../services/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useAuth } from "../context/AuthContext";

const MoodChart = () => {
  const [data, setData] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "emotions", currentUser.uid, "logs"),

      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const moodData = [];
      snapshot.forEach((doc) => {
        const { emotion, timestamp } = doc.data();
        if (emotion && timestamp) {
          const moodScore =
            emotion === "happy"
              ? 2
              : emotion === "neutral"
              ? 1
              : emotion === "frustrated"
              ? 0
              : -1;
          moodData.push({
            date: timestamp.toDate().toLocaleDateString("en-GB"),
            mood: moodScore,
          });
        }
      });
      setData(moodData);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const moodLabels = {
    2: "Happy",
    1: "Neutral",
    0: "Frustrated",
    [-1]: "Sad",
  };

  return (
    <div className="w-full h-60 md:h-72">
      {data.length === 0 ? (
        <p className="text-gray-500 text-sm">No emotional data yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 30, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              stroke="#666"
              angle={-30}
              height={60}
            />
            <YAxis
              type="number"
              domain={[-1, 2]}
              tickFormatter={(value) => moodLabels[value] || ""}
              tick={{ fontSize: 12 }}
              stroke="#666"
            />
            <Tooltip
              formatter={(value) => moodLabels[value]}
              labelStyle={{ fontWeight: "bold" }}
            />
            <Line
              type="monotone"
              dataKey="mood"
              stroke="#a855f7"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default MoodChart;
