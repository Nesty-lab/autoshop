import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setSubmitting(false)
    if (error) return setError(error.message)
    navigate('/')
  }

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <h1 className="text-3xl mb-8 text-center">Sign In</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-charcoal border border-steel rounded-sm px-4 py-3 focus:outline-none focus:border-ignition" />
        <input required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-charcoal border border-steel rounded-sm px-4 py-3 focus:outline-none focus:border-ignition" />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-50">
          {submitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      <p className="text-center text-sm text-chrome/60 mt-6">
        No account? <Link to="/signup" className="text-ignition">Sign up</Link> — or just checkout as a guest.
      </p>
    </div>
  )
}
