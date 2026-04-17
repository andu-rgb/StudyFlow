import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../ThemeContext";

type Theme = 'pink-light' | 'pink-dark' | 'purple-light' | 'purple-dark'

const themes: { id: Theme; label: string; sub: string }[] = [
  { id: 'pink-light',   label: '🌸 Pink Light',   sub: 'Soft & bright (default)' },
  { id: 'pink-dark',    label: '🌸 Pink Dark',    sub: 'Cozy night mode' },
  { id: 'purple-light', label: '💜 Purple Light', sub: 'Dreamy & fresh' },
  { id: 'purple-dark',  label: '💜 Purple Dark',  sub: 'Deep & focused' },
]

function Navbar() {
  const { theme, setTheme, toggleDark, isDark } = useTheme();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <nav style={{ background: "var(--nav)", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", gap: "24px" }}>
        <Link to="/" style={{ color: "white", textDecoration: "none", fontWeight: "bold" }}>Home</Link>
        <Link to="/dashboard" style={{ color: "white", textDecoration: "none", fontWeight: "bold" }}>Dashboard</Link>
        <Link to="/stats" style={{ color: "white", textDecoration: "none", fontWeight: "bold" }}>Stats</Link>
        <Link to="/pomodoro" style={{ color: "white", textDecoration: "none", fontWeight: "bold" }}>Timer</Link>
      </div>

      <div style={{ display: "flex", gap: "10px", alignItems: "center", position: "relative" }}>

        {/* Theme dropdown */}
        <button
          onClick={() => setOpen(o => !o)}
          style={{ background: "rgba(255,255,255,0.25)", color: "white", border: "none", borderRadius: "20px", padding: "6px 16px", cursor: "pointer", fontWeight: "bold" }}
        >
          🎨 Theme {open ? "▲" : "▼"}
        </button>

        {open && (
          <>
            {/* backdrop to close on outside click */}
            <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
            <div style={{
              position: "absolute", top: "calc(100% + 10px)", right: "120px",
              background: "var(--card)", border: "1px solid rgba(0,0,0,0.1)",
              borderRadius: "16px", padding: "8px", minWidth: "210px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.15)", zIndex: 50
            }}>
              <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--text2)", padding: "4px 10px 6px", opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Choose a theme
              </p>
              {themes.map(t => (
                <button key={t.id} onClick={() => { setTheme(t.id); setOpen(false); }}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: "10px",
                    padding: "8px 10px", borderRadius: "10px", border: "none", cursor: "pointer",
                    background: theme === t.id ? "rgba(0,0,0,0.06)" : "transparent",
                    textAlign: "left"
                  }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)" }}>{t.label}</div>
                    <div style={{ fontSize: "11px", color: "var(--text2)" }}>{t.sub}</div>
                  </div>
                  {theme === t.id && <span style={{ color: "var(--accent)", fontWeight: "bold" }}>✓</span>}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Dark/light toggle */}
        <button
          onClick={toggleDark}
          style={{ background: "white", color: "#f472b6", border: "none", borderRadius: "20px", padding: "6px 16px", cursor: "pointer", fontWeight: "bold" }}
        >
          {isDark ? "☀️ Light" : "🌙 Dark"}
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