import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Stats from "./pages/Stats";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AuthSuccess from "./pages/AuthSuccess";
import type { ReactElement } from "react";
import Pomodoro from "./pages/Pomodoro";


function ProtectedRoute({ children }: { children: ReactElement }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: darkMode ? "#1a1a2e" : "#fdf2f8", color: darkMode ? "white" : "black", transition: "all 0.3s ease" }}>
      <BrowserRouter>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <Routes>
          <Route path="/" element={<Home darkMode={darkMode} />} />
          <Route path="/login" element={<Login darkMode={darkMode} />} />
          <Route path="/signup" element={<Signup darkMode={darkMode} />} />
          <Route path="/auth-success" element={<AuthSuccess />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard darkMode={darkMode} /></ProtectedRoute>} />
          <Route path="/stats" element={<ProtectedRoute><Stats darkMode={darkMode} /></ProtectedRoute>} />
          <Route path="/pomodoro" element={<ProtectedRoute><Pomodoro darkMode={darkMode} /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;