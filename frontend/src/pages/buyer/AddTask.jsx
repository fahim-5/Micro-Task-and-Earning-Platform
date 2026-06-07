import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddTask() {
  const [form, setForm] = useState({
    title: "",
    detail: "",
    required_workers: 1,
    payable_amount: 1,
    completion_date: "",
    submission_info: "",
    task_image_url: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const total = Number(form.required_workers) * Number(form.payable_amount);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.message && data.message.includes("Not enough coins")) {
          alert("Not available Coin. Purchase Coin");
          return navigate("/dashboard/purchase");
        }
        return setError(data.message || "Failed to create task");
      }
      navigate("/dashboard/my-tasks");
    } catch (err) {
      setError("Failed to create task");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Add New Task</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
        <input
          placeholder="Task title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="input-field"
        />
        <textarea
          placeholder="Task detail"
          value={form.detail}
          onChange={(e) => setForm({ ...form, detail: e.target.value })}
          className="input-field"
        />
        <input
          type="number"
          min="1"
          placeholder="Required workers"
          value={form.required_workers}
          onChange={(e) =>
            setForm({ ...form, required_workers: e.target.value })
          }
          className="input-field"
        />
        <input
          type="number"
          min="0"
          placeholder="Payable amount per worker"
          value={form.payable_amount}
          onChange={(e) => setForm({ ...form, payable_amount: e.target.value })}
          className="input-field"
        />
        <input
          type="date"
          value={form.completion_date}
          onChange={(e) =>
            setForm({ ...form, completion_date: e.target.value })
          }
          className="input-field"
        />
        <input
          placeholder="Submission info"
          value={form.submission_info}
          onChange={(e) =>
            setForm({ ...form, submission_info: e.target.value })
          }
          className="input-field"
        />
        <input
          placeholder="Task image URL"
          value={form.task_image_url}
          onChange={(e) => setForm({ ...form, task_image_url: e.target.value })}
          className="input-field"
        />
        <button className="btn-primary" type="submit">
          Add Task
        </button>
      </form>
    </div>
  );
}
