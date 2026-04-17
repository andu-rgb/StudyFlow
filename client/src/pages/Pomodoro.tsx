import { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import ringSound from "../assets/ringer.mp3";

type Mode = "focus" | "short" | "long";

const LABELS = {
  focus: "FOCUS SESSION",
  short: "SHORT BREAK",
  long: "LONG BREAK",
};

const RADIUS = 95;
const CIRC = 2 * Math.PI * RADIUS;

function formatTime(totalSeconds: number) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function toSeconds(mins: number, secs: number) {
  return mins * 60 + secs;
}

export default function Pomodoro() {
  /* SETTINGS */
  const [focusMin, setFocusMin] = useState(() => Number(localStorage.getItem("focusMin")) || 25);
  const [focusSec, setFocusSec] = useState(() => Number(localStorage.getItem("focusSec")) || 0);

  const [shortMin, setShortMin] = useState(() => Number(localStorage.getItem("shortMin")) || 5);
  const [shortSec, setShortSec] = useState(() => Number(localStorage.getItem("shortSec")) || 0);

  const [longMin, setLongMin] = useState(() => Number(localStorage.getItem("longMin")) || 15);
  const [longSec, setLongSec] = useState(() => Number(localStorage.getItem("longSec")) || 0);

  const [sessionsGoal, setSessionsGoal] = useState(
    () => Number(localStorage.getItem("sessionsGoal")) || 4
  );

  /* TIMER */
  const focusTime = toSeconds(focusMin, focusSec);
  const shortTime = toSeconds(shortMin, shortSec);
  const longTime = toSeconds(longMin, longSec);

  const MODES = {
    focus: focusTime,
    short: shortTime,
    long: longTime,
  };

  const [mode, setMode] = useState<Mode>("focus");
  const [remaining, setRemaining] = useState(focusTime);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(0);

  const [autoStart, setAutoStart] = useState(true);
  const [soundOn, setSoundOn] = useState(true);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  /* AUDIO */
  useEffect(() => {
    const audio = new Audio(ringSound);
    audio.preload = "auto";
    audio.volume = 1;
    audio.load();
    audioRef.current = audio;
  }, []);

  /* SAVE */
  useEffect(() => {
    localStorage.setItem("focusMin", String(focusMin));
    localStorage.setItem("focusSec", String(focusSec));
    localStorage.setItem("shortMin", String(shortMin));
    localStorage.setItem("shortSec", String(shortSec));
    localStorage.setItem("longMin", String(longMin));
    localStorage.setItem("longSec", String(longSec));
    localStorage.setItem("sessionsGoal", String(sessionsGoal));
  }, [
    focusMin,
    focusSec,
    shortMin,
    shortSec,
    longMin,
    longSec,
    sessionsGoal,
  ]);

  const total = MODES[mode];

  function switchMode(next: Mode) {
    if (timerRef.current) clearInterval(timerRef.current);
    setRunning(false);
    setMode(next);
    setRemaining(MODES[next]);
  }

  async function nextMode() {
    if (soundOn && audioRef.current) {
      try {
        audioRef.current.currentTime = 0;
        await audioRef.current.play();
      } catch {}
    }

    if (mode === "focus") {
      const nextCompleted = completed + 1;
      setCompleted(nextCompleted);

      if (nextCompleted >= sessionsGoal) {
        confetti({
          particleCount: 180,
          spread: 100,
          origin: { y: 0.6 },
        });
      }

      const next = nextCompleted % sessionsGoal === 0 ? "long" : "short";
      setMode(next);
      setRemaining(MODES[next]);
      if (autoStart) setRunning(true);
    } else {
      setMode("focus");
      setRemaining(MODES.focus);
      if (autoStart) setRunning(true);
    }
  }

  /* TIMER */
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

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [running, mode, completed]);

  /* Update remaining when settings change */
  useEffect(() => {
    if (!running) setRemaining(MODES[mode]);
  }, [
    focusMin,
    focusSec,
    shortMin,
    shortSec,
    longMin,
    longSec,
  ]);

  const progress = CIRC * (1 - remaining / total);

  const glass = {
    background: "var(--card)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 18px 50px rgba(0,0,0,0.18)",
    backdropFilter: "blur(18px)",
  };

  const smallBtn = {
    width: 54,
    height: 54,
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    color: "var(--text)",
    fontSize: 22,
    ...glass,
  };

  const inputStyle = {
    width: "44px",
    textAlign: "center" as const,
    border: "none",
    outline: "none",
    borderRadius: "10px",
    background: "var(--bg)",
    color: "var(--text)",
    padding: "6px",
    fontWeight: 700,
    fontSize: "16px",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `
          radial-gradient(circle at top left, rgba(255,255,255,0.08), transparent 30%),
          radial-gradient(circle at bottom right, rgba(255,255,255,0.06), transparent 30%),
          var(--bg)
        `,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 560,
          padding: 34,
          borderRadius: 32,
          ...glass,
        }}
      >
        {/* Tabs */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 10,
            marginBottom: 28,
          }}
        >
          {(["focus", "short", "long"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              style={{
                padding: "10px 18px",
                borderRadius: 999,
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
                background:
                  mode === m
                    ? "linear-gradient(135deg,var(--accent1),var(--accent2))"
                    : "rgba(255,255,255,0.05)",
                color: mode === m ? "white" : "var(--text2)",
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

        {/* Timer Circle */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
          <div style={{ position: "relative", width: 250, height: 250 }}>
            <svg
              width="250"
              height="250"
              viewBox="0 0 250 250"
              style={{ transform: "rotate(-90deg)" }}
            >
              <circle
                cx="125"
                cy="125"
                r={RADIUS}
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="12"
              />

              <circle
                cx="125"
                cy="125"
                r={RADIUS}
                fill="none"
                stroke="url(#grad)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={CIRC}
                strokeDashoffset={progress}
                style={{ transition: "0.8s linear" }}
              />

              <defs>
                <linearGradient id="grad">
                  <stop offset="0%" stopColor="var(--accent1)" />
                  <stop offset="100%" stopColor="var(--accent2)" />
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
              <div style={{ fontSize: 56, fontWeight: 800, color: "var(--text)" }}>
                {formatTime(remaining)}
              </div>

              <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 8 }}>
                {LABELS[mode]}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 16,
            marginBottom: 28,
          }}
        >
          <button
            style={smallBtn}
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
              padding: "14px 48px",
              borderRadius: 999,
              border: "none",
              cursor: "pointer",
              fontSize: 18,
              fontWeight: 700,
              background:
                "linear-gradient(135deg,var(--accent1),var(--accent2))",
              color: "var(--buttonText)",
            }}
          >
            {running ? "Pause" : "Play"}
          </button>

          <button style={smallBtn} onClick={nextMode}>
            ⏭
          </button>
        </div>

        {/* Toggles */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 10,
            marginBottom: 24,
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => setAutoStart((v) => !v)}
            style={{
              padding: "8px 14px",
              borderRadius: 999,
              border: "none",
              cursor: "pointer",
              ...glass,
              color: "var(--text)",
            }}
          >
            {autoStart ? "⚡ Auto Start On" : "Auto Start Off"}
          </button>

          <button
            onClick={() => setSoundOn((v) => !v)}
            style={{
              padding: "8px 14px",
              borderRadius: 999,
              border: "none",
              cursor: "pointer",
              ...glass,
              color: "var(--text)",
            }}
          >
            {soundOn ? "🔔 Sound On" : "🔕 Sound Off"}
          </button>
        </div>

        {/* Editors */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 12,
          }}
        >
          {[
            ["Focus", focusMin, focusSec, setFocusMin, setFocusSec],
            ["Short", shortMin, shortSec, setShortMin, setShortSec],
            ["Long", longMin, longSec, setLongMin, setLongSec],
          ].map(([label, mins, secs, setMin, setSec]: any) => (
            <div
              key={label}
              style={{
                padding: 14,
                borderRadius: 18,
                textAlign: "center",
                ...glass,
              }}
            >
              <div style={{ fontSize: 12, color: "var(--text2)" }}>
                {label}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 6,
                  marginTop: 8,
                }}
              >
                <input
                  type="number"
                  min="0"
                  value={mins}
                  onChange={(e) => setMin(Number(e.target.value))}
                  style={inputStyle}
                />

                <input
                  type="number"
                  min="0"
                  max="59"
                  value={secs}
                  onChange={(e) => setSec(Math.min(59, Number(e.target.value)))}
                  style={inputStyle}
                />
              </div>

              <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 6 }}>
                min / sec
              </div>
            </div>
          ))}

          {/* Goal */}
          <div
            style={{
              padding: 14,
              borderRadius: 18,
              textAlign: "center",
              ...glass,
            }}
          >
            <div style={{ fontSize: 12, color: "var(--text2)" }}>Goal</div>

            <input
              type="number"
              min="1"
              value={sessionsGoal}
              onChange={(e) => setSessionsGoal(Number(e.target.value))}
              style={{
                ...inputStyle,
                width: "70px",
                marginTop: "8px",
              }}
            />

            <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 6 }}>
              sessions
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}