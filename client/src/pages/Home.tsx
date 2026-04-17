import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import API_BASE from "../config";

interface Habit {
  _id: string;
  name: string;
  completed: boolean;
}

function Home({ darkMode }: { darkMode: boolean }) {
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.get(`${API_BASE}/api/habits`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then((res) => setHabits(res.data));
    }
  }, []);

  const completedCount = habits.filter((h) => h.completed).length;
  const completionRate = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;

  const card = {
    background: darkMode ? "#16213e" : "white",
    color: darkMode ? "white" : "black",
    padding: "50px",
    borderRadius: "20px",
    boxShadow: "0 12px 20px rgba(0,0,0,0.08)",
  };

  const smallCard = {
    background: darkMode ? "#16213e" : "white",
    color: darkMode ? "white" : "black",
    padding: "20px",
    borderRadius: "20px",
    boxShadow: "0 12px 20px rgba(0,0,0,0.08)",
  };

  return (
    <div className="page">
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "20px", alignItems: "center" }}>
        <div style={card}>
          <div style={{ color: "#f9b2c2", fontWeight: "bold", marginBottom: "12px", fontSize: "18px" }}>Study Tracker</div>
          <h1 style={{ fontSize: "72px", fontWeight: "bold", color: "#f4a46e", lineHeight: "1.1", textShadow: "2px 2px #f4d168" }}>StudyFlow</h1>
          <p style={{ fontSize: "24px", color: darkMode ? "#ccc" : "#555", marginBottom: "30px", lineHeight: "1.5" }}>
            Stay motivated and organized with a cute tracker 𓍢ִ໋🌷͙֒ ᰔᩚ
          </p>
          <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
            <Link to="/dashboard">
              <button style={{ background: "#f9b2c2", color: "white", padding: "15px 20px", borderRadius: "15px", border: "none", fontWeight: "bold", fontSize: "18px", cursor: "pointer" }}>
                Start Tracking
              </button>
            </Link>
            <Link to="/stats">
              <button style={{ background: "#FFE560", color: "#333", padding: "15px 20px", borderRadius: "15px", border: "none", fontWeight: "bold", fontSize: "18px", cursor: "pointer" }}>
                View Stats
              </button>
            </Link>
          </div>
          <div style={{ display: "flex", gap: "20px", color: darkMode ? "#aaa" : "#777", fontWeight: "bold" }}>
            <span>~ Study Sessions</span>
            <span>~ Goal Tracking</span>
            <span>~ Stay Focused</span>
          </div>
        </div>

        <div style={smallCard}>
          <h5 style={{ marginTop: 0, color: darkMode ? "white" : "black" }}>Today's Progress 🌷</h5>
          {habits.length === 0 ? (
            <p style={{ color: "#9ca3af", textAlign: "center" }}>No tasks yet — add some on the Dashboard!</p>
          ) : (
            habits.slice(0, 3).map((habit) => (
              <div key={habit._id} style={{ background: darkMode ? "#0f3460" : "#fff0f5", borderRadius: "12px", padding: "10px", marginBottom: "8px" }}>
                <strong>{habit.name}</strong>
                <p style={{ margin: 0, color: "#9ca3af" }}>{habit.completed ? "✔ Completed!" : "⏸ In Progress~"}</p>
              </div>
            ))
          )}
          <div style={{ marginTop: "20px", background: darkMode ? "#0f3460" : "#fff0f5", padding: "15px", borderRadius: "15px", textAlign: "center" }}>
            <h2 style={{ margin: 0, color: "#f9b2c2" }}>{completionRate}%</h2>
            <p style={{ margin: 0, color: darkMode ? "#ccc" : "black" }}>Daily Completion</p>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginTop: "20px" }}>
        {["Daily Tracking", "Streak Building", "Progress Insights"].map((title, i) => (
          <div key={i} style={{ background: darkMode ? "#16213e" : "white", color: darkMode ? "white" : "black", padding: "32px", borderRadius: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
            <h3>{title}</h3>
            <p style={{ color: darkMode ? "#aaa" : "#555" }}>
              {i === 0 ? "Stay consistent with your daily study wins" : i === 1 ? "Keep momentum and stay motivated" : "See growth with beautiful stats"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;