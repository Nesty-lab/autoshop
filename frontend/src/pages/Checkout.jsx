import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'
import { payWithPaystack } from '../lib/paystack'

export default function Checkout() {
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: user?.email || '',
    phone: '',
    address: '',
  })
  const [paymentMethod, setPaymentMethod] = useState('online')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function createOrder() {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: form.name,
        customer_email: form.email,
        customer_phone: form.phone,
        delivery_address: form.address,
        payment_method: paymentMethod,
        payment_status: paymentMethod === 'delivery' ? 'pending' : 'pending',
        total_amount: total,
        user_id: user?.id || null,
      })
      .select()
      .single()

    if (orderError) throw orderError

    const orderItems = items.map((item) => ({
      order_id: order.id,
      part_id: item.id,
      part_name: item.name,
      unit_price: item.price,
      quantity: item.quantity,
      subtotal: item.price * item.quantity,
    }))

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
    if (itemsError) throw itemsError

    return order
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const order = await createOrder()

      if (paymentMethod === 'delivery') {
        clearCart()
        navigate('/order-confirmed', { state: { orderId: order.id, paymentMethod } })
        return
      }

      // Online payment via Paystack
      payWithPaystack({
        email: form.email,
        amountInKobo: Math.round(total * 100),
        reference: `order_${order.id}`,
        onSuccess: async (response) => {
          // Server-side verification — never trust the client callback alone
          await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reference: response.reference, orderId: order.id }),
          })
          clearCart()
          navigate('/order-confirmed', { state: { orderId: order.id, paymentMethod } })
        },
        onClose: () => setSubmitting(false),
      })
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl mb-8">Checkout</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <input name="name" required placeholder="Full name" value={form.name} onChange={handleChange}
          className="w-full bg-charcoal border border-steel rounded-sm px-4 py-3 focus:outline-none focus:border-ignition" />
        <input name="email" type="email" required placeholder="Email address" value={form.email} onChange={handleChange}
          className="w-full bg-charcoal border border-steel rounded-sm px-4 py-3 focus:outline-none focus:border-ignition" />
        <input name="phone" required placeholder="Phone number" value={form.phone} onChange={handleChange}
          className="w-full bg-charcoal border border-steel rounded-sm px-4 py-3 focus:outline-none focus:border-ignition" />
        <textarea name="address" required placeholder="Delivery address" value={form.address} onChange={handleChange}
          className="w-full bg-charcoal border border-steel rounded-sm px-4 py-3 focus:outline-none focus:border-ignition" rows="3" />

        <div>
          <p className="mb-2 text-sm text-chrome/70">Payment method</p>
          <div className="flex gap-3">
            <button type="button" onClick={() => setPaymentMethod('online')}
              className={`flex-1 py-3 rounded-sm border ${paymentMethod === 'online' ? 'border-ignition bg-ignition/10 text-ignition' : 'border-steel'}`}>
              Pay Now (Paystack)
            </button>
            <button type="button" onClick={() => setPaymentMethod('delivery')}
              className={`flex-1 py-3 rounded-sm border ${paymentMethod === 'delivery' ? 'border-ignition bg-ignition/10 text-ignition' : 'border-steel'}`}>
              Pay on Delivery
            </button>
          </div>
        </div>

        <div className="border-t border-steel pt-4 flex justify-between text-lg">
          <span>Total</span>
          <span className="text-ignition font-bold">GHS {total.toFixed(2)}</span>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-50">
          {submitting ? 'Processing...' : paymentMethod === 'online' ? 'Pay Now' : 'Place Order'}
        </button>
      </form>
    </div>
  )
}
