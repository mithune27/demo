import { useState } from "react";
import { loginUser } from "../api/auth";
import "./Login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate(); // ✅ REQUIRED

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await loginUser({ username, password });

      console.log("Login response:", res.data);

      // ✅ ADMIN → Django Admin
      if (res.data.is_admin) {
        window.location.href = "http://127.0.0.1:8000/admin/";
      } 
      // ✅ STAFF → React dashboard
      else {
        navigate("/staff/dashboard");
      }

    } catch (err) {
      console.error(err);
      setError("Invalid username or password");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Welcome Back 👋</h2>
        <p className="subtitle">Sign in to continue</p>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
