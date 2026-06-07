import { useEffect, useState } from "react";

export default function ManageTasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchTasks = async () => {
      try {
        const res = await fetch("/api/tasks/all", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        if (res.ok) setTasks(data.data.tasks || []);
      } catch (e) {}
    };
    fetchTasks();
  }, []);

  const removeTask = async (id) => {
    const token = localStorage.getItem("token");
    if (!confirm("Delete this task?")) return;
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (res.ok) setTasks((prev) => prev.filter((t) => t._id !== id));
      else alert(data.message || "Failed");
    } catch (e) {}
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Tasks</h2>
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-2">Title</th>
              <th className="p-2">Buyer</th>
              <th className="p-2">Payable</th>
              <th className="p-2">Remaining</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t) => (
              <tr key={t._id} className="border-b">
                <td className="p-2">{t.title}</td>
                <td className="p-2">{t.owner?.name || t.owner?.email}</td>
                <td className="p-2">{t.payable_amount}</td>
                <td className="p-2">{t.required_workers_remaining}</td>
                <td className="p-2">
                  <button
                    className="px-2 py-1 bg-red-600 text-white rounded"
                    onClick={() => removeTask(t._id)}
                  >
                    Delete
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
