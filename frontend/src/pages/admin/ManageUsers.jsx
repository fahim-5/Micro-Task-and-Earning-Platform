import { useEffect, useState } from "react";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        if (res.ok) setUsers(data.data || data.data.users || data);
      } catch (e) {}
    };
    fetchUsers();
  }, []);

  const removeUser = async (id) => {
    const token = localStorage.getItem("token");
    if (!confirm("Delete this user?")) return;
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (res.ok) setUsers((prev) => prev.filter((u) => u._id !== id));
      else alert(data.message || "Failed");
    } catch (e) {}
  };

  const changeRole = async (id, role) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (res.ok)
        setUsers((prev) => prev.map((u) => (u._id === id ? data.data : u)));
      else alert(data.message || "Failed");
    } catch (e) {}
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Coins</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b">
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">
                  <select
                    value={u.role}
                    onChange={(e) => changeRole(u._id, e.target.value)}
                    className="border p-1 rounded"
                  >
                    <option value="admin">Admin</option>
                    <option value="buyer">Buyer</option>
                    <option value="worker">Worker</option>
                  </select>
                </td>
                <td className="p-2">{u.coins || 0}</td>
                <td className="p-2">
                  <button
                    className="px-2 py-1 bg-red-600 text-white rounded"
                    onClick={() => removeUser(u._id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
