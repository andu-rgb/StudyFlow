import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:3001/api/habits";

interface Habit {
  _id: string;
  name: string;
  completed: boolean;
}

function getAuthHeader() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}

function Dashboard() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState("");

  useEffect(() => {
    axios.get(API, { headers: getAuthHeader() }).then((res) => setHabits(res.data));
  }, []);

  async function addHabit() {
    if (newHabit.trim() === "") return;
    const res = await axios.post(API, { name: newHabit }, { headers: getAuthHeader() });
    setHabits([...habits, res.data]);
    setNewHabit("");
  }

  async function toggleHabit(id: string, completed: boolean) {
    const res = await axios.put(`${API}/${id}`, { completed: !completed }, { headers: getAuthHeader() });
    setHabits(habits.map((h) => (h._id === id ? res.data : h)));
  }

  async function deleteHabit(id: string) {
    await axios.delete(`${API}/${id}`, { headers: getAuthHeader() });
    setHabits(habits.filter((h) => h._id !== id));
  }

  function logout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  return (
    <div className="page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>❀˖ ° My Study Tasks</h1>
      </div>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          placeholder="Enter new study task"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addHabit()}
          style={{ border: "2px solid #f9a8d4", borderRadius: "20px", padding: "10px 16px", outline: "none", width: "300px", fontSize: "16px" }}
        />
        <button
          onClick={addHabit}
          style={{ background: "linear-gradient(to right, #f472b6, #fb923c)", color: "white", border: "none", borderRadius: "20px", padding: "10px 20px", cursor: "pointer", fontWeight: "bold", fontSize: "16px" }}
        >
          Add Task ✨
        </button>
      </div>

      {habits.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "40px" }}>
          <p style={{ fontSize: "20px" }}><strong>No study tasks yet 📖</strong></p>
          <p style={{ color: "#9ca3af" }}>Add your first task above!</p>
        </div>
      ) : (
        habits.map((habit) => (
          <div key={habit._id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", opacity: habit.completed ? 0.7 : 1 }}>
            <span style={{ textDecoration: habit.completed ? "line-through" : "none", color: habit.completed ? "#9ca3af" : "black", fontSize: "16px" }}>
              {habit.completed ? "✔ " : "‣ "}{habit.name}
            </span>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => toggleHabit(habit._id, habit.completed)} style={{ background: habit.completed ? "#d1d5db" : "linear-gradient(to right, #f472b6, #fb923c)", color: "white", border: "none", borderRadius: "20px", padding: "8px 16px", cursor: "pointer", fontWeight: "bold" }}>
                {habit.completed ? "Undo" : "Done"}
              </button>
              <button onClick={() => deleteHabit(habit._id)} style={{ background: "white", color: "#f472b6", border: "2px solid #f472b6", borderRadius: "20px", padding: "8px 16px", cursor: "pointer", fontWeight: "bold" }}>
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