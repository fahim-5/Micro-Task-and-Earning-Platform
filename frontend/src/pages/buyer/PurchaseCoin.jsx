import { useState } from "react";

const options = [
  { coins: 10, amount: 1 },
  { coins: 150, amount: 10 },
  { coins: 500, amount: 20 },
  { coins: 1000, amount: 35 },
];

export default function PurchaseCoin() {
  const [msg, setMsg] = useState(null);

  const buy = async (opt) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/payments/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ coins: opt.coins, amount: opt.amount }),
      });
      const data = await res.json();
      if (!res.ok) return setMsg(data.message || "Payment failed");
      setMsg("Payment completed");
    } catch (err) {
      setMsg("Payment failed");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Purchase Coins</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {options.map((o, i) => (
          <div key={i} className="p-4 bg-white shadow text-center">
            <div className="text-3xl font-bold">{o.coins} coins</div>
            <div className="text-xl">= ${o.amount}</div>
            <button className="btn-primary mt-3" onClick={() => buy(o)}>
              Buy
            </button>
          </div>
        ))}
      </div>
      {msg && <div className="mt-4">{msg}</div>}
    </div>
  );
}
