import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const validate = () => {
    const emailRe = /^\S+@\S+\.\S+$/;
    if (!emailRe.test(form.email)) return "Invalid email";
    if (!form.password || form.password.length < 6)
      return "Password must be at least 6 characters";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) return setError(v);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok)
        return setError(data.message || data.error || "Login failed");
      if (data.token) localStorage.setItem("token", data.token);
      if (data.data && data.data.user) setUser(data.data.user);
      navigate("/dashboard");
    } catch (e) {
      setError(e?.message || "Login failed");
    }
  };

  const handleGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const u = result.user;
      // Exchange Google user info with backend to create/login user
      try {
        const body = {
          name: u.displayName,
          email: u.email,
          avatar: u.photoURL,
          role: "worker",
        };
        const res = await fetch("/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) return setError(data.message || "Google auth failed");
        if (data.token) localStorage.setItem("token", data.token);
        if (data.data && data.data.user) setUser(data.data.user);
        navigate("/dashboard");
      } catch (err) {
        setError("Google Sign-In backend exchange failed");
      }
    } catch (e) {
      setError(e?.message || "Google Sign-In failed");
    }
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="Email"
          className="input-field"
        />
        <input
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          type="password"
          placeholder="Password"
          className="input-field"
        />
        <button type="submit" className="btn-primary">
          Login
        </button>
      </form>

      <div className="mt-6">
        <button onClick={handleGoogle} className="btn-secondary">
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
