import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { demoBrands, demoModels } from '../BrandModels'

export default function ManageModels() {
  const [brands, setBrands] = useState([])
  const [models, setModels] = useState([])
  const [brandId, setBrandId] = useState('')
  const [name, setName] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState('')

  async function loadData() {
    let [{ data: brandData }, { data: modelData }] = await Promise.all([
      supabase.from('brands').select('*').order('name'),
      supabase.from('models').select('*, brands(name)').order('name'),
    ])

    if (!brandData?.length) {
      await supabase.from('brands').insert(demoBrands.map(({ name, logo_url }) => ({ name, logo_url })))
      const result = await supabase.from('brands').select('*').order('name')
      brandData = result.data || []
    }

    if (!modelData?.length && brandData.length) {
      const brandIds = new Map(brandData.map((brand) => [brand.name, brand.id]))
      const seedModels = Object.entries(demoModels).flatMap(([brandKey, modelList]) => {
        const brand = demoBrands.find((item) => item.id === brandKey)
        const brandId = brandIds.get(brand?.name)
        return brandId ? modelList.map(({ name, image_url }) => ({ brand_id: brandId, name, image_url })) : []
      })
      if (seedModels.length) await supabase.from('models').insert(seedModels)
      const result = await supabase.from('models').select('*, brands(name)').order('name')
      modelData = result.data || []
    }

    setBrands(brandData || [])
    setModels(modelData || [])
  }

  useEffect(() => {
    loadData()
  }, [])

  async function handleAdd(e) {
    e.preventDefault()
    if (!brandId) return
    setSaving(true)

    let image_url = null
    if (imageFile) {
      const path = `models/${brandId}-${name.toLowerCase().replace(/\s+/g, '-')}.jpg`
      await supabase.storage.from('part-images').upload(path, imageFile, { upsert: true })
      const { data } = supabase.storage.from('part-images').getPublicUrl(path)
      image_url = data.publicUrl
    }

    await supabase.from('models').insert({ brand_id: brandId, name, image_url })
    setName('')
    setImageFile(null)
    setSaving(false)
    loadData()
  }

  async function handleDelete(id) {
    if (!confirm('Delete this model and all its parts?')) return
    await supabase.from('models').delete().eq('id', id)
    loadData()
  }

  async function handleEdit(model) {
    if (!editingName.trim()) return
    await supabase.from('models').update({ name: editingName.trim() }).eq('id', model.id)
    setEditingId(null)
    loadData()
  }

  return (
    <div>
      <form onSubmit={handleAdd} className="card p-6 mb-8 space-y-4 max-w-lg">
        <h2 className="font-display font-semibold text-lg">Add Model</h2>
        <select required value={brandId} onChange={(e) => setBrandId(e.target.value)}
          className="w-full bg-carbon border border-steel rounded-sm px-4 py-3 focus:outline-none focus:border-ignition">
          <option value="">Select brand...</option>
          {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <input required placeholder="Model name (e.g. M8)" value={name} onChange={(e) => setName(e.target.value)}
          className="w-full bg-carbon border border-steel rounded-sm px-4 py-3 focus:outline-none focus:border-ignition" />
        <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])}
          className="w-full text-sm text-chrome/70" />
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
          {saving ? 'Saving...' : 'Add Model'}
        </button>
      </form>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {models.map((model) => (
          <div key={model.id} className="card p-4">
            {model.image_url && <img src={model.image_url} alt={model.name} className="w-full h-24 object-cover rounded-sm mb-2" />}
            {editingId === model.id ? (
              <input value={editingName} onChange={(event) => setEditingName(event.target.value)} className="w-full rounded border border-steel bg-carbon px-2 py-1 text-sm" />
            ) : <p className="font-semibold">{model.name}</p>}
            <p className="text-xs text-chrome/50">{model.brands?.name}</p>
            {editingId === model.id ? (
              <button onClick={() => handleEdit(model)} className="text-xs font-bold text-ignition mt-2">Save</button>
            ) : (
              <button onClick={() => { setEditingId(model.id); setEditingName(model.name) }} className="text-xs text-ignition mt-2">Edit</button>
            )}
            <button onClick={() => handleDelete(model.id)} className="text-xs text-chrome/50 hover:text-ignition mt-2">Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}
