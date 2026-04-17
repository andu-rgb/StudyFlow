import { useState, useEffect } from "react";
import axios from "axios";
import API_BASE from "../config";

interface Habit {
  _id: string;
  name: string;
  completed: boolean;
}

function Stats() {
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`${API_BASE}/api/habits`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setHabits(res.data))
      .catch(() => {});
  }, []);

  const totalHabits = habits.length;

  const completedHabits = habits.filter(
    (h) => h.completed
  ).length;

  const pendingHabits =
    totalHabits - completedHabits;

  const completionRate =
    totalHabits > 0
      ? Math.round(
          (completedHabits / totalHabits) * 100
        )
      : 0;

  const card = {
    background: "var(--card)",
    color: "var(--text)",
    padding: "30px",
    borderRadius: "28px",
    boxShadow: "0 18px 38px rgba(0,0,0,0.08)",
  };

  const statCards = [
    {
      label: "Total Tasks",
      value: totalHabits,
    },
    {
      label: "Completed",
      value: completedHabits,
    },
    {
      label: "Pending",
      value: pendingHabits,
    },
    {
      label: "Completion",
      value: `${completionRate}%`,
    },
  ];

  return (
    <div className="page">
      {/* Header */}
      <div
        style={{
          ...card,
          marginBottom: "22px",
          padding: "38px",
        }}
      >
        <div
          style={{
            color: "var(--text2)",
            fontWeight: 700,
            fontSize: "14px",
            marginBottom: "12px",
          }}
        >
          PRODUCTIVITY OVERVIEW
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: "54px",
            lineHeight: 1.05,
            color: "var(--text)",
          }}
        >
          Study Stats
        </h1>

        <p
          style={{
            marginTop: "14px",
            marginBottom: 0,
            color: "var(--text2)",
            fontSize: "18px",
            lineHeight: 1.6,
            maxWidth: "620px",
          }}
        >
          Visualize progress, celebrate wins,
          and stay motivated one task at a
          time.
        </p>
      </div>

      {/* Stat Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(4,1fr)",
          gap: "18px",
          marginBottom: "22px",
        }}
      >
        {statCards.map((item) => (
          <div
            key={item.label}
            style={card}
          >
            <div
              style={{
                fontSize: "14px",
                fontWeight: 700,
                color: "var(--text2)",
                marginBottom: "12px",
              }}
            >
              {item.label}
            </div>

            <div
              style={{
                fontSize: "42px",
                fontWeight: 800,
                color: "var(--accent1)",
                lineHeight: 1,
              }}
            >
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1.1fr 0.9fr",
          gap: "22px",
        }}
      >
        {/* Breakdown */}
        <div style={card}>
          <h2
            style={{
              marginTop: 0,
              color: "var(--text)",
              fontSize: "24px",
            }}
          >
            Task Breakdown
          </h2>

          {habits.length === 0 ? (
            <p
              style={{
                color: "var(--text2)",
                marginBottom: 0,
              }}
            >
              No study tasks yet — start on
              your Dashboard.
            </p>
          ) : (
            habits.map((habit) => (
              <div
                key={habit._id}
                style={{
                  background: "var(--bg)",
                  borderRadius: "18px",
                  padding: "14px 16px",
                  marginBottom: "12px",
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      color:
                        habit.completed
                          ? "var(--text2)"
                          : "var(--text)",
                      textDecoration:
                        habit.completed
                          ? "line-through"
                          : "none",
                    }}
                  >
                    {habit.name}
                  </div>

                  <div
                    style={{
                      fontSize: "13px",
                      marginTop: "4px",
                      color:
                        "var(--text2)",
                    }}
                  >
                    {habit.completed
                      ? "Completed"
                      : "Pending"}
                  </div>
                </div>

                <div
                  style={{
                    padding:
                      "8px 12px",
                    borderRadius:
                      "999px",
                    fontSize: "13px",
                    fontWeight: 700,
                    background:
                      habit.completed
                        ? "linear-gradient(135deg,var(--accent1),var(--accent2))"
                        : "var(--card)",
                    color:
                      habit.completed
                        ? "white"
                        : "var(--text2)",
                    border:
                      habit.completed
                        ? "none"
                        : "1px solid rgba(0,0,0,0.08)",
                  }}
                >
                  {habit.completed
                    ? "Done ✓"
                    : "Pending"}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Progress */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "22px",
          }}
        >
          {/* Progress Card */}
          <div style={card}>
            <h2
              style={{
                marginTop: 0,
                fontSize: "24px",
                color: "var(--text)",
              }}
            >
              Daily Goal
            </h2>

            <div
              style={{
                background:
                  "var(--bg)",
                height: "18px",
                borderRadius:
                  "999px",
                overflow: "hidden",
                marginTop: "18px",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  width: `${completionRate}%`,
                  height: "100%",
                  background:
                    "linear-gradient(135deg,var(--accent1),var(--accent2))",
                  transition:
                    "0.5s ease",
                }}
              />
            </div>

            <p
              style={{
                color: "var(--text2)",
                marginBottom: 0,
              }}
            >
              {completedHabits} of{" "}
              {totalHabits} tasks
              completed today
            </p>
          </div>

          {/* Motivation */}
          <div
            style={{
              padding: "34px",
              borderRadius: "28px",
              color: "white",
              background:
                "linear-gradient(135deg,var(--accent1),var(--accent2))",
              boxShadow:
                "0 18px 38px rgba(0,0,0,0.08)",
            }}
          >
            <div
              style={{
                fontSize: "16px",
                fontWeight: 700,
                opacity: 0.92,
                marginBottom: "10px",
              }}
            >
              TODAY'S ENERGY
            </div>

            <div
              style={{
                fontSize: "28px",
                fontWeight: 800,
                lineHeight: 1.25,
              }}
            >
              {completionRate ===
              100
                ? "You completed everything 🎉"
                : completionRate >=
                  70
                ? "Amazing progress today ✨"
                : completionRate >=
                  40
                ? "You're building momentum 💪"
                : "Every small step counts!"}
            </div>

            <p
              style={{
                marginTop: "14px",
                marginBottom: 0,
                opacity: 0.92,
                lineHeight: 1.6,
              }}
            >
              Keep showing up consistently —
              future you will thank you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stats;