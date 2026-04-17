import { useState, useEffect, useRef } from "react";
import ringSound from "../assets/ring.mp3";

type Mode = "focus" | "short" | "long";
const LABELS = { focus: "Focus Session", short: "Short Break", long: "Long Break" };
const CIRC = 2 * Math.PI * 95;

function formatTime(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

export default function Pomodoro() {
  const [focusMins, setFocusMins]   = useState(() => Number(localStorage.getItem("focusMins"))   || 25);
  const [shortMins, setShortMins]   = useState(() => Number(localStorage.getItem("shortMins"))   || 5);
  const [longMins, setLongMins]     = useState(() => Number(localStorage.getItem("longMins"))    || 15);
  const [sessionsGoal, setSessionsGoal] = useState(() => Number(localStorage.getItem("sessionsGoal")) || 4);

  // Which card is being edited: "focus" | "short" | "long" | "sessions" | null
  const [editing, setEditing] = useState<string | null>(null);
  const [editVal, setEditVal] = useState("");

  const focusTime = focusMins * 60;
  const shortTime = shortMins * 60;
  const longTime  = longMins  * 60;
  const MODES = { focus: focusTime, short: shortTime, long: longTime };

  const [mode, setMode]           = useState<Mode>("focus");
  const [remaining, setRemaining] = useState(focusTime);
  const [running, setRunning]     = useState(false);
  const [completed, setCompleted] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(ringSound);
  }, []);

  useEffect(() => {
    localStorage.setItem("focusMins",    String(focusMins));
    localStorage.setItem("shortMins",    String(shortMins));
    localStorage.setItem("longMins",     String(longMins));
    localStorage.setItem("sessionsGoal", String(sessionsGoal));
  }, [focusMins, shortMins, longMins, sessionsGoal]);

  const total = MODES[mode];

  const switchMode = (m: Mode) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setRunning(false);
    setMode(m);
    setRemaining(MODES[m]);
  };

  const nextMode = () => {
    audioRef.current?.play();
    if (mode === "focus") {
      const n = completed + 1;
      setCompleted(n);
      switchMode(n % sessionsGoal === 0 ? "long" : "short");
    } else {
      switchMode("focus");
    }
  };

  useEffect(() => {
    if (!running) return;
    timerRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setRunning(false);
          nextMode();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [running, mode, completed]);

  // When minutes change, update remaining if that mode is active and timer isn't running
  useEffect(() => { if (mode === "focus" && !running) setRemaining(focusTime); }, [focusMins]);
  useEffect(() => { if (mode === "short" && !running) setRemaining(shortTime); }, [shortMins]);
  useEffect(() => { if (mode === "long"  && !running) setRemaining(longTime);  }, [longMins]);

  const offset = CIRC * (1 - remaining / total);

  // Inline edit helpers
  function startEdit(key: string, currentVal: number) {
    setEditing(key);
    setEditVal(String(currentVal));
  }

  function commitEdit() {
    const val = Number(editVal);
    if (isNaN(val) || val <= 0) { setEditing(null); return; }
    if (editing === "focus")    setFocusMins(val);
    if (editing === "short")    setShortMins(val);
    if (editing === "long")     setLongMins(val);
    if (editing === "sessions") setSessionsGoal(val);
    setEditing(null);
  }

  const glass = {
    background: "var(--card)",
    border: "1px solid rgba(244,114,182,0.2)",
    boxShadow: "0 8px 24px rgba(244,114,182,0.12)",
  };

  const roundBtn = {
    width: "52px", height: "52px", borderRadius: "50%",
    border: "none", cursor: "pointer", color: "var(--text)", fontSize: "20px", ...glass,
  };

  const settingsCards = [
    { key: "focus",    label: "Focus",       val: focusMins,    unit: "min" },
    { key: "short",    label: "Short Break", val: shortMins,    unit: "min" },
    { key: "long",     label: "Long Break",  val: longMins,     unit: "min" },
    { key: "sessions", label: "Sessions",    val: sessionsGoal, unit: "" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", justifyContent: "center", alignItems: "center", padding: "2rem" }}>
      <div style={{ width: "100%", maxWidth: "520px", padding: "32px", borderRadius: "30px", ...glass }}>

        {/* Tabs */}
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "28px" }}>
          {(["focus", "short", "long"] as Mode[]).map((m) => (
            <button key={m} onClick={() => switchMode(m)} style={{
              border: "none", padding: "10px 18px", borderRadius: "999px",
              cursor: "pointer", fontWeight: 600,
              background: mode === m ? "linear-gradient(135deg,#f472b6,#fb923c)" : "var(--bg)",
              color: mode === m ? "white" : "var(--text2)",
            }}>
              {m === "focus" ? "Focus" : m === "short" ? "Short Break" : "Long Break"}
            </button>
          ))}
        </div>

        {/* Circle Timer */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
          <div style={{ position: "relative", width: 240, height: 240 }}>
            <svg width="240" height="240" viewBox="0 0 240 240" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="120" cy="120" r="95" fill="none" stroke="rgba(244,114,182,0.2)" strokeWidth="12" />
              <circle cx="120" cy="120" r="95" fill="none" strokeWidth="12" strokeLinecap="round"
                stroke="url(#grad)" strokeDasharray={CIRC} strokeDashoffset={offset} />
              <defs>
                <linearGradient id="grad">
                  <stop offset="0%" stopColor="#f472b6" />
                  <stop offset="100%" stopColor="#fb923c" />
                </linearGradient>
              </defs>
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              <div style={{ fontSize: "52px", fontWeight: 700, color: "var(--text)" }}>{formatTime(remaining)}</div>
              <div style={{ color: "var(--text2)", fontSize: "13px", marginTop: "6px" }}>{LABELS[mode].toUpperCase()}</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", justifyContent: "center", gap: "14px", marginBottom: "28px" }}>
          <button style={roundBtn} onClick={() => { setRunning(false); setRemaining(total); }}>↺</button>
          <button onClick={() => setRunning((r) => !r)} style={{
            border: "none", padding: "14px 44px", borderRadius: "999px",
            fontWeight: 700, fontSize: "17px", cursor: "pointer", color: "white",
            background: "linear-gradient(135deg,#f472b6,#fb923c)",
            boxShadow: "0 8px 20px rgba(244,114,182,0.3)",
          }}>{running ? "Pause" : "Start"}</button>
          <button style={roundBtn} onClick={nextMode}>⏭</button>
        </div>

        {/* Settings Cards — inline edit */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px" }}>
          {settingsCards.map(({ key, label, val, unit }) => (
            <div key={key}
              onClick={() => !editing && startEdit(key, val)}
              style={{
                padding: "14px", borderRadius: "18px", cursor: "pointer",
                textAlign: "center", ...glass, transition: "all 0.2s ease",
                outline: editing === key ? "2px solid #f472b6" : "none",
              }}
            >
              <div style={{ color: "var(--text2)", fontSize: "12px", marginBottom: "6px" }}>{label}</div>
              {editing === key ? (
                <div onClick={(e) => e.stopPropagation()} style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: "center" }}>
                  <input
                    autoFocus
                    type="number"
                    value={editVal}
                    onChange={(e) => setEditVal(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") commitEdit(); if (e.key === "Escape") setEditing(null); }}
                    style={{
                      width: "100%", textAlign: "center", fontWeight: 700, fontSize: "14px",
                      border: "none", outline: "none", borderRadius: "8px",
                      background: "var(--bg)", color: "var(--text)", padding: "2px 4px",
                    }}
                  />
                  <div style={{ fontSize: "10px", color: "var(--text2)" }}>{unit || "count"} · Enter ✓</div>
                </div>
              ) : (
                <div style={{ color: "var(--text)", fontWeight: 700 }}>
                  {val}{unit}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}