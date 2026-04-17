import { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSignup() {
    try {
      const res = await axios.post(`${API}/api/auth/register`, { name, email, password });
      localStorage.setItem("token", res.data.token);
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed");
    }
  }

  const inputStyle = {
    border: "2px solid #f9a8d4", borderRadius: "20px", padding: "10px 16px",
    outline: "none", width: "100%", fontSize: "16px", marginBottom: "12px",
    boxSizing: "border-box" as const,
    background: "var(--card)", color: "var(--text)",
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
      <div style={{
        background: "var(--card)", color: "var(--text)", padding: "40px",
        borderRadius: "20px", width: "380px",
        boxShadow: "0 4px 24px rgba(244,114,182,0.15)",
        border: "1px solid var(--accent)", transition: "all 0.3s ease",
      }}>
        <h2 style={{ textAlign: "center", marginBottom: "24px" }}>Create Account</h2>

        {error && <p style={{ color: "#ef4444", textAlign: "center", marginBottom: "12px" }}>{error}</p>}

        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
        <input placeholder="Password" type="password" value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSignup()} style={inputStyle} />

        <button onClick={handleSignup} style={{
          background: "linear-gradient(to right, #f472b6, #fb923c)", color: "white",
          border: "none", borderRadius: "20px", padding: "12px", cursor: "pointer",
          fontWeight: "bold", fontSize: "16px", width: "100%", boxSizing: "border-box" as const,
        }}>Sign Up</button>

        <div style={{ textAlign: "center", margin: "16px 0", color: "var(--text2)" }}>or</div>

        <a href={`${API}/auth/google`}>
          <button style={{
            background: "var(--card)", color: "var(--text)", border: "2px solid var(--accent)",
            borderRadius: "20px", padding: "12px", cursor: "pointer",
            fontWeight: "bold", fontSize: "16px", width: "100%", boxSizing: "border-box" as const,
          }}>Continue with Google</button>
        </a>

        <p style={{ textAlign: "center", marginTop: "20px", color: "var(--text2)" }}>
          Already have an account?{" "}
          <a href="/login" style={{ color: "var(--accent)", fontWeight: "bold" }}>Login</a>
        </p>
      </div>
    </div>
  );
}

export default Signup;