import Sidebar from '../components/Sidebar'

export default function DashboardHome() {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold">Dashboard Home</h1>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white shadow">Total Earnings: $0</div>
          <div className="p-4 bg-white shadow">Available Tasks: 0</div>
          <div className="p-4 bg-white shadow">Pending Reviews: 0</div>
        </div>
      </main>
    </div>
  )
}
