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

export default function Home() {
  const [activeTab, setActiveTab] = useState<"freelancer" | "contractor" | "sales" | "consultant" | "recruiter">(
    "freelancer",
  )

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      {/* Hero Section */}
      <section className="pt-24 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="max-w-[1120px] mx-auto">
          <div className="text-center max-w-5xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Shield className="w-4 h-4" />
              <span>Trusted by 500+ professionals across industries</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-[1.05]">
              Your reputation is your biggest asset. Stop losing it.
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-4 font-light leading-relaxed max-w-[36ch] sm:max-w-2xl mx-auto">
              Nomee turns <strong className="font-semibold text-gray-900">scattered feedback</strong> from clients,
              colleagues, and collaborators into verified social proof that wins deals, builds trust, and follows you{" "}
              <strong className="font-semibold text-gray-900">throughout your career</strong>.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 sm:mb-12">
              <Button
                variant="default"
                className="w-full sm:w-auto px-8 h-12 sm:h-auto sm:py-4 rounded-xl text-base sm:text-lg font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
              >
                Build My Reputation Profile
              </Button>
              <Link href="/what-is-nomee" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full px-8 h-12 sm:h-auto sm:py-4 rounded-xl text-base sm:text-lg font-semibold hover:border-gray-300 transition-all bg-transparent"
                >
                  See How It Works
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>Free to start</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>Setup in 5 minutes</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>No credit card required</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Flow Section */}
      <section className="py-12 sm:py-20 lg:py-32 bg-gradient-to-b from-white to-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1120px] mx-auto">
          <div className="text-center mb-12 sm:mb-20">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
              Real feedback — saved as it happens.
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 font-light max-w-3xl mx-auto">
              Transform scattered praise into a verified professional reputation
            </p>
          </div>

          <div className="lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-16 lg:items-center max-w-7xl mx-auto">
            {/* Left Side - Scattered Feedback */}
            <div className="mb-8 lg:mb-0">
              <div className="text-center mb-6 lg:mb-8">
                <p className="text-xs sm:text-sm uppercase tracking-wider text-gray-500 font-semibold">
                  Scattered Feedback
                </p>
              </div>

              <div className="lg:space-y-8 overflow-x-auto snap-x snap-mandatory lg:overflow-visible flex lg:block gap-4 pb-4 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0">
                {/* iMessage */}
                <div className="min-w-[280px] sm:min-w-[320px] lg:min-w-0 snap-center lg:snap-none flex-shrink-0 bg-white rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6 lg:max-w-sm lg:ml-auto transform hover:scale-105 transition-transform duration-200">
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
                <div className="min-w-[280px] sm:min-w-[320px] lg:min-w-0 snap-center lg:snap-none flex-shrink-0 bg-white rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6 lg:max-w-sm transform hover:scale-105 transition-transform duration-200">
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
                <div className="min-w-[280px] sm:min-w-[320px] lg:min-w-0 snap-center lg:snap-none flex-shrink-0 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden lg:max-w-sm lg:ml-auto transform hover:scale-105 transition-transform duration-200">
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
              </div>
            </div>

            {/* Center - Transform Arrows */}
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
            <div>
              <div className="text-center mb-6 lg:mb-8">
                <p className="text-xs sm:text-sm uppercase tracking-wider text-indigo-600 font-semibold">
                  One Nomee Page
                </p>
              </div>

              <div className="bg-gradient-to-br from-white to-indigo-50 rounded-3xl shadow-2xl border-2 border-indigo-100 p-6 sm:p-8 lg:p-10 transform hover:scale-105 transition-transform duration-200">
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Maya Torres</h3>
                  <p className="text-base sm:text-lg text-gray-600">Product Designer</p>
                </div>

                <div className="mb-6 sm:mb-8">
                  <p className="text-sm text-gray-600 mb-4 font-medium">
                    What consistently shows up when people talk about working with Maya:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
                      Strategic
                    </span>
                    <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
                      Problem solver
                    </span>
                    <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
                      Clear communicator
                    </span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border-2 border-indigo-200 p-6 sm:p-8 shadow-lg">
                  <div className="flex items-start space-x-1 mb-3">
                    <span className="text-3xl text-indigo-300">"</span>
                    <p className="text-gray-700 italic leading-relaxed text-sm sm:text-base">
                      <span className="font-semibold text-gray-900">Maya brings incredible strategic clarity</span> to
                      complex projects. She helped us restructure our product roadmap and the results were{" "}
                      <span className="font-semibold text-gray-900">transformative</span>."
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
                    <span className="text-sm text-gray-600 font-medium">— Alex Rivera, TechCorp</span>
                    <Shield className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                  </div>
                </div>

                {/* See Full Example link */}
                <div className="mt-6 sm:mt-8 text-center">
                  <Link
                    href="/example"
                    className="inline-flex items-center justify-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl min-h-[44px]"
                  >
                    <span>See Full Example</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Summary */}
          <div className="text-center mt-12 sm:mt-16 lg:mt-20">
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 font-light">All of it becomes one Nomee page.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-12 sm:py-16 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1120px] mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12 leading-tight">
            Request & Build reputation on autopilot. Deploy it where it matters.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
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
      <section className="py-12 sm:py-16 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1120px] mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-4">
            You've done great work. Where's the proof?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 text-center mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
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

            {/* Mobile: Stacked cards | Desktop: 3-column grid */}
            <div className="space-y-6 md:space-y-4">
              {/* Row 1 */}
              <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-3 md:gap-6">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-3 md:hidden">
                    Your Reality
                  </div>
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

                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 border border-red-100">
                  <div className="text-xs uppercase tracking-wider text-red-600 font-semibold mb-3 md:hidden">
                    The Feedback Problem
                  </div>
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

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                  <div className="text-xs uppercase tracking-wider text-green-600 font-semibold mb-3 md:hidden">
                    What Clients Need
                  </div>
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
              <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-3 md:gap-6">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-3 md:hidden">
                    Your Reality
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <Linkedin className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-gray-900">LinkedIn recommendations</div>
                      <div className="text-xs text-gray-500 leading-relaxed">Last updated: 2020</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 border border-red-100">
                  <div className="text-xs uppercase tracking-wider text-red-600 font-semibold mb-3 md:hidden">
                    The Feedback Problem
                  </div>
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

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                  <div className="text-xs uppercase tracking-wider text-green-600 font-semibold mb-3 md:hidden">
                    What Clients Need
                  </div>
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
              <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-3 md:gap-6">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-3 md:hidden">
                    Your Reality
                  </div>
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

                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 border border-red-100">
                  <div className="text-xs uppercase tracking-wider text-red-600 font-semibold mb-3 md:hidden">
                    The Feedback Problem
                  </div>
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

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                  <div className="text-xs uppercase tracking-wider text-green-600 font-semibold mb-3 md:hidden">
                    What Clients Need
                  </div>
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

            <div className="mt-6 sm:mt-8 text-center">
              <div className="inline-flex items-center space-x-2 bg-gray-900 text-white px-4 sm:px-6 py-3 rounded-full text-sm sm:text-base">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="font-medium">Nomee gives you column 3. Everyone else is stuck in column 2.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section id="who-its-for" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1120px] mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12 leading-tight">
            Built for professionals who compete on reputation
          </h2>

          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="w-full overflow-x-auto">
              <div className="inline-flex bg-gray-100 rounded-lg p-1 gap-1 min-w-full sm:min-w-0 justify-start sm:justify-center">
                <button
                  onClick={() => setActiveTab("freelancer")}
                  className={`px-4 py-2 rounded-md text-sm whitespace-nowrap min-h-[44px] ${activeTab === "freelancer" ? "bg-white shadow-sm font-semibold" : ""}`}
                >
                  Freelancers
                </button>
                <button
                  onClick={() => setActiveTab("contractor")}
                  className={`px-4 py-2 rounded-md text-sm whitespace-nowrap min-h-[44px] ${activeTab === "contractor" ? "bg-white shadow-sm font-semibold" : ""}`}
                >
                  Contractors
                </button>
                <button
                  onClick={() => setActiveTab("sales")}
                  className={`px-4 py-2 rounded-md text-sm whitespace-nowrap min-h-[44px] ${activeTab === "sales" ? "bg-white shadow-sm font-semibold" : ""}`}
                >
                  Sales
                </button>
                <button
                  onClick={() => setActiveTab("consultant")}
                  className={`px-4 py-2 rounded-md text-sm whitespace-nowrap min-h-[44px] ${activeTab === "consultant" ? "bg-white shadow-sm font-semibold" : ""}`}
                >
                  Consultants
                </button>
                <button
                  onClick={() => setActiveTab("recruiter")}
                  className={`px-4 py-2 rounded-md text-sm whitespace-nowrap min-h-[44px] ${activeTab === "recruiter" ? "bg-white shadow-sm font-semibold" : ""}`}
                >
                  Recruiters
                </button>
              </div>
            </div>
          </div>

          {activeTab === "freelancer" && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto">
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
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto">
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
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto">
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
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto">
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
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto">
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
      <section id="pricing" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-[1120px] mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-4 leading-tight">
            Simple pricing for professionals
          </h2>
          <p className="text-base sm:text-lg text-gray-600 text-center mb-8 sm:mb-12">
            Start free, upgrade when you're ready
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {/* Start Collecting - Free */}
            <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Start Collecting</h2>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">$0</span>
                <span className="text-gray-600">/forever</span>
              </div>
              <p className="text-gray-600 mb-8">Perfect for building initial proof</p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Unlimited feedback requests</span>
                </div>
                <div className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Upload 10 saved feedback items</span>
                </div>
                <div className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Public Nomee page</span>
                </div>
                <div className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Auto-generated reputation themes</span>
                </div>
                <div className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Basic analytics</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full border-2 border-gray-300 text-gray-900 py-3 rounded-lg font-medium hover:border-gray-400 bg-transparent"
              >
                Start Free
              </Button>
              <p className="text-center text-sm text-gray-500 mt-3">No credit card required</p>
            </div>

            {/* Build Momentum - $15.99/month */}
            <div className="bg-white rounded-2xl shadow-sm border-2 border-indigo-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Build Momentum</h2>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">$15.99</span>
                <span className="text-gray-600">/month</span>
              </div>
              <p className="text-gray-600 mb-2">or $149/year (save 22%)</p>
              <p className="text-gray-600 mb-8">For growing professionals collecting more feedback</p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <Check className="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-semibold">Everything in Free, plus:</span>
                </div>
                <div className="flex items-start">
                  <Check className="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Upload 30 saved feedback items</span>
                </div>
                <div className="flex items-start">
                  <Check className="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Voice note collection</span>
                </div>
                <div className="flex items-start">
                  <Check className="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Custom views & filtering</span>
                </div>
                <div className="flex items-start">
                  <Check className="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">3 featured contributions</span>
                </div>
                <div className="flex items-start">
                  <Check className="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Standard support</span>
                </div>
              </div>

              <Button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                Start 14-Day Free Trial
              </Button>
            </div>

            {/* Reputation on Autopilot - $29.99/month - MOST POPULAR */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white relative">
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

              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <Check className="w-5 h-5 text-white mr-3 flex-shrink-0 mt-0.5" />
                  <span className="font-semibold">Everything in Build Momentum, plus:</span>
                </div>
                <div className="flex items-start">
                  <Check className="w-5 h-5 text-white mr-3 flex-shrink-0 mt-0.5" />
                  <span>Unlimited saved feedback uploads</span>
                </div>
                <div className="flex items-start">
                  <Check className="w-5 h-5 text-white mr-3 flex-shrink-0 mt-0.5" />
                  <span>Unlimited featured contributions</span>
                </div>
                <div className="flex items-start">
                  <Check className="w-5 h-5 text-white mr-3 flex-shrink-0 mt-0.5" />
                  <span>Embed Nomee on your website</span>
                </div>
                <div className="flex items-start">
                  <Check className="w-5 h-5 text-white mr-3 flex-shrink-0 mt-0.5" />
                  <span>One-click PDF export</span>
                </div>
                <div className="flex items-start">
                  <Check className="w-5 h-5 text-white mr-3 flex-shrink-0 mt-0.5" />
                  <span>Monthly reputation digest</span>
                </div>
                <div className="flex items-start">
                  <Check className="w-5 h-5 text-white mr-3 flex-shrink-0 mt-0.5" />
                  <span>Advanced analytics & insights</span>
                </div>
                <div className="flex items-start">
                  <Check className="w-5 h-5 text-white mr-3 flex-shrink-0 mt-0.5" />
                  <span>Priority support</span>
                </div>
              </div>

              <Button className="w-full bg-white text-indigo-600 py-3 rounded-lg font-bold hover:bg-gray-50 transition-colors">
                Start 14-Day Free Trial
              </Button>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-20 text-center">
            <p className="text-gray-600 mb-4">
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
      <section className="py-20 bg-gradient-to-br from-indigo-600 to-purple-700 text-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Start building reputation that follows you forever</h2>
          <p className="text-xl text-indigo-100 mb-8">
            Your best work deserves to be seen. Nomee makes your reputation portable, verifiable, and working for you
            24/7.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="default"
              className="bg-white text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-50"
            >
              Start Free - Build My Nomee
            </Button>
            <Button
              variant="outline"
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:bg-opacity-10 bg-transparent"
            >
              See Real Examples First
            </Button>
          </div>
          <div className="flex items-center justify-center space-x-6 mt-8 text-indigo-100 text-sm">
            <div className="flex items-center">
              <Check className="w-4 h-4 mr-2" />
              No credit card required
            </div>
            <div className="flex items-center">
              <Check className="w-4 h-4 mr-2" />
              Setup in 5 minutes
            </div>
            <div className="flex items-center">
              <Check className="w-4 h-4 mr-2" />
              14-day Pro trial
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-start mb-8">
            <div className="max-w-xs">
              <div
                className="text-white text-2xl font-bold tracking-tight mb-3"
                style={{ fontFamily: "system-ui, -apple-system, sans-serif", letterSpacing: "-0.02em" }}
              >
                nomee
              </div>
              <p className="text-sm text-gray-500">Portable reputation for professionals who compete on trust.</p>
            </div>

            <div className="flex space-x-16">
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
