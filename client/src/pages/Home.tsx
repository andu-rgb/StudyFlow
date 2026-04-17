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
      axios
        .get(`${API_BASE}/api/habits`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setHabits(res.data))
        .catch((err) => console.log(err));
    }
  }, []);

  const completed = habits.filter((h) => h.completed).length;
  const completionRate =
    habits.length > 0 ? Math.round((completed / habits.length) * 100) : 0;

  const card = {
    background: "var(--card)",
    color: "var(--text)",
    padding: "50px",
    borderRadius: "28px",
    boxShadow: "0 12px 35px rgba(236,72,153,0.08)",
  };

  const smallCard = {
    background: "var(--card)",
    color: "var(--text)",
    padding: "28px",
    borderRadius: "28px",
    boxShadow: "0 12px 35px rgba(236,72,153,0.08)",
  };

  const softButton = {
    padding: "15px 22px",
    borderRadius: "16px",
    border: "none",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "18px",
    transition: "0.25s ease",
  };

  return (
    <div className="page">
      {/* TOP GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.45fr 0.95fr",
          gap: "22px",
          alignItems: "stretch",
        }}
      >
        {/* HERO */}
        <div style={card}>
          <p
            style={{
              color: "var(--text2)",
              fontWeight: 700,
              letterSpacing: "0.06em",
              marginBottom: "18px",
              textTransform: "uppercase",
              fontSize: "18px",
            }}
          >
            Study Tracker
          </p>

          <h1
            style={{
              fontSize: "86px",
              margin: 0,
              lineHeight: 1,
              fontWeight: 800,
              background:
                "linear-gradient(90deg,#ec4899,#f472b6,#fb7185)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            StudyFlow
          </h1>

          <p
            style={{
              marginTop: "28px",
              fontSize: "24px",
              color: "var(--text2)",
              lineHeight: 1.55,
              maxWidth: "720px",
            }}
          >
            Stay motivated and organized with a cute tracker
            {" "}𓍢ִ໋🌷͙֒ ᰔᩚ
          </p>

          {/* BUTTONS */}
          <div
            style={{
              display: "flex",
              gap: "18px",
              marginTop: "32px",
              marginBottom: "28px",
            }}
          >
            <Link to="/dashboard">
              <button
                style={{
                  ...softButton,
                  background: "var(--nav)",
                  color: "white",
                  minWidth: "170px",
                }}
              >
                Start Tracking
              </button>
            </Link>

            <Link to="/stats">
              <button
                style={{
                  ...softButton,
                  background: "#FFE560",
                  color: "#333",
                  minWidth: "150px",
                }}
              >
                View Stats
              </button>
            </Link>
          </div>

          {/* FEATURES */}
          <div
            style={{
              display: "flex",
              gap: "28px",
              flexWrap: "wrap",
              color: "var(--accent)",
              fontWeight: 700,
              fontSize: "18px",
            }}
          >
            <span>~ Study Sessions</span>
            <span>~ Goal Tracking</span>
            <span>~ Stay Focused</span>
          </div>
        </div>

        {/* RIGHT PROGRESS CARD */}
        <div style={smallCard}>
          <h3
            style={{
              marginTop: 0,
              marginBottom: "18px",
              fontSize: "32px",
              color: "var(--text)",
            }}
          >
            Today's Progress 🌷
          </h3>

          {habits.length === 0 ? (
            <p
              style={{
                color: "var(--text2)",
                fontSize: "18px",
                marginBottom: "20px",
              }}
            >
              No tasks yet — add some on the Dashboard!
            </p>
          ) : (
            habits.slice(0, 3).map((habit) => (
              <div
                key={habit._id}
                style={{
                  background: "var(--bg)",
                  borderRadius: "18px",
                  padding: "14px 16px",
                  marginBottom: "12px",
                }}
              >
                <strong style={{ color: "var(--text)", fontSize: "18px" }}>
                  {habit.name}
                </strong>

                <p
                  style={{
                    margin: "6px 0 0",
                    color: "var(--text2)",
                    fontSize: "16px",
                  }}
                >
                  {habit.completed
                    ? "✔ Completed!"
                    : "⏸ In Progress~"}
                </p>
              </div>
            ))
          )}

          {/* PROGRESS BAR CARD */}
          <div
            style={{
              marginTop: "20px",
              padding: "22px",
              borderRadius: "22px",
              background:
                "linear-gradient(to right,#f472b6,#fb923c)",
              color: "white",
              textAlign: "center",
            }}
          >
            <h1
              style={{
                margin: 0,
                fontSize: "56px",
                lineHeight: 1,
              }}
            >
              {completionRate}%
            </h1>

            <p
              style={{
                margin: "8px 0 0",
                fontSize: "18px",
                opacity: 0.95,
              }}
            >
              Daily Completion
            </p>
          </div>
        </div>
      </div>

      {/* BOTTOM 3 CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "22px",
          marginTop: "22px",
        }}
      >
        {[
          {
            title: "Daily Tracking",
            text: "Stay consistent with your daily study wins",
          },
          {
            title: "Streak Building",
            text: "Keep momentum and stay motivated",
          },
          {
            title: "Progress Insights",
            text: "See growth with beautiful stats",
          },
        ].map((item, i) => (
          <div key={i} style={smallCard}>
            <h3
              style={{
                marginTop: 0,
                marginBottom: "14px",
                fontSize: "32px",
              }}
            >
              {item.title}
            </h3>

            <p
              style={{
                margin: 0,
                color: "var(--text2)",
                fontSize: "18px",
                lineHeight: 1.5,
              }}
            >
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;