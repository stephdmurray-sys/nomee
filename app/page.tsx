"use client"

import { useState } from "react"
import {
  Check,
  X,
  Shield,
  Users,
  TrendingUp,
  Mail,
  Linkedin,
  Briefcase,
  Code,
  DollarSign,
  MessageSquare,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { useScrollToTop } from "@/lib/use-scroll-to-top"
import { DynamicMiniExample } from "@/components/dynamic-mini-example"

export default function Home() {
  const scrollToTop = useScrollToTop()
  const [activeTab, setActiveTab] = useState<"freelancer" | "contractor" | "sales" | "consultant" | "recruiter">(
    "freelancer",
  )

  const handleTabChange = (tab: typeof activeTab) => {
    scrollToTop()
    setActiveTab(tab)
  }

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      {/* Hero Section */}
      <section className="pt-14 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="max-w-[1120px] mx-auto">
          <div className="text-center max-w-5xl mx-auto mb-12 sm:mb-16 space-y-6">
            <div className="inline-flex items-center bg-white/80 backdrop-blur-sm border border-indigo-200 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-lg text-xs sm:text-sm font-semibold text-indigo-900">
              <span>First personal reputation platform</span>
            </div>

            <h1 className="text-[34px] sm:text-6xl md:text-8xl font-bold text-slate-900 leading-[1.15] sm:leading-[1.1] tracking-tight">
              Your best feedback is
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                scattered.
              </span>
            </h1>

            <div className="space-y-4">
              <p className="text-lg sm:text-2xl md:text-3xl text-slate-600 font-light leading-relaxed max-w-[34ch] mx-auto px-4">
                Nomee collects real feedback and turns it into proof.
              </p>
              <p className="hidden sm:block text-sm sm:text-base text-slate-500 font-light max-w-[34ch] mx-auto px-4">
                So your best work doesn't disappear when it matters most.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto px-4">
              <Button
                variant="default"
                className="w-full sm:w-auto px-8 sm:px-10 min-h-[48px] sm:h-auto sm:py-5 rounded-xl text-base sm:text-lg font-semibold bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all"
              >
                Build My Reputation Profile
              </Button>
              <Link href="/example" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full px-8 sm:px-10 min-h-[48px] sm:h-auto sm:py-5 rounded-xl text-base sm:text-lg font-semibold border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all bg-white"
                >
                  See Live Example
                </Button>
              </Link>
            </div>

            {/* Trust signals */}
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-x-6 sm:gap-y-3 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                <span>Free to start</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                <span>Setup in 5 minutes</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                <span>No credit card required</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Flow Section */}
      <section className="py-8 sm:py-16 lg:py-24 bg-gradient-to-b from-white to-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-6 sm:space-y-8 text-center mb-12 sm:mb-16">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-6">
                Your proof already exists.
              </h2>
              <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">It's just not in one place yet.</p>

              {/* Pill-style labels */}
              <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4">
                {/* Row 1 */}
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="inline-flex items-center px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-sm font-medium">
                    Slack messages
                  </span>
                  <span className="inline-flex items-center px-4 py-2 rounded-full bg-slate-50 text-slate-600 text-sm font-medium">
                    Emails
                  </span>
                </div>

                {/* Row 2 */}
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="inline-flex items-center px-4 py-2 rounded-full bg-neutral-100 text-neutral-700 text-sm font-medium">
                    Texts
                  </span>
                  <span className="inline-flex items-center px-4 py-2 rounded-full bg-gray-50 text-gray-600 text-sm font-medium">
                    After-project notes
                  </span>
                </div>

                {/* Row 3 */}
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="inline-flex items-center px-4 py-2 rounded-full bg-slate-50 text-slate-600 text-sm font-medium">
                    Conversations
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8 sm:space-y-12 lg:space-y-0 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-12 lg:items-center">
            {/* Left Side - Scattered Feedback */}
            <div>
              <div className="text-center mb-4 lg:mb-8">
                <p className="text-xs sm:text-sm uppercase tracking-wider text-gray-500 font-semibold">
                  Scattered Feedback
                </p>
              </div>

              {/* Mobile: Stack max 3 cards | Desktop: all cards stacked */}
              <div className="space-y-4 sm:space-y-6">
                {/* iMessage */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-5 lg:p-6 lg:max-w-sm lg:ml-auto transform hover:scale-105 transition-transform duration-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs sm:text-sm font-semibold text-blue-600">JL</span>
                    </div>
                    <div>
                      <div className="font-semibold text-sm">Jessica Liu</div>
                      <div className="text-xs text-gray-500">iMessage</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-blue-500 text-white rounded-2xl rounded-tr-sm px-4 py-3 ml-auto inline-block text-sm max-w-xs">
                      Thanks again for yesterday!
                    </div>
                    <div className="bg-gray-100 text-gray-900 rounded-2xl rounded-tl-sm px-4 py-3 text-sm max-w-xs">
                      You totally saved us. Your ability to see three steps ahead is exactly what we needed. 🙏
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-5 lg:p-6 lg:max-w-sm transform hover:scale-105 transition-transform duration-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs sm:text-sm font-semibold text-white">MK</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">Marcus Kim</div>
                      <div className="text-xs text-gray-500 truncate">Re: Q4 Strategy Review</div>
                    </div>
                    <div className="text-xs text-gray-400 flex-shrink-0">2:14 PM</div>
                  </div>
                  <div className="text-sm text-gray-700 leading-relaxed">
                    The way you reframed our approach completely shifted the conversation. I've worked with a lot of
                    consultants, and your clarity stands out.
                  </div>
                </div>

                {/* Slack */}
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden lg:max-w-sm lg:ml-auto transform hover:scale-105 transition-transform duration-200">
                  <div className="bg-purple-900 text-white px-4 py-2 flex items-center space-x-2">
                    <span className="text-sm font-semibold">#project-team</span>
                    <span className="text-sm">📌</span>
                  </div>
                  <div className="p-4 sm:p-5">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded bg-teal-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-white">AS</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-semibold text-sm truncate">Aisha Singh</span>
                          <span className="text-xs text-gray-500 flex-shrink-0">11:23 AM</span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          Just wrapped the client call — they were so impressed by how you handled your questions.
                          That's the kind of thinking we need. 💯
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fourth Card - LinkedIn (hidden on mobile for brevity) */}
                <div className="hidden lg:block bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-5 lg:p-6 lg:max-w-sm transform hover:scale-105 transition-transform duration-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs sm:text-sm font-semibold text-white">PP</span>
                    </div>
                    <div>
                      <div className="font-semibold text-sm">Priya Patel</div>
                      <div className="text-xs text-gray-500">LinkedIn Recommendation</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-700 leading-relaxed">
                    I've worked with many consultants over my career, but they stand out for their business acumen and
                    follow-through. They don't just deliver advice—they ensure you succeed with it.
                  </div>
                </div>
              </div>
            </div>

            {/* Center - Transform Arrows (desktop only) */}
            <div className="hidden lg:flex flex-col items-center space-y-6 px-8">
              <div className="flex flex-col items-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <ArrowRight className="w-8 h-8 text-white" />
                </div>
                <div className="w-1 h-12 bg-gradient-to-b from-indigo-300 to-transparent"></div>
              </div>
              <div className="flex flex-col items-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <ArrowRight className="w-8 h-8 text-white" />
                </div>
                <div className="w-1 h-12 bg-gradient-to-b from-indigo-300 to-transparent"></div>
              </div>
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <ArrowRight className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Right Side - Nomee Profile */}
            <DynamicMiniExample />
          </div>

          {/* Bottom Summary */}
          <div className="text-center mt-8 sm:mt-12 lg:mt-20">
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 font-light">It all becomes one Nomee page.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-12 sm:py-16 bg-white px-5 sm:px-6 lg:px-8">
        <div className="max-w-[1120px] mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12 leading-tight px-2">
            Build your reputation on autopilot. Deploy it where it matters.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-full">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-indigo-600">1</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 leading-snug">Collect Feedback After Every Project</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">
                When a project wraps up, request feedback in 30 seconds. Nomee sends them a professional, automated
                request.
              </p>
              <div className="bg-gray-50 p-3 rounded text-sm text-gray-600 leading-relaxed">
                Takes 15 seconds per project. Client gets it when they've seen your value.
              </div>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-indigo-600">2</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 leading-snug">Save Existing Proof You Already Have</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">
                Upload screenshots of Slack messages, text messages, and email replies. Nomee organizes them with
                AI-detected themes.
              </p>
              <div className="bg-gray-50 p-3 rounded text-sm text-gray-600 leading-relaxed">
                "Thanks for the great work!" becomes verified social proof.
              </div>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-indigo-600">3</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 leading-snug">Share Your Nomee Link Everywhere</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">
                Add to email signature, LinkedIn profile, cold emails, proposals. Your reputation works for you 24/7.
              </p>
              <div className="bg-indigo-50 p-3 rounded text-sm leading-relaxed break-all sm:break-normal">
                <Mail className="w-4 h-4 inline mr-2 text-indigo-600 flex-shrink-0" />
                <span className="text-gray-700">What people say: </span>
                <span className="text-indigo-600 font-semibold">nomee.co/your-name</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-12 sm:py-16 bg-gray-50 px-5 sm:px-6 lg:px-8">
        <div className="max-w-[1120px] mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-3 sm:mb-4 leading-tight px-2">
            You've done great work. Where's the proof?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 text-center mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-2">
            Great feedback on your work is buried in Slack, emails, old references from 3 years ago, screenshots you
            can't find. Your reputation is scattered.
          </p>

          <div className="max-w-6xl mx-auto">
            {/* Header Row - Desktop only */}
            <div className="hidden md:grid grid-cols-3 gap-6 mb-4">
              <div className="text-center">
                <div className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Your Reality</div>
              </div>
              <div className="text-center">
                <div className="text-xs uppercase tracking-wider text-red-600 font-semibold">The Feedback Problem</div>
              </div>
              <div className="text-center">
                <div className="text-xs uppercase tracking-wider text-green-600 font-semibold">What Clients Need</div>
              </div>
            </div>

            <div className="space-y-4 md:space-y-4">
              {/* Row 1 */}
              {/* Mobile: Single card container | Desktop: Grid row */}
              <div className="md:grid md:grid-cols-3 md:gap-6">
                {/* Mobile unified card wrapper */}
                <div className="md:hidden rounded-2xl border border-gray-200 bg-white shadow-sm p-5 space-y-3 max-w-full">
                  {/* Mini-panel 1: Your Reality */}
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                    <div className="text-[11px] uppercase tracking-wide font-semibold text-gray-400 mb-2">
                      Your Reality
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-gray-900">Amazing client feedback</div>
                        <div className="text-sm text-gray-500">Across Slack, texts, emails</div>
                      </div>
                    </div>
                  </div>

                  {/* Mini-panel 2: The Feedback Problem */}
                  <div className="bg-red-50 border border-red-100 rounded-xl p-3">
                    <div className="text-[11px] uppercase tracking-wide font-semibold text-red-600 mb-2">
                      The Feedback Problem
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <X className="w-5 h-5 text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-gray-900">Lost in 1000 messages</div>
                        <div className="text-sm text-gray-600">Can't find when needed</div>
                      </div>
                    </div>
                  </div>

                  {/* Mini-panel 3: What Clients Need */}
                  <div className="bg-green-50 border border-green-100 rounded-xl p-3">
                    <div className="text-[11px] uppercase tracking-wide font-semibold text-green-600 mb-2">
                      What Clients Need
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <Check className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-gray-900">One organized place</div>
                        <div className="text-sm text-gray-600">Always accessible</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desktop: Individual cards */}
                <div className="hidden md:block bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-gray-900">Amazing client feedback</div>
                      <div className="text-xs text-gray-500 leading-relaxed">Across Slack, texts, emails</div>
                    </div>
                  </div>
                </div>

                <div className="hidden md:block bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 border border-red-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                      <X className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-gray-900">Lost in 1000 messages</div>
                      <div className="text-xs text-gray-600 leading-relaxed">Can't find when needed</div>
                    </div>
                  </div>
                </div>

                <div className="hidden md:block bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Check className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-gray-900">One organized place</div>
                      <div className="text-xs text-gray-600 leading-relaxed">Always accessible</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2 */}
              <div className="md:grid md:grid-cols-3 md:gap-6">
                {/* Mobile unified card wrapper */}
                <div className="md:hidden rounded-2xl border border-gray-200 bg-white shadow-sm p-5 space-y-3 max-w-full">
                  {/* Mini-panel 1: Your Reality */}
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                    <div className="text-[11px] uppercase tracking-wide font-semibold text-gray-400 mb-2">
                      Your Reality
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <Linkedin className="w-5 h-5 text-gray-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-gray-900">LinkedIn recommendations</div>
                        <div className="text-sm text-gray-500">Last updated: 2020</div>
                      </div>
                    </div>
                  </div>

                  {/* Mini-panel 2: The Feedback Problem */}
                  <div className="bg-red-50 border border-red-100 rounded-xl p-3">
                    <div className="text-[11px] uppercase tracking-wide font-semibold text-red-600 mb-2">
                      The Feedback Problem
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <X className="w-5 h-5 text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-gray-900">Outdated & vague</div>
                        <div className="text-sm text-gray-600">"Great to work with!"</div>
                      </div>
                    </div>
                  </div>

                  {/* Mini-panel 3: What Clients Need */}
                  <div className="bg-green-50 border border-green-100 rounded-xl p-3">
                    <div className="text-[11px] uppercase tracking-wide font-semibold text-green-600 mb-2">
                      What Clients Need
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <Check className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-gray-900">Recent, specific feedback</div>
                        <div className="text-sm text-gray-600">Real work stories</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desktop: Individual cards */}
                <div className="hidden md:block bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-200">
                      <Linkedin className="w-5 h-5 text-gray-700" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-gray-900">LinkedIn recommendations</div>
                      <div className="text-xs text-gray-500 leading-relaxed">Last updated: 2020</div>
                    </div>
                  </div>
                </div>

                <div className="hidden md:block bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 border border-red-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                      <X className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-gray-900">Outdated & vague</div>
                      <div className="text-xs text-gray-600 leading-relaxed">"Great to work with!"</div>
                    </div>
                  </div>
                </div>

                <div className="hidden md:block bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Check className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-gray-900">Recent, specific feedback</div>
                      <div className="text-xs text-gray-600 leading-relaxed">Real work stories</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 3 */}
              <div className="md:grid md:grid-cols-3 md:gap-6">
                {/* Mobile unified card wrapper */}
                <div className="md:hidden rounded-2xl border border-gray-200 bg-white shadow-sm p-5 space-y-3 max-w-full">
                  {/* Mini-panel 1: Your Reality */}
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                    <div className="text-[11px] uppercase tracking-wide font-semibold text-gray-400 mb-2">
                      Your Reality
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-gray-900">Cold outreach sent</div>
                        <div className="text-sm text-gray-500">Generic pitch</div>
                      </div>
                    </div>
                  </div>

                  {/* Mini-panel 2: The Feedback Problem */}
                  <div className="bg-red-50 border border-red-100 rounded-xl p-3">
                    <div className="text-[11px] uppercase tracking-wide font-semibold text-red-600 mb-2">
                      The Feedback Problem
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <X className="w-5 h-5 text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-gray-900">No trust signals</div>
                        <div className="text-sm text-gray-600">Ignored or deleted</div>
                      </div>
                    </div>
                  </div>

                  {/* Mini-panel 3: What Clients Need */}
                  <div className="bg-green-50 border border-green-100 rounded-xl p-3">
                    <div className="text-[11px] uppercase tracking-wide font-semibold text-green-600 mb-2">
                      What Clients Need
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <Check className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-gray-900">Social proof included</div>
                        <div className="text-sm text-gray-600">Link to verified feedback</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desktop: Individual cards */}
                <div className="hidden md:block bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-gray-900">Cold outreach sent</div>
                      <div className="text-xs text-gray-500 leading-relaxed">Generic pitch</div>
                    </div>
                  </div>
                </div>

                <div className="hidden md:block bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 border border-red-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                      <X className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-gray-900">No trust signals</div>
                      <div className="text-xs text-gray-600 leading-relaxed">Ignored or deleted</div>
                    </div>
                  </div>
                </div>

                <div className="hidden md:block bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Check className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-gray-900">Social proof included</div>
                      <div className="text-xs text-gray-600 leading-relaxed">Link to verified feedback</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 text-center px-2">
              <div className="inline-flex items-center space-x-2 bg-gray-900 text-white px-4 sm:px-6 py-3 rounded-full text-sm sm:text-base leading-snug">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="font-medium">Nomee gives you column 3. Everyone else is stuck in column 2.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section id="who-its-for" className="py-12 sm:py-16 px-5 sm:px-6 lg:px-8">
        <div className="max-w-[1120px] mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12 leading-tight px-2">
            Built for professionals who compete on reputation
          </h2>

          <div className="flex justify-center mb-6 sm:mb-8 -mx-5 px-5 sm:mx-0 sm:px-0">
            <div className="inline-flex bg-gray-100 rounded-lg p-1 gap-1">
              <button
                onClick={() => {
                  handleTabChange("freelancer")
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }}
                className={`px-4 py-2 rounded-md text-sm whitespace-nowrap min-h-[44px] ${activeTab === "freelancer" ? "bg-white shadow-sm font-semibold" : ""}`}
              >
                Freelancers
              </button>
              <button
                onClick={() => {
                  handleTabChange("contractor")
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }}
                className={`px-4 py-2 rounded-md text-sm whitespace-nowrap min-h-[44px] ${activeTab === "contractor" ? "bg-white shadow-sm font-semibold" : ""}`}
              >
                Contractors
              </button>
              <button
                onClick={() => {
                  handleTabChange("sales")
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }}
                className={`px-4 py-2 rounded-md text-sm whitespace-nowrap min-h-[44px] ${activeTab === "sales" ? "bg-white shadow-sm font-semibold" : ""}`}
              >
                Sales
              </button>
              <button
                onClick={() => {
                  handleTabChange("consultant")
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }}
                className={`px-4 py-2 rounded-md text-sm whitespace-nowrap min-h-[44px] ${activeTab === "consultant" ? "bg-white shadow-sm font-semibold" : ""}`}
              >
                Consultants
              </button>
              <button
                onClick={() => {
                  handleTabChange("recruiter")
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }}
                className={`px-4 py-2 rounded-md text-sm whitespace-nowrap min-h-[44px] ${activeTab === "recruiter" ? "bg-white shadow-sm font-semibold" : ""}`}
              >
                Recruiters
              </button>
            </div>
          </div>

          {activeTab === "freelancer" && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 sm:p-6 lg:p-8 max-w-4xl mx-auto">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold leading-tight">Freelancers & Creators</h3>
              </div>
              <p className="text-base sm:text-lg text-gray-700 italic mb-6 leading-relaxed">
                "You've completed 50 projects, but every client asks for references. Again."
              </p>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Your Challenge:</h4>
                  <ul className="space-y-3 text-sm sm:text-base text-gray-600 leading-relaxed">
                    <li>• Client testimonials scattered across Slack, email, and texts</li>
                    <li>• New clients can't see your track record</li>
                    <li>• Upwork/Fiverr reviews don't travel with you</li>
                    <li>• Cold outreach gets ignored without social proof</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">How Nomee Helps:</h4>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    Upload screenshots of client praise, request feedback after each project. Your Nomee profile shows
                    "Delivers on time" mentioned 23 times, "Great communication" mentioned 19 times. Put it in your
                    email signature and watch response rates double.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "contractor" && (
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 sm:p-6 lg:p-8 max-w-4xl mx-auto">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold leading-tight">Independent Contractors</h3>
              </div>
              <p className="text-base sm:text-lg text-gray-700 italic mb-6 leading-relaxed">
                "Every contract ends. Your reputation should follow you to the next one."
              </p>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Your Challenge:</h4>
                  <ul className="space-y-3 text-sm sm:text-base text-gray-600 leading-relaxed">
                    <li>• Reputation resets with each new contract</li>
                    <li>• Previous clients won't write LinkedIn recommendations</li>
                    <li>• Agency reputation doesn't transfer to independent work</li>
                    <li>• Hard to differentiate from other contractors</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">How Nomee Helps:</h4>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    Build a portable reputation across all contracts. When clients end engagements with "Great work!"
                    messages, save them. Request formal feedback. Show hiring managers 40+ verified contributions
                    proving your reliability, technical skills, and communication style.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "sales" && (
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-5 sm:p-6 lg:p-8 max-w-4xl mx-auto">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold leading-tight">Sales Professionals</h3>
              </div>
              <p className="text-base sm:text-lg text-gray-700 italic mb-6 leading-relaxed">
                "You close deals by building trust. But prospects can't see your track record."
              </p>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Your Challenge:</h4>
                  <ul className="space-y-3 text-sm sm:text-base text-gray-600 leading-relaxed">
                    <li>• Prospects get cold emails from 10 other sales reps daily</li>
                    <li>• No way to prove you're different from the rest</li>
                    <li>• Client success stories buried in CRM notes</li>
                    <li>• Switching companies means starting reputation from scratch</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">How Nomee Helps:</h4>
                  <p className="text-sm sm:text-base text-gray-600 mb-3 leading-relaxed">
                    Include your Nomee link in cold outreach: "See what 35 clients say about working with me." Show
                    patterns like "Responsive," "No pressure tactics," "Helped us choose right solution." Your
                    reputation becomes your best closer.
                  </p>
                  <div className="bg-white p-4 rounded-lg border-2 border-emerald-200">
                    <p className="text-sm font-semibold text-gray-900">
                      Sales pros using Nomee see 3-4× higher reply rates on cold outreach.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "consultant" && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 sm:p-6 lg:p-8 max-w-4xl mx-auto">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold leading-tight">Consultants & Advisors</h3>
              </div>
              <p className="text-base sm:text-lg text-gray-700 italic mb-6 leading-relaxed">
                "Clients pay you for expertise. But how do they know you're worth $300/hour?"
              </p>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Your Challenge:</h4>
                  <ul className="space-y-3 text-sm sm:text-base text-gray-600 leading-relaxed">
                    <li>• NDAs prevent you from sharing client names publicly</li>
                    <li>• Generic testimonials don't convey specific expertise</li>
                    <li>• Prospects need proof before paying premium rates</li>
                    <li>• Referrals are word-of-mouth only</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">How Nomee Helps:</h4>
                  <p className="text-sm sm:text-base text-gray-600 mb-3 leading-relaxed">
                    Collect anonymous feedback that shows your impact without revealing client identities. Prospects see
                    verified patterns: "Strategic thinking," "ROI exceeded expectations," "Delivered actionable
                    insights." Your expertise becomes provable.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "recruiter" && (
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 sm:p-6 lg:p-8 max-w-4xl mx-auto">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold leading-tight">Agency Recruiters</h3>
              </div>
              <p className="text-base sm:text-lg text-gray-700 italic mb-6 leading-relaxed">
                "You've placed 200 candidates, but you have zero portable proof."
              </p>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Your Challenge:</h4>
                  <ul className="space-y-3 text-sm sm:text-base text-gray-600 leading-relaxed">
                    <li>• Every recruiter claims to be "different"</li>
                    <li>• Reputation trapped at your agency when you switch</li>
                    <li>• Candidates ignore cold emails without trust signals</li>
                    <li>• Competing against recruiters with 10+ years at one firm</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">How Nomee Helps:</h4>
                  <p className="text-sm sm:text-base text-gray-600 mb-3 leading-relaxed">
                    47 verified contributions showing "Responsive" (31×), "Honest" (24×), "Follow-through" (17×). When
                    candidates Google you before your call, they find proof. Add to email signatures, LinkedIn profiles.
                    Your reputation becomes your unfair advantage.
                  </p>
                  <div className="bg-white p-4 rounded-lg border-2 border-indigo-200">
                    <p className="text-sm font-semibold text-gray-900">
                      Recruiters using Nomee see 2.5× higher callback rates and close 2-3 extra placements per year.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-12 sm:py-16 px-5 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-[1120px] mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-3 sm:mb-4 leading-tight px-2">
            Simple pricing for professionals
          </h2>
          <p className="text-base sm:text-lg text-gray-600 text-center mb-8 sm:mb-12">
            Start free, upgrade when you're ready
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {/* Start Collecting - Free */}
            <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-200 p-5 sm:p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Start Collecting</h2>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">$0</span>
                <span className="text-gray-600">/forever</span>
              </div>
              <p className="text-gray-600 mb-8">Perfect for building initial proof</p>

              <div className="space-y-3 sm:space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    Unlimited feedback requests
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    Upload 10 saved feedback items
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-gray-700">Public Nomee page</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    Auto-generated reputation themes
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-gray-700 leading-relaxed">Basic analytics</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full border-2 border-gray-300 text-gray-900 min-h-[48px] py-3 rounded-lg font-medium hover:border-gray-400 bg-transparent"
              >
                Start Free
              </Button>
              <p className="text-center text-sm text-gray-500 mt-3">No credit card required</p>
            </div>

            {/* Build Momentum - $15.99/month */}
            <div className="bg-white rounded-2xl shadow-sm border-2 border-indigo-200 p-5 sm:p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Build Momentum</h2>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">$15.99</span>
                <span className="text-gray-600">/month</span>
              </div>
              <p className="text-gray-600 mb-2">or $149/year (save 22%)</p>
              <p className="text-gray-600 mb-8">For growing professionals collecting more feedback</p>

              <div className="space-y-3 sm:space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-gray-700 font-semibold">Everything in Free, plus:</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-gray-700">Upload 30 saved feedback items</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-gray-700">Voice note collection</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-gray-700">Custom views & filtering</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-gray-700">3 featured contributions</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-gray-700">Standard support</span>
                </div>
              </div>

              <Button className="w-full bg-indigo-600 text-white min-h-[48px] py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                Start 14-Day Free Trial
              </Button>
            </div>

            {/* Reputation on Autopilot - $29.99/month - MOST POPULAR */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-5 sm:p-6 text-white relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-amber-400 text-gray-900 px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shadow-md">
                MOST POPULAR
              </div>
              <h2 className="text-2xl font-bold mb-2 mt-2">Reputation on Autopilot</h2>
              <div className="mb-6">
                <span className="text-5xl font-bold">$29.99</span>
                <span className="text-indigo-100">/month</span>
              </div>
              <p className="text-indigo-100 mb-2">or $249/year (save 31%)</p>
              <p className="text-indigo-100 mb-8">For professionals who compete on trust daily</p>

              <div className="space-y-3 sm:space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-white mr-3 flex-shrink-0 mt-0.5" />
                  <span className="font-semibold">Everything in Build Momentum, plus:</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-white mr-3 flex-shrink-0 mt-0.5" />
                  <span>Unlimited saved feedback uploads</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-white mr-3 flex-shrink-0 mt-0.5" />
                  <span>Unlimited featured contributions</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-white mr-3 flex-shrink-0 mt-0.5" />
                  <span>Embed Nomee on your website</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-white mr-3 flex-shrink-0 mt-0.5" />
                  <span>One-click PDF export</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-white mr-3 flex-shrink-0 mt-0.5" />
                  <span>Monthly reputation digest</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-white mr-3 flex-shrink-0 mt-0.5" />
                  <span>Advanced analytics & insights</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-white mr-3 flex-shrink-0 mt-0.5" />
                  <span>Priority support</span>
                </div>
              </div>

              <Button className="w-full bg-white text-indigo-600 min-h-[48px] py-3 rounded-lg font-bold hover:bg-gray-50 transition-colors">
                Start 14-Day Free Trial
              </Button>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-12 sm:mt-20 text-center space-y-3 px-2">
            <p className="text-gray-600">
              All plans include unlimited written contributions and basic reputation themes
            </p>
            <p className="text-gray-600">
              Need a custom plan for your team?{" "}
              <Link href="/contact" className="text-indigo-600 font-medium hover:text-indigo-700">
                Contact us
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-indigo-600 to-purple-700 text-white px-5 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            Start building reputation that follows you forever
          </h2>
          <p className="text-lg sm:text-xl text-indigo-100 leading-relaxed max-w-2xl mx-auto">
            Your best work deserves to be seen. Nomee makes your reputation portable, verifiable, and working for you
            24/7.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto pt-2">
            <Button
              variant="default"
              className="w-full sm:w-auto bg-white text-indigo-600 px-6 sm:px-8 min-h-[48px] sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-indigo-50"
            >
              Start Free - Build My Nomee
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto border-2 border-white text-white px-6 sm:px-8 min-h-[48px] sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-white hover:bg-opacity-10 bg-transparent"
            >
              See Real Examples First
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-indigo-100 text-sm pt-4">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 flex-shrink-0" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 flex-shrink-0" />
              <span>Setup in 5 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 flex-shrink-0" />
              <span>14-day Pro trial</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-5 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-8 mb-8">
            <div className="max-w-xs">
              <div
                className="text-white text-2xl font-bold tracking-tight mb-3"
                style={{ fontFamily: "system-ui, -apple-system, sans-serif", letterSpacing: "-0.02em" }}
              >
                nomee
              </div>
              <p className="text-sm text-gray-500">Portable reputation for professionals who compete on trust.</p>
            </div>

            <div className="grid grid-cols-2 sm:flex sm:space-x-12 lg:space-x-16 gap-8 sm:gap-0 w-full sm:w-auto">
              <div>
                <h4 className="text-white font-semibold mb-3 text-sm">Product</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#" className="hover:text-white">
                      How It Works
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Who It's For
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Pricing
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-3 text-sm">Company</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#" className="hover:text-white">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-3 text-sm">Legal</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#" className="hover:text-white">
                      Privacy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Terms
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Security
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-sm text-center text-gray-500">
            &copy; 2025 Nomee. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
