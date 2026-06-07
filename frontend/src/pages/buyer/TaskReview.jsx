import { useEffect, useState } from "react";

export default function TaskReview() {
  const [subs, setSubs] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/submissions/owner/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setSubs(data.data.submissions);
    };
    load();
  }, []);

  const action = async (id, kind) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/submissions/${id}/${kind}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) setSubs(subs.filter((s) => s._id !== id));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Task Submissions to Review</h2>
      <div className="bg-white shadow rounded">
        <table className="w-full">
          <thead>
            <tr>
              <th className="p-2">Worker</th>
              <th className="p-2">Task</th>
              <th className="p-2">Payable</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subs.map((s) => (
              <tr key={s._id}>
                <td className="p-2">{s.worker_name || s.worker?.name}</td>
                <td className="p-2">{s.task_title || s.task?.title}</td>
                <td className="p-2">{s.payable_amount}</td>
                <td className="p-2">
                  <button
                    className="btn-secondary mr-2"
                    onClick={() => setSelected(s)}
                  >
                    View
                  </button>
                  <button
                    className="btn-primary mr-2"
                    onClick={() => action(s._id, "approve")}
                  >
                    Approve
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => action(s._id, "reject")}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded max-w-xl">
            <h3 className="font-bold mb-2">Submission Detail</h3>
            <div className="mb-4">{selected.content}</div>
            <div className="flex justify-end">
              <button
                className="btn-secondary mr-2"
                onClick={() => setSelected(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
