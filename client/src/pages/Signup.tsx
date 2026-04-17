import { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

interface SignupProps {
  darkMode: boolean;
}

function Signup({ darkMode }: SignupProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSignup() {
    try {
      const res = await axios.post(`${API}/api/auth/register`, {
        name,
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed");
    }
  }

  const inputStyle = {
    border: "2px solid #f9a8d4",
    borderRadius: "20px",
    padding: "10px 16px",
    outline: "none",
    width: "100%",
    fontSize: "16px",
    marginBottom: "12px",
    boxSizing: "border-box" as const,
    background: darkMode ? "#1f2937" : "white",
    color: darkMode ? "white" : "black",
  };

  const btnStyle = {
    background: "linear-gradient(to right, #f472b6, #fb923c)",
    color: "white",
    border: "none",
    borderRadius: "20px",
    padding: "12px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
    width: "100%",
    boxSizing: "border-box" as const,
  };

  const googleBtnStyle = {
    background: darkMode ? "#111827" : "white",
    color: darkMode ? "white" : "#374151",
    border: "2px solid #e5e7eb",
    borderRadius: "20px",
    padding: "12px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
    width: "100%",
    boxSizing: "border-box" as const,
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
      }}
    >
      <div
        style={{
          background: darkMode
            ? "rgba(31,41,55,0.95)"
            : "white",
          color: darkMode ? "white" : "black",
          padding: "40px",
          borderRadius: "20px",
          width: "380px",
          boxShadow: darkMode
            ? "0 4px 24px rgba(244,114,182,0.25)"
            : "0 4px 24px rgba(244,114,182,0.15)",
          border: darkMode ? "1px solid #f472b6" : "none",
          transition: "all 0.3s ease",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "24px" }}>
          Create Account
        </h2>

        {error && (
          <p
            style={{
              color: "#ef4444",
              textAlign: "center",
              marginBottom: "12px",
            }}
          >
            {error}
          </p>
        )}

        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSignup()}
          style={inputStyle}
        />

        <button onClick={handleSignup} style={btnStyle}>
          Sign Up
        </button>

        <div
          style={{
            textAlign: "center",
            margin: "16px 0",
            color: darkMode ? "#d1d5db" : "#9ca3af",
          }}
        >
          or
        </div>

        <a href={`${API}/auth/google`}>
          <button style={googleBtnStyle}>
            Continue with Google
          </button>
        </a>

        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
            color: darkMode ? "#d1d5db" : "#9ca3af",
          }}
        >
          Already have an account?{" "}
          <a
            href="/login"
            style={{
              color: "#f472b6",
              fontWeight: "bold",
            }}
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default Signup;