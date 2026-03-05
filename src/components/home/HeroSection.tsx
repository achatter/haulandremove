import { SearchBar } from '@/components/search/SearchBar'

export function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-slate-50 to-white py-20 border-b">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-foreground">
          Find Hauling &amp; Removal Services Near You
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
