import { useEffect, useState } from "react";
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
      .catch((err) => console.log(err));
  }, []);

  const total = habits.length;
  const completed = habits.filter(
    (h) => h.completed
  ).length;
  const pending = total - completed;

  const completionRate =
    total > 0
      ? Math.round((completed / total) * 100)
      : 0;

  const card = {
    background: "var(--card)",
    color: "var(--text)",
    borderRadius: "28px",
    padding: "28px",
    boxShadow:
      "0 12px 35px rgba(236,72,153,0.08)",
  };

  const statCards = [
    {
      title: "Total Tasks",
      value: total,
      color: "var(--accent)",
    },
    {
      title: "Completed",
      value: completed,
      color: "#22c55e",
    },
    {
      title: "Pending",
      value: pending,
      color: "#f59e0b",
    },
    {
      title: "Completion",
      value: `${completionRate}%`,
      color: "#3b82f6",
    },
  ];

  return (
    <div className="page">
      {/* HEADER */}
      <div style={{ marginBottom: "26px" }}>
        <h1
          style={{
            margin: 0,
            fontSize: "58px",
            color: "var(--text)",
          }}
        >
          Study Progress ✨
        </h1>

        <p
          style={{
            marginTop: "8px",
            color: "var(--text2)",
            fontSize: "18px",
          }}
        >
          Track your momentum and celebrate
          consistency.
        </p>
      </div>

      {/* TOP STATS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: "18px",
          marginBottom: "24px",
        }}
      >
        {statCards.map((item, i) => (
          <div key={i} style={card}>
            <h2
              style={{
                margin: 0,
                fontSize: "50px",
                color: item.color,
              }}
            >
              {item.value}
            </h2>

            <p
              style={{
                marginTop: "8px",
                color: "var(--text2)",
                fontSize: "16px",
                fontWeight: 600,
              }}
            >
              {item.title}
            </p>
          </div>
        ))}
      </div>

      {/* PROGRESS SECTION */}
      <div
        style={{
          ...card,
          marginBottom: "24px",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            marginBottom: "16px",
            fontSize: "34px",
          }}
        >
          Today's Goal 🌷
        </h2>

        <div
          style={{
            height: "24px",
            background: "var(--bg)",
            borderRadius: "999px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${completionRate}%`,
              height: "100%",
              borderRadius: "999px",
              background:
                "linear-gradient(to right,#f472b6,#fb923c)",
              transition: "0.5s ease",
            }}
          />
        </div>

        <p
          style={{
            marginTop: "14px",
            color: "var(--text2)",
            fontSize: "17px",
          }}
        >
          {completed} of {total} tasks completed
          today.
        </p>
      </div>

      {/* TASK BREAKDOWN */}
      <div
        style={{
          ...card,
          marginBottom: "24px",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            marginBottom: "18px",
            fontSize: "34px",
          }}
        >
          Task Breakdown 📚
        </h2>

        {habits.length === 0 ? (
          <p
            style={{
              color: "var(--text2)",
              fontSize: "17px",
              margin: 0,
            }}
          >
            No tasks yet — start adding tasks
            on the Dashboard.
          </p>
        ) : (
          habits.map((habit) => (
            <div
              key={habit._id}
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                padding: "14px 0",
                borderBottom:
                  "1px solid rgba(0,0,0,0.05)",
                gap: "16px",
              }}
            >
              <div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "22px",
                    textDecoration:
                      habit.completed
                        ? "line-through"
                        : "none",
                    opacity:
                      habit.completed
                        ? 0.65
                        : 1,
                  }}
                >
                  {habit.name}
                </h3>

                <p
                  style={{
                    margin: "6px 0 0",
                    color:
                      "var(--text2)",
                    fontSize: "14px",
                  }}
                >
                  {habit.completed
                    ? "Completed"
                    : "Pending"}
                </p>
              </div>

              <div
                style={{
                  padding:
                    "8px 14px",
                  borderRadius:
                    "999px",
                  fontWeight: 700,
                  fontSize: "14px",
                  background:
                    habit.completed
                      ? "linear-gradient(to right,#f472b6,#fb923c)"
                      : "var(--bg)",
                  color:
                    habit.completed
                      ? "white"
                      : "var(--text2)",
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

      {/* MOTIVATION CARD */}
      <div
        style={{
          background:
            "linear-gradient(to right,#f9a8d4,#fdba74)",
          color: "#7a1146",
          borderRadius: "28px",
          padding: "34px",
          textAlign: "center",
          fontWeight: 700,
          fontSize: "24px",
          boxShadow:
            "0 12px 35px rgba(236,72,153,0.08)",
        }}
      >
        {completionRate === 100
          ? "🎉 Perfect day — every task completed!"
          : completionRate >= 70
          ? `Amazing work — you're ${completionRate}% done today!`
          : completionRate >= 40
          ? `Great progress — keep going, you're ${completionRate}% there!`
          : "Small steps count. Start one task right now 🌸"}
      </div>
    </div>
  );
}

export default Stats;