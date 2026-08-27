import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import ProductCard from '../components/ProductCard'

export default function Search() {
  const [params] = useSearchParams()
  const q = params.get('q') || ''
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!q) return
    setLoading(true)
    supabase
      .from('parts')
      .select('*, models(name, brands(name))')
      .ilike('name', `%${q}%`)
      .then(({ data }) => {
        setResults(data || [])
        setLoading(false)
      })
  }, [q])

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-2xl mb-8">Results for "{q}"</h1>
      {loading ? (
        <p>Searching...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {results.map((part) => (
            <ProductCard key={part.id} part={part} />
          ))}
          {results.length === 0 && <p className="text-chrome/50 col-span-full">No parts matched your search.</p>}
        </div>
      )}
    </div>
  )
}
