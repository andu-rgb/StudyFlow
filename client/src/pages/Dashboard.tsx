import { useState, useEffect } from "react";
import axios from "axios";
import confetti from "canvas-confetti";

const API = `${import.meta.env.VITE_API_URL}/api/habits`;

interface Habit {
  _id: string;
  name: string;
  completed: boolean;
}

function getAuthHeader() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}

function Dashboard({ darkMode }: { darkMode: boolean }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState("");

  useEffect(() => {
    axios.get(API, { headers: getAuthHeader() }).then((res) => setHabits(res.data));
  }, []);

  useEffect(() => {
    if (habits.length > 0 && habits.every((h) => h.completed)) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#f472b6", "#fb923c", "#f9a8d4"],
      });
    }
  }, [habits]);

  async function addHabit() {
    if (newHabit.trim() === "") return;

    const res = await axios.post(
      API,
      { name: newHabit },
      { headers: getAuthHeader() }
    );

    setHabits([...habits, res.data]);
    setNewHabit("");
  }

  async function toggleHabit(id: string, completed: boolean) {
    const res = await axios.put(
      `${API}/${id}`,
      { completed: !completed },
      { headers: getAuthHeader() }
    );

    setHabits(habits.map((h) => (h._id === id ? res.data : h)));
  }

  async function deleteHabit(id: string) {
    await axios.delete(`${API}/${id}`, { headers: getAuthHeader() });
    setHabits(habits.filter((h) => h._id !== id));
  }

  return (
    <div className="page">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ color: darkMode ? "white" : "black" }}>
          ❀˖ ° My Study Tasks
        </h1>
      </div>

      {/* INPUT AREA */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          placeholder="Enter new study task"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addHabit()}
          style={{
            background: darkMode ? "#16213e" : "white",
            color: darkMode ? "white" : "black",
            border: "2px solid #f9a8d4",
            borderRadius: "20px",
            padding: "10px 16px",
            outline: "none",
            width: "300px",
            fontSize: "16px",
          }}
        />

        <button
          onClick={addHabit}
          style={{
            background: "linear-gradient(to right, #f472b6, #fb923c)",
            color: "white",
            border: "none",
            borderRadius: "20px",
            padding: "10px 20px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          Add Task ✨
        </button>
      </div>

      {/* EMPTY STATE */}
      {habits.length === 0 ? (
        <div
          className="card"
          style={{
            textAlign: "center",
            padding: "40px",
            background: darkMode ? "#16213e" : "white",
            color: darkMode ? "white" : "black",
          }}
        >
          <p style={{ fontSize: "20px" }}>
            <strong>No study tasks yet 📖</strong>
          </p>
          <p style={{ color: "#9ca3af" }}>Add your first task above!</p>
        </div>
      ) : (
        habits.map((habit) => (
          <div
            key={habit._id}
            className="card"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
              opacity: habit.completed ? 0.7 : 1,
              background: darkMode ? "#16213e" : "white",
              color: darkMode ? "white" : "black",
            }}
          >
            <span
              style={{
                textDecoration: habit.completed ? "line-through" : "none",
                color: habit.completed
                  ? "#9ca3af"
                  : darkMode
                  ? "white"
                  : "black",
                fontSize: "16px",
              }}
            >
              {habit.completed ? "✔ " : "‣ "} {habit.name}
            </span>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() =>
                  toggleHabit(habit._id, habit.completed)
                }
                style={{
                  background: habit.completed
                    ? "#6b7280"
                    : "linear-gradient(to right, #f472b6, #fb923c)",
                  color: "white",
                  border: "none",
                  borderRadius: "20px",
                  padding: "8px 16px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                {habit.completed ? "Undo" : "Done"}
              </button>

              <button
                onClick={() => deleteHabit(habit._id)}
                style={{
                  background: darkMode ? "#0f3460" : "white",
                  color: "#f472b6",
                  border: "2px solid #f472b6",
                  borderRadius: "20px",
                  padding: "8px 16px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;