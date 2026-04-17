import { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import ringSound from "../assets/ringercut.mp3";

type Mode = "focus" | "short" | "long";

const LABELS = {
  focus: "Focus Session",
  short: "Short Break",
  long: "Long Break",
};

const RADIUS = 96;
const CIRC = 2 * Math.PI * RADIUS;

function formatTime(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function toSeconds(min: number, sec: number) {
  return min * 60 + sec;
}

export default function Pomodoro() {
  /* SETTINGS */
  const [focusMin, setFocusMin] = useState(
    () => Number(localStorage.getItem("focusMin")) || 25
  );
  const [focusSec, setFocusSec] = useState(
    () => Number(localStorage.getItem("focusSec")) || 0
  );

  const [shortMin, setShortMin] = useState(
    () => Number(localStorage.getItem("shortMin")) || 5
  );
  const [shortSec, setShortSec] = useState(
    () => Number(localStorage.getItem("shortSec")) || 0
  );

  const [longMin, setLongMin] = useState(
    () => Number(localStorage.getItem("longMin")) || 15
  );
  const [longSec, setLongSec] = useState(
    () => Number(localStorage.getItem("longSec")) || 0
  );

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

  /* UX */
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

  async function playSound() {
    if (!soundOn || !audioRef.current) return;
    try {
      audioRef.current.currentTime = 0;
      await audioRef.current.play();
    } catch {}
  }

  async function nextMode() {
    await playSound();

    if (mode === "focus") {
      const next = completed + 1;
      setCompleted(next);

      if (next >= sessionsGoal) {
        confetti({
          particleCount: 180,
          spread: 100,
          origin: { y: 0.6 },
        });
      }

      const target = next % sessionsGoal === 0 ? "long" : "short";
      setMode(target);
      setRemaining(MODES[target]);
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

  /* update current timer if values change */
  useEffect(() => {
    if (!running) setRemaining(MODES[mode]);
  }, [focusMin, focusSec, shortMin, shortSec, longMin, longSec]);

  const progress = CIRC * (1 - remaining / total);

  const glass = {
    background: "var(--card)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
    backdropFilter: "blur(18px)",
  };

  const iconBtn = {
    width: 54,
    height: 54,
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    fontSize: 22,
    color: "var(--text)",
    ...glass,
  };

  const inputStyle = {
    width: 42,
    border: "none",
    outline: "none",
    textAlign: "center" as const,
    borderRadius: 10,
    padding: "6px",
    fontWeight: 700,
    fontSize: 16,
    background: "var(--bg)",
    color: "var(--text)",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `
          radial-gradient(circle at top left, rgba(255,255,255,0.10), transparent 28%),
          radial-gradient(circle at bottom right, rgba(255,255,255,0.08), transparent 28%),
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
          borderRadius: 34,
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
                cursor: "pointer",
                fontWeight: 700,
                border:
                  mode === m
                    ? "none"
                    : "1px solid rgba(0,0,0,0.08)",
                background:
                  mode === m
                    ? "linear-gradient(135deg,var(--accent1),var(--accent2))"
                    : "var(--bg)",
                color: mode === m ? "white" : "var(--text)",
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

        {/* Timer */}
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
            marginBottom: 24,
          }}
        >
          <button
            style={iconBtn}
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
              padding: "14px 50px",
              minWidth: 150,
              borderRadius: 999,
              border: "none",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 18,
              color: "white",
              background:
                "linear-gradient(135deg,var(--accent1),var(--accent2))",
              boxShadow:
                "0 12px 30px rgba(244,114,182,0.25)",
            }}
          >
            {running ? "⏸ Pause" : "▶ Start"}
          </button>

          <button style={iconBtn} onClick={nextMode}>
            ⏭
          </button>
        </div>

        {/* Toggles */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 10,
            flexWrap: "wrap",
            marginBottom: 24,
          }}
        >
          <button
            onClick={() => setAutoStart((v) => !v)}
            style={{
              padding: "8px 14px",
              borderRadius: 999,
              border: "none",
              cursor: "pointer",
              color: "var(--text)",
              ...glass,
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
              color: "var(--text)",
              ...glass,
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
              <div
                style={{
                  fontSize: 12,
                  color: "var(--text2)",
                  marginBottom: 8,
                }}
              >
                {label}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <input
                  type="number"
                  min="0"
                  value={mins}
                  onChange={(e) =>
                    setMin(Number(e.target.value))
                  }
                  style={inputStyle}
                />

                <input
                  type="number"
                  min="0"
                  max="59"
                  value={secs}
                  onChange={(e) =>
                    setSec(
                      Math.min(59, Number(e.target.value))
                    )
                  }
                  style={inputStyle}
                />
              </div>

              <div
                style={{
                  fontSize: 11,
                  color: "var(--text2)",
                  marginTop: 6,
                }}
              >
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
            <div
              style={{
                fontSize: 12,
                color: "var(--text2)",
                marginBottom: 8,
              }}
            >
              Goal
            </div>

            <input
              type="number"
              min="1"
              value={sessionsGoal}
              onChange={(e) =>
                setSessionsGoal(Number(e.target.value))
              }
              style={{
                ...inputStyle,
                width: 70,
              }}
            />

            <div
              style={{
                fontSize: 11,
                color: "var(--text2)",
                marginTop: 6,
              }}
            >
              sessions
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}