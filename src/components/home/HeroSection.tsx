import { SearchBar } from '@/components/search/SearchBar'

export function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20 border-b relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
        <h1 className="text-6xl font-bold tracking-tight text-foreground">
          Search for Hauling Services
        </h1>
        <p className="mt-4 text-xl text-muted-foreground">
          Search thousands of trusted junk removal and estate cleanout professionals nationwide.
        </p>

        <div className="mt-8 max-w-2xl mx-auto">
          <SearchBar
            placeholder="Enter city, state, or zip code..."
            large
          />
        </div>

        <div className="mt-4 flex items-center justify-center gap-6 text-sm text-muted-foreground">
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
