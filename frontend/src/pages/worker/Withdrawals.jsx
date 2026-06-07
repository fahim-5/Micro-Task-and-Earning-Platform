import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";

export default function Withdrawals() {
  const { user } = useContext(AuthContext);
  const [coinAmount, setCoinAmount] = useState("");
  const [paymentSystem, setPaymentSystem] = useState("stripe");
  const [accountNumber, setAccountNumber] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchData = async () => {
      try {
        const res = await fetch("/api/withdrawals/mine", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        if (res.ok) setItems(data.data.withdrawals || []);
      } catch (e) {}
    };
    fetchData();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/withdrawals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          withdrawalCoin: Number(coinAmount),
          paymentSystem,
          accountNumber,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setItems((prev) => [data.data.withdrawal, ...prev]);
        setCoinAmount("");
        setAccountNumber("");
        setPaymentSystem("stripe");
      } else alert(data.message || "Failed");
    } catch (e) {}
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Withdrawals</h2>
      <div className="mb-4 p-4 bg-white rounded shadow">
        <div className="mb-2">Your Coins: {user?.coins || 0}</div>
        <div className="mb-2">Withdrawable ($): {(user?.coins || 0) / 20}</div>
        {user?.coins < 200 ? (
          <div className="text-red-600">
            Insufficient coin (minimum 200 required)
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-2">
            <div>
              <label className="block text-sm">Coins to withdraw</label>
              <input
                type="number"
                min={200}
                max={user?.coins || 0}
                value={coinAmount}
                onChange={(e) => setCoinAmount(e.target.value)}
                className="border p-2 rounded w-full"
                placeholder="Coins to withdraw (min 200)"
              />
            </div>
            {coinAmount && Number(coinAmount) % 20 !== 0 && (
              <div className="text-yellow-700 text-sm">
                Coins must be a multiple of 20.
              </div>
            )}
            <div>
              <label className="block text-sm">Withdraw amount ($)</label>
              <input
                type="number"
                value={coinAmount ? Number(coinAmount) / 20 : 0}
                readOnly
                className="border p-2 rounded w-full bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm">Payment system</label>
              <select
                value={paymentSystem}
                onChange={(e) => setPaymentSystem(e.target.value)}
                className="border p-2 rounded w-full"
              >
                <option value="stripe">Stripe</option>
                <option value="bkash">Bkash</option>
                <option value="rocket">Rocket</option>
                <option value="nagad">Nagad</option>
              </select>
            </div>
            <div>
              <label className="block text-sm">Account number</label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="border p-2 rounded w-full"
                placeholder="Account number"
              />
            </div>
            <div>
              <button
                disabled={
                  !coinAmount ||
                  Number(coinAmount) < 200 ||
                  Number(coinAmount) > (user?.coins || 0) ||
                  Number(coinAmount) % 20 !== 0 ||
                  !accountNumber
                }
                className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
              >
                Request Withdraw
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="space-y-2">
        {items.map((w) => (
          <div key={w._id} className="p-3 bg-white rounded shadow">
            {w.withdrawal_coin} coins — ${w.withdrawal_amount} — {w.status}
          </div>
        ))}
      </div>
    </div>
  );
}
