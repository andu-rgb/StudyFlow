import { useEffect, useState } from "react";
import axios from "axios";
import confetti from "canvas-confetti";
import API_BASE from "../config";

interface Habit {
  _id: string;
  name: string;
  completed: boolean;
}

function Dashboard() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState("");

  useEffect(() => {
    fetchHabits();
  }, []);

  async function fetchHabits() {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get(
        `${API_BASE}/api/habits`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setHabits(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  async function addHabit() {
    if (!newHabit.trim()) return;

    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        `${API_BASE}/api/habits`,
        { name: newHabit },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setHabits([...habits, res.data]);
      setNewHabit("");
    } catch (err) {
      console.log(err);
    }
  }

  async function toggleHabit(
    id: string,
    completed: boolean
  ) {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.put(
        `${API_BASE}/api/habits/${id}`,
        { completed: !completed },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!completed) {
        confetti({
          particleCount: 90,
          spread: 65,
          origin: { y: 0.7 },
        });
      }

      setHabits(
        habits.map((habit) =>
          habit._id === id ? res.data : habit
        )
      );
    } catch (err) {
      console.log(err);
    }
  }

  async function deleteHabit(id: string) {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(
        `${API_BASE}/api/habits/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setHabits(
        habits.filter((habit) => habit._id !== id)
      );
    } catch (err) {
      console.log(err);
    }
  }

  const card = {
    background: "var(--card)",
    borderRadius: "28px",
    padding: "28px",
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.06)",
  };

  const completedCount = habits.filter(
    (h) => h.completed
  ).length;

  return (
    <div className="page">
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <p
          style={{
            margin: 0,
            color: "var(--text2)",
            fontWeight: 700,
            letterSpacing: "0.03em",
          }}
        >
          DAILY PRODUCTIVITY
        </p>

        <h1
          style={{
            margin: "8px 0",
            fontSize: "64px",
            color: "var(--text)",
          }}
        >
          Dashboard ✨
        </h1>

        <p
          style={{
            color: "var(--text2)",
            fontSize: "18px",
            marginTop: 0,
          }}
        >
          Add tasks, complete tasks, and stay
          consistent every day.
        </p>
      </div>

      {/* Add Task */}
      <div
        style={{
          ...card,
          marginBottom: "24px",
          display: "flex",
          gap: "14px",
          alignItems: "center",
        }}
      >
        <input
          value={newHabit}
          placeholder="Add a new study task..."
          onChange={(e) =>
            setNewHabit(e.target.value)
          }
          onKeyDown={(e) =>
            e.key === "Enter" && addHabit()
          }
          style={{
            flex: 1,
            padding: "16px 18px",
            borderRadius: "18px",
            border:
              "1px solid rgba(0,0,0,0.08)",
            outline: "none",
            background: "var(--bg)",
            color: "var(--text)",
            fontSize: "16px",
          }}
        />

        <button
          onClick={addHabit}
          style={{
            border: "none",
            padding: "16px 22px",
            borderRadius: "18px",
            fontWeight: 700,
            cursor: "pointer",
            color: "white",
            background:
              "linear-gradient(to right,#f472b6,#fb7185)",
          }}
        >
          + Add Task
        </button>
      </div>

      {/* Quick Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: "18px",
          marginBottom: "24px",
        }}
      >
        {[
          {
            label: "Total Tasks",
            value: habits.length,
          },
          {
            label: "Completed",
            value: completedCount,
          },
          {
            label: "Remaining",
            value:
              habits.length -
              completedCount,
          },
        ].map((item, i) => (
          <div key={i} style={card}>
            <h2
              style={{
                margin: 0,
                fontSize: "46px",
                color: "var(--accent)",
              }}
            >
              {item.value}
            </h2>

            <p
              style={{
                marginTop: "8px",
                color: "var(--text2)",
                fontWeight: 600,
              }}
            >
              {item.label}
            </p>
          </div>
        ))}
      </div>

      {/* Tasks */}
      <div style={card}>
        <h2
          style={{
            marginTop: 0,
            marginBottom: "18px",
            fontSize: "38px",
            color: "var(--text)",
          }}
        >
          My Tasks 🌷
        </h2>

        {habits.length === 0 ? (
          <p
            style={{
              color: "var(--text2)",
              fontSize: "17px",
            }}
          >
            No tasks yet — add your first one
            above.
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
                gap: "18px",
                padding: "16px 0",
                borderBottom:
                  "1px solid rgba(0,0,0,0.05)",
              }}
            >
              <div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "24px",
                    color:
                      "var(--text)",
                    textDecoration:
                      habit.completed
                        ? "line-through"
                        : "none",
                    opacity:
                      habit.completed
                        ? 0.6
                        : 1,
                  }}
                >
                  {habit.name}
                </h3>

                <p
                  style={{
                    margin:
                      "6px 0 0 0",
                    color:
                      "var(--text2)",
                    fontSize:
                      "14px",
                  }}
                >
                  {habit.completed
                    ? "Completed ✓"
                    : "Ready to focus"}
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                }}
              >
                <button
                  onClick={() =>
                    toggleHabit(
                      habit._id,
                      habit.completed
                    )
                  }
                  style={{
                    border: "none",
                    padding:
                      "10px 16px",
                    borderRadius:
                      "999px",
                    fontWeight: 700,
                    cursor:
                      "pointer",
                    color: "white",
                    background:
                      habit.completed
                        ? "#b8b8c5"
                         : "linear-gradient(to right,#d8b4fe,#f9a8d4)",
                  }}
                >
                  {habit.completed
                    ? "Undo"
                    : "Done"}
                </button>

                <button
                  onClick={() =>
                    deleteHabit(
                      habit._id
                    )
                  }
                  style={{
                    border:
                      "1px solid rgba(0,0,0,0.08)",
                    padding:
                      "10px 16px",
                    borderRadius:
                      "999px",
                    fontWeight: 700,
                    cursor:
                      "pointer",
                    color:
                      "var(--text)",
                    background:
                      "var(--bg)",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;