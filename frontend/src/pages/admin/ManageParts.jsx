import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function ManageParts() {
  const [models, setModels] = useState([])
  const [parts, setParts] = useState([])
  const [modelId, setModelId] = useState('')
  const [form, setForm] = useState({ name: '', description: '', price: '', stock_quantity: '' })
  const [imageFile, setImageFile] = useState(null)
  const [saving, setSaving] = useState(false)

  async function loadData() {
    const [{ data: modelData }, { data: partData }] = await Promise.all([
      supabase.from('models').select('*, brands(name)').order('name'),
      supabase.from('parts').select('*, models(name, brands(name))').order('created_at', { ascending: false }),
    ])
    setModels(modelData || [])
    setParts(partData || [])
  }

  useEffect(() => {
    loadData()
  }, [])

  async function uploadPartImage(partId, file) {
    // Re-uploading to the same path overwrites the previous image automatically —
    // this is how "upload new image when a part sells out" works.
    const path = `parts/${partId}.jpg`
    await supabase.storage.from('part-images').upload(path, file, { upsert: true })
    const { data } = supabase.storage.from('part-images').getPublicUrl(path)
    // cache-bust so the new image shows immediately instead of a cached old one
    return `${data.publicUrl}?t=${Date.now()}`
  }

  async function handleAdd(e) {
    e.preventDefault()
    if (!modelId) return
    setSaving(true)

    const { data: newPart, error } = await supabase
      .from('parts')
      .insert({
        model_id: modelId,
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        stock_quantity: parseInt(form.stock_quantity) || 0,
        is_available: true,
      })
      .select()
      .single()

    if (!error && imageFile) {
      const image_url = await uploadPartImage(newPart.id, imageFile)
      await supabase.from('parts').update({ image_url }).eq('id', newPart.id)
    }

    setForm({ name: '', description: '', price: '', stock_quantity: '' })
    setImageFile(null)
    setSaving(false)
    loadData()
  }

  // Called from each part row when admin restocks with a new image after a sell-out
  async function handleReplaceImage(part, file) {
    const image_url = await uploadPartImage(part.id, file)
    await supabase.from('parts').update({ image_url, is_available: true, stock_quantity: part.stock_quantity || 1 }).eq('id', part.id)
    loadData()
  }

  async function handleStockChange(part, stock_quantity) {
    await supabase.from('parts').update({ stock_quantity, is_available: stock_quantity > 0 }).eq('id', part.id)
    loadData()
  }

  async function handleDelete(id) {
    if (!confirm('Delete this part?')) return
    await supabase.from('parts').delete().eq('id', id)
    loadData()
  }

  return (
    <div>
      <form onSubmit={handleAdd} className="card p-6 mb-8 space-y-4 max-w-lg">
        <h2 className="font-display font-semibold text-lg">Add Part</h2>
        <select required value={modelId} onChange={(e) => setModelId(e.target.value)}
          className="w-full bg-carbon border border-steel rounded-sm px-4 py-3 focus:outline-none focus:border-ignition">
          <option value="">Select model...</option>
          {models.map((m) => <option key={m.id} value={m.id}>{m.brands?.name} — {m.name}</option>)}
        </select>
        <input required placeholder="Part name (e.g. Front Bumper)" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full bg-carbon border border-steel rounded-sm px-4 py-3 focus:outline-none focus:border-ignition" />
        <textarea placeholder="Description (optional)" value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full bg-carbon border border-steel rounded-sm px-4 py-3 focus:outline-none focus:border-ignition" rows="2" />
        <div className="flex gap-3">
          <input required type="number" step="0.01" placeholder="Price (GHS)" value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="flex-1 bg-carbon border border-steel rounded-sm px-4 py-3 focus:outline-none focus:border-ignition" />
          <input required type="number" placeholder="Stock qty" value={form.stock_quantity}
            onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })}
            className="flex-1 bg-carbon border border-steel rounded-sm px-4 py-3 focus:outline-none focus:border-ignition" />
        </div>
        <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])}
          className="w-full text-sm text-chrome/70" />
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
          {saving ? 'Saving...' : 'Add Part'}
        </button>
      </form>

      <h2 className="font-display font-semibold text-lg mb-4">All Parts</h2>
      <div className="space-y-3">
        {parts.map((part) => (
          <div key={part.id} className="card p-4 flex flex-wrap items-center gap-4">
            <img src={part.image_url} alt={part.name} className="w-16 h-16 object-cover rounded-sm bg-steel" />
            <div className="flex-1 min-w-[150px]">
              <p className="font-semibold">{part.name}</p>
              <p className="text-xs text-chrome/50">{part.models?.brands?.name} — {part.models?.name}</p>
              <p className="text-ignition font-bold">GHS {Number(part.price).toFixed(2)}</p>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-chrome/50">Stock</label>
              <input type="number" defaultValue={part.stock_quantity}
                onBlur={(e) => handleStockChange(part, parseInt(e.target.value) || 0)}
                className="w-20 bg-carbon border border-steel rounded-sm px-2 py-1 text-center" />
            </div>

            {part.stock_quantity <= 0 && (
              <span className="text-xs font-bold text-ignition uppercase">Sold Out</span>
            )}

            <label className="btn-outline text-xs py-2 px-3 cursor-pointer">
              Replace Image
              <input type="file" accept="image/*" className="hidden"
                onChange={(e) => e.target.files[0] && handleReplaceImage(part, e.target.files[0])} />
            </label>

            <button onClick={() => handleDelete(part.id)} className="text-xs text-chrome/50 hover:text-ignition">Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}
