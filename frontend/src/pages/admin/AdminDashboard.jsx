import { NavLink, Link, Outlet, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

export default function AdminDashboard() {
  const { signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const navigation = [
    { to: '/admin', label: 'Overview', icon: '⌂', end: true },
    { to: '/admin/brands', label: 'Categories', icon: '◇' },
    { to: '/admin/models', label: 'Car models', icon: '▣' },
    { to: '/admin/parts', label: 'Parts & images', icon: '◈' },
    { to: '/admin/orders', label: 'Orders', icon: '□' },
    { to: '/admin/support', label: 'Support inbox', icon: '✉' },
  ]

  const currentPage = navigation.find((item) => item.end ? location.pathname === item.to : location.pathname.startsWith(item.to))

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-[#27303a]">
      {menuOpen && <button aria-label="Close menu" onClick={closeMenu} className="fixed inset-0 z-30 bg-[#101820]/50 lg:hidden" />}

      <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-[#101820] text-white shadow-2xl transition-transform duration-200 lg:translate-x-0 ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-3 border-b border-white/10 px-7 py-7">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ff9900] text-xl font-black text-white">D</div>
          <div>
            <p className="text-lg font-black tracking-tight">Dave</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">Admin workspace</p>
          </div>
        </div>

        <div className="px-5 py-7">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">Manage store</p>
          <nav className="space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={closeMenu}
                className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors ${isActive ? 'bg-[#ff9900] text-white shadow-lg shadow-[#ff9900]/20' : 'text-white/65 hover:bg-white/10 hover:text-white'}`}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-base">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-auto space-y-2 border-t border-white/10 p-5">
          <Link to="/" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-white/65 hover:bg-white/10 hover:text-white">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10">↗</span>
            View storefront
          </Link>
          <button onClick={signOut} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-white/65 hover:bg-red-500/15 hover:text-red-300">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10">⇥</span>
            Sign out
          </button>
        </div>
      </aside>

      <main className="min-h-screen lg:pl-72">
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-[#e1e6ea] bg-white/95 px-5 shadow-sm backdrop-blur md:px-10">
          <div className="flex items-center gap-4">
            <button aria-label="Open menu" onClick={() => setMenuOpen(true)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#dce2e7] text-xl text-[#27303a] lg:hidden">☰</button>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#ff9900]">Admin panel</p>
              <h1 className="text-xl font-black text-[#16212b] md:text-2xl">{currentPage?.label || 'Admin dashboard'}</h1>
            </div>
          </div>
          <div className="hidden items-center gap-3 sm:flex">
            <span className="rounded-full bg-[#e9f7ee] px-3 py-2 text-xs font-bold text-[#247a40]">Store online</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff0d5] font-black text-[#c26c00]">A</div>
          </div>
        </header>

        <section className="px-5 py-7 md:px-10 md:py-10">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </section>
      </main>
    </div>
  )
}
