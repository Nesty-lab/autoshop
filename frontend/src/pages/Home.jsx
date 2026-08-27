import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'
import BrandLogo from '../components/BrandLogo'

const createBrandLogo = (name, accent = '#ff9900') => {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
      <rect width="120" height="120" rx="26" fill="#fff7e8"/>
      <circle cx="60" cy="60" r="42" fill="${accent}" opacity="0.12"/>
      <path d="M20 76c16-22 34-32 40-32 14 0 28 8 40 22v12H20V76z" fill="${accent}" opacity="0.18"/>
      <text x="60" y="68" text-anchor="middle" dominant-baseline="middle" font-size="32" font-weight="700" fill="${accent}" font-family="Arial, sans-serif">${initials}</text>
    </svg>
  `

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

const demoBrands = [
  { id: 'bmw', name: 'BMW', logo_url: createBrandLogo('BMW', '#1d3557') },
  { id: 'toyota', name: 'Toyota', logo_url: createBrandLogo('Toyota', '#d62828') },
  { id: 'mercedes', name: 'Mercedes-Benz', logo_url: createBrandLogo('Mercedes', '#0d1b2a') },
  { id: 'ford', name: 'Ford', logo_url: createBrandLogo('Ford', '#1d4ed8') },
  { id: 'honda', name: 'Honda', logo_url: createBrandLogo('Honda', '#ef4444') },
  { id: 'audi', name: 'Audi', logo_url: createBrandLogo('Audi', '#111827') },
  { id: 'nissan', name: 'Nissan', logo_url: createBrandLogo('Nissan', '#f59e0b') },
  { id: 'volkswagen', name: 'Volkswagen', logo_url: createBrandLogo('VW', '#2563eb') },
  { id: 'hyundai', name: 'Hyundai', logo_url: createBrandLogo('Hyundai', '#0f766e') },
  { id: 'kia', name: 'Kia', logo_url: createBrandLogo('Kia', '#ef4444') },
  { id: 'tesla', name: 'Tesla', logo_url: createBrandLogo('Tesla', '#ef4444') },
  { id: 'porsche', name: 'Porsche', logo_url: createBrandLogo('Porsche', '#b91c1c') },
  { id: 'lexus', name: 'Lexus', logo_url: createBrandLogo('Lexus', '#6d28d9') },
  { id: 'mazda', name: 'Mazda', logo_url: createBrandLogo('Mazda', '#f97316') },
  { id: 'subaru', name: 'Subaru', logo_url: createBrandLogo('Subaru', '#0ea5e9') },
  { id: 'jeep', name: 'Jeep', logo_url: createBrandLogo('Jeep', '#a16207') },
  { id: 'chevrolet', name: 'Chevrolet', logo_url: createBrandLogo('Chevy', '#dc2626') },
  { id: 'volvo', name: 'Volvo', logo_url: createBrandLogo('Volvo', '#2563eb') },
  { id: 'mitsubishi', name: 'Mitsubishi', logo_url: createBrandLogo('Mitsubishi', '#ea580c') },
  { id: 'land-rover', name: 'Land Rover', logo_url: createBrandLogo('Land', '#b45309') },
]

const demoProducts = [
  { id: 'p1', name: 'Premium Brake Pad Kit', price: 340.0, image_url: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=800&q=80', is_available: true, stock_quantity: 12 },
  { id: 'p2', name: 'High-Performance Battery', price: 260.0, image_url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80', is_available: true, stock_quantity: 20 },
  { id: 'p3', name: 'LED Headlight Assembly', price: 520.0, image_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80', is_available: true, stock_quantity: 10 },
  { id: 'p4', name: 'Air Filter Combo', price: 89.0, image_url: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=800&q=80', is_available: true, stock_quantity: 30 },
]

export default function Home() {
  const [brands, setBrands] = useState([])
  const [featuredParts, setFeaturedParts] = useState([])

  useEffect(() => {
    async function loadHomeData() {
      if (!isSupabaseConfigured) {
        setBrands(demoBrands)
        setFeaturedParts(demoProducts)
        return
      }

      try {
        const [{ data: brandData }, { data: partsData }] = await Promise.all([
          supabase.from('brands').select('*').order('name'),
          supabase.from('parts').select('*, models(name, brands(name))').order('created_at', { ascending: false }),
        ])

        setBrands((brandData && brandData.length ? brandData : demoBrands).map((brand) => ({
          ...brand,
          logo_url: brand.logo_url || createBrandLogo(brand.name),
        })))
        setFeaturedParts(partsData && partsData.length ? partsData : demoProducts)
      } catch (error) {
        console.error('Home data loading failed:', error)
        setBrands(demoBrands)
        setFeaturedParts(demoProducts)
      }
    }

    loadHomeData()
  }, [])

  return (
    <div className="storefront-page pb-10">
      <section className="hero-card px-4 py-8 md:py-12">
        <div className="max-w-7xl mx-auto grid gap-6 lg:grid-cols-[1.35fr_0.65fr] items-center">
          <div className="rounded-[28px] bg-[#fffaf1] border border-[#f8ddb0] p-6 md:p-10 shadow-sm">
            <span className="tag-chip">Flash sales</span>
            <h1 className="mt-5 text-4xl md:text-5xl font-black leading-tight text-[#1d1d1d]">
              Buy the parts your ride needs, without the stress.
            </h1>
            <p className="mt-4 max-w-xl text-base text-[#5b5b5b]">
              Genuine car parts, trusted brands, fast delivery, and simple checkout — all in one storefront.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link to="/brands" className="btn-primary">Shop now</Link>
              <Link to="/support" className="btn-outline">Need help?</Link>
            </div>
            <div className="mt-7 flex flex-wrap gap-5 text-sm text-[#4d4d4d]">
              <span>🚚 Free delivery above GHS 250</span>
              <span>🛡️ Genuine parts</span>
              <span>💬 24/7 support</span>
            </div>
          </div>

          <div className="rounded-[28px] bg-white p-5 border border-[#e5e5e5] shadow-sm">
            <div className="deal-banner rounded-2xl p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8a5b00]">Weekend deal</p>
              <h2 className="mt-2 text-3xl font-black text-[#1d1d1d]">Up to 45% off</h2>
              <p className="mt-2 text-sm text-[#5b5b5b]">Tyres, batteries, filters and more.</p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {featuredParts.slice(0, 2).map((product) => (
                <div key={product.id} className="card p-2">
                  <img src={product.image_url || 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=800&q=80'} alt={product.name} className="h-24 w-full rounded-lg object-cover" />
                  <div className="mt-2">
                    <p className="text-xs font-semibold text-[#1d1d1d] line-clamp-2">{product.name}</p>
                    <p className="mt-1 text-sm font-bold price-text">GHS {Number(product.price).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 mt-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="section-kicker">Find the right fit</p>
            <h2 className="section-title">Shop by car brand</h2>
          </div>
          <Link to="/brands" className="text-sm font-bold text-[#ff9900]">View all</Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {brands.map((brand) => (
            <Link key={brand.id} to={`/brands/${brand.id}`} className="category-tile">
              <BrandLogo name={brand.name} src={brand.logo_url} className="h-12 w-12 rounded-full" />
              <span className="font-bold !text-[#1d1d1d]">{brand.name}</span>
            </Link>
          ))}
          {brands.length === 0 && (
            <p className="text-[#757575] col-span-full">No categories yet — check back soon.</p>
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 mt-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="section-kicker">Ready for the road</p>
            <h2 className="section-title">Featured parts</h2>
          </div>
          <Link to="/brands" className="text-sm font-bold text-[#ff9900]">See more</Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featuredParts.map((product) => (
            <div key={product.id} className="product-card">
              <div className="relative aspect-square bg-[#f8f8f8]">
                <img src={product.image_url || 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=800&q=80'} alt={product.name} className="h-full w-full object-cover" />
                <span className="badge-discount">-15%</span>
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-[#1d1d1d]">{product.name}</p>
                <div className="mt-2 flex items-center gap-2 text-xs text-[#757575]">
                  <span>⭐ 4.8</span>
                  <span>•</span>
                  <span>{product.models?.brands?.name || 'Top brand'}</span>
                </div>
                <div className="mt-3 flex items-end justify-between gap-2">
                  <div>
                    <p className="text-xl font-bold price-text">GHS {Number(product.price).toFixed(2)}</p>
                    <p className="text-[11px] text-[#757575] line-through">GHS {(Number(product.price) * 1.2).toFixed(2)}</p>
                  </div>
                  <Link to="/cart" className="btn-primary rounded-full px-3 py-2 text-xs">Add</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
