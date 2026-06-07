import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";

export default function WorkerHome() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ total: 0, pending: 0, earned: 0 });
  const [approvedSubs, setApprovedSubs] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchData = async () => {
      try {
        const res = await fetch("/api/submissions/mine", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        if (res.ok) {
          const subs = data.data.submissions || [];
          const total = subs.length;
          const pending = subs.filter((s) => s.status === "pending").length;
          const earned = subs
            .filter((s) => s.status === "approved")
            .reduce((a, b) => a + (b.payable_amount || 0), 0);
          setStats({ total, pending, earned });
          setApprovedSubs(subs.filter((s) => s.status === "approved"));
        }
      } catch (e) {}
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Worker Dashboard</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded shadow">
          Total Submissions: {stats.total}
        </div>
        <div className="p-4 bg-white rounded shadow">
          Pending: {stats.pending}
        </div>
        <div className="p-4 bg-white rounded shadow">
          Total Earned: {stats.earned}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Approved Submissions</h3>
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-2">Task</th>
                <th className="p-2">Pay</th>
                <th className="p-2">Buyer</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {approvedSubs.map((s) => (
                <tr key={s._id} className="border-b">
                  <td className="p-2">{s.task_title}</td>
                  <td className="p-2">{s.payable_amount}</td>
                  <td className="p-2">{s.buyer_name || s.buyer_email}</td>
                  <td className="p-2 text-green-600 font-semibold">
                    {s.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
