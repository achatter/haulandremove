import { HeroSectionV1 } from '@/components/home/HeroSectionV1'
import { HeroSectionV2 } from '@/components/home/HeroSectionV2'
import { HeroSectionV3 } from '@/components/home/HeroSectionV3'

export default function PreviewPage() {
  return (
    <main>
      {/* Option 1 */}
      <div>
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-center gap-3">
          <span className="text-2xl">🔥</span>
          <div>
            <span className="font-bold text-amber-900">Option 1 — &quot;Molten Industrial&quot;</span>
            <span className="ml-3 text-sm text-amber-700">Warm amber/charcoal · Bold, earthy, trustworthy</span>
          </div>
        </div>
        <HeroSectionV1 />
      </div>

      {/* Option 2 */}
      <div>
        <div className="bg-blue-50 border-b border-blue-200 px-6 py-3 flex items-center gap-3">
          <span className="text-2xl">⚡</span>
          <div>
            <span className="font-bold text-blue-900">Option 2 — &quot;Electric Vivid&quot;</span>
            <span className="ml-3 text-sm text-blue-700">Deep blue-violet with glassmorphism · Modern, tech-forward</span>
          </div>
        </div>
        <HeroSectionV2 />
      </div>

      {/* Option 3 */}
      <div>
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center gap-3">
          <span className="text-2xl">☀️</span>
          <div>
            <span className="font-bold text-slate-900">Option 3 — &quot;Premium Light&quot;</span>
            <span className="ml-3 text-sm text-slate-600">Clean white/light · Professional, minimal, high-trust</span>
          </div>
        </div>
        <HeroSectionV3 />
      </div>
    </main>
  )
}
