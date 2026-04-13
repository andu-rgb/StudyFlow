import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

interface Habit {
  _id: string;
  name: string;
  completed: boolean;
}

function Home() {
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    axios.get("http://localhost:3001/api/habits").then((res) => setHabits(res.data));
  }, []);

  const completedCount = habits.filter((h) => h.completed).length;
  const completionRate = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;

  return (
    <div className="page">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr",
          gap: "20px",
          alignItems: "center",
        }}
      >
        {/* LEFT SIDE */}
        <div
          style={{
            background: "white",
            padding: "50px",
            borderRadius: "20px",
            boxShadow: "0 12px 20px rgba(0,0,0,0.08)",
          }}
        >
          <div
            style={{
              color: "#f9b2c2",
              fontWeight: "bold",
              marginBottom: "12px",
              fontSize: "18px",
            }}
          >
            Study Tracker
          </div>

          <h1
            style={{
              fontSize: "72px",
              fontWeight: "bold",
              color: "#f4a46e",
              lineHeight: "1.1",
              textShadow: "2px 2px #f4d168",
            }}
          >
            StudyFlow
          </h1>

          <p
            style={{
              fontSize: "24px",
              color: "#555",
              marginBottom: "30px",
              lineHeight: "1.5",
            }}
          >
            Stay motivated and organized with a cute tracker 𓍢ִ໋🌷͙֒ ᰔᩚ
          </p>

          <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
            <Link to="/dashboard">
              <button
                style={{
                  background: "#f9b2c2",
                  color: "white",
                  padding: "15px 20px",
                  borderRadius: "15px",
                  border: "none",
                  fontWeight: "bold",
                  fontSize: "18px",
                  cursor: "pointer",
                  boxShadow: "0 5px 10px rgba(255,143,177,0.35)",
                }}
              >
                Start Tracking 
              </button>
            </Link>

            <Link to="/stats">
              <button
                style={{
                  background: "#FFE560",
                  color: "#333",
                  padding: "15px 20px",
                  borderRadius: "15px",
                  border: "none",
                  fontWeight: "bold",
                  fontSize: "18px",
                  cursor: "pointer",
                }}
              >
                View Stats ✨
              </button>
            </Link>
          </div>

          <div
            style={{
              display: "flex",
              gap: "20px",
              color: "#777",
              fontWeight: "bold",
            }}
          >
            <span> ~ Study Sessions</span>
            <span> ~ Goal Tracking</span>
            <span> ~ Stay Focused</span>
          </div>
        </div>

        {/* RIGHT SIDE DASHBOARD PREVIEW */}
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "20px",
            boxShadow: "0 12px 20px rgba(0,0,0,0.08)",
          }}
        >
          <h5 style={{ marginTop: 0 }}>Today's Progress 🌷</h5>

          {habits.length === 0 ? (
            <p style={{ color: "#9ca3af", textAlign: "center" }}>
              No tasks yet — add some on the Dashboard!
            </p>
          ) : (
            habits.slice(0, 3).map((habit) => (
              <div key={habit._id} className="card">
                <strong>{habit.name}</strong>
                <p>{habit.completed ? "✔ Completed!" : " ⏸ In Progress~"}</p>
              </div>
            ))
          )}

          <div
            style={{
              marginTop: "20px",
              background: "#fff0f5",
              padding: "15px",
              borderRadius: "15px",
              textAlign: "center",
            }}
          >
            <h2 style={{ margin: 0, color: "#f9b2c2" }}>{completionRate}%</h2>
            <p style={{ margin: 0 }}>Daily Completion</p>
          </div>
        </div>
      </div>

      {/* BOTTOM FEATURES */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <div className="card">
          <h3> Daily Tracking</h3>
          <p>Stay consistent with your daily study wins</p>
        </div>

        <div className="card">
          <h3> Streak Building</h3>
          <p>Keep momentum and stay motivated</p>
        </div>

        <div className="card">
          <h3> Progress Insights</h3>
          <p>See growth with beautiful stat</p>
        </div>
      </div>
    </div>
  );
}

export default Home;