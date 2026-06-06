import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "worker",
    avatar: "",
  });
  const [error, setError] = useState(null);
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const validate = () => {
    const email = form.email ? form.email.trim().toLowerCase() : "";
    const emailRe = /^\S+@\S+\.\S+$/;
    const passRe = /^.{6,}$/;
    if (!form.name || form.name.length < 2)
      return "Name must be at least 2 characters";
    if (!email || !emailRe.test(email)) return "Invalid email";
    if (!passRe.test(form.password))
      return "Password must be at least 6 characters";
    if (!["worker", "buyer"].includes(form.role)) return "Invalid role";
    if (form.avatar && !/^https?:\/\//.test(form.avatar))
      return "Avatar must be a valid URL";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) return setError(v);

    try {
      const payload = { ...form, email: form.email.trim().toLowerCase() };
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        // prefer explicit message(s) from server
        if (data.errors && Array.isArray(data.errors)) {
          const msgs = data.errors.map((e) => e.msg).join(", ");
          return setError(msgs || "Registration failed");
        }
        return setError(data.message || "Registration failed");
      }

      // store token and set user
      if (data.token) localStorage.setItem("token", data.token);
      if (data.data && data.data.user) setUser(data.data.user);
      navigate("/dashboard");
    } catch (e) {
      setError("Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Name"
          className="input-field"
        />
        <input
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="Email"
          className="input-field"
        />
        <input
          value={form.avatar}
          onChange={(e) => setForm({ ...form, avatar: e.target.value })}
          placeholder="Profile picture URL (optional)"
          className="input-field"
        />
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="input-field"
        >
          <option value="worker">Worker</option>
          <option value="buyer">Buyer</option>
        </select>
        <input
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          type="password"
          placeholder="Password"
          className="input-field"
        />
        <button type="submit" className="btn-primary">
          Register
        </button>
      </form>
    </div>
  );
}
