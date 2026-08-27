import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'
import ProductCard from '../components/ProductCard'

export default function Search() {
  const [params] = useSearchParams()
  const q = params.get('q') || ''
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!q) {
      setResults([])
      setLoading(false)
      return
    }
    setLoading(true)
    async function searchParts() {
      if (!isSupabaseConfigured) {
        setResults([])
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('parts')
        .select('*, models(name, brands(name))')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Part search failed:', error)
        setResults([])
      } else {
        const searchTerm = q.trim().toLowerCase()
        setResults((data || []).filter((part) => [
          part.name,
          part.description,
          part.models?.name,
          part.models?.brands?.name,
        ].some((value) => value?.toLowerCase().includes(searchTerm))))
      }
      setLoading(false)
    }

    searchParts()
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
