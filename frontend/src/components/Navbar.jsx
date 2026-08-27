import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { itemCount } = useCart()
  const { user, signOut } = useAuth()
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  function handleSearch(e) {
    e.preventDefault()
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-[#e5e5e5]">
      <div className="top-strip">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between text-[11px]">
          <span>Sell on Dave</span>
          <div className="hidden sm:flex items-center gap-4">
            <span>Customer Care</span>
            <span>Track Order</span>
            <span>Download App</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center shrink-0">
            <span className="text-2xl font-black tracking-tight text-[#ff9900]">DAVE</span>
          </Link>

          <form onSubmit={handleSearch} className="flex-1 min-w-[200px] flex items-center gap-2">
            <div className="relative flex-1">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for car parts, tyres, batteries..."
                className="search-input pr-12"
              />
            </div>
            <button type="submit" className="btn-primary rounded-full px-5 py-3 whitespace-nowrap">
              Search
            </button>
          </form>

          <button
            type="button"
            aria-label="Toggle navigation menu"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#e5e5e5] text-xl text-[#2d2d2d] lg:hidden"
          >
            {menuOpen ? '×' : '☰'}
          </button>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#2d2d2d]">
            {[['/', 'Home'], ['/brands', 'Categories'], ['/search?q=parts', 'Products'], ['/support', 'Support']].map(([to, label]) => (
              <NavLink key={to} to={to} className={({ isActive }) => isActive ? 'font-bold text-[#ff9900]' : 'hover:text-[#ff9900]'}>{label}</NavLink>
            ))}
            <NavLink to="/cart" className={({ isActive }) => `relative inline-flex items-center gap-2 ${isActive ? 'font-bold text-[#ff9900]' : 'hover:text-[#ff9900]'}`}>
              Cart
              {itemCount > 0 && (
                <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#ff9900] px-1 text-[10px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </NavLink>
            {user ? (
              <button onClick={signOut} className="hover:text-[#ff9900]">Sign out</button>
            ) : (
              <Link to="/login" className="hover:text-[#ff9900]">Sign in</Link>
            )}
          </nav>
        </div>

        <nav className={`${menuOpen ? 'flex' : 'hidden'} mt-3 flex-col gap-1 border-t border-[#f0f0f0] pt-3 text-sm text-[#4d4d4d] lg:hidden`}>
          {[['/', 'Home'], ['/brands', 'Categories'], ['/search?q=parts', 'Products'], ['/support', 'Support'], ['/cart', 'Cart']].map(([to, label]) => (
            <NavLink key={to} to={to} onClick={() => setMenuOpen(false)} className={({ isActive }) => `rounded-xl px-3 py-3 font-semibold ${isActive ? 'bg-[#fff3dd] text-[#d97900]' : 'hover:bg-[#f5f5f5]'}`}>{label}</NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
