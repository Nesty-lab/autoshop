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

      const [{ data: parts, error }, { data: brands }, { data: models }] = await Promise.all([
        supabase.from('parts').select('*, models(name, brands(name))').order('created_at', { ascending: false }),
        supabase.from('brands').select('*').order('name'),
        supabase.from('models').select('*, brands(name)').order('name'),
      ])

      if (error) {
        console.error('Part search failed:', error)
        setResults([])
      } else {
        const searchTerm = q.trim().toLowerCase()
        if (searchTerm === 'parts' || searchTerm === 'products' || searchTerm === 'all') {
          setResults(parts || [])
        } else {
          const matchingBrands = (brands || []).filter((brand) => brand.name.toLowerCase().includes(searchTerm))
          const matchingModels = (models || []).filter((model) => [model.name, model.brands?.name].some((value) => value?.toLowerCase().includes(searchTerm)))
          const matchingParts = (parts || []).filter((part) => [
          part.name,
          part.description,
          part.models?.name,
          part.models?.brands?.name,
          ].some((value) => value?.toLowerCase().includes(searchTerm)))
          setResults([...matchingParts, ...matchingModels.map((model) => ({ ...model, resultType: 'model' })), ...matchingBrands.map((brand) => ({ ...brand, resultType: 'brand' }))])
        }
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
          {results.map((result) => (
            result.resultType === 'brand' || result.resultType === 'model' ? (
              <a key={`${result.resultType}-${result.id}`} href={result.resultType === 'brand' ? `#/brands/${result.id}` : `#/models/${result.id}`} className="card p-5">
                <p className="text-xs font-bold uppercase text-[#c57500]">{result.resultType}</p>
                <h2 className="mt-2 text-lg font-black">{result.name}</h2>
                <p className="mt-1 text-sm text-[#757575]">Browse matching car parts</p>
              </a>
            ) : <ProductCard key={result.id} part={result} />
          ))}
          {results.length === 0 && <p className="text-chrome/50 col-span-full">No parts matched your search.</p>}
        </div>
      )}
    </div>
  )
}
