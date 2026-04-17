import { useState, useEffect, useRef } from "react";

type Mode = "focus" | "short" | "long";
const LABELS = { focus: "Focus Session", short: "Short Break", long: "Long Break" };
const CIRC = 2 * Math.PI * 95;

function formatTime(s: number) { return `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`; }
function formatCard(s: number) { const m = Math.floor(s/60); const sc = s%60; if(m>0&&sc>0) return `${m}m ${sc}s`; if(m>0) return `${m}m`; return `${sc}s`; }

export default function Pomodoro() {
  const [focusTime, setFocusTime] = useState(() => Number(localStorage.getItem("focusTime")) || 1500);
  const [shortTime, setShortTime] = useState(() => Number(localStorage.getItem("shortTime")) || 300);
  const [longTime, setLongTime]   = useState(() => Number(localStorage.getItem("longTime"))  || 900);
  const [sessionsGoal, setSessionsGoal] = useState(() => Number(localStorage.getItem("sessionsGoal")) || 4);
  const MODES = { focus: focusTime, short: shortTime, long: longTime };

  const [mode, setMode]           = useState<Mode>("focus");
  const [remaining, setRemaining] = useState(focusTime);
  const [running, setRunning]     = useState(false);
  const [completed, setCompleted] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    localStorage.setItem("focusTime", String(focusTime));
    localStorage.setItem("shortTime", String(shortTime));
    localStorage.setItem("longTime",  String(longTime));
    localStorage.setItem("sessionsGoal", String(sessionsGoal));
  }, [focusTime, shortTime, longTime, sessionsGoal]);

  const total = MODES[mode];

  const switchMode = (m: Mode) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setRunning(false); setMode(m); setRemaining(MODES[m]);
  };

  const nextMode = () => {
    if (mode === "focus") {
      const n = completed + 1; setCompleted(n);
      switchMode(n % sessionsGoal === 0 ? "long" : "short");
    } else { switchMode("focus"); }
  };

  useEffect(() => {
    if (!running) return;
    timerRef.current = setInterval(() => {
      setRemaining((prev) => { if (prev <= 1) { clearInterval(timerRef.current!); setRunning(false); nextMode(); return 0; } return prev - 1; });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [running, mode, completed]);

  const offset = CIRC * (1 - remaining / total);

  const editSeconds = (label: string, current: number, setter: (n: number) => void) => {
    const input = prompt(`Set ${label} in seconds`, String(current));
    if (!input) return;
    const val = Number(input);
    if (!isNaN(val) && val > 0) {
      setter(val);
      if ((label==="Focus"&&mode==="focus")||(label==="Short break"&&mode==="short")||(label==="Long break"&&mode==="long")) setRemaining(val);
    }
  };

  const glass = {
    background: "var(--card)",
    border: "1px solid rgba(244,114,182,0.2)",
    boxShadow: "0 8px 24px rgba(244,114,182,0.12)",
  };

  const cardStyle = { padding: "14px", minWidth: "92px", borderRadius: "18px", cursor: "pointer", textAlign: "center" as const, ...glass, transition: "all 0.2s ease" };
  const roundBtn  = { width: "52px", height: "52px", borderRadius: "50%", border: "none", cursor: "pointer", color: "var(--text)", fontSize: "20px", ...glass };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", justifyContent: "center", alignItems: "center", padding: "2rem" }}>
      <div style={{ width: "100%", maxWidth: "520px", padding: "32px", borderRadius: "30px", ...glass }}>

        {/* Tabs */}
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "28px" }}>
          {(["focus","short","long"] as Mode[]).map((m) => (
            <button key={m} onClick={() => switchMode(m)} style={{
              border: "none", padding: "10px 18px", borderRadius: "999px", cursor: "pointer", fontWeight: 600,
              background: mode===m ? "linear-gradient(135deg,#f472b6,#fb923c)" : "var(--bg)",
              color: mode===m ? "white" : "var(--text2)",
            }}>
              {m==="focus" ? "Focus" : m==="short" ? "Short Break" : "Long Break"}
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
              <defs><linearGradient id="grad"><stop offset="0%" stopColor="#f472b6"/><stop offset="100%" stopColor="#fb923c"/></linearGradient></defs>
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
            border: "none", padding: "14px 44px", borderRadius: "999px", fontWeight: 700,
            fontSize: "17px", cursor: "pointer", color: "white",
            background: "linear-gradient(135deg,#f472b6,#fb923c)",
            boxShadow: "0 8px 20px rgba(244,114,182,0.3)",
          }}>{running ? "Pause" : "Start"}</button>
          <button style={roundBtn} onClick={nextMode}>⏭</button>
        </div>

        {/* Settings Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px" }}>
          <div style={cardStyle} onClick={() => editSeconds("Focus", focusTime, setFocusTime)}>
            <div style={{ color: "var(--text2)", fontSize: "12px" }}>Focus</div>
            <div style={{ color: "var(--text)", fontWeight: 700 }}>{formatCard(focusTime)}</div>
          </div>
          <div style={cardStyle} onClick={() => editSeconds("Short break", shortTime, setShortTime)}>
            <div style={{ color: "var(--text2)", fontSize: "12px" }}>Short Break</div>
            <div style={{ color: "var(--text)", fontWeight: 700 }}>{formatCard(shortTime)}</div>
          </div>
          <div style={cardStyle} onClick={() => editSeconds("Long break", longTime, setLongTime)}>
            <div style={{ color: "var(--text2)", fontSize: "12px" }}>Long Break</div>
            <div style={{ color: "var(--text)", fontWeight: 700 }}>{formatCard(longTime)}</div>
          </div>
          <div style={cardStyle} onClick={() => { const i=prompt("Sessions before long break",String(sessionsGoal)); if(i){const v=Number(i); if(!isNaN(v)&&v>0) setSessionsGoal(v);} }}>
            <div style={{ color: "var(--text2)", fontSize: "12px" }}>Sessions</div>
            <div style={{ color: "var(--text)", fontWeight: 700 }}>{sessionsGoal}</div>
          </div>
        </div>
      </div>
    </div>
  );
}