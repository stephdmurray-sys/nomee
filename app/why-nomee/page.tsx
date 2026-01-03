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
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium text-slate-900 tracking-tight leading-tight">
            Praise disappears.
            <br />
            Opportunities don&apos;t wait.
          </h1>
        </div>
      </section>

      {/* SECTION 2: WHY PEOPLE USE NOMEE - 2×3 Grid */}
      <section className="py-20 px-6 bg-slate-50/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              <p className="text-sm text-slate-600">Praise → leverage</p>
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

      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-6">
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

      {/* SECTION 4: REDESIGNED COMPARISON SECTION */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          {/* Centered section label with minimal spacing */}
          <div className="text-center mb-12">
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 font-semibold">The Difference</p>
          </div>

          {/* Integrated comparison with center divider */}
          <div className="relative">
            {/* Vertical divider in the center */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-slate-200 via-slate-300 to-slate-200 -translate-x-1/2" />

            {/* Two-column comparison with matching typography */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 max-w-4xl mx-auto">
              {/* Left: Traditional - Right-aligned, closer to divider */}
              <div className="space-y-12 lg:text-right lg:pr-12 pb-12 lg:pb-0">
                <div>
                  <p className="text-2xl font-semibold text-slate-400 tracking-tight inline-block border-b-[3px] border-slate-300 pb-1 mb-10">
                    Traditional feedback
                  </p>
                </div>
                <div className="space-y-10">
                  <p className="text-xl font-medium text-slate-400 leading-relaxed">Annual</p>
                  <p className="text-xl font-medium text-slate-400 leading-relaxed">Company-owned</p>
                  <p className="text-xl font-medium text-slate-400 leading-relaxed">Forgotten</p>
                </div>
              </div>

              {/* Right: Nomee - Left-aligned, closer to divider */}
              <div className="space-y-12 lg:pl-12 pt-12 lg:pt-0 border-t lg:border-t-0 border-slate-200 lg:border-0">
                <div>
                  <p className="text-2xl font-semibold text-slate-900 tracking-tight inline-block border-b-[3px] border-slate-900 pb-1 mb-10">
                    Nomee
                  </p>
                </div>
                <div className="space-y-10">
                  <p className="text-xl font-medium text-slate-900 leading-relaxed">In the moment</p>
                  <p className="text-xl font-medium text-slate-900 leading-relaxed">Portable</p>
                  <p className="text-xl font-medium text-slate-900 leading-relaxed">Yours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: QUIET CLOSING - Small, centered, no CTA */}
      <section className="py-20 px-6 bg-slate-50/30">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-base text-slate-600 leading-relaxed">
            Nomee exists for the moment praise would&apos;ve helped — but was already forgotten.
          </p>
        </div>
      </section>

      <section className="relative py-24 px-6 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl font-medium text-white tracking-tight leading-tight md:text-4xl">
            Your work speaks through other people.
            <br />
            Nomee makes sure you don&apos;t lose that record.
          </h2>

          <Button
            asChild
            className="bg-white hover:bg-slate-50 text-slate-900 rounded-full px-8 h-12 text-base font-medium transition-all shadow-lg hover:shadow-xl group"
          >
            <Link href="/auth/signup" className="inline-flex items-center gap-2">
              Start your Nomee
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
            </Link>
          </Button>
        </div>
      </section>

      <div className="h-20" />
    </div>
  )
}
