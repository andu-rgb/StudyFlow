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

function formatTime(s: number) {
  const min = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export default function Pomodoro() {
  /* SETTINGS */
  const [focusMins, setFocusMins] = useState(
    () => Number(localStorage.getItem("focusMins")) || 25
  );
  const [shortMins, setShortMins] = useState(
    () => Number(localStorage.getItem("shortMins")) || 5
  );
  const [longMins, setLongMins] = useState(
    () => Number(localStorage.getItem("longMins")) || 15
  );
  const [sessionsGoal, setSessionsGoal] = useState(
    () => Number(localStorage.getItem("sessionsGoal")) || 4
  );

  /* TIMER */
  const [mode, setMode] = useState<Mode>("focus");
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(0);

  const focusTime = focusMins * 60;
  const shortTime = shortMins * 60;
  const longTime = longMins * 60;

  const MODES = {
    focus: focusTime,
    short: shortTime,
    long: longTime,
  };

  const [remaining, setRemaining] = useState(focusTime);

  /* UI */
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

  /* SAVE SETTINGS */
  useEffect(() => {
    localStorage.setItem("focusMins", String(focusMins));
    localStorage.setItem("shortMins", String(shortMins));
    localStorage.setItem("longMins", String(longMins));
    localStorage.setItem("sessionsGoal", String(sessionsGoal));
  }, [focusMins, shortMins, longMins, sessionsGoal]);

  const total = MODES[mode];

  /* SWITCH MODE */
  function switchMode(next: Mode) {
    if (timerRef.current) clearInterval(timerRef.current);
    setRunning(false);
    setMode(next);
    setRemaining(MODES[next]);
  }

  /* NEXT MODE */
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

      const next =
        nextCompleted % sessionsGoal === 0 ? "long" : "short";

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

  /* KEYBOARD SHORTCUTS */
  useEffect(() => {
    function handle(e: KeyboardEvent) {
      if (e.code === "Space") {
        e.preventDefault();
        setRunning((r) => !r);
      }
      if (e.key === "r") {
        setRunning(false);
        setRemaining(total);
      }
      if (e.key === "n") {
        nextMode();
      }
    }

    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [total, mode, completed]);

  const progress = CIRC * (1 - remaining / total);

  const glass = {
    background: "var(--card)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.22)",
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

  const accent = {
    background:
      "linear-gradient(135deg,var(--accent1),var(--accent2))",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontWeight: 700,
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
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Floating Glow */}
      <div
        style={{
          position: "absolute",
          width: 420,
          height: 420,
          borderRadius: "50%",
          background:
            "linear-gradient(135deg,var(--accent1),var(--accent2))",
          filter: "blur(130px)",
          opacity: 0.14,
          top: -120,
          left: -100,
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: 560,
          padding: 34,
          borderRadius: 32,
          position: "relative",
          zIndex: 2,
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

        {/* Circle */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 28,
          }}
        >
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
              <div
                style={{
                  fontSize: 56,
                  fontWeight: 800,
                  color: "var(--text)",
                }}
              >
                {formatTime(remaining)}
              </div>

              <div
                style={{
                  marginTop: 8,
                  fontSize: 13,
                  color: "var(--text2)",
                  letterSpacing: 1,
                }}
              >
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
            onClick={() => {
              audioRef.current?.play().then(() => {
                audioRef.current!.pause();
                audioRef.current!.currentTime = 0;
              }).catch(() => {});
              setRunning((r) => !r);
            }}
            style={{
              padding: "14px 48px",
              borderRadius: 999,
              fontSize: 18,
              ...accent,
              boxShadow:
                "0 10px 28px rgba(244,114,182,0.25)",
            }}
          >
            {running ? "Pause" : "Start"}
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
            gap: 12,
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

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 12,
          }}
        >
          {[
            ["Focus", `${focusMins}m`],
            ["Short", `${shortMins}m`],
            ["Long", `${longMins}m`],
            ["Done", `${completed}/${sessionsGoal}`],
          ].map(([label, val]) => (
            <div
              key={label}
              style={{
                padding: 16,
                borderRadius: 18,
                textAlign: "center",
                ...glass,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: "var(--text2)",
                  marginBottom: 6,
                }}
              >
                {label}
              </div>
              <div
                style={{
                  color: "var(--text)",
                  fontWeight: 800,
                  fontSize: 20,
                }}
              >
                {val}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}