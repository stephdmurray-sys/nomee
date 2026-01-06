"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { SiteHeader } from "@/components/site-header"
import { ArrowRight, AlertCircle, Layers, Zap, Check, Send, MessageSquare, Mail } from "lucide-react"
import { useState, useRef } from "react"
import { ModalSignup } from "@/components/modal-signup"
import Link from "next/link"
import { DynamicMiniExample } from "@/components/dynamic-mini-example"
import { useScrollToTop } from "@/lib/use-scroll-to-top"

export default function WhatIsNomeePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8])

  const scrollToTop = useScrollToTop()

  return (
    <main className="min-h-screen bg-white">
      <div className="min-h-screen bg-white">
        <SiteHeader onCreateClick={() => setIsModalOpen(true)} />

        {/* Hero Section with Animated Typography */}
        <section className="pt-20 md:pt-32 pb-16 md:pb-24 px-5 md:px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 opacity-50" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

          <div className="max-w-5xl mx-auto text-center space-y-6 md:space-y-8 relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-6xl lg:text-8xl font-bold text-slate-900 leading-[1.1] tracking-tight"
            >
              What is Nomee?
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl lg:text-3xl text-slate-600 leading-relaxed max-w-4xl mx-auto"
            >
              A single place to save real feedback about how you work.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
            >
              <button
                onClick={() => setIsModalOpen(true)}
                className="group px-8 md:px-10 py-4 md:py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl text-base md:text-lg font-semibold hover:shadow-2xl hover:shadow-indigo-300 transition-all transform hover:scale-105"
              >
                <span className="flex items-center justify-center gap-2">
                  Start Your Nomee
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              <Link
                href="/example"
                onClick={scrollToTop}
                className="px-8 md:px-10 py-4 md:py-5 bg-white text-slate-900 border-2 border-slate-200 rounded-2xl text-base md:text-lg font-semibold hover:border-slate-300 hover:shadow-xl transition-all"
              >
                View Live Example
              </Link>
            </motion.div>
          </div>
        </section>

        <section className="py-16 md:py-24 px-5 md:px-6 bg-gradient-to-b from-white via-slate-50 to-white">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12 md:mb-16"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                The problem isn't feedback. It's losing it.
              </h2>
            </motion.div>

            <div className="space-y-4 md:space-y-6">
              {/* Card 1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border-2 border-slate-100"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">Great feedback happens</h3>
                    <p className="text-base md:text-lg text-slate-600">
                      A client says you nailed it. A colleague calls out your thinking. Real praise shows up after real
                      work.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Card 2 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border-2 border-slate-100"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Layers className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">It shows up everywhere</h3>
                    <p className="text-base md:text-lg text-slate-600">
                      Slack messages. Email chains. Texts after a project. Quick notes that never get saved.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Card 3 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border-2 border-red-100 bg-red-50"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">Then it disappears</h3>
                    <p className="text-base md:text-lg text-slate-600">
                      When you need proof of your work, it's buried in old threads or gone completely.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 px-5 md:px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              {/* Before Nomee */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-slate-50 rounded-3xl p-8 md:p-10 border-2 border-slate-200"
              >
                <div className="mb-6">
                  <p className="text-sm uppercase tracking-widest text-slate-400 font-bold mb-2">Before Nomee</p>
                  <h3 className="text-2xl md:text-3xl font-bold text-slate-900">Feedback is scattered</h3>
                </div>
                <ul className="space-y-4 text-base md:text-lg text-slate-700">
                  <li className="flex items-start gap-3">
                    <span className="text-slate-400 mt-1">•</span>
                    <span>Lost in old Slack threads</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-slate-400 mt-1">•</span>
                    <span>Buried in email inboxes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-slate-400 mt-1">•</span>
                    <span>Never written down at all</span>
                  </li>
                </ul>
              </motion.div>

              {/* With Nomee */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 md:p-10 border-2 border-indigo-200"
              >
                <div className="mb-6">
                  <p className="text-sm uppercase tracking-widest text-indigo-600 font-bold mb-2">With Nomee</p>
                  <h3 className="text-2xl md:text-3xl font-bold text-slate-900">Feedback is organized</h3>
                </div>
                <ul className="space-y-4 text-base md:text-lg text-slate-700">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" />
                    <span>All in one place</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" />
                    <span>Verified and timestamped</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" />
                    <span>Ready when you need it</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 px-5 md:px-6 bg-gradient-to-b from-white via-slate-50 to-white">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">Here's how it looks</h2>
            </motion.div>
            <DynamicMiniExample />
          </div>
        </section>

        {/* Animated Flow Section - The Transformation */}
        <section
          ref={containerRef}
          className="py-32 px-6 bg-gradient-to-b from-white via-slate-50 to-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(99,102,241,0.05),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(168,85,247,0.05),transparent_50%)]" />

          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
                The problem isn't getting feedback. It's finding it.
              </h2>
            </motion.div>

            <div className="grid lg:grid-cols-[1.2fr_auto_1fr] gap-12 items-center">
              {/* Left: Scattered Feedback with Visual Cards */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <p className="text-sm uppercase tracking-widest text-slate-400 font-bold">Before Nomee</p>
                  <p className="text-2xl font-bold text-slate-900 mt-2">Scattered everywhere</p>
                </div>

                {/* Message Card 1 - Slack */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                  <div className="bg-blue-50 text-blue-700 px-4 py-3 flex items-center gap-2 border-b border-blue-100">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6.915 13.25c0 .83-.674 1.504-1.504 1.504H3.504C2.674 14.754 2 14.08 2 13.25c0-.83.674-1.504 1.504-1.504h1.907c.83 0 1.504.674 1.504 1.504zm.754 0c0-.83.674-1.504 1.504-1.504h5.672c.83 0 1.504.674 1.504 1.504v1.907c0 .83-.674 1.504-1.504 1.504H9.173c-.83 0-1.504-.674-1.504-1.504v-1.907zm0-5.418C7.669 6.004 8.343 5.33 9.173 5.33h5.672c.83 0 1.504.674 1.504 1.504v1.907c0 .83-.674 1.504-1.504 1.504H9.173c-.83 0-1.504-.674-1.504-1.504V7.832zm-5.418 0c0 .83-.674 1.504-1.504 1.504H3.504C2.674 9.336 2 8.662 2 7.832V5.925c0-.83.674-1.504 1.504-1.504h1.907c.83 0 1.504.674 1.504 1.504v1.907z" />
                    </svg>
                    <span className="text-xs font-bold">Slack</span>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-teal-500 rounded flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                        AS
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Aisha Singh, Manager • Acme Corp</p>
                        <p className="text-xs text-slate-500">11:23 AM</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-700 mb-3">
                      Just wrapped the client call — they were{" "}
                      <span className="font-semibold text-slate-900">so impressed</span> by how you handled their
                      questions. That's exactly the kind of thinking we need. 💡
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-block bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
                        Great communication
                      </span>
                      <span className="inline-block bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
                        Problem solver
                      </span>
                    </div>
                  </div>
                </div>

                {/* Message Card 2 - Email */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                  <div className="bg-blue-100 border-b border-blue-200 px-4 py-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 12H6v-2h14v2zm0-3H6V9h14v2zm0-3H6V6h14v2z" />
                    </svg>
                    <p className="text-xs font-bold text-blue-800">Re: Q4 Strategy Review</p>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-300 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-blue-700">MK</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Marcus Kim, VP Strategy • TechFlow</p>
                        <p className="text-xs text-slate-500">2:14 PM</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-700 mb-3">
                      The way you <span className="font-semibold text-slate-900">reframed our approach</span> completely
                      shifted the conversation. I've worked with a lot of consultants, and your{" "}
                      <span className="font-semibold text-slate-900">clarity</span> stands out.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-block bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
                        Strategic thinker
                      </span>
                      <span className="inline-block bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
                        Clear communicator
                      </span>
                    </div>
                  </div>
                </div>

                {/* Message Card 3 - LinkedIn */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                  <div className="bg-blue-150 border-b border-blue-300 px-4 py-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-700 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.722-2.004 1.418-.103.249-.129.597-.129.946v5.441h-3.554s.05-8.82 0-9.737h3.554v1.38c.43-.664 1.199-1.61 2.922-1.61 2.135 0 3.731 1.395 3.731 4.397v5.57zM5.337 8.855c-1.144 0-1.915-.759-1.915-1.71 0-.951.77-1.71 1.915-1.71 1.144 0 1.914.759 1.914 1.71 0 .951-.77 1.71-1.914 1.71zm1.575 11.597H3.762V9.57h3.15v10.882zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                    </svg>
                    <p className="text-xs font-bold text-blue-800">LinkedIn</p>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0 text-white">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.722-2.004 1.418-.103.249-.129.597-.129.946v5.441h-3.554s.05-8.82 0-9.737h3.554v1.38c.43-.664 1.199-1.61 2.922-1.61 2.135 0 3.731 1.395 3.731 4.397v5.57zM5.337 8.855c-1.144 0-1.915-.759-1.915-1.71 0-.951.77-1.71 1.915-1.71 1.144 0 1.914.759 1.914 1.71 0 .951-.77 1.71-1.914 1.71zm1.575 11.597H3.762V9.57h3.15v10.882zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          Taylor Rodriguez, Design Lead • CreativeStudio
                        </p>
                        <p className="text-xs text-slate-500">LinkedIn</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-700 mb-3">
                      Your presentation yesterday was <span className="font-semibold text-slate-900">incredible</span>.
                      The way you broke down complex data into actionable insights — that's a rare skill. Would love to
                      work together again.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-block bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
                        Data expert
                      </span>
                      <span className="inline-block bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
                        Insightful
                      </span>
                    </div>
                  </div>
                </div>

                {/* Message Card 4 - Text/iMessage */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                  <div className="bg-blue-200 border-b border-blue-300 px-4 py-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-900 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 12H6v-2h14v2zm0-3H6V9h14v2zm0-3H6V6h14v2z" />
                    </svg>
                    <p className="text-xs font-bold text-blue-900">Text • 3:45 PM</p>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                        JL
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          Jessica Liu, Director • NextGen Solutions
                        </p>
                      </div>
                    </div>
                    <div className="ml-13 space-y-2 mb-3">
                      <div className="bg-blue-500 text-white rounded-2xl px-4 py-2 text-sm max-w-xs">
                        Thanks again for yesterday! 🙌
                      </div>
                      <div className="bg-slate-100 text-slate-900 rounded-2xl px-4 py-2 text-sm">
                        You totally <span className="font-semibold">saved us</span>. Your ability to see three steps
                        ahead is exactly what we needed.
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-block bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
                        Strategic thinker
                      </span>
                      <span className="inline-block bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
                        Reliable
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Center: Animated Flow Arrows */}
              <div className="hidden lg:flex flex-col items-center justify-center space-y-8 px-4">
                <motion.div
                  animate={{
                    x: [0, 10, 0],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                  className="flex flex-col items-center"
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl">
                    <ArrowRight className="w-10 h-10 text-white" />
                  </div>
                  <div className="w-1 h-16 bg-gradient-to-b from-indigo-400 to-transparent mt-2" />
                </motion.div>

                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                  className="text-center px-6 py-3 bg-white rounded-full shadow-lg border-2 border-indigo-200"
                >
                  <span className="text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Nomee organizes
                  </span>
                </motion.div>

                <motion.div
                  animate={{
                    x: [0, 10, 0],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                  className="flex flex-col items-center"
                >
                  <div className="w-1 h-16 bg-gradient-to-b from-transparent to-indigo-400 mb-2" />
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center shadow-2xl">
                    <ArrowRight className="w-10 h-10 text-white" />
                  </div>
                </motion.div>
              </div>

              {/* Right: Nomee Profile - The Result */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <p className="text-sm uppercase tracking-widest text-indigo-600 font-bold">After Nomee</p>
                  <p className="text-2xl font-bold text-slate-900 mt-2">One powerful profile</p>
                </div>

                {/* Visual Profile Mockup */}
                <DynamicMiniExample />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Mobile Flow Indicator */}
        <div className="lg:hidden py-8 px-6 bg-slate-50">
          <div className="max-w-md mx-auto text-center">
            <div className="flex justify-center mb-4">
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                className="text-indigo-600"
              >
                <ArrowRight className="w-8 h-8 rotate-90" />
              </motion.div>
            </div>
            <p className="text-sm font-semibold text-slate-600">All feedback becomes one profile</p>
          </div>
        </div>

        {/* How It Actually Works */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl font-bold text-slate-900 mb-6">Three ways to build your Nomee</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Every path leads to the same place: verified proof of your professional reputation
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 border-2 border-indigo-100"
              >
                <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                  <Send className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Request feedback</h3>
                <p className="text-slate-700 leading-relaxed mb-6">
                  After every project, send a quick request. Your clients get a simple form, you get verified
                  testimonials. Takes 30 seconds.
                </p>
                <div className="bg-white rounded-xl p-4 text-sm text-slate-600">
                  Perfect for: New projects, ongoing work, finishing deliverables
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 border-2 border-purple-100"
              >
                <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center mb-6">
                  <MessageSquare className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Upload screenshots</h3>
                <p className="text-slate-700 leading-relaxed mb-6">
                  Got a great Slack message or email? Screenshot it and upload. Nomee extracts the feedback
                  automatically and organizes it by theme.
                </p>
                <div className="bg-white rounded-xl p-4 text-sm text-slate-600">
                  Perfect for: Slack DMs, email threads, LinkedIn messages, texts
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-gradient-to-br from-pink-50 to-orange-50 rounded-3xl p-8 border-2 border-pink-100"
              >
                <div className="w-14 h-14 bg-pink-600 rounded-2xl flex items-center justify-center mb-6">
                  <Mail className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Invite contributors</h3>
                <p className="text-slate-700 leading-relaxed mb-6">
                  Send your personal Nomee link to past colleagues or clients. They submit feedback directly, you
                  approve what goes live.
                </p>
                <div className="bg-white rounded-xl p-4 text-sm text-slate-600">
                  Perfect for: Building your initial profile, past projects, references
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* What Nomee Is (and Isn't) */}
        <section className="py-24 px-6 bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl font-bold text-slate-900 mb-6">So, what is Nomee?</h2>
              <div className="space-y-4 text-xl text-slate-700">
                <p>Nomee saves feedback as you receive it.</p>
                <p>It helps you see patterns over time.</p>
                <p>It gives you one link when you need to show your work.</p>
              </div>
              <p className="text-2xl text-slate-600 font-light mt-8">That's it.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white rounded-3xl border-2 border-slate-200 p-10 shadow-xl"
            >
              <h3 className="text-3xl font-bold text-slate-900 mb-6 text-center">Nomee is not:</h3>
              <div className="space-y-4 text-lg text-slate-600">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-slate-400">✕</span>
                  </div>
                  <p>Not a performance review</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-slate-400">✕</span>
                  </div>
                  <p>Not a testimonial page written after the fact</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-slate-400">✕</span>
                  </div>
                  <p>Not another place to manage your "brand"</p>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-slate-200 text-center">
                <p className="text-xl font-semibold text-slate-900">
                  It's what people actually say about you — saved as it happens.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-6 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center relative z-10"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Stop losing your reputation.
              <br />
              Start building your Nomee.
            </h2>
            <p className="text-2xl text-indigo-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of professionals who have one place for their professional reputation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setIsModalOpen(true)}
                className="group px-10 py-5 bg-white text-indigo-600 rounded-2xl text-lg font-semibold hover:shadow-2xl transition-all transform hover:scale-105"
              >
                <span className="flex items-center justify-center gap-2">
                  Create Your Nomee — Free
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              <Link
                href="/example"
                onClick={scrollToTop}
                className="px-10 py-5 bg-transparent border-2 border-white text-white rounded-2xl text-lg font-bold hover:bg-white/10 transition-all"
              >
                See a Live Example
              </Link>
            </div>
            <div className="mt-8 flex items-center justify-center gap-8 text-indigo-100">
              <span className="flex items-center gap-2">
                <Check className="w-5 h-5" />
                Free to start
              </span>
              <span>•</span>
              <span>Setup in 5 minutes</span>
              <span>•</span>
              <span>No credit card</span>
            </div>
          </motion.div>
        </section>
      </div>

      <ModalSignup isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  )
}
