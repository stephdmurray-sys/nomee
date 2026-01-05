"use client"

import { motion } from "framer-motion"
import { SiteHeader } from "@/components/site-header"
import { ArrowRight } from "lucide-react"
import { useState } from "react"
import { ModalSignup } from "@/components/modal-signup"
import Link from "next/link"

export default function WhatIsNomeePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className="min-h-screen bg-white">
        <SiteHeader onCreateClick={() => setIsModalOpen(true)} />

        <section className="pt-32 pb-24 px-6">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-7xl font-bold text-slate-900 leading-tight tracking-tight"
            >
              Nomee keeps the feedback you receive — so it's ready when it matters.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl md:text-2xl text-slate-600 leading-relaxed"
            >
              Feedback is often shared casually, then forgotten. Nomee saves it in one place.
            </motion.p>
          </div>
        </section>

        <section className="py-20 px-6 bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* iMessage feedback */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                        JL
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">Jessica Liu</p>
                        <p className="text-xs text-slate-500">iMessage</p>
                      </div>
                    </div>
                    <div className="bg-blue-500 text-white p-3 rounded-2xl rounded-tl-sm max-w-[85%]">
                      <p className="text-sm leading-relaxed">
                        Thanks again for yesterday! The way you explained it made everything click.
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-center text-sm text-slate-500">Said once.</p>
              </motion.div>

              {/* Email feedback */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="space-y-4"
              >
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                      <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold text-sm">
                        MK
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">Marcus Kim</p>
                        <p className="text-xs text-slate-500">Re: Q4 Strategy Review</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      The way you reframed our approach completely shifted how the team sees this launch.
                    </p>
                  </div>
                </div>
                <p className="text-center text-sm text-slate-500">Never saved.</p>
              </motion.div>

              {/* Slack feedback */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-4"
              >
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                      <div className="w-6 h-6 rounded bg-purple-600" />
                      <span className="text-sm font-medium text-slate-900">#project-team</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded bg-teal-500 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                        AS
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-500 mb-1">Aisha Singh 11:23 AM</p>
                        <p className="text-sm text-slate-700 leading-relaxed">
                          Just wrapped the client call — they were so impressed by how you handled their questions.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-center text-sm text-slate-500">Easily forgotten.</p>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-white">
          <div className="max-w-6xl mx-auto space-y-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold text-slate-900 text-center leading-tight"
            >
              Nomee turns moments into something you can use.
            </motion.h2>

            {/* Visual transformation with arrows */}
            <div className="relative">
              {/* Desktop: horizontal layout with arrows */}
              <div className="hidden md:grid md:grid-cols-[1fr,auto,1fr] gap-8 items-center">
                {/* Left: Three feedback artifacts stacked */}
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <p className="text-sm text-slate-700">
                      "Thanks again for yesterday! The way you explained it made everything click."
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <p className="text-sm text-slate-700">
                      "The way you reframed our approach completely shifted how the team sees this launch."
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <p className="text-sm text-slate-700">
                      "They were so impressed by how you handled their questions."
                    </p>
                  </div>
                </div>

                {/* Middle: Dotted arrows */}
                <div className="flex flex-col items-center gap-2">
                  <svg
                    width="60"
                    height="40"
                    viewBox="0 0 60 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-slate-300"
                  >
                    <path
                      d="M2 20 L50 20"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      markerEnd="url(#arrowhead)"
                    />
                    <defs>
                      <marker
                        id="arrowhead"
                        markerWidth="10"
                        markerHeight="10"
                        refX="8"
                        refY="3"
                        orient="auto"
                        markerUnits="strokeWidth"
                      >
                        <path d="M0,0 L0,6 L9,3 z" fill="currentColor" />
                      </marker>
                    </defs>
                  </svg>
                </div>

                {/* Right: Maya page preview */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-6 space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-slate-900">Maya Torres</h3>
                    <p className="text-sm text-slate-600">Product Lead</p>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-medium text-slate-700">What consistently shows up</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                        Strategic
                      </span>
                      <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
                        Clear communicator
                      </span>
                      <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                        Calm under pressure
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <p className="text-sm text-slate-700 leading-relaxed">
                      "Maya has this gift for{" "}
                      <span className="bg-yellow-200/40 px-1 rounded">seeing both the forest and the trees</span>. She
                      caught details that would have derailed our launch while never losing sight of the bigger{" "}
                      <span className="bg-yellow-200/40 px-1 rounded">strategic picture</span>."
                    </p>
                    <p className="text-xs text-slate-500 mt-2">— Taylor Kim, Colleague</p>
                  </div>
                </div>
              </div>

              {/* Mobile: vertical layout */}
              <div className="md:hidden space-y-8">
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <p className="text-sm text-slate-700">
                      "Thanks again for yesterday! The way you explained it made everything click."
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <p className="text-sm text-slate-700">
                      "The way you reframed our approach completely shifted how the team sees this launch."
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <p className="text-sm text-slate-700">
                      "They were so impressed by how you handled their questions."
                    </p>
                  </div>
                </div>

                <div className="flex justify-center">
                  <svg width="24" height="60" viewBox="0 0 24 60" fill="none" className="text-slate-300">
                    <path
                      d="M12 2 L12 50"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      markerEnd="url(#arrowhead-down)"
                    />
                    <defs>
                      <marker
                        id="arrowhead-down"
                        markerWidth="10"
                        markerHeight="10"
                        refX="3"
                        refY="8"
                        orient="auto"
                        markerUnits="strokeWidth"
                      >
                        <path d="M0,0 L6,0 L3,9 z" fill="currentColor" />
                      </marker>
                    </defs>
                  </svg>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-6 space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-slate-900">Maya Torres</h3>
                    <p className="text-sm text-slate-600">Product Lead</p>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-medium text-slate-700">What consistently shows up</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                        Strategic
                      </span>
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                        Clear communicator
                      </span>
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                        Calm under pressure
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <p className="text-sm text-slate-700 leading-relaxed">
                      "Maya has this gift for{" "}
                      <span className="bg-yellow-200/40 px-1 rounded">seeing both the forest and the trees</span>. She
                      caught details that would have derailed our launch."
                    </p>
                    <p className="text-xs text-slate-500 mt-2">— Taylor Kim, Colleague</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-slate-50">
          <div className="max-w-4xl mx-auto space-y-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-semibold text-slate-900 text-center"
            >
              What a Nomee page looks like
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white border border-slate-200 rounded-2xl shadow-lg p-8 space-y-6"
            >
              {/* Name */}
              <div>
                <h3 className="text-3xl font-bold text-slate-900">Maya Torres</h3>
                <p className="text-base text-slate-500 mt-1">Product Manager</p>
              </div>

              {/* Traits section */}
              <div>
                <p className="text-sm font-medium text-slate-500 mb-3">What consistently shows up</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm rounded-full">Strategic</span>
                  <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm rounded-full">Calm under pressure</span>
                  <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm rounded-full">Clear communicator</span>
                </div>
              </div>

              {/* Sample quotes */}
              <div className="space-y-4">
                <div className="border-l-2 border-slate-200 pl-4">
                  <p className="text-slate-700 text-base leading-relaxed">
                    "Maya brings incredible <mark className="bg-yellow-200/40 px-0.5">strategic clarity</mark> to
                    complex projects."
                  </p>
                  <p className="text-sm text-slate-500 mt-2">— Alex Rivera, Colleague</p>
                </div>

                <div className="border-l-2 border-slate-200 pl-4">
                  <p className="text-slate-700 text-base leading-relaxed">
                    "She <mark className="bg-yellow-200/40 px-0.5">stays calm</mark> in high-pressure situations."
                  </p>
                  <p className="text-sm text-slate-500 mt-2">— Jordan Chen, Manager</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-20 px-6 bg-white">
          <div className="max-w-3xl mx-auto space-y-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold text-slate-900 text-center"
            >
              So, what is Nomee?
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4 text-xl text-slate-700 text-center"
            >
              <p>Nomee saves feedback as you receive it.</p>
              <p>It helps you see patterns over time.</p>
              <p>It gives you one link when you need to show your work.</p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg text-slate-600 text-center pt-4"
            >
              That's it.
            </motion.p>
          </div>
        </section>

        <section className="py-16 px-6 bg-slate-50">
          <div className="max-w-2xl mx-auto space-y-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold text-slate-900 text-center"
            >
              Nomee is not:
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-3 text-base text-slate-500 text-center"
            >
              <p>Not a performance review</p>
              <p>Not a testimonial page</p>
              <p>Not written after the fact</p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-slate-900 font-medium text-center pt-6"
            >
              It's what people actually say — saved as it happens.
            </motion.p>
          </div>
        </section>

        <section className="py-24 px-6 bg-gradient-to-b from-white to-slate-50">
          <div className="max-w-3xl mx-auto text-center space-y-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight"
            >
              You don't need more feedback.
              <br />
              You need to stop losing it.
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-8 py-4 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-colors text-lg shadow-lg hover:shadow-xl"
              >
                Start saving feedback
              </button>

              <Link
                href="/how-it-works"
                className="group relative inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-full font-medium text-slate-700 hover:border-slate-300 transition-all overflow-hidden"
              >
                <span className="relative z-10 transition-transform group-hover:-translate-x-1">See how it works</span>
                <ArrowRight className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1" />
                <span className="absolute inset-0 bg-slate-50 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Link>
            </motion.div>
          </div>
        </section>
      </div>

      <ModalSignup isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
