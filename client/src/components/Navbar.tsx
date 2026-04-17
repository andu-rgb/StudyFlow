import { Link, useNavigate } from "react-router-dom";

function Navbar({ darkMode, setDarkMode }: { darkMode: boolean, setDarkMode: (v: boolean) => void }) {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <nav style={{ background: "#f472b6", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", gap: "24px" }}>
        <Link to="/" style={{ color: "white", textDecoration: "none", fontWeight: "bold" }}>Home</Link>
        <Link to="/dashboard" style={{ color: "white", textDecoration: "none", fontWeight: "bold" }}>Dashboard</Link>
        <Link to="/stats" style={{ color: "white", textDecoration: "none", fontWeight: "bold" }}>Stats</Link>
        <Link to="/pomodoro">Timer</Link>
      </div>
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{ background: "white", color: "#f472b6", border: "none", borderRadius: "20px", padding: "6px 16px", cursor: "pointer", fontWeight: "bold" }}
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
        <button
          onClick={isLoggedIn ? handleLogout : () => navigate("/login")}
          style={{ background: "white", color: "#f472b6", border: "2px solid white", borderRadius: "20px", padding: "6px 20px", cursor: "pointer", fontWeight: "bold" }}
        >
          {isLoggedIn ? "Logout" : "Login"}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;