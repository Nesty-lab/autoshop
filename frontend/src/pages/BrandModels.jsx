import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
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

export const demoBrands = [
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

export const demoModels = {
  bmw: [
    { id: 'bmw-3-series', name: '3 Series', image_url: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=900&q=80' },
    { id: 'bmw-5-series', name: '5 Series', image_url: 'https://images.unsplash.com/photo-1494905998402-395d179af9a7?auto=format&fit=crop&w=900&q=80' },
    { id: 'bmw-x5', name: 'X5', image_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80' },
    { id: 'bmw-m3', name: 'M3', image_url: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=900&q=80' },
  ],
  toyota: [
    { id: 'toyota-corolla', name: 'Corolla', image_url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80' },
    { id: 'toyota-camry', name: 'Camry', image_url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80' },
    { id: 'toyota-rav4', name: 'RAV4', image_url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80' },
    { id: 'toyota-prado', name: 'Prado', image_url: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=900&q=80' },
  ],
  mercedes: [
    { id: 'mercedes-c-class', name: 'C-Class', image_url: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=900&q=80' },
    { id: 'mercedes-e-class', name: 'E-Class', image_url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=900&q=80' },
    { id: 'mercedes-glc', name: 'GLC', image_url: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=900&q=80' },
    { id: 'mercedes-gle', name: 'GLE', image_url: 'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&w=900&q=80' },
  ],
  ford: [
    { id: 'ford-focus', name: 'Focus', image_url: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=900&q=80' },
    { id: 'ford-ranger', name: 'Ranger', image_url: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=900&q=80' },
    { id: 'ford-f150', name: 'F-150', image_url: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=900&q=80' },
    { id: 'ford-mustang', name: 'Mustang', image_url: 'https://images.unsplash.com/photo-1494905998402-395d179af9a7?auto=format&fit=crop&w=900&q=80' },
  ],
  honda: [
    { id: 'honda-civic', name: 'Civic', image_url: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=900&q=80' },
    { id: 'honda-accord', name: 'Accord', image_url: 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&w=900&q=80' },
    { id: 'honda-cr-v', name: 'CR-V', image_url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=80' },
    { id: 'honda-hr-v', name: 'HR-V', image_url: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=900&q=80' },
  ],
  audi: [
    { id: 'audi-a3', name: 'A3', image_url: 'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=900&q=80' },
    { id: 'audi-a4', name: 'A4', image_url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80' },
    { id: 'audi-q5', name: 'Q5', image_url: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=900&q=80' },
    { id: 'audi-r8', name: 'R8', image_url: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=900&q=80' },
  ],
  nissan: [
    { id: 'nissan-altima', name: 'Altima', image_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80' },
    { id: 'nissan-sentra', name: 'Sentra', image_url: 'https://images.unsplash.com/photo-1494905998402-395d179af9a7?auto=format&fit=crop&w=900&q=80' },
    { id: 'nissan-patrol', name: 'Patrol', image_url: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=900&q=80' },
    { id: 'nissan-navara', name: 'Navara', image_url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80' },
  ],
  volkswagen: [
    { id: 'vw-golf', name: 'Golf', image_url: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=900&q=80' },
    { id: 'vw-polo', name: 'Polo', image_url: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=900&q=80' },
    { id: 'vw-jetta', name: 'Jetta', image_url: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=900&q=80' },
    { id: 'vw-tiguan', name: 'Tiguan', image_url: 'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=900&q=80' },
  ],
  hyundai: [
    { id: 'hyundai-elantra', name: 'Elantra', image_url: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=900&q=80' },
    { id: 'hyundai-sonata', name: 'Sonata', image_url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=80' },
    { id: 'hyundai-tucson', name: 'Tucson', image_url: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=900&q=80' },
    { id: 'hyundai-creta', name: 'Creta', image_url: 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&w=900&q=80' },
  ],
  kia: [
    { id: 'kia-forte', name: 'Forte', image_url: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=900&q=80' },
    { id: 'kia-optima', name: 'Optima', image_url: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=900&q=80' },
    { id: 'kia-sportage', name: 'Sportage', image_url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80' },
    { id: 'kia-sorento', name: 'Sorento', image_url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80' },
  ],
  tesla: [
    { id: 'tesla-model-3', name: 'Model 3', image_url: 'https://images.unsplash.com/photo-1560958089-b8a3d1e2f8d2?auto=format&fit=crop&w=900&q=80' },
    { id: 'tesla-model-s', name: 'Model S', image_url: 'https://images.unsplash.com/photo-1571388208493-408a0a7d9d8e?auto=format&fit=crop&w=900&q=80' },
    { id: 'tesla-model-x', name: 'Model X', image_url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=900&q=80' },
    { id: 'tesla-model-y', name: 'Model Y', image_url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80' },
  ],
  porsche: [
    { id: 'porsche-911', name: '911', image_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80' },
    { id: 'porsche-cayenne', name: 'Cayenne', image_url: 'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=900&q=80' },
    { id: 'porsche-macan', name: 'Macan', image_url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=900&q=80' },
    { id: 'porsche-panthera', name: 'Panth.', image_url: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=900&q=80' },
  ],
}

export default function BrandModels() {
  const { brandId } = useParams()
  const [brand, setBrand] = useState(null)
  const [models, setModels] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (!isSupabaseConfigured) {
        const matchingBrand = demoBrands.find((item) => item.id === brandId) || demoBrands[0]
        setBrand(matchingBrand)
        setModels(demoModels[matchingBrand.id] || [])
        setLoading(false)
        return
      }

      try {
        const [{ data: brandData }, { data: modelData, error }] = await Promise.all([
          supabase.from('brands').select('*').eq('id', brandId).single(),
          supabase.from('models').select('*').eq('brand_id', brandId).order('name'),
        ])

        if (error) {
          console.error('Model load failed:', error)
          const matchingBrand = demoBrands.find((item) => item.id === brandId) || demoBrands[0]
          setBrand(matchingBrand)
          setModels(demoModels[matchingBrand.id] || [])
        } else {
          setBrand({
            ...brandData,
            logo_url: brandData?.logo_url || createBrandLogo(brandData?.name || 'Car', '#ff9900'),
          })
          setModels(modelData || [])
        }
      } catch (error) {
        console.error('Brand model fetch failed:', error)
        const matchingBrand = demoBrands.find((item) => item.id === brandId) || demoBrands[0]
        setBrand(matchingBrand)
        setModels(demoModels[matchingBrand.id] || [])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [brandId])

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-10">Loading...</div>

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#1d1d1d] max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8 flex items-center gap-4">
        <BrandLogo name={brand?.name || 'Car'} src={brand?.logo_url} className="h-16 w-16 rounded-2xl" />
        <div>
          <p className="text-sm font-semibold text-ignition">Choose your car model</p>
          <h1 className="text-3xl">{brand?.name} Models</h1>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
        {models.map((model) => (
          <Link key={model.id} to={`/models/${model.id}`} className="card">
            <div className="aspect-video bg-steel">
              {model.image_url ? (
                <img src={model.image_url} alt={model.name} className="w-full h-full object-cover" onError={(event) => { event.target.src = createBrandLogo(brand?.name || 'Car', '#ff9900') }} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-chrome/40 text-sm">No image</div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-display font-semibold">{model.name}</h3>
            </div>
          </Link>
        ))}
        {models.length === 0 && <p className="text-chrome/50 col-span-full">No models added for this brand yet.</p>}
      </div>
    </div>
  )
}
