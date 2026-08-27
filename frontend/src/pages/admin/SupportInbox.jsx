import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function SupportInbox() {
  const [messages, setMessages] = useState([])
  const [reply, setReply] = useState({})
  const [saving, setSaving] = useState(null)

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

  async function sendReply(message) {
    const replyText = reply[message.id]?.trim()
    if (!replyText) return
    setSaving(message.id)
    await supabase.from('support_messages').update({
      reply: replyText,
      replied_at: new Date().toISOString(),
      status: 'resolved',
    }).eq('id', message.id)
    setReply({ ...reply, [message.id]: '' })
    setSaving(null)
    loadMessages()
  }

  async function deleteMessage(id) {
    if (!confirm('Delete this customer message?')) return
    await supabase.from('support_messages').delete().eq('id', id)
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
          {msg.reply && (
            <div className="mb-3 rounded-lg bg-[#fff7e8] p-3 text-sm text-[#704500]">
              <span className="font-bold">Your reply:</span> {msg.reply}
            </div>
          )}
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              value={reply[msg.id] || ''}
              onChange={(event) => setReply({ ...reply, [msg.id]: event.target.value })}
              placeholder="Reply to customer..."
              className="flex-1 rounded-lg border border-steel bg-carbon px-3 py-2 text-sm"
            />
            <button disabled={saving === msg.id} onClick={() => sendReply(msg)} className="btn-primary px-4 py-2 text-xs disabled:opacity-50">
              {saving === msg.id ? 'Sending...' : 'Send reply'}
            </button>
          </div>
          {msg.status === 'open' && (
            <button onClick={() => markResolved(msg.id)} className="btn-outline text-xs py-2 px-3">Mark Resolved</button>
          )}
          <button onClick={() => deleteMessage(msg.id)} className="mt-2 text-left text-xs font-semibold text-red-500 hover:text-red-700">Delete message</button>
        </div>
      ))}
      {messages.length === 0 && <p className="text-chrome/50">No support messages yet.</p>}
    </div>
  )
}
