import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [withdrawals, setWithdrawals] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        if (res.ok) setStats(data.data);
      } catch (e) {}
    };

    const fetchWithdrawals = async () => {
      try {
        const res = await fetch("/api/withdrawals/pending", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        if (res.ok) setWithdrawals(data.data.withdrawals || []);
      } catch (e) {}
    };

    fetchStats();
    fetchWithdrawals();
  }, []);

  const doAction = async (id, action) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/withdrawals/${id}/${action}`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (res.ok) {
        // refresh data after action
        await refresh();
      } else alert(data.message || "Failed");
    } catch (e) {}
  };

  // expose functions to refresh data
  const refresh = async () => {
    const token = localStorage.getItem("token");
    try {
      const s = await fetch("/api/admin/stats", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const sd = await s.json();
      if (s.ok) setStats(sd.data);

      const w = await fetch("/api/withdrawals/pending", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const wd = await w.json();
      if (w.ok) setWithdrawals(wd.data.withdrawals || []);
    } catch (e) {}
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

      {stats && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-white rounded shadow">
            Workers: {stats.totalWorkers}
          </div>
          <div className="p-4 bg-white rounded shadow">
            Buyers: {stats.totalBuyers}
          </div>
          <div className="p-4 bg-white rounded shadow">
            Total Coins: {stats.totalCoins}
          </div>
          <div className="p-4 bg-white rounded shadow">
            Total Payments: ${stats.totalPayments}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-xl font-semibold mb-2">Pending Withdrawals</h3>
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-2">User</th>
                <th className="p-2">Coins</th>
                <th className="p-2">Amount ($)</th>
                <th className="p-2">Payment</th>
                <th className="p-2">Account</th>
                <th className="p-2">Date</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((w) => (
                <tr key={w._id} className="border-b">
                  <td className="p-2">{w.worker_name || w.worker_email}</td>
                  <td className="p-2">{w.withdrawal_coin}</td>
                  <td className="p-2">${w.withdrawal_amount}</td>
                  <td className="p-2">{w.payment_system}</td>
                  <td className="p-2">{w.account_number}</td>
                  <td className="p-2">
                    {new Date(w.createdAt).toLocaleString()}
                  </td>
                  <td className="p-2">
                    <button
                      className="mr-2 px-2 py-1 bg-green-600 text-white rounded"
                      onClick={() => doAction(w._id, "approve")}
                    >
                      Approve
                    </button>
                    <button
                      className="px-2 py-1 bg-red-600 text-white rounded"
                      onClick={() => doAction(w._id, "reject")}
                    >
                      Reject
                    </button>
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
