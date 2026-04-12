import { HeroSectionA } from '@/components/home/HeroSectionA'
import { HeroSectionB } from '@/components/home/HeroSectionB'
import { HeroSectionC } from '@/components/home/HeroSectionC'
import { HeroSectionD } from '@/components/home/HeroSectionD'

function OptionLabel({ letter, title, description }: { letter: string; title: string; description: string }) {
  return (
    <div className="flex items-center gap-3 px-6 py-4 bg-slate-900 border-b border-slate-700">
      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
        {letter}
      </span>
      <div>
        <p className="font-semibold text-white text-sm">{title}</p>
        <p className="text-slate-400 text-xs">{description}</p>
      </div>
    </div>
  )
}

export default function PreviewPage() {
  return (
    <div className="bg-slate-950">
      {/* Page header */}
      <div className="px-6 py-8 border-b border-slate-800 bg-slate-950">
        <h1 className="text-2xl font-bold text-white">Landing Page Design Preview</h1>
        <p className="text-slate-400 mt-1 text-sm">
          4 hero section design options — all using the 3-column layout with photographic imagery.
          Reply on the GitHub issue with your preferred option (A, B, C, or D).
        </p>
      </div>

      {/* Option A */}
      <div className="border-b border-slate-700">
        <OptionLabel
          letter="A"
          title="Photo Cards on Dark Navy"
          description="Closest to the reference screenshot. Photo backgrounds on both cards with strong blue/violet overlays. Clean dark navy hero."
        />
        <HeroSectionA />
      </div>

      {/* Option B */}
      <div className="border-b border-slate-700">
        <OptionLabel
          letter="B"
          title="Cinematic Panorama"
          description="A wide panoramic photo covers the entire hero background. Cards use glassmorphism (frosted-glass) with photo peek strips at the top."
        />
        <HeroSectionB />
      </div>

      {/* Option C */}
      <div className="border-b border-slate-700">
        <OptionLabel
          letter="C"
          title="Bold Split Scene"
          description="Hero background splits into two photo zones — warm amber/orange on the left (junk removal), cool teal on the right (estate). Center is clean dark."
        />
        <HeroSectionC />
      </div>

      {/* Option D */}
      <div className="border-b border-slate-700">
        <OptionLabel
          letter="D"
          title="Modern Photo Cards"
          description="Cards feature a large prominent photo area at the top with a clean dark info panel below. Stats strip above the heading. Most modern / app-like feel."
        />
        <HeroSectionD />
      </div>

      {/* Footer note */}
      <div className="px-6 py-6 bg-slate-950 text-center">
        <p className="text-slate-500 text-sm">
          All photo backgrounds use placeholder images from picsum.photos — replace with licensed hauling &amp; estate photos for production.
        </p>
      </div>
    </div>
  )
}
