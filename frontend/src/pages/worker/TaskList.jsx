import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchData = async () => {
      try {
        const res = await fetch("/api/tasks/available", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        if (res.ok) setTasks(data.data.tasks || []);
      } catch (e) {}
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Available Tasks</h2>
      <div className="grid grid-cols-1 gap-4">
        {tasks.map((t) => (
          <div key={t._id} className="p-4 bg-white rounded shadow">
            <div className="font-semibold">{t.title}</div>
            <div className="text-sm text-gray-600">
              Buyer: {t.owner?.name || t.owner?.email}
            </div>
            <div className="text-sm text-gray-600">
              Completion:{" "}
              {t.completion_date
                ? new Date(t.completion_date).toLocaleDateString()
                : "N/A"}
            </div>
            <div className="text-sm text-gray-600">
              Pay: {t.payable_amount} | Required: {t.required_workers} |
              Remaining: {t.required_workers_remaining}
            </div>
            <div className="mt-2">
              <Link className="text-blue-600" to={`/dashboard/tasks/${t._id}`}>
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
