import { Link, useLocation } from 'react-router-dom'

export default function OrderConfirmed() {
  const { state } = useLocation()

  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <h1 className="text-3xl mb-4 text-ignition">Order Placed!</h1>
      <p className="text-chrome/70 mb-2">Order reference: <span className="text-chrome">{state?.orderId}</span></p>
      <p className="text-chrome/70 mb-8">
        {state?.paymentMethod === 'delivery'
          ? "You'll pay when your order arrives. We'll contact you to confirm delivery details."
          : 'Payment received — your order is being processed.'}
      </p>
      <Link to="/brands" className="btn-primary inline-block">Continue Shopping</Link>
    </div>
  )
}
