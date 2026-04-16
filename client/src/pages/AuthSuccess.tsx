import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

function AuthSuccess() {
  const [params] = useSearchParams();

  useEffect(() => {
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      window.location.href = "/dashboard";
    }
  }, []);

  return <p style={{ textAlign: "center", marginTop: "40px" }}>Logging you in...</p>;
}

export default AuthSuccess;