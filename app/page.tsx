"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ModalSignup } from "@/components/modal-signup"
import { motion } from "framer-motion"
import { SiteHeader } from "@/components/site-header"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { RealNomeeSlice } from "@/components/real-nomee-slice"

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<"deck" | "recognition">("deck")
  const [expandedOutcome, setExpandedOutcome] = useState<number | null>(null)
  const [expandedFramework, setExpandedFramework] = useState<string | null>(null)
  const [heroTab, setHeroTab] = useState<"professional" | "decision-maker">("professional")
  const [showAllTraits, setShowAllTraits] = useState(false)
  const [activeDecisionTab, setActiveDecisionTab] = useState<"hiring" | "partnerships" | "clients">("hiring") // Added state for decision tab

  const openModal = (type: "deck" | "recognition") => {
    setModalType(type)
    setIsModalOpen(true)
  }

  return (
    <>
      <div className="min-h-screen bg-white">
        <SiteHeader onCreateClick={() => openModal("deck")} />

        <section className="pt-24 md:pt-32 pb-16 md:pb-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              {/* Left: Product-first copy */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6 lg:pt-8"
              >
                <p className="text-sm text-slate-600 font-medium">Trusted by the people who decide.</p>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight tracking-tight">
                  Your reputation already exists.
                </h1>

                <p className="text-lg md:text-xl lg:text-2xl text-slate-700 leading-relaxed">
                  A living record of how people experience working with you.
                </p>

                <div className="flex flex-col sm:flex-row items-start gap-4 pt-2 md:pt-4">
                  <Button
                    onClick={() => openModal("deck")}
                    size="lg"
                    className="w-full sm:w-auto bg-slate-900 text-white hover:bg-slate-800 rounded-full px-8 py-6 text-base font-medium shadow-lg hover:shadow-xl transition-all"
                  >
                    Create your Nomee Page
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>

                  <Link
                    href="/maya-torres"
                    className="w-full sm:w-auto text-center sm:text-left text-slate-600 hover:text-slate-900 font-medium text-base flex items-center justify-center gap-2 px-4 py-3"
                  >
                    See an example →
                  </Link>
                </div>

                <p className="text-sm text-slate-500">Start free. No card required.</p>
              </motion.div>

              {/* Right: Real Nomee Slice (Desktop) */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="hidden lg:block"
              >
                <RealNomeeSlice />
              </motion.div>
            </div>

            {/* Mobile: Real Nomee Slice below hero copy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:hidden mt-10"
            >
              <RealNomeeSlice />
            </motion.div>
          </div>
        </section>

        <section className="relative py-16 md:py-24 px-6 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.03),transparent_50%)]" />

          <div className="relative max-w-7xl mx-auto">
            {/* Section title */}
            <div className="text-center mb-12 md:mb-16">
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl md:text-4xl lg:text-5xl font-semibold text-slate-900 tracking-tight"
              >
                Two ways your Nomee grows
              </motion.h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-16 max-w-6xl mx-auto">
              {/* Collect new perspectives - shown first on mobile */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-4 transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1 hover:border-slate-300"
              >
                <h4 className="text-xl md:text-2xl font-semibold text-slate-900">Collect new perspectives</h4>
                <p className="text-base text-slate-700 leading-relaxed">
                  Share your Nomee link.
                  <br />
                  People contribute 1–3 sentences (optional voice).
                  <br />
                  Patterns form as more people share how it feels to work with you.
                </p>
                <p className="text-sm text-slate-500 pt-2">Free · Unlimited</p>
              </motion.div>

              {/* Save existing praise */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-4 transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1 hover:border-slate-300"
              >
                <h4 className="text-xl md:text-2xl font-semibold text-slate-900">Save existing praise</h4>
                <p className="text-base text-slate-700 leading-relaxed">
                  Upload and store screenshots, emails, Slack messages, texts, or DMs you already have.
                  <br />
                  Nomee pulls out key traits and keeps it organized over time.
                </p>
                <p className="text-sm text-slate-500 pt-2">3 uploads free · Unlimited on Pro</p>
              </motion.div>
            </div>

            {/* Bottom line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-center mb-12 md:mb-16"
            >
              <p className="text-base md:text-lg text-slate-700 leading-relaxed max-w-4xl mx-auto px-4">
                Don't lose the praise that shows how people experience working with you.
              </p>
            </motion.div>

            <div className="relative max-w-6xl mx-auto">
              {/* Mobile: horizontal scroll container */}
              <div className="md:hidden overflow-x-auto scrollbar-hide -mx-6 px-6">
                <div className="flex gap-4 pb-4" style={{ width: "max-content" }}>
                  {/* iMessage snippet */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="flex-shrink-0 w-[85vw] max-w-sm"
                  >
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden h-60 flex flex-col">
                      <div className="bg-[#f5f5f7] border-b border-slate-200 px-4 py-3 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-white text-xs font-semibold">
                          JL
                        </div>
                        <div>
                          <div className="text-xs font-medium text-slate-900">Jessica Liu</div>
                          <div className="text-[10px] text-slate-500">iMessage</div>
                        </div>
                      </div>
                      <div className="p-4 space-y-2 flex-1 flex flex-col justify-end">
                        <div className="bg-blue-500 text-white rounded-2xl rounded-br-sm px-4 py-2 text-sm ml-auto max-w-[85%]">
                          Thanks again for yesterday!
                        </div>
                        <div className="bg-slate-200 text-slate-900 rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm max-w-[85%] leading-snug">
                          You totally saved us. Your ability to see three steps ahead is exactly what we needed. 🙏
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Email snippet */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="flex-shrink-0 w-[85vw] max-w-sm"
                  >
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden h-60 flex flex-col">
                      <div className="bg-white border-b border-slate-200 px-4 py-3">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-semibold mt-0.5">
                            MK
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-slate-900">Marcus Kim</div>
                            <div className="text-[10px] text-slate-500 truncate">Re: Q4 Strategy Review</div>
                          </div>
                          <div className="text-[10px] text-slate-400">2:14 PM</div>
                        </div>
                      </div>
                      <div className="p-4 flex-1 flex items-center">
                        <p className="text-xs leading-relaxed text-slate-700">
                          The way you reframed our approach completely shifted the conversation. I've worked with a lot
                          of consultants, and your clarity stands out. Let's definitely work together again next
                          quarter.
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Slack snippet */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="flex-shrink-0 w-[85vw] max-w-sm"
                  >
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden h-60 flex flex-col">
                      <div className="bg-[#4a154b] px-4 py-3 flex items-center gap-2">
                        <div className="flex items-center gap-2 flex-1">
                          <div className="text-white text-xs font-semibold">#project-team</div>
                        </div>
                        <svg className="w-4 h-4 text-white/70" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M6 10.5C6 9.67157 6.67157 9 7.5 9C8.32843 9 9 9.67157 9 10.5C9 11.3284 8.32843 12 7.5 12H6V10.5Z" />
                          <path d="M6 13.5C6 12.6716 6.67157 12 7.5 12C8.32843 12 9 12.6716 9 13.5V15C9 15.8284 8.32843 16.5 7.5 16.5C6.67157 16.5 6 15.8284 6 15V13.5Z" />
                          <path d="M10.5 6C9.67157 6 9 6.67157 9 7.5C9 8.32843 9.67157 9 10.5 9H12V7.5C12 6.67157 11.3284 6 10.5 6Z" />
                          <path d="M13.5 6C12.6716 6 12 6.67157 12 7.5C12 8.32843 12.6716 9 13.5 9H15C15.8284 9 16.5 8.32843 16.5 7.5C16.5 6.67157 15.8284 6 15 6H13.5Z" />
                        </svg>
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-center">
                        <div className="flex items-start gap-2 w-full">
                          <div className="w-6 h-6 rounded bg-teal-500 flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0 mt-0.5">
                            AS
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2 mb-1">
                              <span className="text-xs font-semibold text-slate-900">Aisha Singh</span>
                              <span className="text-[10px] text-slate-500">11:23 AM</span>
                            </div>
                            <p className="text-xs leading-relaxed text-slate-700">
                              Just wrapped the client call — they were so impressed by how you handled their questions
                              and concerns. That's the kind of thinking we need more of. 💯
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Desktop: three columns */}
              <div className="hidden md:grid md:grid-cols-3 gap-6 mb-12">
                {/* iMessage snippet */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="relative group"
                >
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow duration-300 h-60 flex flex-col">
                    {/* iMessage header */}
                    <div className="bg-[#f5f5f7] border-b border-slate-200 px-4 py-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-white text-xs font-semibold">
                        JL
                      </div>
                      <div>
                        <div className="text-xs font-medium text-slate-900">Jessica Liu</div>
                        <div className="text-[10px] text-slate-500">iMessage</div>
                      </div>
                    </div>
                    {/* iMessage content */}
                    <div className="p-4 space-y-2 flex-1 flex flex-col justify-end">
                      <div className="bg-blue-500 text-white rounded-2xl rounded-br-sm px-4 py-2 text-sm ml-auto max-w-[85%]">
                        Thanks again for yesterday!
                      </div>
                      <div className="bg-slate-200 text-slate-900 rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm max-w-[85%] leading-snug">
                        You totally saved us. Your ability to see three steps ahead is exactly what we needed. 🙏
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Email snippet */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="relative group"
                >
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow duration-300 h-60 flex flex-col">
                    {/* Gmail header */}
                    <div className="bg-white border-b border-slate-200 px-4 py-3">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-semibold mt-0.5">
                          MK
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-slate-900">Marcus Kim</div>
                          <div className="text-[10px] text-slate-500 truncate">Re: Q4 Strategy Review</div>
                        </div>
                        <div className="text-[10px] text-slate-400">2:14 PM</div>
                      </div>
                    </div>
                    {/* Email content */}
                    <div className="p-4 flex-1 flex items-center">
                      <p className="text-xs leading-relaxed text-slate-700">
                        The way you reframed our approach completely shifted the conversation. I've worked with a lot of
                        consultants, and your clarity stands out. Let's definitely work together again next quarter.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Slack snippet - Fixed height alignment to match other cards */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="relative group"
                >
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow duration-300 h-60 flex flex-col">
                    {/* Slack header */}
                    <div className="bg-[#4a154b] px-4 py-3 flex items-center gap-2">
                      <div className="flex items-center gap-2 flex-1">
                        <div className="text-white text-xs font-semibold">#project-team</div>
                      </div>
                      <svg className="w-4 h-4 text-white/70" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 10.5C6 9.67157 6.67157 9 7.5 9C8.32843 9 9 9.67157 9 10.5C9 11.3284 8.32843 12 7.5 12H6V10.5Z" />
                        <path d="M6 13.5C6 12.6716 6.67157 12 7.5 12C8.32843 12 9 12.6716 9 13.5V15C9 15.8284 8.32843 16.5 7.5 16.5C6.67157 16.5 6 15.8284 6 15V13.5Z" />
                        <path d="M10.5 6C9.67157 6 9 6.67157 9 7.5C9 8.32843 9.67157 9 10.5 9H12V7.5C12 6.67157 11.3284 6 10.5 6Z" />
                        <path d="M13.5 6C12.6716 6 12 6.67157 12 7.5C12 8.32843 12.6716 9 13.5 9H15C15.8284 9 16.5 8.32843 16.5 7.5C16.5 6.67157 15.8284 6 15 6H13.5Z" />
                      </svg>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-center">
                      <div className="flex items-start gap-2 w-full">
                        <div className="w-6 h-6 rounded bg-teal-500 flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0 mt-0.5">
                          AS
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-xs font-semibold text-slate-900">Aisha Singh</span>
                            <span className="text-[10px] text-slate-500">11:23 AM</span>
                          </div>
                          <p className="text-xs leading-relaxed text-slate-700">
                            Just wrapped the client call — they were so impressed by how you handled their questions and
                            concerns. That's the kind of thinking we need more of. 💯
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Three-way arrow convergence to CTA */}
              <div className="relative">
                {/* Decorative flow lines */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                  className="absolute -top-6 left-0 right-0 h-24 hidden md:block"
                >
                  <svg className="w-full h-full" viewBox="0 0 1200 96" preserveAspectRatio="xMidYMid meet">
                    {/* Left arrow: straight down from left card center, then horizontal to center */}
                    <path
                      d="M 200 0 L 200 48 L 600 48"
                      stroke="rgba(148, 163, 184, 0.4)"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="6 6"
                      strokeLinecap="round"
                    />
                    {/* Center arrow: straight down from middle card center */}
                    <path
                      d="M 600 0 L 600 96"
                      stroke="rgba(148, 163, 184, 0.4)"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="6 6"
                      strokeLinecap="round"
                    />
                    {/* Right arrow: straight down from right card center, then horizontal to center */}
                    <path
                      d="M 1000 0 L 1000 48 L 600 48"
                      stroke="rgba(148, 163, 184, 0.4)"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="6 6"
                      strokeLinecap="round"
                    />
                  </svg>
                </motion.div>

                {/* Primary CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center gap-3 md:gap-4"
                >
                  <Link
                    href="/auth/signup"
                    className="w-full md:w-auto group relative inline-flex items-center justify-center px-8 md:px-10 py-4 bg-slate-900 text-white rounded-full font-medium text-base hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105"
                  >
                    <span>Start saving your proof</span>
                    <svg
                      className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                  <p className="text-xs text-slate-500 text-center px-4">
                    Have your reputation ready when you need it the most
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Updated embed section to use "Proof Tiles" terminology */}
        <section className="py-20 px-6 bg-gradient-to-b from-white to-slate-50">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-6"
            >
              <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">Use your Proof Link anywhere</h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Share your Proof Link anywhere for free. Embed your Proof Tiles to any website with Pro.
              </p>

              <p className="text-sm text-slate-500 max-w-xl mx-auto">
                Add your proof tiles to any website, your portfolio, media kit, brand kit, Linktree -- it will auto
                update as new ones come in.
              </p>

              {/* Mock embed visual */}
              <div className="mt-8 max-w-3xl mx-auto">
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-lg bg-white">
                  <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-300" />
                    <div className="w-3 h-3 rounded-full bg-slate-300" />
                    <div className="w-3 h-3 rounded-full bg-slate-300" />
                    <div className="ml-4 flex-1 bg-white rounded px-3 py-1 text-xs text-slate-500">
                      yoursite.com/about
                    </div>
                  </div>
                  <div className="p-8 space-y-6">
                    {/* Page content placeholder */}
                    <div className="space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-3/4" />
                      <div className="h-4 bg-slate-200 rounded w-full" />
                      <div className="h-4 bg-slate-200 rounded w-5/6" />
                    </div>

                    <div className="relative overflow-hidden">
                      <div className="flex gap-3 animate-scroll-left">
                        {/* First set of cards */}
                        <div className="flex gap-3 flex-shrink-0">
                          {/* Card 1 */}
                          <div className="w-64 border border-slate-200 rounded-lg p-4 bg-white shadow-sm">
                            <p className="text-sm text-slate-700 leading-relaxed mb-3">
                              "Clear communicator, calm under pressure, and deeply thoughtful in how she approaches
                              complex work."
                            </p>
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-8 h-8 rounded-full bg-slate-200" />
                              <div>
                                <div className="text-xs font-medium text-slate-900">Sarah Chen</div>
                                <div className="text-xs text-slate-500">Product Lead</div>
                              </div>
                            </div>
                            <div className="text-[10px] text-slate-400 text-center pt-2 border-t border-slate-100">
                              Powered by Nomee
                            </div>
                          </div>

                          {/* Card 2 */}
                          <div className="w-64 border border-slate-200 rounded-lg p-4 bg-white shadow-sm">
                            <p className="text-sm text-slate-700 leading-relaxed mb-3">
                              "One of the most reliable collaborators I've worked with. Strong judgment and
                              follow-through."
                            </p>
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-8 h-8 rounded-full bg-slate-200" />
                              <div>
                                <div className="text-xs font-medium text-slate-900">Marcus Johnson</div>
                                <div className="text-xs text-slate-500">Design Director</div>
                              </div>
                            </div>
                            <div className="text-[10px] text-slate-400 text-center pt-2 border-t border-slate-100">
                              Powered by Nomee
                            </div>
                          </div>

                          {/* Card 3 */}
                          <div className="w-64 border border-slate-200 rounded-lg p-4 bg-white shadow-sm">
                            <p className="text-sm text-slate-700 leading-relaxed mb-3">
                              "Consistently strategic while still being easy to work with."
                            </p>
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-8 h-8 rounded-full bg-slate-200" />
                              <div>
                                <div className="text-xs font-medium text-slate-900">Alex Rivera</div>
                                <div className="text-xs text-slate-500">Co-Founder</div>
                              </div>
                            </div>
                            <div className="text-[10px] text-slate-400 text-center pt-2 border-t border-slate-100">
                              Powered by Nomee
                            </div>
                          </div>
                        </div>

                        {/* Duplicate set for seamless loop */}
                        <div className="flex gap-3 flex-shrink-0">
                          {/* Card 1 duplicate */}
                          <div className="w-64 border border-slate-200 rounded-lg p-4 bg-white shadow-sm">
                            <p className="text-sm text-slate-700 leading-relaxed mb-3">
                              "Clear communicator, calm under pressure, and deeply thoughtful in how she approaches
                              complex work."
                            </p>
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-8 h-8 rounded-full bg-slate-200" />
                              <div>
                                <div className="text-xs font-medium text-slate-900">Sarah Chen</div>
                                <div className="text-xs text-slate-500">Product Lead</div>
                              </div>
                            </div>
                            <div className="text-[10px] text-slate-400 text-center pt-2 border-t border-slate-100">
                              Powered by Nomee
                            </div>
                          </div>

                          {/* Card 2 duplicate */}
                          <div className="w-64 border border-slate-200 rounded-lg p-4 bg-white shadow-sm">
                            <p className="text-sm text-slate-700 leading-relaxed mb-3">
                              "One of the most reliable collaborators I've worked with. Strong judgment and
                              follow-through."
                            </p>
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-8 h-8 rounded-full bg-slate-200" />
                              <div>
                                <div className="text-xs font-medium text-slate-900">Marcus Johnson</div>
                                <div className="text-xs text-slate-500">Design Director</div>
                              </div>
                            </div>
                            <div className="text-[10px] text-slate-400 text-center pt-2 border-t border-slate-100">
                              Powered by Nomee
                            </div>
                          </div>

                          {/* Card 3 duplicate */}
                          <div className="w-64 border border-slate-200 rounded-lg p-4 bg-white shadow-sm">
                            <p className="text-sm text-slate-700 leading-relaxed mb-3">
                              "Consistently strategic while still being easy to work with."
                            </p>
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-8 h-8 rounded-full bg-slate-200" />
                              <div>
                                <div className="text-xs font-medium text-slate-900">Alex Rivera</div>
                                <div className="text-xs text-slate-500">Co-Founder</div>
                              </div>
                            </div>
                            <div className="text-[10px] text-slate-400 text-center pt-2 border-t border-slate-100">
                              Powered by Nomee
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-500 mt-6 max-w-lg mx-auto">
                Submissions are tied to real people — one per contributor
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-12 md:py-20 px-6 bg-slate-50">
          <div className="max-w-5xl mx-auto space-y-8 md:space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-4 md:space-y-6"
            >
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-slate-900 px-4">
                Nomee turns moments into patterns you can carry forward.
              </h2>

              <p className="text-base md:text-lg text-slate-600">This isn't self-promotion. It's reflection.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
            >
              <div className="space-y-3 p-5 md:p-6 bg-white rounded-xl border border-slate-200">
                <h3 className="text-base md:text-lg font-semibold text-slate-900">One voice per person</h3>
                <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                  Each person can only contribute once, ensuring authentic and diverse viewpoints.
                </p>
              </div>

              <div className="space-y-3 p-5 md:p-6 bg-white rounded-xl border border-slate-200">
                <h3 className="text-base md:text-lg font-semibold text-slate-900">Identity-backed</h3>
                <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                  Contributors provide their full name and company, creating accountability.
                </p>
              </div>

              <div className="space-y-3 p-5 md:p-6 bg-white rounded-xl border border-slate-200">
                <h3 className="text-base md:text-lg font-semibold text-slate-900">You control what's shown</h3>
                <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                  Choose which contributions appear without changing what was said.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Decision-maker section - Keep as is */}
        <section id="decision-makers" className="py-16 md:py-32 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            {/* Header - Generous spacing */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center space-y-4 md:space-y-6 mb-12 md:mb-20"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-slate-900 tracking-tight px-4">
                For decision-makers
              </h2>
              <p className="text-lg md:text-xl lg:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed px-4">
                Review someone's Proof Link — see how they operate in under 60 seconds.
              </p>
            </motion.div>

            {/* Minimal Tab Pills - Centered */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="flex items-center justify-center gap-2 md:gap-3 mb-10 md:mb-16 px-4 overflow-x-auto scrollbar-hide"
            >
              <button
                onClick={() => setActiveDecisionTab("hiring")}
                className={`px-5 md:px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                  activeDecisionTab === "hiring"
                    ? "bg-slate-900 text-white shadow-lg"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Hiring
              </button>
              <button
                onClick={() => setActiveDecisionTab("partnerships")}
                className={`px-5 md:px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                  activeDecisionTab === "partnerships"
                    ? "bg-slate-900 text-white shadow-lg"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Partnerships
              </button>
              <button
                onClick={() => setActiveDecisionTab("clients")}
                className={`px-5 md:px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                  activeDecisionTab === "clients"
                    ? "bg-slate-900 text-white shadow-lg"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Clients
              </button>
            </motion.div>

            {/* Hero Preview Card - LARGE and centered */}
            <motion.div
              key={activeDecisionTab}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-slate-50 rounded-2xl border-2 border-slate-200 shadow-2xl shadow-slate-200/50 p-12 space-y-10">
                {/* Card Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">
                      Decision-Maker View
                    </p>
                    <h3 className="text-3xl font-semibold text-slate-900">
                      {activeDecisionTab === "hiring" && "Candidate evaluation"}
                      {activeDecisionTab === "partnerships" && "Partner validation"}
                      {activeDecisionTab === "clients" && "Collaboration preview"}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200">
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-sm font-medium text-slate-600">~1 min</span>
                  </div>
                </div>

                {/* Top Signals - Large and prominent */}
                <div className="space-y-5">
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Top Signals</p>
                  <div className="flex flex-wrap gap-3">
                    <span className="px-5 py-3 bg-blue-100 text-blue-900 text-base font-semibold rounded-xl border-2 border-blue-200">
                      Strategic
                    </span>
                    <span className="px-5 py-3 bg-blue-100 text-blue-900 text-base font-semibold rounded-xl border-2 border-blue-200">
                      Clear communicator
                    </span>
                    <span className="px-5 py-3 bg-blue-100 text-blue-900 text-base font-semibold rounded-xl border-2 border-blue-200">
                      Reliable
                    </span>
                  </div>
                </div>

                {/* Quick Scan - Larger, cleaner quotes */}
                <div className="space-y-5">
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">What people say</p>

                  {/* Quote 1 */}
                  <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <p className="text-lg text-slate-800 leading-relaxed font-medium">
                      "Brings clarity to complex projects. Always two steps ahead."
                    </p>
                  </div>

                  {/* Quote 2 */}
                  <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <p className="text-lg text-slate-800 leading-relaxed font-medium">
                      "The kind of collaborator who makes everyone better."
                    </p>
                  </div>

                  {/* Uploaded proof */}
                  <div className="bg-white rounded-xl p-6 border-2 border-slate-300 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">From email</span>
                    </div>
                    <p className="text-lg text-slate-800 leading-relaxed font-medium">
                      "This exceeded our expectations. Thank you."
                    </p>
                  </div>
                </div>

                {/* Patterns - Subtle footer */}
                <div className="pt-6 border-t border-slate-200">
                  <p className="text-sm text-slate-500">
                    Patterns forming:{" "}
                    <span className="font-semibold text-slate-700">Strategic ×5, Clear communicator ×4</span>
                  </p>
                </div>
              </div>
            </motion.div>

            {/* One-line context under preview */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-center text-slate-500 mt-8 text-sm max-w-2xl mx-auto px-4"
            >
              {activeDecisionTab === "hiring" && "Skip the guesswork. See collaboration patterns before the interview."}
              {activeDecisionTab === "partnerships" &&
                "Validate working style before signing contracts or making commitments."}
              {activeDecisionTab === "clients" && "Know how someone operates before starting a project together."}
            </motion.p>

            {/* CTAs - Generous spacing */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-center mt-12 md:mt-16 space-y-6"
            >
              <div className="flex flex-col gap-4 px-4">
                <Link
                  href="/maya-torres"
                  className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl text-base md:text-lg font-semibold hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  See an example
                </Link>
                <Link
                  href="/auth/signup"
                  className="w-full inline-flex items-center justify-center gap-2 border-2 border-slate-300 text-slate-900 px-8 py-4 rounded-xl text-base md:text-lg font-semibold hover:bg-slate-50 transition-all duration-300"
                >
                  Create your Nomee
                </Link>
              </div>

              {/* Trust line */}
              <p className="text-sm text-slate-500 px-4">
                Real names. Real relationships. One contribution per person.
              </p>

              {/* Free forever clarification */}
              <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed px-4">
                Your Nomee link is free to share — forever. Unlimited people can contribute. You only upgrade to save
                and showcase highlights.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Pricing section - Keep as is */}
        <section id="pricing" className="py-16 md:py-24 px-6 bg-white">
          <div className="max-w-6xl mx-auto space-y-8 md:space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-4"
            >
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-slate-900">Pricing</h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
            >
              {/* Free Plan */}
              <div className="border border-slate-200 rounded-xl p-8 bg-white space-y-6 hover:shadow-lg transition-shadow">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-slate-900">Collect</h3>
                  <p className="text-4xl font-bold text-slate-900">$0</p>
                  <p className="text-sm text-slate-500">Forever</p>
                  <p className="text-base font-semibold text-slate-700">For collecting Human Proof.</p>
                </div>

                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>Unlimited contributions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>Public Proof Link (Nomee Page)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>Core summary + traits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>Up to 3 proof uploads (emails, screenshots)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 mt-1">•</span>
                    <span className="text-sm italic text-slate-500">One contribution per person. Never edited.</span>
                  </li>
                </ul>

                <Button
                  onClick={() => openModal("deck")}
                  className="w-full bg-slate-900 text-white hover:bg-slate-800 rounded-full py-6 text-base font-medium transition-all"
                >
                  Start free
                </Button>

                <p className="text-xs text-slate-500 text-center">Capture what people say — before it gets lost.</p>
              </div>

              {/* Pro Plan */}
              <div className="border-2 border-blue-600 rounded-xl p-8 bg-white space-y-6 shadow-lg relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-semibold">
                  Keep it current
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-slate-900">Maintain</h3>
                  <p className="text-4xl font-bold text-slate-900">
                    $8<span className="text-lg font-normal text-slate-600">/month</span>
                  </p>
                  <p className="text-sm text-slate-500">or $79/year</p>
                  <p className="text-base font-semibold text-slate-700">
                    For keeping your Proof Link accurate over time.
                  </p>
                </div>

                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>Everything in Free</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>Unlimited proof uploads & secure storage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>Feature, pin, or hide proof and contributions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>Signal freshness (recent vs long-term feedback)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>Monthly "What's changed" digest</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>Advanced summaries</span>
                  </li>
                </ul>

                <Button className="w-full bg-blue-600 text-white hover:bg-blue-700 rounded-full py-6 text-base font-medium transition-all">
                  Keep my Proof Link current
                </Button>

                <p className="text-xs text-slate-500 text-center">
                  Store all your proof in one place — so you don't lose sight of it over time.
                </p>
              </div>

              {/* Premier Plan */}
              <div className="border border-slate-200 rounded-xl p-8 bg-white space-y-6 hover:shadow-lg transition-shadow">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-slate-900">Pro</h3>
                  <p className="text-4xl font-bold text-slate-900">
                    $16<span className="text-lg font-normal text-slate-600">/month</span>
                  </p>
                  <p className="text-sm text-slate-500">or $159/year</p>
                  <p className="text-base font-semibold text-slate-700">For professionals using Nomee actively.</p>
                </div>

                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>Everything in Maintain</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>Proof Tiles embed (websites, portfolios)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>Saved views (Hiring · Clients · Partnerships)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>One-page proof export (PDF)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>Subtle branding control</span>
                  </li>
                </ul>

                <Button className="w-full bg-slate-900 text-white hover:bg-slate-800 rounded-full py-6 text-base font-medium transition-all">
                  Upgrade to Pro
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center pt-6 md:pt-8"
            >
              <p className="text-sm text-slate-500 max-w-2xl mx-auto px-4">
                Contributions are free forever. Subscription keeps uploaded proof stored, organized, and current.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-20 md:py-32 px-6 bg-slate-900">
          <div className="max-w-3xl mx-auto text-center space-y-6 md:space-y-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white px-4"
            >
              Create your Nomee Page once. Let it grow over time.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-300 px-4"
            >
              One link. Many perspectives. Patterns emerge.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="px-4"
            >
              <Button
                onClick={() => openModal("deck")}
                size="lg"
                className="w-full md:w-auto bg-white text-slate-900 hover:bg-slate-100 rounded-full px-8 py-6 text-base font-medium shadow-lg hover:shadow-xl transition-all"
              >
                Create your Nomee Page
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </div>
        </section>
      </div>

      <ModalSignup initialType={modalType} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
