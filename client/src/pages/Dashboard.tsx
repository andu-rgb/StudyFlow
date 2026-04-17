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
    fetchHabits();
  }, []);

  async function fetchHabits() {
    try {
      const res = await axios.get(API, { headers: getAuthHeader() });
      setHabits(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function addHabit() {
    if (newHabit.trim() === "") return;

    try {
      const res = await axios.post(
        API,
        { name: newHabit },
        { headers: getAuthHeader() }
      );

      setHabits([...habits, res.data]);
      setNewHabit("");
    } catch (err) {
      console.error(err);
    }
  }

  async function toggleHabit(id: string, completed: boolean) {
    const becomingCompleted = !completed;

    // 🎉 Confetti only when marking as done
    if (becomingCompleted) {
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#f472b6", "#fb923c", "#f9a8d4"],
      });

      confetti({
        particleCount: 80,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#f472b6", "#fb923c", "#f9a8d4"],
      });
    }

    try {
      const res = await axios.put(
        `${API}/${id}`,
        { completed: becomingCompleted },
        { headers: getAuthHeader() }
      );

      setHabits(habits.map((h) => (h._id === id ? res.data : h)));
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteHabit(id: string) {
    try {
      await axios.delete(`${API}/${id}`, {
        headers: getAuthHeader(),
      });

      setHabits(habits.filter((h) => h._id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="page">
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ color: darkMode ? "white" : "black" }}>
          My Study Tasks
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
          Add Task
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
            <strong>No study tasks yet!</strong>
          </p>
          <p style={{ color: "#9ca3af" }}>Add your first task above ✨</p>
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
            {/* TASK TEXT */}
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

            {/* BUTTONS */}
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
                  transition: "0.2s",
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