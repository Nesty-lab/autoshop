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

export default function Brands() {
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setBrands(demoBrands)
      setLoading(false)
      return
    }

    supabase
      .from('brands')
      .select('*')
      .order('name')
      .then(({ data, error }) => {
        if (error) {
          console.error('Failed to load brands:', error)
          setBrands(demoBrands)
        } else {
          const availableBrands = data && data.length ? data : demoBrands
          setBrands(availableBrands.map((brand) => ({
            ...brand,
            logo_url: brand.logo_url || createBrandLogo(brand.name),
          })))
        }
        setLoading(false)
      })
      .catch((error) => {
        console.error('Brand fetch failed:', error)
        setBrands(demoBrands)
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#1d1d1d] max-w-7xl mx-auto px-4 py-10">
      <h1 className="mb-8 text-3xl !text-[#1d1d1d]">All Brands</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {brands.map((brand) => (
            <Link key={brand.id} to={`/brands/${brand.id}`} className="card flex flex-col items-center justify-center p-6 gap-3">
              <BrandLogo name={brand.name} src={brand.logo_url} />
              <span className="font-display font-semibold !text-[#1d1d1d]">{brand.name}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
