import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";

export default function Sidebar() {
  const { user } = useContext(AuthContext);
  const role = user?.role || "worker";

  return (
    <aside className="w-64 bg-white border-r hidden md:block">
      <div className="p-4 flex items-center space-x-3">
        <img
          src={user?.avatar || "/logo192.png"}
          alt="avatar"
          className="w-10 h-10 rounded-full"
        />
        <div>
          <div className="font-bold">{user?.name || "Guest"}</div>
          <div className="text-sm text-gray-600">{role}</div>
        </div>
        <div className="ml-auto font-semibold">Coins: {user?.coins ?? 0}</div>
      </div>
      <nav className="p-4 space-y-2">
        <Link to="/dashboard" className="block">
          Home
        </Link>
        <Link to="/dashboard/tasks" className="block">
          Task List
        </Link>
        {role === "buyer" && (
          <>
            <Link to="/dashboard/create" className="block">
              Add New Task
            </Link>
            <Link to="/dashboard/purchase" className="block">
              Purchase Coin
            </Link>
            <Link to="/dashboard/payment-history" className="block">
              Payment History
            </Link>
          </>
        )}
        {role === "worker" && (
          <>
            <Link to="/dashboard/submissions" className="block">
              My Submissions
            </Link>
            <Link to="/dashboard/tasks" className="block">
              My Tasks
            </Link>
            <Link to="/dashboard/withdrawals" className="block">
              Withdrawals
            </Link>
          </>
        )}
        {role === "admin" && (
          <>
            <Link to="/dashboard/manage-users" className="block">
              Manage Users
            </Link>
            <Link to="/dashboard/manage-tasks" className="block">
              Manage Tasks
            </Link>
          </>
        )}
      </nav>
    </aside>
  );
}
