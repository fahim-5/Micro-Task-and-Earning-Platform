import { useEffect, useState } from "react";

export default function BuyerHome() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/tasks/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setStats(data.data);
      } catch (err) {}
    };
    load();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Buyer Home</h2>
      {stats ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white shadow">
            Total Tasks: {stats.totalCount}
          </div>
          <div className="p-4 bg-white shadow">
            Pending Workers Needed: {stats.pendingTaskSum}
          </div>
          <div className="p-4 bg-white shadow">
            Total Paid: ${stats.totalPaid}
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
