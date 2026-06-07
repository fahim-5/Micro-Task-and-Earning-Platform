import { useEffect, useState } from "react";

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/payments/mine", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setPayments(data.data.payments);
    };
    load();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Payment History</h2>
      <div className="bg-white shadow rounded">
        <table className="w-full">
          <thead>
            <tr>
              <th className="p-2">Date</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Coins</th>
              <th className="p-2">Provider</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p._id}>
                <td className="p-2">
                  {new Date(p.createdAt).toLocaleString()}
                </td>
                <td className="p-2">${p.amount}</td>
                <td className="p-2">{p.coins}</td>
                <td className="p-2">{p.provider}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
