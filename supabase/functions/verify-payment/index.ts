// Supabase Edge Function: verify-payment
// Deploy with: supabase functions deploy verify-payment
// Set secret with: supabase secrets set PAYSTACK_SECRET_KEY=sk_xxx
//
// Why this exists: the Paystack popup's "success" callback runs in the
// customer's browser and can be faked. Real confirmation must come from
// Paystack's server using your SECRET key. This function does that check,
// then marks the order as paid in the database.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const PAYSTACK_SECRET_KEY = Deno.env.get('PAYSTACK_SECRET_KEY')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

Deno.serve(async (req) => {
  try {
    const { reference, orderId } = await req.json()

    if (!reference || !orderId) {
      return new Response(JSON.stringify({ error: 'Missing reference or orderId' }), { status: 400 })
    }

    // 1. Ask Paystack to confirm the transaction really succeeded
    const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
    })
    const verifyData = await verifyRes.json()

    const paid = verifyData?.data?.status === 'success'

    // 2. Update the order in the database accordingly
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    const { error } = await supabase
      .from('orders')
      .update({
        payment_status: paid ? 'paid' : 'failed',
        paystack_reference: reference,
        order_status: paid ? 'processing' : 'pending',
      })
      .eq('id', orderId)

    if (error) throw error

    return new Response(JSON.stringify({ success: paid }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
})
