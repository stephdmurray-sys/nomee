"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ModalSignup } from "@/components/modal-signup"
import { SiteHeader } from "@/components/site-header"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<"deck" | "recognition">("deck")
  const [expandedOutcome, setExpandedOutcome] = useState<number | null>(null)
  const [expandedFramework, setExpandedFramework] = useState<string | null>(null)
  const [heroTab, setHeroTab] = useState<"professional" | "decision-maker">("professional")
  const [showAllTraits, setShowAllTraits] = useState(false)
  const [activeDecisionTab, setActiveDecisionTab] = useState<"hiring" | "partnerships" | "clients">("hiring")

  const openModal = (type: "deck" | "recognition") => {
    setModalType(type)
    setIsModalOpen(true)
  }

  return (
    <>
      <SiteHeader onCreateClick={() => openModal("deck")} />

      {/* Hero Section */}
      <section className="relative pt-28 md:pt-32 pb-16 md:pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <p className="text-xs md:text-sm text-slate-500 font-normal">
                Most people forget the best feedback they receive — until they need it.
              </p>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight tracking-tight">
                You receive valuable feedback. Nomee keeps it.
              </h1>

              <p className="text-lg md:text-xl lg:text-2xl text-slate-700 leading-relaxed">
                Save what people say about your work in one place — so it's ready when it matters.
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-4 pt-1">
                <Button
                  onClick={() => openModal("deck")}
                  size="lg"
                  className="w-full sm:w-auto bg-slate-900 text-white hover:bg-slate-800 rounded-full px-8 py-6 text-base font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  Save my feedback
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                <Link
                  href="/maya-torres"
                  className="w-full sm:w-auto text-center sm:text-left text-slate-500 hover:text-slate-700 text-sm flex items-center gap-1.5 px-4 py-3 transition-colors"
                >
                  See an example →
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Two ways to save feedback */}
      <section className="relative py-12 md:py-16 px-6 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(148,163,184,0.05),transparent_50%)]" />
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl md:text-4xl lg:text-5xl font-semibold text-slate-900 tracking-tight"
            >
              Two ways to save feedback
            </motion.h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-16 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1 hover:border-slate-300"
            >
              <h4 className="text-xl md:text-2xl font-semibold text-slate-900">Collect feedback</h4>
              <p className="text-base text-slate-700 leading-relaxed">Invite people to share feedback as it happens.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1 hover:border-slate-300"
            >
              <h4 className="text-xl md:text-2xl font-semibold text-slate-900">Save existing feedback</h4>
              <p className="text-base text-slate-700 leading-relaxed">
                Save feedback you already have — emails, Slack messages, texts, or screenshots.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="mb-16 md:mb-20 max-w-2xl mx-auto text-center px-4"
          >
            <h3 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-4">Your personal Nomee page</h3>
            <p className="text-base md:text-lg text-slate-700 leading-relaxed mb-6">
              One private link that keeps all your feedback in one place — ready to share when it matters.
            </p>
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors duration-200"
            >
              Create my Nomee link
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 md:mb-12 max-w-2xl mx-auto text-center px-4"
          >
            <h3 className="text-xl md:text-2xl font-semibold text-slate-900 mb-3">What your Nomee page looks like</h3>
            <p className="text-base text-slate-600 leading-relaxed">Real feedback — saved as it happens.</p>
          </motion.div>

          <div className="relative max-w-7xl mx-auto px-4">
            {/* Mobile: Vertical stack */}
            <div className="md:hidden space-y-6">
              {/* Feedback artifacts */}
              <div className="space-y-4">
                {/* iMessage snippet */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
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
                        The way you reframed our approach completely shifted the conversation. I've worked with a lot of
                        consultants, and your clarity stands out.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Slack snippet */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
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
                            Just wrapped the client call — they were so impressed by how you handled your questions and
                            concerns. That's the kind of thinking we need. 💯
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Arrow indicator */}
              <div className="flex justify-center py-4">
                <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </div>

              {/* Transformation text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="text-center text-base text-slate-700 font-medium"
              >
                All of it becomes one Nomee page.
              </motion.p>

              {/* Maya page preview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden p-6"
              >
                {/* Name header */}
                <div className="mb-6">
                  <h4 className="text-2xl font-bold text-slate-900">Maya Torres</h4>
                  <p className="text-sm text-slate-600 mt-1">Product Designer</p>
                </div>

                {/* What consistently shows up */}
                <div className="mb-6">
                  <h5 className="text-sm font-medium text-slate-700 mb-3">
                    What consistently shows up when people talk about working with Maya:
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                      Strategic
                    </span>
                    <span className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
                      Problem solver
                    </span>
                    <span className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                      Clear communicator
                    </span>
                  </div>
                </div>

                {/* One quote */}
                <div className="bg-slate-50 rounded-xl p-4 border-l-4 border-blue-500">
                  <p className="text-sm text-slate-700 italic leading-relaxed">
                    "Maya brings incredible{" "}
                    <span className="font-semibold not-italic text-slate-900">strategic clarity</span> to complex
                    projects. She helped us restructure our product roadmap and the results were{" "}
                    <span className="font-semibold not-italic text-slate-900">transformative</span>."
                  </p>
                  <p className="text-xs text-slate-500 mt-2">— Alex Rivera, TechCorp</p>
                </div>
              </motion.div>
            </div>

            {/* Desktop: Side-by-side with arrows */}
            <div className="hidden md:grid md:grid-cols-[1fr_120px_1fr] gap-8 items-center">
              {/* Left: Feedback artifacts */}
              <div className="space-y-6">
                {/* iMessage snippet */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden h-52 flex flex-col">
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
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden h-52 flex flex-col">
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
                        The way you reframed our approach completely shifted the conversation. I've worked with a lot of
                        consultants, and your clarity stands out.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Slack snippet */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden h-52 flex flex-col">
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
                            Just wrapped the client call — they were so impressed by how you handled your questions.
                            That's the kind of thinking we need. 💯
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Center: Arrow visualization */}
              <div className="flex flex-col items-center justify-center space-y-8 py-12">
                {/* Three dotted arrows pointing right */}
                <svg className="w-24 h-4" viewBox="0 0 100 16" fill="none">
                  <path d="M0 8 L90 8" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" />
                  <path
                    d="M85 3 L95 8 L85 13"
                    stroke="#cbd5e1"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <svg className="w-24 h-4" viewBox="0 0 100 16" fill="none">
                  <path d="M0 8 L90 8" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" />
                  <path
                    d="M85 3 L95 8 L85 13"
                    stroke="#cbd5e1"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <svg className="w-24 h-4" viewBox="0 0 100 16" fill="none">
                  <path d="M0 8 L90 8" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" />
                  <path
                    d="M85 3 L95 8 L85 13"
                    stroke="#cbd5e1"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Right: Nomee page preview */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex flex-col items-center"
              >
                {/* Transformation text */}
                <p className="text-center text-lg text-slate-700 font-medium mb-6">All of it becomes one Nomee page.</p>

                {/* Maya page preview */}
                <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-8 w-full">
                  {/* Name header */}
                  <div className="mb-6">
                    <h4 className="text-3xl font-bold text-slate-900">Maya Torres</h4>
                    <p className="text-sm text-slate-600 mt-1">Product Designer</p>
                  </div>

                  {/* What consistently shows up */}
                  <div className="mb-6">
                    <h5 className="text-sm font-medium text-slate-700 mb-3">
                      What consistently shows up when people talk about working with Maya:
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                        Strategic
                      </span>
                      <span className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
                        Problem solver
                      </span>
                      <span className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                        Clear communicator
                      </span>
                    </div>
                  </div>

                  {/* One quote */}
                  <div className="bg-slate-50 rounded-xl p-4 border-l-4 border-blue-500">
                    <p className="text-sm text-slate-700 italic leading-relaxed">
                      "Maya brings incredible{" "}
                      <span className="font-semibold not-italic text-slate-900">strategic clarity</span> to complex
                      projects. She helped us restructure our product roadmap and the results were{" "}
                      <span className="font-semibold not-italic text-slate-900">transformative</span>."
                    </p>
                    <p className="text-xs text-slate-500 mt-3">— Alex Rivera, TechCorp</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* CTAs below transformation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-16"
            >
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors"
              >
                Save my feedback
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/maya-torres"
                className="inline-flex items-center justify-center text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors"
              >
                See the full example →
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6"
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">Use your Nomee page anywhere</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Share your Nomee link anywhere you need credibility.
            </p>

            <div className="flex flex-wrap justify-center gap-8 pt-4">
              <div className="text-base text-slate-700">Reviews</div>
              <div className="text-base text-slate-700">Interviews</div>
              <div className="text-base text-slate-700">Clients</div>
            </div>
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
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-slate-900">Real feedback. Unedited.</h2>

            <p className="text-base md:text-lg text-slate-600">What people actually said.</p>
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
              When decisions are made, guessing isn't enough. Saved feedback shows how someone actually works.
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

              <div className="space-y-5">
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Common themes</p>
                <div className="flex flex-wrap gap-3">
                  {activeDecisionTab === "hiring" && (
                    <>
                      <span className="px-5 py-3 bg-blue-100 text-blue-900 text-base font-semibold rounded-xl border-2 border-blue-200">
                        Calm under pressure
                      </span>
                      <span className="px-5 py-3 bg-blue-100 text-blue-900 text-base font-semibold rounded-xl border-2 border-blue-200">
                        Strategic thinker
                      </span>
                      <span className="px-5 py-3 bg-blue-100 text-blue-900 text-base font-semibold rounded-xl border-2 border-blue-200">
                        Clear communicator
                      </span>
                    </>
                  )}
                  {activeDecisionTab === "partnerships" && (
                    <>
                      <span className="px-5 py-3 bg-blue-100 text-blue-900 text-base font-semibold rounded-xl border-2 border-blue-200">
                        Reliable
                      </span>
                      <span className="px-5 py-3 bg-blue-100 text-blue-900 text-base font-semibold rounded-xl border-2 border-blue-200">
                        Trustworthy
                      </span>
                      <span className="px-5 py-3 bg-blue-100 text-blue-900 text-base font-semibold rounded-xl border-2 border-blue-200">
                        Proactive
                      </span>
                    </>
                  )}
                  {activeDecisionTab === "clients" && (
                    <>
                      <span className="px-5 py-3 bg-blue-100 text-blue-900 text-base font-semibold rounded-xl border-2 border-blue-200">
                        Delivers results
                      </span>
                      <span className="px-5 py-3 bg-blue-100 text-blue-900 text-base font-semibold rounded-xl border-2 border-blue-200">
                        Clear timelines
                      </span>
                      <span className="px-5 py-3 bg-blue-100 text-blue-900 text-base font-semibold rounded-xl border-2 border-blue-200">
                        Great to work with
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-5">
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">What people say</p>

                {activeDecisionTab === "hiring" && (
                  <>
                    {/* Quote 1 - Hiring: confidence under pressure */}
                    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                      <p className="text-lg text-slate-800 leading-relaxed">
                        "When the project shifted mid-sprint, she{" "}
                        <span className="bg-yellow-200 px-1 rounded">stayed calm</span> and{" "}
                        <span className="bg-yellow-200 px-1 rounded">mapped a new approach</span> in minutes."
                      </p>
                    </div>

                    {/* Quote 2 */}
                    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                      <p className="text-lg text-slate-800 leading-relaxed">
                        "<span className="bg-yellow-200 px-1 rounded">Thinks three steps ahead.</span> Her planning
                        saved us from major blockers."
                      </p>
                    </div>

                    {/* Quote 3 - From email */}
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
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          From email
                        </span>
                      </div>
                      <p className="text-lg text-slate-800 leading-relaxed">
                        "Her updates were <span className="bg-yellow-200 px-1 rounded">always clear</span> — no
                        surprises, no confusion."
                      </p>
                    </div>
                  </>
                )}

                {activeDecisionTab === "partnerships" && (
                  <>
                    {/* Quote 1 - Partnerships: trust and reliability */}
                    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                      <p className="text-lg text-slate-800 leading-relaxed">
                        "Every commitment was met. <span className="bg-yellow-200 px-1 rounded">Zero surprises</span>,
                        just <span className="bg-yellow-200 px-1 rounded">consistent delivery.</span>"
                      </p>
                    </div>

                    {/* Quote 2 */}
                    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                      <p className="text-lg text-slate-800 leading-relaxed">
                        "<span className="bg-yellow-200 px-1 rounded">Flagged issues before they became problems.</span>{" "}
                        That's the kind of partner you want."
                      </p>
                    </div>

                    {/* Quote 3 - From Slack */}
                    <div className="bg-white rounded-xl p-6 border-2 border-slate-300 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          From Slack
                        </span>
                      </div>
                      <p className="text-lg text-slate-800 leading-relaxed">
                        "I'd <span className="bg-yellow-200 px-1 rounded">work with them again</span> without
                        hesitation."
                      </p>
                    </div>
                  </>
                )}

                {activeDecisionTab === "clients" && (
                  <>
                    {/* Quote 1 - Clients: clarity and delivery */}
                    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                      <p className="text-lg text-slate-800 leading-relaxed">
                        "<span className="bg-yellow-200 px-1 rounded">Delivered exactly what we needed</span> — on time,
                        no back-and-forth."
                      </p>
                    </div>

                    {/* Quote 2 */}
                    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                      <p className="text-lg text-slate-800 leading-relaxed">
                        "Timelines were <span className="bg-yellow-200 px-1 rounded">clear from day one.</span> No
                        guessing, no delays."
                      </p>
                    </div>

                    {/* Quote 3 - From email */}
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
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          From email
                        </span>
                      </div>
                      <p className="text-lg text-slate-800 leading-relaxed">
                        "A pleasure to work with.{" "}
                        <span className="bg-yellow-200 px-1 rounded">Made the whole process easy.</span>"
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div className="pt-6 border-t border-slate-200">
                <p className="text-sm text-slate-500">
                  {activeDecisionTab === "hiring" && "Common themes across team feedback."}
                  {activeDecisionTab === "partnerships" && "Common themes across partner feedback."}
                  {activeDecisionTab === "clients" && "Common themes across client feedback."}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center text-slate-500 mt-8 text-sm max-w-2xl mx-auto px-4"
          >
            {activeDecisionTab === "hiring" && "See real feedback before the interview. Don't rely on resumes alone."}
            {activeDecisionTab === "partnerships" && "See how someone works before committing to a partnership."}
            {activeDecisionTab === "clients" && "See what to expect before starting a project together."}
          </motion.p>

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
                Start saving feedback
              </Link>
            </div>

            <p className="text-sm text-slate-500 px-4">Real names. Real relationships. One contribution per person.</p>

            <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed px-4">
              Your Nomee page is free to share — forever. You only upgrade to keep feedback organized over time.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing section - Updated */}
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
            {/* Collect tier (was Free) */}
            <div className="border border-slate-200 rounded-xl p-8 bg-white space-y-6 hover:shadow-lg transition-shadow">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900">Collect</h3>
                <p className="text-4xl font-bold text-slate-900">$0</p>
                <p className="text-sm text-slate-500">forever</p>
                <p className="text-base font-medium text-slate-700 mt-4">Collect real feedback. See the patterns.</p>
              </div>

              <ul className="space-y-3 text-slate-600 min-h-[160px]">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>Unlimited contributions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>Public Nomee page</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>Core summary + traits</span>
                </li>
              </ul>

              <Button
                onClick={() => openModal("deck")}
                className="w-full bg-slate-900 text-white hover:bg-slate-800 rounded-full py-6 text-base font-medium transition-all"
              >
                Save my feedback
              </Button>
            </div>

            {/* Maintain tier (was Pro) - $9/$79 */}
            <div className="border-2 border-blue-600 rounded-xl p-8 bg-white space-y-6 shadow-lg relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                Most Popular
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900">Maintain</h3>
                <p className="text-4xl font-bold text-slate-900">
                  $9<span className="text-lg font-normal text-slate-600">/month</span>
                </p>
                <p className="text-sm text-slate-500">$79 / year (Save ~27%)</p>
                <p className="text-base font-medium text-slate-700 mt-4">
                  Keep feedback organized and ready when it matters.
                </p>
              </div>

              <ul className="space-y-3 text-slate-600 min-h-[160px]">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>Everything in Collect</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>Saved feedback & secure storage</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>Feature, pin, or hide contributions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>Track recent vs long-term feedback</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>Monthly "What's changed" digest</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>See common themes over time</span>
                </li>
              </ul>

              <Button className="w-full bg-blue-600 text-white hover:bg-blue-700 rounded-full py-6 text-base font-medium transition-all">
                Keep my feedback current
              </Button>
            </div>

            <div className="border border-slate-200 rounded-xl p-8 bg-white space-y-6 hover:shadow-lg transition-shadow">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900">Showcase</h3>
                <p className="text-4xl font-bold text-slate-900">
                  $19<span className="text-lg font-normal text-slate-600">/month</span>
                </p>
                <p className="text-sm text-slate-500">$169 / year (Save ~26%)</p>
                <p className="text-base font-medium text-slate-700 mt-4">Use feedback when decisions are being made.</p>
              </div>

              <ul className="space-y-3 text-slate-600 min-h-[160px]">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>Everything in Maintain</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>Feedback tiles (embed websites, portfolios)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>Saved views (Hiring · Clients · Partnerships)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>One-page export (PDF)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>Subtle branding control</span>
                </li>
              </ul>

              <Button className="w-full bg-slate-900 text-white hover:bg-slate-800 rounded-full py-6 text-base font-medium transition-all">
                Keep feedback ready
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center pt-6 md:pt-8 space-y-2"
          >
            <p className="text-sm text-slate-600 max-w-2xl mx-auto px-4">We don't charge for feedback or asking.</p>
            <p className="text-sm text-slate-600 max-w-2xl mx-auto px-4">
              We charge for keeping it organized — ready when it matters.
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
            Ready when it matters — not lost in messages.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-300 px-4"
          >
            Save what people said before you need it.
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
              Save my feedback
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      <ModalSignup initialType={modalType} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
