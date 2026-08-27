import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) {
      setSubmitting(false)
      return setError(signInError.message)
    }

    // Confirm this user is actually an admin (not just any registered customer)
    const { data: adminRow } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', data.user.id)
      .maybeSingle()

    setSubmitting(false)

    if (!adminRow) {
      await supabase.auth.signOut()
      return setError('This account does not have admin access.')
    }

    navigate('/admin')
  }

  return (
    <div className="admin-workspace max-w-md mx-auto px-4 py-24">
      <h1 className="text-3xl mb-2 text-center">Admin Login</h1>
      <p className="text-center text-chrome/50 text-sm mb-8">Restricted access — staff only</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input required type="email" placeholder="Admin email" value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-charcoal border border-steel rounded-sm px-4 py-3 focus:outline-none focus:border-ignition" />
        <input required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-charcoal border border-steel rounded-sm px-4 py-3 focus:outline-none focus:border-ignition" />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-50">
          {submitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}
