import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import API_BASE from "../config";

interface Habit {
  _id: string;
  name: string;
  completed: boolean;
}

function Home() {
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
    background: "var(--card)",
    color: "var(--text)",
    padding: "50px",
    borderRadius: "20px",
    boxShadow: "0 12px 20px rgba(0,0,0,0.08)",
  };

  const smallCard = {
    background: "var(--card)",
    color: "var(--text)",
    padding: "20px",
    borderRadius: "20px",
    boxShadow: "0 12px 20px rgba(0,0,0,0.08)",
  };

  return (
    <div className="page">
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "20px", alignItems: "center" }}>
        <div style={card}>
          <div style={{ color: "var(--text2)", fontWeight: "bold", marginBottom: "12px", fontSize: "18px" }}>Study Tracker</div>
          <h1 style={{ fontSize: "72px", fontWeight: "bold", color: "var(--accent)", lineHeight: "1.1" }}>StudyFlow</h1>
          <p style={{ fontSize: "24px", color: "var(--text2)", marginBottom: "30px", lineHeight: "1.5" }}>
            Stay motivated and organized with a cute tracker 𓍢ִ໋🌷͙֒ ᰔᩚ
          </p>
          <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
            <Link to="/dashboard">
              <button style={{ background: "var(--nav)", color: "white", padding: "15px 20px", borderRadius: "15px", border: "none", fontWeight: "bold", fontSize: "18px", cursor: "pointer" }}>
                Start Tracking
              </button>
            </Link>
            <Link to="/stats">
              <button style={{ background: "#FFE560", color: "#333", padding: "15px 20px", borderRadius: "15px", border: "none", fontWeight: "bold", fontSize: "18px", cursor: "pointer" }}>
                View Stats
              </button>
            </Link>
          </div>
          <div style={{ display: "flex", gap: "20px", color: "var(--text2)", fontWeight: "bold" }}>
            <span>~ Study Sessions</span>
            <span>~ Goal Tracking</span>
            <span>~ Stay Focused</span>
          </div>
        </div>

        <div style={smallCard}>
          <h5 style={{ marginTop: 0, color: "var(--text)" }}>Today's Progress 🌷</h5>
          {habits.length === 0 ? (
            <p style={{ color: "var(--text2)", textAlign: "center" }}>No tasks yet — add some on the Dashboard!</p>
          ) : (
            habits.slice(0, 3).map((habit) => (
              <div key={habit._id} style={{ background: "var(--bg)", borderRadius: "12px", padding: "10px", marginBottom: "8px" }}>
                <strong style={{ color: "var(--text)" }}>{habit.name}</strong>
                <p style={{ margin: 0, color: "var(--text2)" }}>{habit.completed ? "✔ Completed!" : "⏸ In Progress~"}</p>
              </div>
            ))
          )}
          <div style={{ marginTop: "20px", background: "var(--bg)", padding: "15px", borderRadius: "15px", textAlign: "center" }}>
            <h2 style={{ margin: 0, color: "var(--accent)" }}>{completionRate}%</h2>
            <p style={{ margin: 0, color: "var(--text)" }}>Daily Completion</p>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginTop: "20px" }}>
        {["Daily Tracking", "Streak Building", "Progress Insights"].map((title, i) => (
          <div key={i} style={{ background: "var(--card)", color: "var(--text)", padding: "32px", borderRadius: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
            <h3>{title}</h3>
            <p style={{ color: "var(--text2)" }}>
              {i === 0 ? "Stay consistent with your daily study wins" : i === 1 ? "Keep momentum and stay motivated" : "See growth with beautiful stats"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;