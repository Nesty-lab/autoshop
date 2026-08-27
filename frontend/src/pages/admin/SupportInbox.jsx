import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function SupportInbox() {
  const [messages, setMessages] = useState([])

  async function loadMessages() {
    const { data } = await supabase.from('support_messages').select('*').order('created_at', { ascending: false })
    setMessages(data || [])
  }

  useEffect(() => {
    loadMessages()
  }, [])

  async function markResolved(id) {
    await supabase.from('support_messages').update({ status: 'resolved' }).eq('id', id)
    loadMessages()
  }

  return (
    <div className="space-y-3">
      {messages.map((msg) => (
        <div key={msg.id} className="card p-5">
          <div className="flex justify-between mb-2">
            <p className="font-semibold">{msg.name} <span className="text-chrome/50 font-normal text-sm">({msg.email})</span></p>
            <span className={`text-xs uppercase font-bold ${msg.status === 'open' ? 'text-ignition' : 'text-chrome/40'}`}>
              {msg.status}
            </span>
          </div>
          <p className="text-chrome/80 text-sm mb-3">{msg.message}</p>
          {msg.status === 'open' && (
            <button onClick={() => markResolved(msg.id)} className="btn-outline text-xs py-2 px-3">Mark Resolved</button>
          )}
        </div>
      ))}
      {messages.length === 0 && <p className="text-chrome/50">No support messages yet.</p>}
    </div>
  )
}
