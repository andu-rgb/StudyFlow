import { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin() {
    try {
      const res = await axios.post(`${API}/api/auth/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  }

  const inputStyle = { border: "2px solid #f9a8d4", borderRadius: "20px", padding: "10px 16px", outline: "none", width: "100%", fontSize: "16px", marginBottom: "12px", boxSizing: "border-box" as const };  const btnStyle = { background: "linear-gradient(to right, #f472b6, #fb923c)", color: "white", border: "none", borderRadius: "20px", padding: "12px", cursor: "pointer", fontWeight: "bold", fontSize: "16px", width: "100%" };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
  <div style={{ background: "white", padding: "40px", borderRadius: "20px", width: "100%", maxWidth: "400px", boxShadow: "0 4px 24px rgba(244,114,182,0.15)" }}>
        <h2 style={{ textAlign: "center", marginBottom: "24px" }}>Welcome Back</h2>

        {error && <p style={{ color: "red", textAlign: "center", marginBottom: "12px" }}>{error}</p>}

        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} style={inputStyle} />

        <button onClick={handleLogin} style={btnStyle}>Login</button>

        <div style={{ textAlign: "center", margin: "16px 0", color: "#9ca3af" }}>or</div>

        <a href={`${API}/auth/google`}>
          <button style={{ background: "white", color: "#374151", border: "2px solid #e5e7eb", borderRadius: "20px", padding: "12px", cursor: "pointer", fontWeight: "bold", fontSize: "16px", width: "100%" }}>
             Continue with Google
          </button>
        </a>

        <p style={{ textAlign: "center", marginTop: "20px", color: "#9ca3af" }}>
          Don't have an account? <a href="/signup" style={{ color: "#f472b6", fontWeight: "bold" }}>Sign up</a>
        </p>
      </div>
    </div>
  );
}

export default Login;