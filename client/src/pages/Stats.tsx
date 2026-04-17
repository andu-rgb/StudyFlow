import { useState, useEffect } from "react";
import axios from "axios";
import API_BASE from "../config";

interface Habit {
  _id: string;
  name: string;
  completed: boolean;
}

function Stats({ darkMode }: { darkMode: boolean }) {
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get(`${API_BASE}/api/habits`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => setHabits(res.data));
  }, []);

  const totalHabits = habits.length;
  const completedHabits = habits.filter((h) => h.completed).length;
  const completionRate = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;

  const card = {
    background: darkMode ? "#16213e" : "white",
    color: darkMode ? "white" : "black",
    padding: "32px",
    borderRadius: "24px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    marginBottom: "20px",
  };

  return (
    <div className="page">
      <h1 style={{ marginBottom: "30px", color: darkMode ? "white" : "black" }}>Study Progress</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "30px" }}>
        {[{ label: "Total Study Tasks", value: totalHabits }, { label: "Completed Today", value: completedHabits }, { label: "Completion Rate", value: `${completionRate}%` }].map((item, i) => (
          <div key={i} style={card}>
            <h2 style={{ color: "#f472b6", fontSize: "48px", margin: 0 }}>{item.value}</h2>
            <p style={{ color: "#9ca3af" }}>{item.label}</p>
          </div>
        ))}
      </div>

      <div style={card}>
        <h2 style={{ marginBottom: "15px" }}>Study Task Breakdown</h2>
        {habits.length === 0 ? (
          <p style={{ color: "#9ca3af", textAlign: "center" }}>No study tasks yet — add some on the Dashboard!</p>
        ) : (
          habits.map((habit) => (
            <div key={habit._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ textDecoration: habit.completed ? "line-through" : "none", color: habit.completed ? "#9ca3af" : darkMode ? "white" : "black" }}>
                {habit.completed ? "✔ " : "⏸ "}{habit.name}
              </span>
              <span style={{ background: habit.completed ? "linear-gradient(to right, #f472b6, #fb923c)" : darkMode ? "#0f3460" : "#f3f4f6", color: habit.completed ? "white" : "#9ca3af", borderRadius: "20px", padding: "4px 12px", fontSize: "14px", fontWeight: "bold" }}>
                {habit.completed ? "Done ✓" : "Pending"}
              </span>
            </div>
          ))
        )}
      </div>

      <div style={card}>
        <h2 style={{ marginBottom: "15px" }}>Today's Study Goal</h2>
        <div style={{ background: darkMode ? "#0f3460" : "#f3f3f3", borderRadius: "999px", height: "20px", marginBottom: "10px" }}>
          <div style={{ background: "linear-gradient(to right, #f472b6, #fb923c)", width: `${completionRate}%`, height: "20px", borderRadius: "999px", transition: "width 0.5s ease" }} />
        </div>
        <p style={{ color: "#9ca3af", textAlign: "center" }}>{completedHabits} of {totalHabits} study tasks completed</p>
      </div>

      <div style={{ background: "linear-gradient(to right, #f9a8d4, #fdba74)", color: "#9d174d", fontWeight: "bold", fontSize: "18px", textAlign: "center", padding: "32px", borderRadius: "24px" }}>
        {completionRate === 100 ? "🎉 You've completed all your tasks!" : completionRate >= 50 ? `Yay! You're ${completionRate}% through your study goals!` : `Keep going! You've got — ${completionRate}% done so far!`}
      </div>
    </div>
  );
}

export default Stats;