import { SiteHeader } from "@/components/site-header"
import { TrendingUp, FileCheck, Briefcase, UserCheck, Star, Wifi, ArrowRight } from "lucide-react"

export const metadata = {
  title: "Why Nomee",
  description: "Praise disappears. Opportunities don't wait.",
}

export default function WhyNomeePage() {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      {/* SECTION 1: HERO - No supporting copy */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium text-slate-900 tracking-tight leading-tight">
            Praise disappears. Opportunities don't wait.
          </h1>
        </div>
      </section>

      {/* SECTION 2: WHY PEOPLE USE NOMEE - 2×3 Grid */}
      <section className="py-20 px-6 bg-slate-50/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-xl p-8 border border-slate-200/60 hover:border-slate-300 hover:shadow-sm transition-all">
              <TrendingUp className="w-8 h-8 text-slate-800 mb-4" strokeWidth={1.5} />
              <h3 className="text-lg font-medium text-slate-900 mb-2">Raises & Promotions</h3>
              <p className="text-sm text-slate-600">Proof &gt; memory</p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-xl p-8 border border-slate-200/60 hover:border-slate-300 hover:shadow-sm transition-all">
              <FileCheck className="w-8 h-8 text-slate-800 mb-4" strokeWidth={1.5} />
              <h3 className="text-lg font-medium text-slate-900 mb-2">Performance Reviews</h3>
              <p className="text-sm text-slate-600">Saved words</p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-xl p-8 border border-slate-200/60 hover:border-slate-300 hover:shadow-sm transition-all">
              <Briefcase className="w-8 h-8 text-slate-800 mb-4" strokeWidth={1.5} />
              <h3 className="text-lg font-medium text-slate-900 mb-2">Job Changes</h3>
              <p className="text-sm text-slate-600">Show the experience</p>
            </div>

            {/* Card 4 */}
            <div className="bg-white rounded-xl p-8 border border-slate-200/60 hover:border-slate-300 hover:shadow-sm transition-all">
              <UserCheck className="w-8 h-8 text-slate-800 mb-4" strokeWidth={1.5} />
              <h3 className="text-lg font-medium text-slate-900 mb-2">Contractors</h3>
              <p className="text-sm text-slate-600">Praise → leverage</p>
            </div>

            {/* Card 5 */}
            <div className="bg-white rounded-xl p-8 border border-slate-200/60 hover:border-slate-300 hover:shadow-sm transition-all">
              <Star className="w-8 h-8 text-slate-800 mb-4" strokeWidth={1.5} />
              <h3 className="text-lg font-medium text-slate-900 mb-2">Creators</h3>
              <p className="text-sm text-slate-600">Trust signals</p>
            </div>

            {/* Card 6 */}
            <div className="bg-white rounded-xl p-8 border border-slate-200/60 hover:border-slate-300 hover:shadow-sm transition-all">
              <Wifi className="w-8 h-8 text-slate-800 mb-4" strokeWidth={1.5} />
              <h3 className="text-lg font-medium text-slate-900 mb-2">Remote Work</h3>
              <p className="text-sm text-slate-600">Seen without being there</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: VISUAL FLOW - Icons first, labels second */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-8">
            {/* Step 1 */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full border-2 border-slate-300 flex items-center justify-center">
                <span className="w-3 h-3 rounded-full bg-slate-800" />
              </div>
              <p className="text-sm font-medium text-slate-900">Praise</p>
            </div>

            <ArrowRight className="hidden md:block w-6 h-6 text-slate-300 flex-shrink-0" strokeWidth={1.5} />

            {/* Step 2 */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full border-2 border-slate-300 flex items-center justify-center">
                <span className="w-3 h-3 rounded-full bg-slate-800" />
              </div>
              <p className="text-sm font-medium text-slate-900">Saved</p>
            </div>

            <ArrowRight className="hidden md:block w-6 h-6 text-slate-300 flex-shrink-0" strokeWidth={1.5} />

            {/* Step 3 */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full border-2 border-slate-300 flex items-center justify-center">
                <span className="w-3 h-3 rounded-full bg-slate-800" />
              </div>
              <p className="text-sm font-medium text-slate-900">Patterns</p>
            </div>

            <ArrowRight className="hidden md:block w-6 h-6 text-slate-300 flex-shrink-0" strokeWidth={1.5} />

            {/* Step 4 */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full border-2 border-slate-300 flex items-center justify-center">
                <span className="w-3 h-3 rounded-full bg-slate-800" />
              </div>
              <p className="text-sm font-medium text-slate-900">Used</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: HARD CONTRAST - Two columns, sparse */}
      <section className="py-24 px-6 bg-slate-50/30">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
            {/* Left - Muted */}
            <div className="space-y-4">
              <p className="text-slate-400">Traditional feedback</p>
              <p className="text-slate-400">Annual</p>
              <p className="text-slate-400">Company-owned</p>
              <p className="text-slate-400">Forgotten</p>
            </div>

            {/* Right - Bold */}
            <div className="space-y-4">
              <p className="text-slate-900 font-medium">Nomee</p>
              <p className="text-slate-900 font-medium">In the moment</p>
              <p className="text-slate-900 font-medium">Portable</p>
              <p className="text-slate-900 font-medium">Yours</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: QUIET CLOSING - Small, centered, no CTA */}
      <section className="py-28 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-base text-slate-600 leading-relaxed">
            Nomee exists for the moment praise would've helped — but was already forgotten.
          </p>
        </div>
      </section>

      <div className="h-20" />
    </div>
  )
}
