import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginUser({ username, password });

      // ✅ STORE JWT TOKENS (CRITICAL)
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      // ✅ STORE USER INFO
      const userData = {
        isAdmin: res.data.is_admin === true,
        role: res.data.role || null,
      };

      localStorage.setItem("user", JSON.stringify(userData));

      // ✅ ROUTE BASED ON ROLE
      if (userData.isAdmin) {
        navigate("/admin", { replace: true });
      } else {
        navigate("/staff/dashboard", { replace: true });
      }
    } catch (err) {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="card" style={{ maxWidth: 420, width: "100%" }}>
        <h2 style={{ textAlign: "center" }}>Welcome Back 👋</h2>
        <p style={{ textAlign: "center", color: "#666", marginBottom: 24 }}>
          Sign in to continue
        </p>

        {error && (
          <div
            className="badge badge-danger"
            style={{ textAlign: "center", marginBottom: 16 }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ marginTop: 12 }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "10px",
  border: "1px solid #ddd",
  fontSize: "14px",
  marginBottom: "14px",
  outline: "none",
};

export default Login;
