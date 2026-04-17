import { useState, useEffect, useRef } from "react";

type Mode = "focus" | "short" | "long";

const LABELS = {
  focus: "Focus Session",
  short: "Short Break",
  long: "Long Break",
};

const CIRC = 2 * Math.PI * 95;

function formatTime(totalSeconds: number) {
  const mins = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const secs = String(totalSeconds % 60).padStart(2, "0");
  return `${mins}:${secs}`;
}

function formatCard(totalSeconds: number) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;

  if (mins > 0 && secs > 0) return `${mins}m ${secs}s`;
  if (mins > 0) return `${mins}m`;
  return `${secs}s`;
}

export default function Pomodoro({
  darkMode,
}: {
  darkMode: boolean;
}) {
  // 🔥 Persistent settings (seconds)
  const [focusTime, setFocusTime] = useState(
    () => Number(localStorage.getItem("focusTime")) || 1500
  ); // 25m

  const [shortTime, setShortTime] = useState(
    () => Number(localStorage.getItem("shortTime")) || 300
  ); // 5m

  const [longTime, setLongTime] = useState(
    () => Number(localStorage.getItem("longTime")) || 900
  ); // 15m

  const [sessionsGoal, setSessionsGoal] = useState(
    () => Number(localStorage.getItem("sessionsGoal")) || 4
  );

  const MODES = {
    focus: focusTime,
    short: shortTime,
    long: longTime,
  };

  const [mode, setMode] = useState<Mode>("focus");
  const [remaining, setRemaining] = useState(MODES.focus);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Save settings
  useEffect(() => {
    localStorage.setItem("focusTime", String(focusTime));
    localStorage.setItem("shortTime", String(shortTime));
    localStorage.setItem("longTime", String(longTime));
    localStorage.setItem("sessionsGoal", String(sessionsGoal));
  }, [focusTime, shortTime, longTime, sessionsGoal]);

  const total = MODES[mode];

  const switchMode = (newMode: Mode) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setRunning(false);
    setMode(newMode);
    setRemaining(MODES[newMode]);
  };

  const nextMode = () => {
    if (mode === "focus") {
      const nextCompleted = completed + 1;
      setCompleted(nextCompleted);

      if (nextCompleted % sessionsGoal === 0) {
        switchMode("long");
      } else {
        switchMode("short");
      }
    } else {
      switchMode("focus");
    }
  };

  // Timer logic
  useEffect(() => {
    if (!running) return;

    timerRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setRunning(false);
          nextMode();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [running, mode, completed]);

  const offset = CIRC * (1 - remaining / total);

  // 🎨 Theme
  const bg = darkMode ? "#0f172a" : "#fce8f0";
  const card = darkMode ? "#111827" : "#ffffff";
  const text = darkMode ? "#ffffff" : "#111111";
  const muted = darkMode ? "#94a3b8" : "#b07090";
  const border = darkMode ? "#334155" : "#f0c8dc";
  const soft = darkMode ? "#1e293b" : "#fff5fa";

  const glass = {
    background: soft,
    border: `1px solid ${border}`,
    boxShadow: darkMode
      ? "0 8px 24px rgba(0,0,0,0.25)"
      : "0 8px 24px rgba(244,114,182,0.12)",
  };

  const roundBtn = {
    width: "52px",
    height: "52px",
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    color: text,
    fontSize: "20px",
    ...glass,
  };

  const cardStyle = {
    padding: "14px",
    minWidth: "92px",
    borderRadius: "18px",
    border: `1px solid ${border}`,
    cursor: "pointer",
    textAlign: "center" as const,
    ...glass,
    transition: "all 0.2s ease",
  };

  const editSeconds = (
    label: string,
    current: number,
    setter: (n: number) => void
  ) => {
    const input = prompt(`Set ${label} in seconds`, String(current));
    if (!input) return;

    const val = Number(input);
    if (!isNaN(val) && val > 0) {
      setter(val);

      if (
        (label === "Focus" && mode === "focus") ||
        (label === "Short break" && mode === "short") ||
        (label === "Long break" && mode === "long")
      ) {
        setRemaining(val);
      }
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: bg,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          padding: "32px",
          borderRadius: "30px",
          ...glass,
        }}
      >
        {/* Tabs */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "8px",
            marginBottom: "28px",
          }}
        >
          {(["focus", "short", "long"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              style={{
                border: "none",
                padding: "10px 18px",
                borderRadius: "999px",
                cursor: "pointer",
                fontWeight: 600,
                background:
                  mode === m
                    ? "linear-gradient(135deg,#f472b6,#fb923c)"
                    : soft,
                color: mode === m ? "white" : muted,
              }}
            >
              {m === "focus"
                ? "Focus"
                : m === "short"
                ? "Short Break"
                : "Long Break"}
            </button>
          ))}
        </div>

        {/* Circle Timer */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "24px",
          }}
        >
          <div style={{ position: "relative", width: 240, height: 240 }}>
            <svg
              width="240"
              height="240"
              viewBox="0 0 240 240"
              style={{ transform: "rotate(-90deg)" }}
            >
              <circle
                cx="120"
                cy="120"
                r="95"
                fill="none"
                stroke={border}
                strokeWidth="12"
              />
              <circle
                cx="120"
                cy="120"
                r="95"
                fill="none"
                strokeWidth="12"
                strokeLinecap="round"
                stroke="url(#grad)"
                strokeDasharray={CIRC}
                strokeDashoffset={offset}
              />
              <defs>
                <linearGradient id="grad">
                  <stop offset="0%" stopColor="#f472b6" />
                  <stop offset="100%" stopColor="#fb923c" />
                </linearGradient>
              </defs>
            </svg>

            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontSize: "52px",
                  fontWeight: 700,
                  color: text,
                }}
              >
                {formatTime(remaining)}
              </div>

              <div style={{ color: muted, fontSize: "13px", marginTop: "6px" }}>
                {LABELS[mode].toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "14px",
            marginBottom: "28px",
          }}
        >
          <button
            style={roundBtn}
            onClick={() => {
              setRunning(false);
              setRemaining(total);
            }}
          >
            ↺
          </button>

          <button
            onClick={() => setRunning((r) => !r)}
            style={{
              border: "none",
              padding: "14px 44px",
              borderRadius: "999px",
              fontWeight: 700,
              fontSize: "17px",
              cursor: "pointer",
              color: "white",
              background:
                "linear-gradient(135deg,#f472b6,#fb923c)",
              boxShadow: "0 8px 20px rgba(244,114,182,0.3)",
            }}
          >
            {running ? "Pause" : "Start"}
          </button>

          <button style={roundBtn} onClick={nextMode}>
            ⏭
          </button>
        </div>

        {/* Settings Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: "12px",
          }}
        >
          <div
            style={cardStyle}
            onClick={() => editSeconds("Focus", focusTime, setFocusTime)}
          >
            <div style={{ color: muted, fontSize: "12px" }}>Focus</div>
            <div style={{ color: text, fontWeight: 700 }}>
              {formatCard(focusTime)}
            </div>
          </div>

          <div
            style={cardStyle}
            onClick={() =>
              editSeconds("Short break", shortTime, setShortTime)
            }
          >
            <div style={{ color: muted, fontSize: "12px" }}>
              Short Break
            </div>
            <div style={{ color: text, fontWeight: 700 }}>
              {formatCard(shortTime)}
            </div>
          </div>

          <div
            style={cardStyle}
            onClick={() =>
              editSeconds("Long break", longTime, setLongTime)
            }
          >
            <div style={{ color: muted, fontSize: "12px" }}>
              Long Break
            </div>
            <div style={{ color: text, fontWeight: 700 }}>
              {formatCard(longTime)}
            </div>
          </div>

          <div
            style={cardStyle}
            onClick={() => {
              const input = prompt(
                "Set sessions before long break",
                String(sessionsGoal)
              );
              if (!input) return;
              const val = Number(input);
              if (!isNaN(val) && val > 0) setSessionsGoal(val);
            }}
          >
            <div style={{ color: muted, fontSize: "12px" }}>
              Sessions
            </div>
            <div style={{ color: text, fontWeight: 700 }}>
              {sessionsGoal}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}