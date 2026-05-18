import { useState } from "react";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleUsernameChange(e) {
    setUsername(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

 async function handleSubmit(e) {
    e.preventDefault();

    if (username === "") {
      setError("Kullanıcı adı boş bırakılamaz.");
      return;
    }

    if (password === "") {
      setError("Şifre boş bırakılamaz.");
      return;
    }

    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username, passwordHash: password })
      });
      if (response.ok) {
        const data = await response.json();
        onLogin(data.userId);
      } else {
        setError("Kullanıcı adı veya şifre hatalı.");
      }
    } catch (err) {
      setError("Bir hata oluştu.");
    }
  }

  return (
    <div className="auth-container">
      <h2>Giriş Yap</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Kullanıcı Adı"
          value={username}
          onChange={handleUsernameChange}
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={handlePasswordChange}
        />
        <button type="submit">Giriş Yap</button>
      </form>
      {error && <div className="alert alert-danger mt-2">{error}
  </div>}
    </div>
  );
}

export default Login;