import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { items, updateQuantity, removeFromCart, total } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl mb-4">Your cart is empty</h1>
        <Link to="/brands" className="btn-primary inline-block">Browse Parts</Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl mb-8">Your Cart</h1>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="card flex items-center gap-4 p-4">
            <img src={item.image_url} alt={item.name} className="w-20 h-20 object-cover rounded-sm bg-steel" />
            <div className="flex-1">
              <h3 className="font-display font-semibold">{item.name}</h3>
              <p className="text-ignition font-bold">GHS {Number(item.price).toFixed(2)}</p>
            </div>
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
              className="w-16 bg-carbon border border-steel rounded-sm px-2 py-1 text-center"
            />
            <button onClick={() => removeFromCart(item.id)} className="text-chrome/50 hover:text-ignition text-sm">
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between items-center border-t border-steel pt-6">
        <span className="text-xl">Total: <span className="text-ignition font-bold">GHS {total.toFixed(2)}</span></span>
        <button onClick={() => navigate('/checkout')} className="btn-primary">Proceed to Checkout</button>
      </div>
    </div>
  )
}
