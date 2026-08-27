export default function Footer() {
  return (
    <footer className="bg-[#ff9900] border-t border-[#f68b1e] mt-16 py-8 text-sm text-white">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between gap-4">
        <p>&copy; {new Date().getFullYear()} AgyaPee. Quality auto parts, delivered fast.</p>
        <div className="flex gap-6">
          <a href="/support" className="hover:text-[#1d1d1d]">Support</a>
          <a href="/brands" className="hover:text-[#1d1d1d]">Categories</a>
        </div>
      </div>
    </footer>
  )
}
