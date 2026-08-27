export default function AdminHome() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-[#16212b] p-7 text-white shadow-lg md:p-10">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#ffb84d]">Welcome back</p>
        <h2 className="mt-3 text-3xl font-black">Your store at a glance</h2>
        <p className="mt-2 max-w-2xl text-sm text-white/65">Manage your car categories, models, parts, orders, and customer messages from one place.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          ['Categories', 'Add brands and upload logos', '/admin/brands', '◇'],
          ['Car models', 'Organize models by brand', '/admin/models', '▣'],
          ['Parts & images', 'Add stock and product photos', '/admin/parts', '◈'],
          ['Orders', 'Review incoming purchases', '/admin/orders', '□'],
          ['Support inbox', 'Read customer messages', '/admin/support', '✉'],
        ].map(([title, description, to, icon]) => (
          <a key={to} href={`#${to}`} className="group rounded-2xl border border-[#e1e6ea] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#ffb84d] hover:shadow-md">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff1d9] text-lg font-bold text-[#d77b00]">{icon}</span>
            <h3 className="mt-4 font-black text-[#16212b]">{title}</h3>
            <p className="mt-1 text-sm text-[#73808b]">{description}</p>
          </a>
        ))}
      </div>
    </div>
  )
}
