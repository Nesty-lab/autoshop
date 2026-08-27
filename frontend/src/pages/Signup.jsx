import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    const { error } = await supabase.auth.signUp({ email, password })
    setSubmitting(false)
    if (error) return setError(error.message)
    navigate('/')
  }

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <h1 className="text-3xl mb-8 text-center">Create Account</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-charcoal border border-steel rounded-sm px-4 py-3 focus:outline-none focus:border-ignition" />
        <input required type="password" placeholder="Password (min 6 characters)" value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-charcoal border border-steel rounded-sm px-4 py-3 focus:outline-none focus:border-ignition" />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-50">
          {submitting ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
      <p className="text-center text-sm text-chrome/60 mt-6">
        Already have an account? <Link to="/login" className="text-ignition">Sign in</Link>
      </p>
    </div>
  )
}
