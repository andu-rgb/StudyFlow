import { useState, useEffect } from "react";
import axios from "axios";

interface Habit {
  _id: string;
  name: string;
  completed: boolean;
}

function Stats() {
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    axios.get("http://localhost:3001/api/habits").then((res) => setHabits(res.data));
  }, []);

  const totalHabits = habits.length;
  const completedHabits = habits.filter((h) => h.completed).length;
  const completionRate = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;

  return (
    <div className="page">
      <h1 style={{ marginBottom: "30px" }}>⋆☕︎ ˖ Study Progress</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div className="card">
          <h2 style={{ color: "#f472b6", fontSize: "48px", margin: 0 }}>{totalHabits}</h2>
          <p style={{ color: "#9ca3af" }}>Total Study Tasks</p>
        </div>

        <div className="card">
          <h2 style={{ color: "#f472b6", fontSize: "48px", margin: 0 }}>{completedHabits}</h2>
          <p style={{ color: "#9ca3af" }}>Completed Today</p>
        </div>

        <div className="card">
          <h2 style={{ color: "#f472b6", fontSize: "48px", margin: 0 }}>{completionRate}%</h2>
          <p style={{ color: "#9ca3af" }}>Completion Rate</p>
        </div>
      </div>

      {/* Task Breakdown */}
      <div className="card" style={{ marginBottom: "20px" }}>
        <h2 style={{ marginBottom: "15px" }}>Study Task Breakdown</h2>
        {habits.length === 0 ? (
          <p style={{ color: "#9ca3af", textAlign: "center" }}>
            No study tasks yet — add some on the Dashboard!
          </p>
        ) : (
          habits.map((habit) => (
            <div
              key={habit._id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <span
                style={{
                  textDecoration: habit.completed ? "line-through" : "none",
                  color: habit.completed ? "#9ca3af" : "black",
                }}
              >
                {habit.completed ? "✔ " : "⏸ "}
                {habit.name}
              </span>
              <span
                style={{
                  background: habit.completed
                    ? "linear-gradient(to right, #f472b6, #fb923c)"
                    : "#f3f4f6",
                  color: habit.completed ? "white" : "#9ca3af",
                  borderRadius: "20px",
                  padding: "4px 12px",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                {habit.completed ? "Done ✓" : "Pending"}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Progress Bar */}
      <div className="card" style={{ marginBottom: "20px" }}>
        <h2 style={{ marginBottom: "15px" }}>Today's Study Goal</h2>
        <div
          style={{
            background: "#f3f3f3",
            borderRadius: "999px",
            height: "20px",
            marginBottom: "10px",
          }}
        >
          <div
            style={{
              background: "linear-gradient(to right, #f472b6, #fb923c)",
              width: `${completionRate}%`,
              height: "20px",
              borderRadius: "999px",
              transition: "width 0.5s ease",
            }}
          />
        </div>
        <p style={{ color: "#9ca3af", textAlign: "center" }}>
          {completedHabits} of {totalHabits} study tasks completed
        </p>
      </div>

      {/* Motivational Banner */}
      <div
        className="card"
        style={{
          background: "linear-gradient(to right, #f9a8d4, #fdba74)",
          color: "#9d174d",
          fontWeight: "bold",
          fontSize: "18px",
          textAlign: "center",
        }}
      >
        {completionRate === 100
          ? "You've completed all your tasks!"
          : completionRate >= 50
          ? `Yay! You're ${completionRate}% through your study goals!`
          : `Keep going! You've got — ${completionRate}% done so far!`}
      </div>
    </div>
  );
}

export default Stats;