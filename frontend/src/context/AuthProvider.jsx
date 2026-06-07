import { createContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If a backend token exists, bootstrap from backend /api/auth/me
    const token = localStorage.getItem("token");
    let unsub;
    const bootstrap = async () => {
      if (token) {
        try {
          const res = await fetch("/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (res.ok && data.data && data.data.user) {
            setUser(data.data.user);
            setLoading(false);
            return;
          }
        } catch (err) {
          // fall back to firebase
        }
      }

      // fallback to Firebase auth state
      unsub = onAuthStateChanged(auth, (u) => {
        if (u) {
          setUser({
            uid: u.uid,
            email: u.email,
            name: u.displayName || "",
            avatar: u.photoURL || "",
          });
        } else {
          setUser(null);
          localStorage.removeItem("token");
        }
        setLoading(false);
      });
    };

    bootstrap();

    return () => unsub && unsub();
  }, []);

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {}
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
