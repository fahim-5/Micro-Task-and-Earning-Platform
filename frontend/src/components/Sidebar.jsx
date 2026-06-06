import { Link } from 'react-router-dom'

export default function Sidebar({ role = 'worker' }) {
  return (
    <aside className="w-64 bg-white border-r hidden md:block">
      <div className="p-4"> 
        <h3 className="font-bold">Dashboard</h3>
      </div>
      <nav className="p-4 space-y-2">
        <Link to="/dashboard" className="block">Home</Link>
        <Link to="/dashboard/tasks" className="block">Tasks</Link>
        {role === 'buyer' && (
          <>
            <Link to="/dashboard/create" className="block">Create Task</Link>
            <Link to="/dashboard/purchase" className="block">Purchase Coins</Link>
          </>
        )}
        {role === 'admin' && (
          <>
            <Link to="/admin/users" className="block">User Management</Link>
            <Link to="/admin/reports" className="block">Reports</Link>
          </>
        )}
      </nav>
    </aside>
  )
}
