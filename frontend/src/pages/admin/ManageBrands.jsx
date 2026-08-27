import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

function fallbackLogo(name) {
  const initials = name.slice(0, 2).toUpperCase()
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect width="120" height="120" rx="24" fill="#fff7e8"/><circle cx="60" cy="60" r="40" fill="#ff9900" opacity=".16"/><text x="60" y="68" text-anchor="middle" font-size="30" font-weight="700" fill="#ff9900" font-family="Arial">${initials}</text></svg>`
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

export default function ManageBrands() {
  const [brands, setBrands] = useState([])
  const [name, setName] = useState('')
  const [logoFile, setLogoFile] = useState(null)
  const [saving, setSaving] = useState(false)

  async function loadBrands() {
    const { data } = await supabase.from('brands').select('*').order('name')
    setBrands(data || [])
  }

  useEffect(() => {
    loadBrands()
  }, [])

  async function handleAdd(e) {
    e.preventDefault()
    setSaving(true)

    let logo_url = null
    if (logoFile) {
      const path = `brands/${name.toLowerCase().replace(/\s+/g, '-')}.png`
      await supabase.storage.from('part-images').upload(path, logoFile, { upsert: true })
      const { data } = supabase.storage.from('part-images').getPublicUrl(path)
      logo_url = data.publicUrl
    }

    await supabase.from('brands').insert({ name, logo_url })
    setName('')
    setLogoFile(null)
    setSaving(false)
    loadBrands()
  }

  async function handleDelete(id) {
    if (!confirm('Delete this brand and all its models/parts?')) return
    await supabase.from('brands').delete().eq('id', id)
    loadBrands()
  }

  return (
    <div>
      <form onSubmit={handleAdd} className="card p-6 mb-8 space-y-4 max-w-lg">
        <h2 className="font-display font-semibold text-lg">Add Brand</h2>
        <input required placeholder="Brand name (e.g. BMW)" value={name} onChange={(e) => setName(e.target.value)}
          className="w-full bg-carbon border border-steel rounded-sm px-4 py-3 focus:outline-none focus:border-ignition" />
        <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files[0])}
          className="w-full text-sm text-chrome/70" />
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
          {saving ? 'Saving...' : 'Add Brand'}
        </button>
      </form>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {brands.map((brand) => (
          <div key={brand.id} className="card p-4 flex flex-col items-center gap-2">
            <img
              src={brand.logo_url || fallbackLogo(brand.name)}
              alt={`${brand.name} logo`}
              className="h-12 w-12 rounded-xl bg-[#fff7e8] object-contain p-1"
              onError={(event) => {
                event.target.src = fallbackLogo(brand.name)
              }}
            />
            <span className="font-semibold">{brand.name}</span>
            <button onClick={() => handleDelete(brand.id)} className="text-xs text-chrome/50 hover:text-ignition">Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}
