import { useState } from 'react'
import { useCart } from '../context/CartContext'

export default function ProductCard({ part }) {
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)
  const soldOut = !part.is_available || part.stock_quantity <= 0

  return (
    <div className="product-card">
      <div className="relative aspect-square bg-[#f8f8f8]">
        {part.image_url ? (
          <img src={part.image_url} alt={part.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#f3f3f3] text-sm text-[#8a8a8a]">
            No image
          </div>
        )}
        {soldOut ? (
          <span className="badge-sold">Sold out</span>
        ) : (
          <span className="badge-discount">-15%</span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3">
        <span className="tag-chip mb-2 w-fit">Top deal</span>
        <h3 className="text-sm font-semibold text-[#1d1d1d] leading-5">{part.name}</h3>
        <p className="mt-2 text-xs text-[#5d5d5d] line-clamp-3">
          {part.description || 'High-quality replacement part for reliable performance and long-lasting durability.'}
        </p>
        <div className="mt-2 flex items-center gap-2 text-xs text-[#757575]">
          <span>⭐ 4.7</span>
          <span>•</span>
          <span>1.4k sold</span>
        </div>
        <div className="mt-3 flex items-end justify-between gap-2">
          <div>
            <p className="text-xl font-bold price-text">GHS {Number(part.price).toFixed(2)}</p>
            <p className="text-[11px] text-[#757575] line-through">GHS {(Number(part.price) * 1.2).toFixed(2)}</p>
          </div>
          <span className="rounded-full bg-[#eaf7ea] px-2 py-1 text-[10px] font-bold text-[#2e7d32]">
            Free delivery
          </span>
        </div>

        <button
          disabled={soldOut}
          onClick={() => {
            addToCart(part)
            setAdded(true)
            window.setTimeout(() => setAdded(false), 1400)
          }}
          className="btn-primary mt-4 w-full disabled:cursor-not-allowed disabled:opacity-50"
        >
          {soldOut ? 'Unavailable' : added ? 'Added to cart' : 'Add to cart'}
        </button>
      </div>
    </div>
  )
}
