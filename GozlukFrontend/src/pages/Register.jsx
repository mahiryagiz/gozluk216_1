import { useState } from "react";

function Register({ onRegister }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleUsernameChange(e) {
    setUsername(e.target.value);
  }

  function handleEmailChange(e) {
    setEmail(e.target.value);
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

    if (email === "") {
      setError("Email boş bırakılamaz.");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setError("Geçerli bir email adresi giriniz.");
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
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username, email: email, passwordHash: password })
      });
      if (response.ok) {
        onRegister();
      } else {
        setError("Kayıt başarısız. Kullanıcı adı veya email zaten kullanılıyor.");
      }
    } catch (err) {
      setError("Bir hata oluştu.");
    }
  }

  return (
    <div className="auth-container">
      <h2>Kayıt Ol</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Kullanıcı Adı"
          value={username}
          onChange={handleUsernameChange}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={handlePasswordChange}
        />
        <button type="submit">Kayıt Ol</button>
      </form>
          {error && <div className="alert alert-danger mt-2">{error}
      </div>}
    </div>
  );
}

export default Register;