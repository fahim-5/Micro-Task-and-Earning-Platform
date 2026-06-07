import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

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
      const email = form.email.trim().toLowerCase();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        form.password,
      );
      // update profile with name/avatar
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: form.name,
          photoURL: form.avatar || null,
        });
      }

      // Optionally sync to backend user collection
      try {
        await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            email,
            password: form.password,
            role: form.role,
            avatar: form.avatar,
          }),
        });
      } catch (err) {
        // ignore backend sync errors; user exists in Firebase
      }

      const u = userCredential.user;
      // store Firebase ID token for backend auth if needed
      try {
        const token = await u.getIdToken();
        localStorage.setItem("token", token);
      } catch (err) {
        // ignore token storage failures
      }
      setUser({
        uid: u.uid,
        email: u.email,
        name: u.displayName || "",
        avatar: u.photoURL || "",
      });
      navigate("/dashboard");
    } catch (e) {
      const msg = e?.code || e?.message || "Registration failed";
      setError(msg);
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
