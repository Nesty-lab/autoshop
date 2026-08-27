export default function Footer() {
  return (
    <footer className="bg-[#1d1d1d] border-t border-[#2b2b2b] mt-16 py-8 text-sm text-[#d9d9d9]">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between gap-4">
        <p>&copy; {new Date().getFullYear()} Dave. Quality auto parts, delivered fast.</p>
        <div className="flex gap-6">
          <a href="/support" className="hover:text-[#ff9900]">Support</a>
          <a href="/brands" className="hover:text-[#ff9900]">Categories</a>
        </div>
      </div>
    </footer>
  )
}
