import { useEffect, useState } from "react";

export default function MySubmissions() {
  const [subs, setSubs] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchData = async () => {
      try {
        const res = await fetch("/api/submissions/mine", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        if (res.ok) setSubs(data.data.submissions || []);
      } catch (e) {}
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Submissions</h2>
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-2">Date</th>
              <th className="p-2">Task</th>
              <th className="p-2">Pay</th>
              <th className="p-2">Buyer</th>
              <th className="p-2">Status</th>
              <th className="p-2">Details</th>
            </tr>
          </thead>
          <tbody>
            {subs.map((s) => (
              <tr key={s._id} className="border-b">
                <td className="p-2">
                  {new Date(s.createdAt).toLocaleString()}
                </td>
                <td className="p-2">{s.task_title}</td>
                <td className="p-2">{s.payable_amount}</td>
                <td className="p-2">{s.buyer_name || s.buyer_email}</td>
                <td className="p-2">
                  <span
                    className={
                      s.status === "approved"
                        ? "text-green-600 font-semibold"
                        : s.status === "pending"
                          ? "text-yellow-600 font-semibold"
                          : "text-red-600 font-semibold"
                    }
                  >
                    {s.status}
                  </span>
                </td>
                <td className="p-2 text-sm">{s.content}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
