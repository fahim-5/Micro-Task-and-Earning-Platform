import { useEffect, useState } from "react";

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: "",
    detail: "",
    submission_info: "",
    task_image_url: "",
    completion_date: "",
  });

  const loadTasks = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/tasks/mine", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) setTasks(data.data.tasks);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this task?")) return;
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setTasks(tasks.filter((t) => t._id !== id));
  };

  const startEdit = (t) => {
    setEditing(t._id);
    setForm({
      title: t.title || "",
      detail: t.detail || "",
      submission_info: t.submission_info || "",
      task_image_url: t.task_image_url || "",
      completion_date: t.completion_date ? t.completion_date.split("T")[0] : "",
    });
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/tasks/${editing}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      setEditing(null);
      loadTasks();
    } else {
      alert(data.message || "Failed to update");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Tasks</h2>
      <div className="bg-white shadow rounded">
        <table className="w-full">
          <thead>
            <tr>
              <th className="p-2">Title</th>
              <th className="p-2">Required</th>
              <th className="p-2">Remaining</th>
              <th className="p-2">Pay</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t) => (
              <tr key={t._id}>
                <td className="p-2">{t.title}</td>
                <td className="p-2">{t.required_workers}</td>
                <td className="p-2">{t.required_workers_remaining}</td>
                <td className="p-2">{t.payable_amount}</td>
                <td className="p-2">
                  <button
                    className="btn-secondary mr-2"
                    onClick={() => startEdit(t)}
                  >
                    Update
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => handleDelete(t._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <form
            onSubmit={submitEdit}
            className="bg-white p-6 rounded max-w-lg w-full"
          >
            <h3 className="font-bold mb-2">Edit Task</h3>
            <input
              className="input-field mb-2"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Title"
            />
            <textarea
              className="input-field mb-2"
              value={form.detail}
              onChange={(e) => setForm({ ...form, detail: e.target.value })}
              placeholder="Detail"
            />
            <input
              className="input-field mb-2"
              value={form.submission_info}
              onChange={(e) =>
                setForm({ ...form, submission_info: e.target.value })
              }
              placeholder="Submission info"
            />
            <input
              className="input-field mb-2"
              value={form.task_image_url}
              onChange={(e) =>
                setForm({ ...form, task_image_url: e.target.value })
              }
              placeholder="Image URL"
            />
            <input
              type="date"
              className="input-field mb-2"
              value={form.completion_date}
              onChange={(e) =>
                setForm({ ...form, completion_date: e.target.value })
              }
            />
            <div className="flex justify-end">
              <button
                type="button"
                className="btn-secondary mr-2"
                onClick={() => setEditing(null)}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
