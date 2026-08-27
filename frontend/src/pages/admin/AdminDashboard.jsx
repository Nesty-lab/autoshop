import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function AdminDashboard() {
  const { signOut } = useAuth()

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl">Admin Dashboard</h1>
        <button onClick={signOut} className="text-sm text-chrome/60 hover:text-ignition">Sign out</button>
      </div>

      <div className="flex gap-3 mb-8 border-b border-steel pb-4 flex-wrap">
        <Link to="/admin/brands" className="btn-outline text-sm py-2 px-4">Brands</Link>
        <Link to="/admin/models" className="btn-outline text-sm py-2 px-4">Models</Link>
        <Link to="/admin/parts" className="btn-outline text-sm py-2 px-4">Parts &amp; Images</Link>
        <Link to="/admin/orders" className="btn-outline text-sm py-2 px-4">Orders</Link>
        <Link to="/admin/support" className="btn-outline text-sm py-2 px-4">Support Inbox</Link>
      </div>

      <Outlet />
    </div>
  )
}
