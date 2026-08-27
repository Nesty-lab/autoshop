// Wraps the Paystack Inline JS popup (loaded via <script> in index.html)
// Docs: https://paystack.com/docs/payments/accept-payments/

export function payWithPaystack({ email, amountInKobo, reference, onSuccess, onClose }) {
  if (!window.PaystackPop) {
    alert('Payment system failed to load. Please refresh and try again.')
    return
  }

  const handler = window.PaystackPop.setup({
    key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    email,
    amount: amountInKobo, // Paystack expects the smallest currency unit
    ref: reference,
    currency: import.meta.env.VITE_PAYSTACK_CURRENCY || 'GHS',
    callback: (response) => onSuccess(response),
    onClose: () => onClose && onClose(),
  })

  handler.openIframe()
}
