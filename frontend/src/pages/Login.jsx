import { useState } from "react";
import { loginUser } from "../api/auth";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const res = await loginUser({ username, password });

    // store JWT tokens
    localStorage.setItem("access", res.data.access);
    localStorage.setItem("refresh", res.data.refresh);

    // ✅ redirect to Django admin
    if (res.data.is_admin) {
      window.location.href = "http://127.0.0.1:8000/admin/";
    } else {
      alert("Login successful, but not admin");
      // later you can redirect staff elsewhere
    }

  } catch (err) {
    setError("Invalid username or password");
  }
};

  return (
    <div style={{ maxWidth: 400, margin: "100px auto" }}>
      <h2>Login</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />

        <button style={{ width: "100%", padding: 8 }}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
