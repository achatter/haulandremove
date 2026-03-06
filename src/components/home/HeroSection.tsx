import { SearchBar } from '@/components/search/SearchBar'

export function HeroSection() {
  return (
    <section className="relative py-28 border-b overflow-hidden" style={{background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 40%, #1e40af 70%, #312e81 100%)'}}>
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      {/* Glow blobs */}
      <div className="absolute top-[-80px] left-[-80px] w-[500px] h-[500px] rounded-full opacity-20" style={{background: 'radial-gradient(circle, #6366f1, transparent 70%)'}}></div>
      <div className="absolute bottom-[-100px] right-[-80px] w-[600px] h-[600px] rounded-full opacity-15" style={{background: 'radial-gradient(circle, #3b82f6, transparent 70%)'}}></div>
      <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
        <h1 className="text-6xl font-extrabold tracking-tight text-white drop-shadow-lg">
          Search for Hauling Services
        </h1>
        <p className="mt-4 text-xl text-blue-100/80">
          Search thousands of trusted junk removal and estate cleanout professionals nationwide.
        </p>

        <div className="mt-8 max-w-2xl mx-auto">
          <SearchBar
            placeholder="Enter city, state, or zip code..."
            large
          />
        </div>

        <div className="mt-4 flex items-center justify-center gap-6 text-sm text-blue-200/70">
          <span>Junk Removal</span>
          <span>·</span>
          <span>Estate Cleanout</span>
          <span>·</span>
          <span>Nationwide Coverage</span>
        </div>
      </div>
    </section>
  )
}
