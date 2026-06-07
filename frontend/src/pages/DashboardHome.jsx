import Sidebar from "../components/Sidebar";
import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { Routes, Route } from "react-router-dom";
import BuyerHome from "./buyer/BuyerHome";
import AddTask from "./buyer/AddTask";
import MyTasks from "./buyer/MyTasks";
import TaskReview from "./buyer/TaskReview";
import PurchaseCoin from "./buyer/PurchaseCoin";
import PaymentHistory from "./buyer/PaymentHistory";

import WorkerHome from "./worker/WorkerHome";
import TaskList from "./worker/TaskList";
import TaskDetails from "./worker/TaskDetails";
import MySubmissions from "./worker/MySubmissions";
import Withdrawals from "./worker/Withdrawals";
import AdminDashboard from "./admin/AdminDashboard";
import ManageUsers from "./admin/ManageUsers";
import ManageTasks from "./admin/ManageTasks";

export default function DashboardHome() {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <img src="/logo192.png" alt="logo" className="w-12 h-12" />
            <div>
              <div className="text-sm text-gray-500">Available coin</div>
              <div className="text-xl font-bold">{user?.coins ?? 0}</div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-gray-500">
                {user?.role || "Guest"}
              </div>
              <div className="font-semibold">{user?.name || user?.email}</div>
            </div>
            <img
              src={user?.avatar || "/logo192.png"}
              alt="user"
              className="w-12 h-12 rounded-full"
            />
          </div>
        </header>

        <Routes>
          {user?.role === "worker" ? (
            <>
              <Route path="/" element={<WorkerHome />} />
              <Route path="" element={<WorkerHome />} />
              <Route path="tasks" element={<TaskList />} />
              <Route path="tasks/:id" element={<TaskDetails />} />
              <Route path="submissions" element={<MySubmissions />} />
              <Route path="withdrawals" element={<Withdrawals />} />
            </>
          ) : user?.role === "admin" ? (
            <>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="" element={<AdminDashboard />} />
              <Route path="manage-users" element={<ManageUsers />} />
              <Route path="manage-tasks" element={<ManageTasks />} />
            </>
          ) : (
            <>
              <Route path="/" element={<BuyerHome />} />
              <Route path="" element={<BuyerHome />} />
              <Route path="tasks" element={<MyTasks />} />
              <Route path="create" element={<AddTask />} />
              <Route path="submissions" element={<TaskReview />} />
              <Route path="purchase" element={<PurchaseCoin />} />
              <Route path="payment-history" element={<PaymentHistory />} />
            </>
          )}
        </Routes>
      </main>
    </div>
  );
}
