import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cart')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  function addToCart(part, quantity = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === part.id)
      if (existing) {
        return prev.map((i) => (i.id === part.id ? { ...i, quantity: i.quantity + quantity } : i))
      }
      return [...prev, { ...part, quantity }]
    })
  }

  function updateQuantity(partId, quantity) {
    if (quantity <= 0) return removeFromCart(partId)
    setItems((prev) => prev.map((i) => (i.id === partId ? { ...i, quantity } : i)))
  }

  function removeFromCart(partId) {
    setItems((prev) => prev.filter((i) => i.id !== partId))
  }

  function clearCart() {
    setItems([])
  }

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addToCart, updateQuantity, removeFromCart, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside a CartProvider')
  return ctx
}
