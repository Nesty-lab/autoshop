import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Support() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    await supabase.from('support_messages').insert(form)
    setSubmitting(false)
    setSent(true)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl mb-2">Support</h1>
      <p className="text-chrome/70 mb-8">Have a question about an order or a part? Send us a message.</p>

      {sent ? (
        <div className="card p-6 text-center">
          <p className="text-ignition font-semibold">Message sent — we'll get back to you shortly.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required placeholder="Your name" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-charcoal border border-steel rounded-sm px-4 py-3 focus:outline-none focus:border-ignition" />
          <input required type="email" placeholder="Your email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full bg-charcoal border border-steel rounded-sm px-4 py-3 focus:outline-none focus:border-ignition" />
          <textarea required rows="5" placeholder="How can we help?" value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full bg-charcoal border border-steel rounded-sm px-4 py-3 focus:outline-none focus:border-ignition" />
          <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-50">
            {submitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      )}
    </div>
  )
}
