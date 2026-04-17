import { useState, useEffect, useRef } from "react";

const LABELS = {
  focus: "Focus Session",
  short: "Short Break",
  long: "Long Break",
};

const CIRC = 2 * Math.PI * 95;

export default function Pomodoro({ darkMode }: { darkMode: boolean }) {
  const [focusTime, setFocusTime] = useState(() => {
    return Number(localStorage.getItem("focusTime")) || 25;
  });

  const [shortTime, setShortTime] = useState(() => {
    return Number(localStorage.getItem("shortTime")) || 5;
  });

  const [longTime, setLongTime] = useState(() => {
    return Number(localStorage.getItem("longTime")) || 15;
  });

  const [sessionsGoal, setSessionsGoal] = useState(() => {
    return Number(localStorage.getItem("sessionsGoal")) || 4;
  });

  const MODES = {
    focus: focusTime * 60,
    short: shortTime * 60,
    long: longTime * 60,
  };

  const [mode, setModeState] = useState<"focus" | "short" | "long">("focus");
  const [remaining, setRemaining] = useState(MODES.focus);
  const [running, setRunning] = useState(false);
  const [session, setSession] = useState(1);
  const [completedSessions, setCompleted] = useState(0);
  const [statusText, setStatusText] = useState("Ready to focus?");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = MODES[mode];

  // Save settings permanently
  useEffect(() => {
    localStorage.setItem("focusTime", String(focusTime));
    localStorage.setItem("shortTime", String(shortTime));
    localStorage.setItem("longTime", String(longTime));
    localStorage.setItem("sessionsGoal", String(sessionsGoal));
  }, [focusTime, shortTime, longTime, sessionsGoal]);

  const switchMode = (m: "focus" | "short" | "long") => {
    if (timerRef.current) clearInterval(timerRef.current);
    setRunning(false);
    setModeState(m);
    setRemaining(MODES[m]);
    setStatusText(m === "focus" ? "Ready to focus?" : "Time to recharge!");
  };

  const handleComplete = () => {
    if (mode === "focus") {
      setCompleted((c) => {
        const next = c + 1;

        if (next % sessionsGoal === 0) {
          setSession(1);
          setTimeout(() => switchMode("long"), 300);
        } else {
          setSession((s) => Math.min(s + 1, sessionsGoal));
          setTimeout(() => switchMode("short"), 300);
        }

        return next;
      });
    } else {
      setTimeout(() => switchMode("focus"), 300);
    }
  };

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            setRunning(false);
            handleComplete();
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [running, mode]);

  const mins = String(Math.floor(remaining / 60)).padStart(2, "0");
  const secs = String(remaining % 60).padStart(2, "0");
  const offset = CIRC * (1 - remaining / total);

  const bg = darkMode ? "#0d1b2e" : "#fce8f0";
  const card = darkMode ? "#152236" : "#ffffff";
  const cardBorder = darkMode ? "#2a4060" : "#f0c8dc";
  const track = darkMode ? "#1e3450" : "#f2d0e0";
  const text = darkMode ? "#ffffff" : "#1a1a1a";
  const muted = darkMode ? "#8ba3c0" : "#b07090";
  const tabBg = darkMode ? "#1a2a40" : "#fde0ed";
  const settingBg = darkMode ? "#1a2a40" : "#fde8f2";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.5rem",
        padding: "2rem",
      }}
    >
      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "6px",
          background: tabBg,
          borderRadius: "999px",
          padding: "4px",
        }}
      >
        {(["focus", "short", "long"] as const).map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            style={{
              border: "none",
              borderRadius: "999px",
              padding: "6px 16px",
              cursor: "pointer",
              background:
                mode === m
                  ? "linear-gradient(135deg,#f77fb0,#f4874a)"
                  : "transparent",
              color: mode === m ? "white" : muted,
            }}
          >
            {m === "focus"
              ? "Focus"
              : m === "short"
              ? "Short break"
              : "Long break"}
          </button>
        ))}
      </div>

      {/* Timer */}
      <div
        style={{
          background: card,
          borderRadius: "50%",
          padding: "10px",
          boxShadow: `0 0 0 4px ${cardBorder}`,
        }}
      >
        <div style={{ position: "relative", width: "210px", height: "210px" }}>
          <svg
            width="210"
            height="210"
            viewBox="0 0 210 210"
            style={{ transform: "rotate(-90deg)" }}
          >
            <circle
              cx="105"
              cy="105"
              r="95"
              fill="none"
              stroke={track}
              strokeWidth="10"
            />
            <circle
              cx="105"
              cy="105"
              r="95"
              fill="none"
              strokeWidth="10"
              strokeLinecap="round"
              stroke="url(#grad)"
              strokeDasharray={CIRC}
              strokeDashoffset={offset}
            />
            <defs>
              <linearGradient id="grad">
                <stop offset="0%" stopColor="#f77fb0" />
                <stop offset="100%" stopColor="#f4874a" />
              </linearGradient>
            </defs>
          </svg>

          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "46px", color: text }}>
              {mins}:{secs}
            </div>
            <div style={{ fontSize: "11px", color: muted }}>
              {LABELS[mode].toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: "12px" }}>
        <button
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
            background: "linear-gradient(135deg,#f77fb0,#f4874a)",
            color: "white",
            border: "none",
            padding: "12px 40px",
            borderRadius: "999px",
          }}
        >
          {running ? "Pause" : "Start"}
        </button>

        <button
          onClick={() => {
            setRemaining(0);
            handleComplete();
          }}
        >
          ▶▶
        </button>
      </div>

      {/* Editable Settings */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {[
          ["Focus", focusTime, setFocusTime],
          ["Short break", shortTime, setShortTime],
          ["Long break", longTime, setLongTime],
          ["Sessions", sessionsGoal, setSessionsGoal],
        ].map(([label, val, setter]: any) => (
          <button
            key={label}
            onClick={() => {
              const input = prompt(`Set ${label}`, String(val));
              if (input && !isNaN(Number(input)) && Number(input) > 0) {
                setter(Number(input));
              }
            }}
            style={{
              background: settingBg,
              border: `1px solid ${cardBorder}`,
              borderRadius: "12px",
              padding: "10px 14px",
              minWidth: "76px",
              cursor: "pointer",
            }}
          >
            <div style={{ fontSize: "11px", color: muted }}>{label}</div>
            <div style={{ fontSize: "17px", color: text }}>
              {label === "Sessions" ? val : `${val}m`}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}