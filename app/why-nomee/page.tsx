import { SiteHeader } from "@/components/site-header"
import { TrendingUp, FileCheck, Briefcase, UserCheck, Star, Wifi, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata = {
  title: "Why Nomee",
  description: "Praise disappears. Opportunities don't wait.",
}

export default function WhyNomeePage() {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      {/* SECTION 1: HERO - No supporting copy */}
      <section className="pt-24 md:pt-32 pb-16 md:pb-24 px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium text-slate-900 tracking-tight leading-[1.1] md:leading-tight">
            Praise disappears.
            <br />
            Opportunities don&apos;t wait.
          </h1>
        </div>
      </section>

      {/* SECTION 2: WHY PEOPLE USE NOMEE - 2×3 Grid */}
      <section className="py-16 md:py-20 px-4 md:px-6 bg-slate-50/30">
        <div className="max-w-6xl mx-auto">
          {/* Mobile: Horizontal scroll */}
          <div className="md:hidden flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
            <div className="bg-white rounded-xl p-6 border border-slate-200/60 hover:border-slate-300 hover:shadow-sm transition-all min-w-[280px] snap-center">
              <TrendingUp className="w-7 h-7 text-slate-800 mb-3" strokeWidth={1.5} />
              <h3 className="text-base font-medium text-slate-900 mb-1.5">Raises & Promotions</h3>
              <p className="text-sm text-slate-600">Proof &gt; memory</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200/60 hover:border-slate-300 hover:shadow-sm transition-all min-w-[280px] snap-center">
              <FileCheck className="w-7 h-7 text-slate-800 mb-3" strokeWidth={1.5} />
              <h3 className="text-base font-medium text-slate-900 mb-1.5">Performance Reviews</h3>
              <p className="text-sm text-slate-600">Saved words</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200/60 hover:border-slate-300 hover:shadow-sm transition-all min-w-[280px] snap-center">
              <Briefcase className="w-7 h-7 text-slate-800 mb-3" strokeWidth={1.5} />
              <h3 className="text-base font-medium text-slate-900 mb-1.5">Job Changes</h3>
              <p className="text-sm text-slate-600">Real-world proof</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200/60 hover:border-slate-300 hover:shadow-sm transition-all min-w-[280px] snap-center">
              <UserCheck className="w-7 h-7 text-slate-800 mb-3" strokeWidth={1.5} />
              <h3 className="text-base font-medium text-slate-900 mb-1.5">Contractors & Consultants</h3>
              <p className="text-sm text-slate-600">Turn feedback into credibility</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200/60 hover:border-slate-300 hover:shadow-sm transition-all min-w-[280px] snap-center">
              <Star className="w-7 h-7 text-slate-800 mb-3" strokeWidth={1.5} />
              <h3 className="text-base font-medium text-slate-900 mb-1.5">Creators & Brand Deals</h3>
              <p className="text-sm text-slate-600">Deal credibility</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200/60 hover:border-slate-300 hover:shadow-sm transition-all min-w-[280px] snap-center">
              <Wifi className="w-7 h-7 text-slate-800 mb-3" strokeWidth={1.5} />
              <h3 className="text-base font-medium text-slate-900 mb-1.5">Remote Work</h3>
              <p className="text-sm text-slate-600">Work made visible</p>
            </div>
          </div>

          {/* Desktop: Grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="bg-white rounded-xl p-8 border border-slate-200/60 hover:border-slate-300 hover:shadow-sm transition-all">
              <TrendingUp className="w-8 h-8 text-slate-800 mb-4" strokeWidth={1.5} />
              <h3 className="text-lg font-medium text-slate-900 mb-2">Raises & Promotions</h3>
              <p className="text-sm text-slate-600">Proof &gt; memory</p>
            </div>

            <div className="bg-white rounded-xl p-8 border border-slate-200/60 hover:border-slate-300 hover:shadow-sm transition-all">
              <FileCheck className="w-8 h-8 text-slate-800 mb-4" strokeWidth={1.5} />
              <h3 className="text-lg font-medium text-slate-900 mb-2">Performance Reviews</h3>
              <p className="text-sm text-slate-600">Saved words</p>
            </div>

            <div className="bg-white rounded-xl p-8 border border-slate-200/60 hover:border-slate-300 hover:shadow-sm transition-all">
              <Briefcase className="w-8 h-8 text-slate-800 mb-4" strokeWidth={1.5} />
              <h3 className="text-lg font-medium text-slate-900 mb-2">Job Changes</h3>
              <p className="text-sm text-slate-600">Real-world proof</p>
            </div>

            <div className="bg-white rounded-xl p-8 border border-slate-200/60 hover:border-slate-300 hover:shadow-sm transition-all">
              <UserCheck className="w-8 h-8 text-slate-800 mb-4" strokeWidth={1.5} />
              <h3 className="text-lg font-medium text-slate-900 mb-2">Contractors & Consultants</h3>
              <p className="text-sm text-slate-600">Turn feedback into credibility</p>
            </div>

            <div className="bg-white rounded-xl p-8 border border-slate-200/60 hover:border-slate-300 hover:shadow-sm transition-all">
              <Star className="w-8 h-8 text-slate-800 mb-4" strokeWidth={1.5} />
              <h3 className="text-lg font-medium text-slate-900 mb-2">Creators & Brand Deals</h3>
              <p className="text-sm text-slate-600">Deal credibility</p>
            </div>

            <div className="bg-white rounded-xl p-8 border border-slate-200/60 hover:border-slate-300 hover:shadow-sm transition-all">
              <Wifi className="w-8 h-8 text-slate-800 mb-4" strokeWidth={1.5} />
              <h3 className="text-lg font-medium text-slate-900 mb-2">Remote Work</h3>
              <p className="text-sm text-slate-600">Work made visible</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-6">
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-full border-2 border-slate-300 flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-800" />
              </div>
              <p className="text-sm font-semibold text-slate-900">Praise</p>
            </div>

            <ArrowRight className="hidden md:block w-5 h-5 text-slate-200 flex-shrink-0" strokeWidth={1.5} />

            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-full border-2 border-slate-300 flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-800" />
              </div>
              <p className="text-sm font-semibold text-slate-900">Saved</p>
            </div>

            <ArrowRight className="hidden md:block w-5 h-5 text-slate-200 flex-shrink-0" strokeWidth={1.5} />

            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-full border-2 border-slate-300 flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-800" />
              </div>
              <p className="text-sm font-semibold text-slate-900">Patterns</p>
            </div>

            <ArrowRight className="hidden md:block w-5 h-5 text-slate-200 flex-shrink-0" strokeWidth={1.5} />

            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-full border-2 border-slate-300 flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-800" />
              </div>
              <p className="text-sm font-semibold text-slate-900">Used</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: ELEVATED COMPARISON SECTION */}
      <section className="py-16 md:py-20 px-4 md:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-slate-400 font-medium">
              The FEEDBACK Difference
            </p>
          </div>

          <div className="relative">
            {/* Vertical divider - perfectly centered */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 -translate-x-1/2" />

            {/* Two-column comparison with perfect symmetry */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0 max-w-4xl mx-auto">
              {/* Left: Traditional - Same structure as right, differentiated by color only */}
              <div className="text-center space-y-10 lg:pr-12">
                <div>
                  <h3 className="text-2xl md:text-3xl font-semibold text-slate-400 tracking-tight inline-block border-b-[3px] border-slate-300 pb-1.5">
                    Traditionally
                  </h3>
                </div>
                <div className="space-y-6">
                  <p className="text-lg md:text-xl font-medium text-slate-400">Annual</p>
                  <p className="text-lg md:text-xl font-medium text-slate-400">Company-owned</p>
                  <p className="text-lg md:text-xl font-medium text-slate-400">Lost &amp; Forgotten</p>
                </div>
              </div>

              {/* Right: Nomee - Identical structure to left, differentiated by color only */}
              <div className="text-center space-y-10 lg:pl-12 pt-8 lg:pt-0 border-t lg:border-t-0 border-slate-200 lg:border-0">
                <div>
                  <h3 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight inline-block border-b-[3px] border-slate-900 pb-1.5">
                    Nomee
                  </h3>
                </div>
                <div className="space-y-6">
                  <p className="text-lg md:text-xl font-medium text-slate-900">In the moment</p>
                  <p className="text-lg md:text-xl font-medium text-slate-900">You Own + Portable</p>
                  <p className="text-lg md:text-xl font-medium text-slate-900">Yours Forever</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: QUIET CLOSING */}
      <section className="py-16 md:py-20 px-4 md:px-6 bg-slate-50/30">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm md:text-base text-slate-600 leading-relaxed">
            Nomee exists for the moment praise would&apos;ve helped — but was already forgotten.
          </p>
        </div>
      </section>

      <section className="relative py-20 md:py-24 px-4 md:px-6 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium text-white tracking-tight leading-tight">
            Your work speaks through other people.
            <br className="hidden md:block" />
            <span className="md:inline"> </span>Nomee makes sure you don&apos;t lose that record.
          </h2>

          <Button
            asChild
            className="w-full md:w-auto bg-white hover:bg-slate-50 text-slate-900 rounded-full px-8 h-12 text-base font-medium transition-all shadow-lg hover:shadow-xl group"
          >
            <Link href="/auth/signup" className="inline-flex items-center justify-center gap-2">
              Start your Nomee
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
            </Link>
          </Button>
        </div>
      </section>

      <div className="h-16 md:h-20" />
    </div>
  )
}
