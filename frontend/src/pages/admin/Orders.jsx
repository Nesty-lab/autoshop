import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

export default function Orders() {
  const [orders, setOrders] = useState([])

  async function loadOrders() {
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false })
    setOrders(data || [])
  }

  useEffect(() => {
    loadOrders()
  }, [])

  async function updateStatus(orderId, order_status) {
    await supabase.from('orders').update({ order_status }).eq('id', orderId)
    loadOrders()
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="card p-5">
          <div className="flex flex-wrap justify-between gap-3 mb-3">
            <div>
              <p className="font-semibold">{order.customer_name} — {order.customer_phone}</p>
              <p className="text-xs text-chrome/50">{order.customer_email} · {order.delivery_address}</p>
            </div>
            <div className="text-right">
              <p className="text-ignition font-bold">GHS {Number(order.total_amount).toFixed(2)}</p>
              <p className="text-xs text-chrome/50 uppercase">
                {order.payment_method === 'online' ? 'Paid online' : 'Pay on delivery'} · {order.payment_status}
              </p>
            </div>
          </div>

          <ul className="text-sm text-chrome/70 mb-3 list-disc list-inside">
            {order.order_items.map((item) => (
              <li key={item.id}>{item.quantity} × {item.part_name} (GHS {Number(item.subtotal).toFixed(2)})</li>
            ))}
          </ul>

          <select value={order.order_status} onChange={(e) => updateStatus(order.id, e.target.value)}
            className="bg-carbon border border-steel rounded-sm px-3 py-2 text-sm">
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      ))}
      {orders.length === 0 && <p className="text-chrome/50">No orders yet.</p>}
    </div>
  )
}
