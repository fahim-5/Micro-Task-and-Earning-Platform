import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [content, setContent] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/tasks/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        if (res.ok) setTask(data.data.task);
      } catch (e) {}
    };
    fetchData();
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ taskId: id, content }),
      });
      const data = await res.json();
      if (res.ok) {
        navigate("/dashboard/submissions");
      } else alert(data.message || "Submission failed");
    } catch (e) {}
  };

  if (!task) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">{task.title}</h2>
      <div className="mb-4">{task.detail || task.description}</div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-sm text-gray-600">
            Buyer: {task.owner?.name || task.owner?.email}
          </div>
          <div className="text-sm text-gray-600">
            Completion:{" "}
            {task.completion_date
              ? new Date(task.completion_date).toLocaleDateString()
              : "N/A"}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-600">
            Pay: {task.payable_amount}
          </div>
          <div className="text-sm text-gray-600">
            Required: {task.required_workers} | Remaining:{" "}
            {task.required_workers_remaining}
          </div>
        </div>
      </div>
      {task.submission_info && (
        <div className="mb-4">
          <strong>Submission info:</strong>
          <div className="text-sm text-gray-700">{task.submission_info}</div>
        </div>
      )}
      <form onSubmit={submit}>
        <label className="block text-sm mb-1">Submission Details</label>
        <textarea
          name="submission_Details"
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border rounded"
          rows={6}
        />
        <div className="mt-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded">
            Submit Work
          </button>
        </div>
      </form>
    </div>
  );
}
