import { createContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // bootstrap auth state from Firebase
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        // persist ID token for backend usage
        try {
          u.getIdToken().then((t) => localStorage.setItem("token", t));
        } catch (err) {
          // ignore
        }
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

    return () => unsub();
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
