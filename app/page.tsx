"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ModalSignup } from "@/components/modal-signup"
import { motion } from "framer-motion"
import { SiteHeader } from "@/components/site-header"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { RealNomeeSlice } from "@/components/real-nomee-slice"
import { BadgeCheck, FileCheck2, Bookmark } from "lucide-react"

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<"deck" | "recognition">("deck")
  const [expandedOutcome, setExpandedOutcome] = useState<number | null>(null)
  const [expandedFramework, setExpandedFramework] = useState<string | null>(null)
  const [heroTab, setHeroTab] = useState<"professional" | "decision-maker">("professional")
  const [showAllTraits, setShowAllTraits] = useState(false)

  const openModal = (type: "deck" | "recognition") => {
    setModalType(type)
    setIsModalOpen(true)
  }

  return (
    <>
      <div className="min-h-screen bg-white">
        <SiteHeader onCreateClick={() => openModal("deck")} />

        <section className="pt-32 pb-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              {/* Left: Product-first copy */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6 lg:pt-8"
              >
                <p className="text-sm text-slate-600 font-medium">
                  Trusted by people who make decisions — hiring, partnerships, clients, collaborators.
                </p>

                <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight tracking-tight">
                  Your reputation already exists. Nomee makes it visible.
                </h1>

                <p className="text-xl md:text-2xl text-slate-700 leading-relaxed">
                  One link that shows how people experience working with you — in their words.
                </p>

                <p className="text-sm text-slate-600 font-medium">
                  Don't lose the praise. Turn it into proof you can share anywhere.
                </p>

                <div className="flex flex-col sm:flex-row items-start gap-4 pt-4">
                  <Button
                    onClick={() => openModal("deck")}
                    size="lg"
                    className="bg-slate-900 text-white hover:bg-slate-800 rounded-full px-8 py-6 text-base font-medium shadow-lg hover:shadow-xl transition-all"
                  >
                    Create your Nomee
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>

                  <Link
                    href="/maya-torres"
                    className="text-slate-600 hover:text-slate-900 font-medium text-base flex items-center gap-2 px-4 py-3"
                  >
                    See an example →
                  </Link>
                </div>

                <p className="text-sm text-slate-500">
                  Nomee submissions are free forever • 3 saved highlights included
                </p>
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
              className="lg:hidden mt-12"
            >
              <RealNomeeSlice />
            </motion.div>
          </div>
        </section>

        <section className="relative py-24 px-6 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.03),transparent_50%)]" />

          <div className="relative max-w-7xl mx-auto">
            {/* Headline + Subheadline */}
            <div className="text-center mb-16 space-y-4">
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl md:text-5xl font-semibold text-slate-900 tracking-tight"
              >
                You already have proof.
              </motion.h3>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto"
              >
                Praise already exists in your emails, Slack, texts, and DMs. Nomee helps you save the moments that show
                how people experience working with you — then turns them into something you can actually use.
              </motion.p>
            </div>

            {/* Three-column process flow */}
            <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-5xl mx-auto">
              {/* Step 1: Save */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-center space-y-3"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 font-semibold text-lg mb-2">
                  1
                </div>
                <h4 className="text-lg font-semibold text-slate-900">Save praise from anywhere</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Forward emails, upload screenshots, paste messages — capture feedback before it disappears.
                </p>
              </motion.div>

              {/* Step 2: Extract */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="text-center space-y-3"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 font-semibold text-lg mb-2">
                  2
                </div>
                <h4 className="text-lg font-semibold text-slate-900">Pull out the signal</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Nomee automatically extracts what people value — no formatting, no manual work.
                </p>
              </motion.div>

              {/* Step 3: Share */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="text-center space-y-3"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 font-semibold text-lg mb-2">
                  3
                </div>
                <h4 className="text-lg font-semibold text-slate-900">Share one link when it matters</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Your Proof Link shows patterns across all perspectives — ready for any opportunity.
                </p>
              </motion.div>
            </div>

            {/* Visual demonstration: Three realistic snippets with arrows flowing to CTA */}
            <div className="relative max-w-6xl mx-auto">
              {/* Three message snippets */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                {/* iMessage snippet */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="relative group"
                >
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
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
                    <div className="p-4 space-y-2 h-32 flex flex-col justify-end">
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
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
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
                    <div className="p-4 h-32 flex items-center">
                      <p className="text-xs leading-relaxed text-slate-700">
                        The way you reframed our approach completely shifted the conversation. I've worked with a lot of
                        consultants, and your clarity stands out. Let's definitely work together again next quarter.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Slack snippet */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="relative group"
                >
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
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
                    {/* Slack content */}
                    <div className="p-4 space-y-3 h-32 flex flex-col justify-center">
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded bg-teal-500 flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0 mt-0.5">
                          AS
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-xs font-semibold text-slate-900">Aisha Singh</span>
                            <span className="text-[10px] text-slate-500">11:23 AM</span>
                          </div>
                          <p className="text-xs leading-relaxed text-slate-700">
                            Just wrapped the client call — they were so impressed by how you handled their concerns.
                            That's the kind of thinking we need more of. 💯
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
                  className="absolute -top-6 left-0 right-0 h-12 hidden md:flex items-center justify-center"
                >
                  <svg className="w-full h-full" style={{ maxWidth: "600px" }}>
                    {/* Left arrow */}
                    <path
                      d="M 100 0 Q 150 30, 250 40"
                      stroke="rgba(59, 130, 246, 0.3)"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="4 4"
                    />
                    {/* Center arrow */}
                    <path
                      d="M 300 0 L 300 40"
                      stroke="rgba(59, 130, 246, 0.3)"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="4 4"
                    />
                    {/* Right arrow */}
                    <path
                      d="M 500 0 Q 450 30, 350 40"
                      stroke="rgba(59, 130, 246, 0.3)"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="4 4"
                    />
                  </svg>
                </motion.div>

                {/* Primary CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center gap-4"
                >
                  <Link
                    href="/auth/signup"
                    className="group relative inline-flex items-center justify-center px-10 py-4 bg-slate-900 text-white rounded-full font-medium text-base hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105"
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
                  <p className="text-xs text-slate-500">Free forever • No credit card required</p>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-6 bg-slate-50 border-b border-slate-100">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-semibold text-slate-900"
            >
              How Nomee works.
            </motion.h3>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-base text-slate-600 leading-relaxed max-w-2xl mx-auto"
            >
              Send your unique link to people you've collaborated with directly. They write 1–3 sentences with optional
              voice note — <span className="font-medium">~2 minutes</span>.
            </motion.p>

            {/* Three-column process flow */}
            <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-5xl mx-auto">
              {/* Step 1: Share */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center space-y-3"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 font-semibold text-lg mb-2">
                  1
                </div>
                <h4 className="text-lg font-semibold text-slate-900">Share your Nomee link</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Send your unique link to people you've collaborated with directly.
                </p>
              </motion.div>

              {/* Step 2: Contribute */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-center space-y-3"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 font-semibold text-lg mb-2">
                  2
                </div>
                <h4 className="text-lg font-semibold text-slate-900">People contribute their perspective</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  They write 1–3 sentences with optional voice note — <span className="font-medium">~2 minutes</span>.
                </p>
              </motion.div>

              {/* Step 3: Patterns */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-center space-y-3"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 font-semibold text-lg mb-2">
                  3
                </div>
                <h4 className="text-lg font-semibold text-slate-900">Patterns form over time</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Traits and highlighted phrases emerge as more people share their experience.
                </p>
              </motion.div>
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
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Share your Proof Link anywhere for free. Embed Proof Tiles on your website with Pro.
              </p>

              <p className="text-sm text-slate-500 max-w-xl mx-auto">
                Add 1–3 Proof Tiles to your portfolio, media kit, or About page — auto-updated as praise comes in.
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

        {/* Rewritten benefits section with broader messaging */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-6xl mx-auto"
            >
              <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-2xl border border-slate-200/60 shadow-sm p-8 md:p-12">
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="space-y-4 text-center p-6">
                    <div className="w-11 h-11 mx-auto bg-blue-50 rounded-full border border-blue-200 flex items-center justify-center">
                      <BadgeCheck className="w-5 h-5 text-blue-600" strokeWidth={2} />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900">Make decisions easier.</h3>
                    <p className="text-slate-600 leading-relaxed">
                      A single link that shows how people actually experience working with you — beyond a resume,
                      portfolio, or pitch.
                    </p>
                  </div>

                  <div className="space-y-4 text-center p-6">
                    <div className="w-11 h-11 mx-auto bg-blue-50 rounded-full border border-blue-200 flex items-center justify-center">
                      <FileCheck2 className="w-5 h-5 text-blue-600" strokeWidth={2} />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900">Turn praise into proof.</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Collect real perspectives and highlights you can share in proposals, applications, brand decks,
                      and intros.
                    </p>
                  </div>

                  <div className="space-y-4 text-center p-6">
                    <div className="w-11 h-11 mx-auto bg-blue-50 rounded-full border border-blue-200 flex items-center justify-center">
                      <Bookmark className="w-5 h-5 text-blue-600" strokeWidth={2} />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900">Stop losing the good stuff.</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Save the feedback already sitting in email, Slack, and DMs — so it's ready when opportunity shows
                      up.
                    </p>
                  </div>
                </div>

                <div className="mt-8 space-y-4 text-center">
                  <p className="text-sm text-slate-600">
                    Unlimited Nomee contributions are free forever. Includes 3 saved highlights to start.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
                    <span>Job search</span>
                    <span>·</span>
                    <span>Brand deals</span>
                    <span>·</span>
                    <span>Client work</span>
                    <span>·</span>
                    <span>Promotions</span>
                    <span>·</span>
                    <span>Founder intros</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Built for credibility section moved above How a Nomee comes together */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-4xl mx-auto space-y-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-semibold text-slate-900 text-center"
            >
              Built for credibility
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid md:grid-cols-2 gap-8"
            >
              <div className="space-y-4 p-6 bg-slate-50 rounded-xl">
                <h3 className="text-lg font-semibold text-slate-900">Real names + real relationships</h3>
                <p className="text-slate-600 leading-relaxed">
                  Every contribution shows the contributor's name, company, and working relationship.
                </p>
              </div>

              <div className="space-y-4 p-6 bg-slate-50 rounded-xl">
                <h3 className="text-lg font-semibold text-slate-900">One perspective per person</h3>
                <p className="text-slate-600 leading-relaxed">
                  Each person can only contribute once, ensuring authentic and diverse viewpoints.
                </p>
              </div>

              <div className="space-y-4 p-6 bg-slate-50 rounded-xl">
                <h3 className="text-lg font-semibold text-slate-900">Identity-backed submissions</h3>
                <p className="text-slate-600 leading-relaxed">
                  Contributors provide their full name and company, creating accountability and trust.
                </p>
              </div>

              <div className="space-y-4 p-6 bg-slate-50 rounded-xl">
                <h3 className="text-lg font-semibold text-slate-900">You control what's shown</h3>
                <p className="text-slate-600 leading-relaxed">
                  Choose which contributions appear on your Proof Link without changing what was actually said.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* How a Nomee is built */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-6xl mx-auto space-y-16">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-4"
            >
              <h2 className="text-3xl md:text-4xl font-semibold text-slate-900">How a Nomee is built</h2>
              <p className="text-xl text-slate-600">Two inputs. One Proof Link. Real signals people trust.</p>
            </motion.div>

            <div className="relative">
              {/* Two Input Cards - Side by Side */}
              <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-6">
                {/* Input 1: Contributions */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="bg-slate-50 rounded-xl p-5 space-y-3 border border-slate-200/80"
                >
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Input 1</div>
                    <h3 className="text-lg font-semibold text-slate-900">Contributions</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      People you've worked with describe the experience.
                    </p>
                  </div>
                </motion.div>

                {/* Input 2: Uploaded proof */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="bg-slate-50 rounded-xl p-5 space-y-3 border border-slate-200/80"
                >
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Input 2</div>
                    <h3 className="text-lg font-semibold text-slate-900">Uploaded proof</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">Save praise from email, Slack, and DMs.</p>
                  </div>
                </motion.div>
              </div>

              <div className="hidden md:block relative h-8 max-w-3xl mx-auto mb-4">
                {/* Left arrow from Input 1 */}
                <svg
                  className="absolute left-1/4 top-0 text-slate-300"
                  width="100"
                  height="40"
                  viewBox="0 0 100 40"
                  fill="none"
                >
                  <path
                    d="M10 0 Q40 20, 90 40"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path d="M90 40 L86 35 M90 40 L85 40" stroke="currentColor" strokeWidth="1.5" />
                </svg>

                {/* Right arrow from Input 2 */}
                <svg
                  className="absolute right-1/4 top-0 text-slate-300"
                  width="100"
                  height="40"
                  viewBox="0 0 100 40"
                  fill="none"
                >
                  <path
                    d="M90 0 Q60 20, 10 40"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path d="M10 40 L14 35 M10 40 L15 40" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>

              {/* Mobile simple arrow */}
              <div className="md:hidden flex items-center justify-center mb-6">
                <svg width="2" height="24" viewBox="0 0 2 24" fill="none" className="text-slate-300">
                  <path d="M1 0V20M1 20L-3 16M1 20L5 16" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-2xl p-10 shadow-[0_10px_40px_rgba(0,0,0,0.08)] border-2 border-blue-100/50 max-w-2xl mx-auto"
              >
                <div className="space-y-5">
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Output</div>
                    <h3 className="text-2xl md:text-3xl font-semibold text-slate-900">Your Personal Nomee Link</h3>
                    <p className="text-slate-600 text-lg leading-relaxed">
                      A single link that shows patterns + proof — in their words.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-slate-100">
                    <ul className="space-y-3 text-sm text-slate-600">
                      <li className="flex items-start gap-3">
                        <span className="text-blue-500 mt-0.5">✓</span>
                        <span>AI summary + emerging themes</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-blue-500 mt-0.5">✓</span>
                        <span>Share anywhere, forever</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-8"
            >
              <h4 className="text-xl md:text-2xl font-semibold text-slate-900 text-center">
                Different sources. One signal.
              </h4>

              <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {/* Contribution preview - clearly a person */}
                <div className="bg-white rounded-xl p-5 border border-slate-200 space-y-4 hover:shadow-md transition-shadow">
                  <p className="text-sm text-slate-700 leading-relaxed">
                    "Jordan brings strategic thinking and clear communication to every project. Exactly who you want in
                    the room."
                  </p>
                  <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Sarah Chen</p>
                      <p className="text-xs text-slate-500">Former colleague</p>
                    </div>
                  </div>
                </div>

                {/* Uploaded proof preview - clearly documentation */}
                <div className="bg-slate-50/80 rounded-xl p-5 border border-slate-200 space-y-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-2">
                    <div className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-semibold uppercase tracking-wide flex-shrink-0 mt-0.5">
                      Email
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      "This campaign exceeded our goals by 40%. Jordan's attention to detail made all the difference."
                    </p>
                  </div>
                  <div className="text-xs text-slate-500 pt-2 border-t border-slate-200">Saved 3 weeks ago</div>
                </div>
              </div>
            </motion.div>

            {/* Authority line */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-sm text-slate-500 text-center max-w-2xl mx-auto"
            >
              This is the context people usually wait until the reference check to get — now it's visible upfront.
            </motion.p>
          </div>
        </section>

        <section id="decision-makers" className="py-24 px-6 bg-slate-50">
          <div className="max-w-6xl mx-auto space-y-12">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-3"
            >
              <h2 className="text-3xl md:text-4xl font-semibold text-slate-900">For people who decide</h2>
              <p className="text-xl text-slate-600">
                Validate working style in minutes — before interviews, contracts, or commitments.
              </p>
            </motion.div>

            {/* Interactive Tabs + Skim Mode Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid md:grid-cols-2 gap-8 items-start"
            >
              {/* Left: Tab Content */}
              <div className="space-y-6">
                {/* Tab Buttons */}
                <div className="flex gap-2 border-b border-slate-200">
                  <button className="px-4 py-2 text-sm font-medium text-slate-900 border-b-2 border-slate-900 -mb-px">
                    Hiring
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
                    Partnerships
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
                    Clients & collaborators
                  </button>
                </div>

                {/* Tab Content: Hiring */}
                <div className="space-y-6">
                  <div>
                    <p className="text-base text-slate-700 leading-relaxed">
                      See how candidates actually operate with others.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-slate-900">What you learn</p>
                    <ul className="space-y-2 text-sm text-slate-600">
                      <li className="flex items-start gap-2">
                        <span className="text-slate-400 mt-0.5">•</span>
                        <span>Collaboration style and reliability</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-slate-400 mt-0.5">•</span>
                        <span>Repeated strengths (not one-off claims)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-slate-400 mt-0.5">•</span>
                        <span>Direct signals from real people</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Right: Skim Mode Preview */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">Decision-Maker View (Skim Mode)</p>
                  <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">~1 min</span>
                </div>

                {/* Top Signals */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Top Signals</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200">
                      Strategic
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200">
                      Clear communicator
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200">
                      Reliable
                    </span>
                  </div>
                </div>

                {/* One-minute read */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Quick Scan</p>

                  {/* Quote 1 */}
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-sm text-slate-700 leading-relaxed">
                      "Brings clarity to complex projects. Always two steps ahead."
                    </p>
                  </div>

                  {/* Quote 2 */}
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-sm text-slate-700 leading-relaxed">
                      "The kind of collaborator who makes everyone better."
                    </p>
                  </div>

                  {/* Uploaded proof excerpt */}
                  <div className="bg-white rounded-lg p-3 border border-slate-200">
                    <p className="text-xs text-slate-500 mb-1">📎 From client email</p>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      "This exceeded our expectations. Thank you."
                    </p>
                  </div>
                </div>

                {/* Patterns forming */}
                <div className="pt-3 border-t border-slate-200">
                  <p className="text-xs text-slate-500">
                    Patterns forming: <span className="font-medium">Strategic ×5, Clear communicator ×4</span>
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Strong CTA Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center space-y-4"
            >
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/maya-torres"
                  className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors"
                >
                  See an example Proof Link
                </Link>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center gap-2 border border-slate-300 text-slate-900 px-6 py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                >
                  Create your Nomee
                </Link>
              </div>

              {/* Trust micro-line */}
              <p className="text-sm text-slate-500">Real names. Real relationships. One contribution per person.</p>
            </motion.div>
          </div>
        </section>

        <section id="pricing" className="py-24 px-6 bg-white">
          <div className="max-w-6xl mx-auto space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-4"
            >
              <h2 className="text-3xl md:text-4xl font-semibold text-slate-900">Pricing</h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid md:grid-cols-3 gap-8"
            >
              {/* Free Plan */}
              <div className="border border-slate-200 rounded-xl p-8 bg-white space-y-6 hover:shadow-lg transition-shadow">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-slate-900">Free</h3>
                  <p className="text-4xl font-bold text-slate-900">$0</p>
                  <p className="text-base font-semibold text-slate-700">Submissions free forever</p>
                </div>

                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>Unlimited Nomee submissions (your link)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>AI Summary + Pattern Recognition + Top 3 Vibes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>3 uploads included</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>Share your Proof Link anywhere</span>
                  </li>
                </ul>

                <Button
                  onClick={() => openModal("deck")}
                  className="w-full bg-slate-900 text-white hover:bg-slate-800 rounded-full py-6 text-base font-medium transition-all"
                >
                  Start free
                </Button>
              </div>

              {/* Pro Plan */}
              <div className="border-2 border-blue-600 rounded-xl p-8 bg-white space-y-6 shadow-lg relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-semibold">
                  POPULAR
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-slate-900">Pro</h3>
                  <p className="text-4xl font-bold text-slate-900">
                    $7<span className="text-lg font-normal text-slate-600">/month</span>
                  </p>
                  <p className="text-sm text-slate-500">or $77/year</p>
                  <p className="text-base font-semibold text-slate-700">Unlimited uploads + embeds</p>
                </div>

                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>Unlimited uploads (past praise)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>Better extraction + cleaner excerpts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>Pin your strongest proof</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>Embed Proof Tiles on your website (portfolio, media kit, About page)</span>
                  </li>
                </ul>

                <Button className="w-full bg-blue-600 text-white hover:bg-blue-700 rounded-full py-6 text-base font-medium transition-all">
                  Go Pro
                </Button>
              </div>

              {/* Premier Plan */}
              <div className="border border-slate-200 rounded-xl p-8 bg-white space-y-6 hover:shadow-lg transition-shadow">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-slate-900">Premier</h3>
                  <p className="text-4xl font-bold text-slate-900">
                    $14<span className="text-lg font-normal text-slate-600">/month</span>
                  </p>
                  <p className="text-sm text-slate-500">or $149/year</p>
                  <p className="text-base font-semibold text-slate-700">Decision-Maker View</p>
                </div>

                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>Everything in Pro</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>Decision-Maker View (skim mode)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>Stronger credibility signals (role mix, recency)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>Basic analytics (views / clicks)</span>
                  </li>
                </ul>

                <Button className="w-full bg-slate-900 text-white hover:bg-slate-800 rounded-full py-6 text-base font-medium transition-all">
                  Go Premier
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center pt-8"
            >
              <p className="text-sm text-slate-500 max-w-2xl mx-auto">
                Uploads require processing — that's why Pro exists. Submissions stay free forever.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-32 px-6 bg-slate-900">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold text-white"
            >
              Create once. Let it grow over time.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-slate-300"
            >
              One link. Many perspectives. Patterns emerge.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button
                onClick={() => openModal("deck")}
                size="lg"
                className="bg-white text-slate-900 hover:bg-slate-100 rounded-full px-8 py-6 text-base font-medium shadow-lg hover:shadow-xl transition-all"
              >
                Start uploading today
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
