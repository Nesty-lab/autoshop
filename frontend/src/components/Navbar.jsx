import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { itemCount } = useCart()
  const { user, signOut } = useAuth()
  const [query, setQuery] = useState('')
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

          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#2d2d2d]">
            <Link to="/" className="hover:text-[#ff9900]">Home</Link>
            <Link to="/brands" className="hover:text-[#ff9900]">Categories</Link>
            <Link to="/search?q=parts" className="hover:text-[#ff9900]">Products</Link>
            <Link to="/support" className="hover:text-[#ff9900]">Support</Link>
            <Link to="/cart" className="relative inline-flex items-center gap-2 hover:text-[#ff9900]">
              Cart
              {itemCount > 0 && (
                <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#ff9900] px-1 text-[10px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </Link>
            {user ? (
              <button onClick={signOut} className="hover:text-[#ff9900]">Sign out</button>
            ) : (
              <Link to="/login" className="hover:text-[#ff9900]">Sign in</Link>
            )}
          </nav>
        </div>

        <nav className="mt-3 flex flex-wrap items-center gap-3 overflow-x-auto pb-1 text-sm text-[#4d4d4d] lg:hidden">
          <Link to="/" className="rounded-full bg-[#fff3dd] px-3 py-1.5 font-medium text-[#1d1d1d]">Home</Link>
          <Link to="/brands" className="rounded-full hover:bg-[#f5f5f5] px-3 py-1.5">Categories</Link>
          <Link to="/search?q=parts" className="rounded-full hover:bg-[#f5f5f5] px-3 py-1.5">Products</Link>
          <Link to="/support" className="rounded-full hover:bg-[#f5f5f5] px-3 py-1.5">Support</Link>
          <Link to="/cart" className="rounded-full hover:bg-[#f5f5f5] px-3 py-1.5">Cart</Link>
        </nav>
      </div>
    </header>
  )
}
