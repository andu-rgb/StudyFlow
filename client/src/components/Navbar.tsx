import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../ThemeContext";

type Theme =
  | "pink-light"
  | "pink-dark"
  | "purple-light"
  | "purple-dark"
  | "matcha-light"
  | "matcha-dark"
  | "ocean-light"
  | "ocean-dark";

const themes = [
  {
    id: "pink-light",
    label: "Pink Light",
    sub: "Soft & bright",
    preview: "linear-gradient(135deg,#ec4899,#f97316)",
  },
  {
    id: "pink-dark",
    label: "Pink Dark",
    sub: "Cozy night mode",
    preview: "linear-gradient(135deg,#f472b6,#fb923c)",
  },
  {
    id: "purple-light",
    label: "Purple Light",
    sub: "Dreamy & fresh",
    preview: "linear-gradient(135deg,#8b5cf6,#ec4899)",
  },
  {
    id: "purple-dark",
    label: "Purple Dark",
    sub: "Deep & focused",
    preview: "linear-gradient(135deg,#7c3aed,#ec4899)",
  },
  {
    id: "matcha-light",
    label: "Matcha Light",
    sub: "Fresh & calm",
    preview: "linear-gradient(135deg,#84cc16,#22c55e)",
  },
  {
    id: "matcha-dark",
    label: "Matcha Dark",
    sub: "Late-night grind",
    preview: "linear-gradient(135deg,#65a30d,#16a34a)",
  },
  {
    id: "ocean-light",
    label: "Ocean Light",
    sub: "Clear & productive",
    preview: "linear-gradient(135deg,#38bdf8,#2563eb)",
  },
  {
    id: "ocean-dark",
    label: "Ocean Dark",
    sub: "Deep sea focus",
    preview: "linear-gradient(135deg,#0ea5e9,#1d4ed8)",
  },
] as const;

function Navbar() {
  const { theme, setTheme, toggleDark, isDark } = useTheme();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  const pillBtn = {
    border: "none",
    borderRadius: "999px",
    padding: "8px 16px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "14px",
  };

  return (
    <nav
      style={{
        background: "var(--nav)",
        padding: "16px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
      }}
    >
      {/* LEFT */}
      <div style={{ display: "flex", gap: "24px" }}>
        {[
          ["Home", "/"],
          ["Dashboard", "/dashboard"],
          ["Stats", "/stats"],
          ["Timer", "/pomodoro"],
        ].map(([name, path]) => (
          <Link
            key={name}
            to={path}
            style={{
              color: "white",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: "15px",
            }}
          >
            {name}
          </Link>
        ))}
      </div>

      {/* RIGHT */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
          position: "relative",
        }}
      >
        {/* THEME BUTTON */}
        <button
          onClick={() => setOpen((o) => !o)}
          style={{
            ...pillBtn,
            background: "rgba(255,255,255,0.22)",
            color: "white",
          }}
        >
          🎨 Theme {open ? "▲" : "▼"}
        </button>

        {/* DROPDOWN */}
        {open && (
          <>
            <div
              onClick={() => setOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 40,
              }}
            />

            <div
              style={{
                position: "absolute",
                top: "58px",
                right: "120px",
                width: "290px",
                background: "var(--card)",
                borderRadius: "24px",
                padding: "12px",
                boxShadow: "0 25px 60px rgba(0,0,0,0.14)",
                border: "1px solid rgba(255,255,255,0.08)",
                zIndex: 50,
                maxHeight: "430px",
                overflowY: "auto",
              }}
            >
              <div
                style={{
                  padding: "8px 10px",
                  fontSize: "12px",
                  fontWeight: 800,
                  color: "var(--text2)",
                  letterSpacing: "0.05em",
                }}
              >
                CHOOSE A THEME
              </div>

              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id as any);
                    setOpen(false);
                  }}
                  style={{
                    width: "100%",
                    border: "none",
                    background:
                      theme === t.id
                        ? "rgba(0,0,0,0.05)"
                        : "transparent",
                    borderRadius: "16px",
                    padding: "12px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "4px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "center",
                      textAlign: "left",
                    }}
                  >
                    {/* COLOR DOT */}
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        background: t.preview,
                        flexShrink: 0,
                      }}
                    />

                    <div>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: "14px",
                          color: "var(--text)",
                        }}
                      >
                        {t.label}
                      </div>

                      <div
                        style={{
                          fontSize: "12px",
                          color: "var(--text2)",
                        }}
                      >
                        {t.sub}
                      </div>
                    </div>
                  </div>

                  {theme === t.id && (
                    <div
                      style={{
                        color: "var(--accent1)",
                        fontWeight: 900,
                        fontSize: "16px",
                      }}
                    >
                      ✓
                    </div>
                  )}
                </button>
              ))}
            </div>
          </>
        )}

        {/* DARK TOGGLE */}
        <button
          onClick={toggleDark}
          style={{
            ...pillBtn,
            background: "white",
            color: "var(--accent1)",
          }}
        >
          {isDark ? "☀️ Light" : "🌙 Dark"}
        </button>

        {/* LOGIN / LOGOUT */}
        <button
          onClick={
            isLoggedIn
              ? handleLogout
              : () => navigate("/login")
          }
          style={{
            ...pillBtn,
            background: "white",
            color: "var(--accent1)",
            padding: "8px 20px",
          }}
        >
          {isLoggedIn ? "Logout" : "Login"}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;