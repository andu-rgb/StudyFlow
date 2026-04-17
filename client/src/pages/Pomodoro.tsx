import { useState, useEffect, useRef } from "react";

const MODES = { focus: 25 * 60, short: 5 * 60, long: 15 * 60 };
const LABELS = { focus: "Focus Session", short: "Short Break", long: "Long Break" };
const SESSIONS = 4;
const CIRC = 2 * Math.PI * 95;

export default function Pomodoro({ darkMode }: { darkMode: boolean }) {
  const [mode, setModeState] = useState<"focus" | "short" | "long">("focus");
  const [remaining, setRemaining] = useState(MODES.focus);
  const [running, setRunning] = useState(false);
  const [session, setSession] = useState(1);
  const [completedSessions, setCompleted] = useState(0);
  const [statusText, setStatusText] = useState("Ready to focus?");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = MODES[mode];

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
        if (next % SESSIONS === 0) {
          setSession(1);
          setTimeout(() => switchMode("long"), 300);
        } else {
          setSession((s) => Math.min(s + 1, SESSIONS));
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
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [running, mode]);

  const mins = String(Math.floor(remaining / 60)).padStart(2, "0");
  const secs = String(remaining % 60).padStart(2, "0");
  const offset = CIRC * (1 - remaining / total);

  // Colors that mirror your existing darkMode ? "#1a1a2e" : "#fdf2f8" pattern
  const bg = darkMode ? "#0d1b2e" : "#fce8f0";
  const card = darkMode ? "#152236" : "#ffffff";
  const cardBorder = darkMode ? "#2a4060" : "#f0c8dc";
  const track = darkMode ? "#1e3450" : "#f2d0e0";
  const text = darkMode ? "#ffffff" : "#1a1a1a";
  const muted = darkMode ? "#8ba3c0" : "#b07090";
  const tabBg = darkMode ? "#1a2a40" : "#fde0ed";
  const settingBg = darkMode ? "#1a2a40" : "#fde8f2";

  return (
    <div style={{ minHeight: "100vh", background: bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.5rem", padding: "2rem", transition: "all 0.3s" }}>
      
      {/* Mode Tabs */}
      <div style={{ display: "flex", gap: "6px", background: tabBg, borderRadius: "999px", padding: "4px" }}>
        {(["focus", "short", "long"] as const).map((m) => (
          <button key={m} onClick={() => switchMode(m)} style={{ border: "none", borderRadius: "999px", padding: "6px 16px", fontSize: "13px", cursor: "pointer", fontFamily: "inherit", background: mode === m ? "linear-gradient(135deg, #f77fb0, #f4874a)" : "transparent", color: mode === m ? "white" : muted, fontWeight: mode === m ? 500 : 400, transition: "all 0.2s" }}>
            {m === "focus" ? "Focus" : m === "short" ? "Short break" : "Long break"}
          </button>
        ))}
      </div>

      {/* Clock */}
      <div style={{ background: card, borderRadius: "50%", padding: "10px", boxShadow: `0 0 0 4px ${cardBorder}`, transition: "all 0.3s" }}>
        <div style={{ position: "relative", width: "210px", height: "210px" }}>
          <svg width="210" height="210" viewBox="0 0 210 210" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="105" cy="105" r="95" fill="none" stroke={track} strokeWidth="10" />
            <circle cx="105" cy="105" r="95" fill="none" strokeWidth="10" strokeLinecap="round"
              stroke="url(#grad)" strokeDasharray={CIRC} strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 1s linear" }} />
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#f77fb0" />
                <stop offset="100%" stopColor="#f4874a" />
              </linearGradient>
            </defs>
          </svg>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
            <div style={{ fontSize: "46px", fontWeight: 500, color: text, letterSpacing: "2px", lineHeight: 1 }}>{mins}:{secs}</div>
            <div style={{ fontSize: "11px", color: muted, marginTop: "6px", letterSpacing: "1px" }}>{LABELS[mode].toUpperCase()}</div>
          </div>
        </div>
      </div>

      {/* Session dots */}
      <div style={{ display: "flex", gap: "8px" }}>
        {Array.from({ length: SESSIONS }, (_, i) => i + 1).map((i) => (
          <div key={i} style={{ width: "10px", height: "10px", borderRadius: "50%", border: `1.5px solid ${i === session && mode === "focus" ? "#f77fb0" : cardBorder}`, background: i < session ? "linear-gradient(135deg, #f77fb0, #f4874a)" : track, transition: "all 0.3s" }} />
        ))}
      </div>

      <div style={{ fontSize: "13px", color: muted }}>{statusText}</div>

      {/* Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button onClick={() => { if (timerRef.current) clearInterval(timerRef.current); setRunning(false); setRemaining(total); setStatusText("Ready to focus?"); }}
          style={{ width: "40px", height: "40px", borderRadius: "50%", border: `1.5px solid ${cardBorder}`, background: card, color: muted, cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>↺</button>

        <button onClick={() => setRunning((r) => { if (r) { setStatusText("Paused"); } else { setStatusText(mode === "focus" ? "Stay focused!" : "Take it easy."); } return !r; })}
          style={{ border: "none", background: "linear-gradient(135deg, #f77fb0, #f4874a)", color: "white", fontSize: "15px", fontWeight: 500, padding: "12px 40px", borderRadius: "999px", cursor: "pointer", fontFamily: "inherit" }}>
          {running ? "Pause" : remaining === total ? "Start" : "Resume"}
        </button>

        <button onClick={() => { if (timerRef.current) clearInterval(timerRef.current); setRunning(false); setRemaining(0); handleComplete(); }}
          style={{ width: "40px", height: "40px", borderRadius: "50%", border: `1.5px solid ${cardBorder}`, background: card, color: muted, cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>▶▶</button>
      </div>

      {/* Settings summary */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
        {[["Focus", "25m"], ["Short break", "5m"], ["Long break", "15m"], ["Sessions", "4"]].map(([label, val]) => (
          <div key={label} style={{ background: settingBg, border: `1px solid ${cardBorder}`, borderRadius: "12px", padding: "10px 14px", textAlign: "center", minWidth: "76px", transition: "all 0.3s" }}>
            <div style={{ fontSize: "11px", color: muted, marginBottom: "4px" }}>{label}</div>
            <div style={{ fontSize: "17px", fontWeight: 500, color: text }}>{val}</div>
          </div>
        ))}
      </div>
    </div>
  );
}