import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'
import ProductCard from '../components/ProductCard'

const demoModelLookup = {
  'bmw-3-series': { id: 'bmw-3-series', name: '3 Series', brands: { name: 'BMW' }, image_url: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=900&q=80' },
  'bmw-5-series': { id: 'bmw-5-series', name: '5 Series', brands: { name: 'BMW' }, image_url: 'https://images.unsplash.com/photo-1494905998402-395d179af9a7?auto=format&fit=crop&w=900&q=80' },
  'bmw-x5': { id: 'bmw-x5', name: 'X5', brands: { name: 'BMW' }, image_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80' },
  'bmw-m3': { id: 'bmw-m3', name: 'M3', brands: { name: 'BMW' }, image_url: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=900&q=80' },
  'ford-ranger': { id: 'ford-ranger', name: 'Ranger', brands: { name: 'Ford' }, image_url: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=900&q=80' },
  'ford-f150': { id: 'ford-f150', name: 'F-150', brands: { name: 'Ford' }, image_url: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=900&q=80' },
  'toyota-camry': { id: 'toyota-camry', name: 'Camry', brands: { name: 'Toyota' }, image_url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80' },
  'toyota-rav4': { id: 'toyota-rav4', name: 'RAV4', brands: { name: 'Toyota' }, image_url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80' },
  'mercedes-c-class': { id: 'mercedes-c-class', name: 'C-Class', brands: { name: 'Mercedes-Benz' }, image_url: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=900&q=80' },
  'mercedes-glc': { id: 'mercedes-glc', name: 'GLC', brands: { name: 'Mercedes-Benz' }, image_url: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=900&q=80' },
  'honda-civic': { id: 'honda-civic', name: 'Civic', brands: { name: 'Honda' }, image_url: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=900&q=80' },
  'honda-cr-v': { id: 'honda-cr-v', name: 'CR-V', brands: { name: 'Honda' }, image_url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=80' },
  'audi-a4': { id: 'audi-a4', name: 'A4', brands: { name: 'Audi' }, image_url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80' },
  'audi-q5': { id: 'audi-q5', name: 'Q5', brands: { name: 'Audi' }, image_url: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=900&q=80' },
  'nissan-patrol': { id: 'nissan-patrol', name: 'Patrol', brands: { name: 'Nissan' }, image_url: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=900&q=80' },
  'nissan-navara': { id: 'nissan-navara', name: 'Navara', brands: { name: 'Nissan' }, image_url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80' },
  'vw-golf': { id: 'vw-golf', name: 'Golf', brands: { name: 'Volkswagen' }, image_url: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=900&q=80' },
  'vw-tiguan': { id: 'vw-tiguan', name: 'Tiguan', brands: { name: 'Volkswagen' }, image_url: 'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=900&q=80' },
  'hyundai-tucson': { id: 'hyundai-tucson', name: 'Tucson', brands: { name: 'Hyundai' }, image_url: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=900&q=80' },
  'hyundai-creta': { id: 'hyundai-creta', name: 'Creta', brands: { name: 'Hyundai' }, image_url: 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&w=900&q=80' },
  'kia-sportage': { id: 'kia-sportage', name: 'Sportage', brands: { name: 'Kia' }, image_url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80' },
  'kia-sorento': { id: 'kia-sorento', name: 'Sorento', brands: { name: 'Kia' }, image_url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80' },
  'tesla-model-3': { id: 'tesla-model-3', name: 'Model 3', brands: { name: 'Tesla' }, image_url: 'https://images.unsplash.com/photo-1560958089-b8a3d1e2f8d2?auto=format&fit=crop&w=900&q=80' },
  'tesla-model-y': { id: 'tesla-model-y', name: 'Model Y', brands: { name: 'Tesla' }, image_url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80' },
  'porsche-911': { id: 'porsche-911', name: '911', brands: { name: 'Porsche' }, image_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80' },
  'porsche-cayenne': { id: 'porsche-cayenne', name: 'Cayenne', brands: { name: 'Porsche' }, image_url: 'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=900&q=80' },
}

const demoPartsByModel = {
  'ford-ranger': [
    { id: 'ranger-brake-pad', name: 'Front Brake Pad Kit', description: 'High-performance pads for smoother braking, less dust, and improved stopping power.', price: 320, stock_quantity: 12, image_url: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=900&q=80', is_available: true },
    { id: 'ranger-headlight', name: 'LED Headlight Assembly', description: 'Bright, road-ready LED upgrade for safer night driving and better visibility.', price: 680, stock_quantity: 8, image_url: 'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&w=900&q=80', is_available: true },
    { id: 'ranger-wiper', name: 'Windshield Wiper Set', description: 'Quiet operation and durable wiping performance for rainy driving.', price: 140, stock_quantity: 18, image_url: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=900&q=80', is_available: true },
    { id: 'ranger-clutch', name: 'Clutch Kit', description: 'Reliable clutch replacement for smooth gear transitions and better control.', price: 870, stock_quantity: 5, image_url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80', is_available: true },
    { id: 'ranger-battery', name: 'Battery Pack', description: 'Long-life automotive battery designed for dependable ignition and power output.', price: 410, stock_quantity: 10, image_url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80', is_available: true },
    { id: 'ranger-suspension', name: 'Rear Shock Absorber', description: 'Improves ride comfort and keeps the vehicle stable on uneven roads.', price: 390, stock_quantity: 7, image_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80', is_available: true },
  ],
  'bmw-3-series': [
    { id: 'bmw-brake-pad', name: 'Ceramic Brake Pad Set', description: 'Low-noise ceramic pads for confident braking and clean wheel finish.', price: 360, stock_quantity: 15, image_url: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=900&q=80', is_available: true },
    { id: 'bmw-air-filter', name: 'Cabin Air Filter', description: 'Improves cabin airflow and air quality with quick fit installation.', price: 95, stock_quantity: 20, image_url: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=900&q=80', is_available: true },
    { id: 'bmw-screen', name: 'Windshield Glass', description: 'Original replacement glass for clearer vision and strong weather protection.', price: 820, stock_quantity: 4, image_url: 'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&w=900&q=80', is_available: true },
    { id: 'bmw-spark', name: 'Spark Plug Set', description: 'Optimized ignition for smooth starts and consistent engine performance.', price: 120, stock_quantity: 24, image_url: 'https://images.unsplash.com/photo-1494905998402-395d179af9a7?auto=format&fit=crop&w=900&q=80', is_available: true },
  ],
  'toyota-camry': [
    { id: 'camry-brake', name: 'Brake Rotor Set', description: 'Heat-resistant rotors for stable braking under city and highway driving.', price: 430, stock_quantity: 11, image_url: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=900&q=80', is_available: true },
    { id: 'camry-battery', name: 'Drive Battery', description: 'High-output battery made for long driving cycles and reliable starts.', price: 340, stock_quantity: 14, image_url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80', is_available: true },
    { id: 'camry-fan', name: 'Cooling Fan Assembly', description: 'Keeps engine temperatures stable and supports long-distance reliability.', price: 480, stock_quantity: 9, image_url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80', is_available: true },
  ],
  'mercedes-c-class': [
    { id: 'merc-suspension', name: 'Suspension Kit', description: 'Balanced ride control with durable parts built for comfort and road stability.', price: 700, stock_quantity: 6, image_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80', is_available: true },
    { id: 'merc-headlight', name: 'Headlight Unit', description: 'Premium lighting solution for sharper visibility and a sharp road look.', price: 760, stock_quantity: 5, image_url: 'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&w=900&q=80', is_available: true },
    { id: 'merc-bumper', name: 'Front Bumper', description: 'Strong front-end replacement part with precise fitment and protection.', price: 640, stock_quantity: 4, image_url: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=900&q=80', is_available: true },
  ],
  'honda-civic': [
    { id: 'civic-brake', name: 'Brake Pad Set', description: 'Daily-driving brake pad set with dependable grip and control.', price: 290, stock_quantity: 17, image_url: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=900&q=80', is_available: true },
    { id: 'civic-filter', name: 'Engine Oil Filter', description: 'Improves engine performance by keeping contaminants out of the lubrication system.', price: 60, stock_quantity: 28, image_url: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=900&q=80', is_available: true },
    { id: 'civic-battery', name: 'Starter Battery', description: 'Long-run battery with efficient power delivery for everyday reliability.', price: 320, stock_quantity: 10, image_url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80', is_available: true },
  ],
  'audi-a4': [
    { id: 'a4-screen', name: 'Windshield Panel', description: 'Tough replacement glass with clear vision and safe drive assurance.', price: 760, stock_quantity: 5, image_url: 'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&w=900&q=80', is_available: true },
    { id: 'a4-brake', name: 'Brake Disc Kit', description: 'Better stopping power with smooth operation and longer life.', price: 480, stock_quantity: 8, image_url: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=900&q=80', is_available: true },
    { id: 'a4-light', name: 'Front Lamp Set', description: 'High-clarity front lamps for night visibility and a premium look.', price: 690, stock_quantity: 6, image_url: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=900&q=80', is_available: true },
  ],
}

export default function ModelParts() {
  const { modelId } = useParams()
  const [model, setModel] = useState(null)
  const [parts, setParts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (!isSupabaseConfigured) {
        const fallbackModel = demoModelLookup[modelId] || { id: modelId, name: modelId.replace(/-/g, ' '), brands: { name: 'Car Model' } }
        setModel(fallbackModel)
        setParts(demoPartsByModel[modelId] || [])
        setLoading(false)
        return
      }

      try {
        const [{ data: modelData }, { data: partsData }] = await Promise.all([
          supabase.from('models').select('*, brands(name)').eq('id', modelId).single(),
          supabase.from('parts').select('*').eq('model_id', modelId).order('name'),
        ])

        setModel(modelData || demoModelLookup[modelId])
        setParts(partsData && partsData.length ? partsData : (demoPartsByModel[modelId] || []))
      } catch (error) {
        console.error('Model part load failed:', error)
        setModel(demoModelLookup[modelId] || { id: modelId, name: modelId.replace(/-/g, ' '), brands: { name: 'Car Model' } })
        setParts(demoPartsByModel[modelId] || [])
      }

      setLoading(false)
    }
    load()
  }, [modelId])

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-10">Loading...</div>

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#1d1d1d] max-w-7xl mx-auto px-4 py-10">
      {model?.image_url && (
        <div className="mb-6 overflow-hidden rounded-3xl border border-[#e5e5e5] bg-white shadow-sm">
          <img src={model.image_url} alt={model?.name} className="h-64 w-full object-cover md:h-80" />
        </div>
      )}

      <p className="text-ignition text-sm font-semibold">{model?.brands?.name}</p>
      <h1 className="text-3xl mb-8">{model?.name} Parts</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
        {parts.map((part) => (
          <ProductCard key={part.id} part={part} />
        ))}
        {parts.length === 0 && <p className="text-chrome/50 col-span-full">No parts listed for this model yet.</p>}
      </div>
    </div>
  )
}
