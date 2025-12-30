"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ModalSignup } from "@/components/modal-signup"
import { motion } from "framer-motion"
import { SiteHeader } from "@/components/site-header"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { DemoCard } from "@/components/demo-card"
import { RealNomeeSlice } from "@/components/real-nomee-slice"
import { ChevronDown } from "lucide-react"

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
                {/* Tab toggle */}
                <div className="inline-flex items-center gap-2 bg-slate-100 p-1 rounded-full">
                  <button
                    onClick={() => setHeroTab("professional")}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      heroTab === "professional"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    For Professionals
                  </button>
                  <button
                    onClick={() => setHeroTab("decision-maker")}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      heroTab === "decision-maker"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    For Decision-Makers
                  </button>
                </div>

                {heroTab === "professional" ? (
                  <>
                    <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight tracking-tight">
                      Don't lose the praise. Turn it into proof.
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-700 leading-relaxed">
                      One link to how people experience working with you — for hiring, partnerships, clients, and
                      promotions.
                    </p>

                    <p className="text-sm text-slate-500 font-medium">
                      Trusted by people who make decisions — hiring, partnerships, clients, collaborators.
                    </p>

                    <br />

                    <div className="flex flex-col sm:flex-row items-start gap-4 pt-4">
                      <Button
                        onClick={() => openModal("deck")}
                        size="lg"
                        className="bg-slate-900 text-white hover:bg-slate-800 rounded-full px-8 py-6 text-base font-medium shadow-lg hover:shadow-xl transition-all"
                      >
                        Start uploading today
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>

                      <Link
                        href="/maya-torres"
                        className="text-slate-600 hover:text-slate-900 font-medium text-base flex items-center gap-2 px-4 py-3"
                      >
                        See an example →
                      </Link>
                    </div>

                    <p className="text-sm text-slate-500">Nomee submissions are free forever • 3 uploads included</p>
                  </>
                ) : (
                  <>
                    <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight tracking-tight">
                      See how they actually show up — fast.
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-700 leading-relaxed">
                      Nomee surfaces repeated collaboration signals from real perspectives, voice notes, and sourced
                      screenshots — so you can decide with less guesswork.
                    </p>

                    <br />

                    <div className="flex flex-col sm:flex-row items-start gap-4 pt-4">
                      <Link href="/maya-torres">
                        <Button
                          size="lg"
                          className="bg-slate-900 text-white hover:bg-slate-800 rounded-full px-8 py-6 text-base font-medium shadow-lg hover:shadow-xl transition-all"
                        >
                          View an example
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      </Link>
                    </div>

                    <p className="text-sm text-slate-500">
                      Optional artifact for candidates + creators. Faster than reference checks.
                    </p>
                  </>
                )}
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

        {/* Added new urgency strip section after hero */}
        <section className="py-12 px-6 bg-gradient-to-b from-slate-50 to-white border-y border-slate-100">
          <div className="max-w-3xl mx-auto text-center space-y-3">
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-xl md:text-2xl font-semibold text-slate-900"
            >
              Start uploading today.
            </motion.h3>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-base text-slate-600 leading-relaxed"
            >
              Praise gets buried in emails, Slack, and DMs. Save it while it's still easy to find.
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-sm text-slate-500 font-medium"
            >
              3 uploads free.
            </motion.p>
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
                    <div className="space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-3/4" />
                      <div className="h-4 bg-slate-200 rounded w-full" />
                      <div className="h-4 bg-slate-200 rounded w-5/6" />
                    </div>
                    <div className="border-2 border-blue-200 rounded-lg p-6 bg-blue-50/30">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-blue-200" />
                        <div className="space-y-2 flex-1">
                          <div className="h-3 bg-blue-200 rounded w-1/3" />
                          <div className="h-2 bg-blue-100 rounded w-1/4" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 bg-blue-100 rounded w-full" />
                        <div className="h-3 bg-blue-100 rounded w-5/6" />
                      </div>
                      <div className="mt-4 text-xs text-center text-blue-600 font-medium">Powered by Nomee</div>
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
              className="grid md:grid-cols-3 gap-8"
            >
              <div className="space-y-4 text-center p-6">
                <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 bg-blue-600 rounded" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900">Decide faster with real signals</h3>
                <p className="text-slate-600 leading-relaxed">
                  Hiring, partners, and clients can scan how someone shows up — beyond a resume or pitch.
                </p>
              </div>

              <div className="space-y-4 text-center p-6">
                <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 bg-blue-600 rounded-full" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900">Get recognized without overselling</h3>
                <p className="text-slate-600 leading-relaxed">
                  Let real people describe the impact and working vibe you're known for.
                </p>
              </div>

              <div className="space-y-4 text-center p-6">
                <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 bg-blue-600 rounded-sm" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900">Save praise before it disappears</h3>
                <p className="text-slate-600 leading-relaxed">
                  The best feedback is already in your inbox and messages. Capture it now.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contrast statement after outcomes section */}
        <section className="py-12 px-6 bg-white">
          <div className="max-w-2xl mx-auto">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-xl md:text-2xl text-slate-700 text-center leading-relaxed"
            >
              Without Nomee, people have to take your word for it.
              <br />
              <span className="block mt-3">With Nomee, they hear it from others.</span>
            </motion.p>
          </div>
        </section>

        {/* Renamed section to "What your Proof Link shows" and updated item names */}
        <section className="py-24 px-6 bg-white relative overflow-hidden">
          <div className="max-w-4xl mx-auto space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6 text-center"
            >
              <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">What your Proof Link shows</h2>

              <p className="text-lg text-slate-700 leading-relaxed">
                A Proof Link isn't written by you. It's built from people who've worked with you.
              </p>
            </motion.div>

            {/* Horizontal framework cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {/* How it feels */}
              <div className="relative">
                <button
                  onClick={() => setExpandedFramework(expandedFramework === "feels" ? null : "feels")}
                  className="w-full p-6 border border-slate-300 rounded-xl bg-white hover:border-slate-400 hover:shadow-md transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      How it feels
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-blue-600 transition-transform duration-300 ${
                        expandedFramework === "feels" ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>
                {expandedFramework === "feels" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-2 p-4 bg-slate-50 rounded-lg border border-slate-200"
                  >
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Short reflections on the experience of working together
                    </p>
                  </motion.div>
                )}
              </div>

              {/* What stands out */}
              <div className="relative">
                <button
                  onClick={() => setExpandedFramework(expandedFramework === "stands" ? null : "stands")}
                  className="w-full p-6 border border-slate-300 rounded-xl bg-white hover:border-slate-400 hover:shadow-md transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      What stands out
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-blue-600 transition-transform duration-300 ${
                        expandedFramework === "stands" ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>
                {expandedFramework === "stands" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-2 p-4 bg-slate-50 rounded-lg border border-slate-200"
                  >
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Key traits highlighted from each contribution
                    </p>
                  </motion.div>
                )}
              </div>

              {/* What's consistent */}
              <div className="relative">
                <button
                  onClick={() => setExpandedFramework(expandedFramework === "consistent" ? null : "consistent")}
                  className="w-full p-6 border border-slate-300 rounded-xl bg-white hover:border-slate-400 hover:shadow-md transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      What's consistent
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-blue-600 transition-transform duration-300 ${
                        expandedFramework === "consistent" ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>
                {expandedFramework === "consistent" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-2 p-4 bg-slate-50 rounded-lg border border-slate-200"
                  >
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Patterns that emerge as more people share over time
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Updated section intro copy */}
        <section className="py-20 px-6 bg-slate-50">
          <div className="max-w-7xl mx-auto space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-4"
            >
              <h2 className="text-3xl md:text-4xl font-semibold text-slate-900">
                Shared by people who've worked with them
              </h2>
            </motion.div>

            {/* Scrollable card grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <DemoCard
                quote="Maya's organizational skills are next level. She took our chaotic project and created a system that actually worked. Everyone knew what they were doing and why it mattered."
                name="Riley Parker"
                company="AgileTech"
                relationship="Direct Report"
                traits={["Organized", "Systematic", "Clear communicator"]}
              />
              <DemoCard
                quote="Maya has this gift for seeing both the forest and the trees. She caught details that would have derailed our launch while never losing sight of the bigger strategic picture."
                name="Taylor Kim"
                company="ConsultGroup"
                relationship="Other"
                hasVoice
                voiceDuration="48s"
                traits={["Detail-oriented", "Strategic", "Thorough"]}
              />
              <DemoCard
                quote="Maya's reliability is unmatched. When she commits to something, it gets done and done well. She helped us navigate a critical pivot with such calm confidence that the whole team felt grounded."
                name="Sam Martinez"
                company="StartupHQ"
                relationship="Client"
                traits={["Reliable", "Accountable", "Proactive"]}
              />
              <DemoCard
                quote="Working with Maya was a masterclass in collaboration. She made space for everyone's ideas while keeping us focused on what mattered. The way she listens is rare."
                name="Alex Rivera"
                company="NutriTrack"
                relationship="Colleague"
                hasVoice
                voiceDuration="45s"
                traits={["Collaborative", "Active listener", "Focused"]}
              />
              <DemoCard
                quote="Maya brings incredible strategic clarity to complex projects. She helped us restructure our product roadmap with no wasted meetings or confusion about next steps."
                name="Jordan Chen"
                company="GlowUp Beauty"
                relationship="Client"
                hasVoice
                voiceDuration="52s"
                traits={["Strategic", "Clear", "Efficient"]}
              />
              <DemoCard
                quote="Maya consistently goes above and beyond. She created extra content for us unprompted, provided valuable feedback on our product line, and even connected us with other creators."
                name="Nina Patel"
                company="WellnessHub Collective"
                relationship="Client"
                traits={["Goes above and beyond", "Proactive", "Valuable partner"]}
              />
            </motion.div>
          </div>
        </section>

        {/* Added expand/collapse functionality to show only top 8 traits by default */}
        <section className="pt-24 pb-24 px-6 bg-white">
          <div className="max-w-4xl mx-auto space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-4"
            >
              <h2 className="text-3xl md:text-4xl font-semibold text-slate-900">What stands out, consistently</h2>
              <p className="text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
                These signals repeat across contributors.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4"
            >
              {/* Top 6 traits (always visible) */}
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  { trait: "Strategic", count: 6 },
                  { trait: "Clear communicator", count: 6 },
                  { trait: "Collaborative", count: 6 },
                  { trait: "Thoughtful", count: 5 },
                  { trait: "Detail-oriented", count: 5 },
                  { trait: "Reliable", count: 5 },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-full text-base font-semibold transition-colors"
                  >
                    {item.trait} ×{item.count}
                  </button>
                ))}
              </div>

              {/* Additional traits (shown when expanded) */}
              {showAllTraits && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-wrap justify-center gap-2.5"
                >
                  {[
                    { trait: "Calm under pressure", count: 5 },
                    { trait: "Patient", count: 4 },
                    { trait: "Proactive", count: 4 },
                    { trait: "Empathetic", count: 4 },
                    { trait: "Organized", count: 3 },
                    { trait: "Analytical", count: 3 },
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-sm font-semibold transition-colors"
                    >
                      {item.trait} ×{item.count}
                    </button>
                  ))}
                </motion.div>
              )}

              {/* View all / Show less button */}
              <div className="text-center pt-4">
                <button
                  onClick={() => setShowAllTraits(!showAllTraits)}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                >
                  {showAllTraits ? "Show less" : "View all signals"}
                </button>
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
                  Choose which contributions appear on your profile without changing what was actually said.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-24 px-6 bg-white">
          <div className="max-w-4xl mx-auto space-y-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-semibold text-slate-900 text-center"
            >
              How a Nomee comes together
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-4 text-center"
              >
                <div className="w-12 h-12 mx-auto bg-slate-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold text-slate-900">Share your Nomee link</h3>
                <p className="text-slate-600 leading-relaxed">
                  Send your unique link to people you've collaborated with directly.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-4 text-center"
              >
                <div className="w-12 h-12 mx-auto bg-slate-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold text-slate-900">People contribute their perspective</h3>
                <p className="text-slate-600 leading-relaxed">
                  They write 1–3 sentences with optional voice note — <span className="font-medium">~2 minutes</span>
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-4 text-center"
              >
                <div className="w-12 h-12 mx-auto bg-slate-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold text-slate-900">Patterns form over time</h3>
                <p className="text-slate-600 leading-relaxed">
                  Traits and highlighted phrases emerge as more people share their experience.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Authority line before final CTA */}
        <section className="py-12 px-6 bg-white">
          <div className="max-w-2xl mx-auto">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-sm text-slate-500 text-center font-medium"
            >
              This is the context people usually wait until the reference check to get.
            </motion.p>
          </div>
        </section>

        <section id="decision-makers" className="py-24 px-6 bg-slate-50">
          <div className="max-w-5xl mx-auto space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-4"
            >
              <h2 className="text-3xl md:text-4xl font-semibold text-slate-900">For decision-makers</h2>
              <p className="text-xl text-slate-600">A faster way to validate working style.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid md:grid-cols-3 gap-8"
            >
              <div className="space-y-3 text-center">
                <h3 className="text-lg font-semibold text-slate-900">Hiring</h3>
                <p className="text-slate-600">Skim the signals before interviews.</p>
              </div>

              <div className="space-y-3 text-center">
                <h3 className="text-lg font-semibold text-slate-900">Partnerships</h3>
                <p className="text-slate-600">Confirm reliability and collaboration vibe.</p>
              </div>

              <div className="space-y-3 text-center">
                <h3 className="text-lg font-semibold text-slate-900">Clients & collaborators</h3>
                <p className="text-slate-600">Know what it's like to work together before money changes hands.</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="max-w-2xl mx-auto space-y-4"
            >
              <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-3">
                <p className="text-sm font-medium text-slate-700">Copy/paste options for applications:</p>
                <div className="space-y-2 text-sm text-slate-600">
                  <p className="font-mono bg-slate-50 px-3 py-2 rounded border border-slate-200">
                    Optional: Nomee Proof Link (collaboration signals)
                  </p>
                  <p className="font-mono bg-slate-50 px-3 py-2 rounded border border-slate-200">
                    Optional: Partnership proof link
                  </p>
                  <p className="font-mono bg-slate-50 px-3 py-2 rounded border border-slate-200">
                    Optional: Working style evidence link
                  </p>
                </div>
              </div>

              <div className="text-center pt-4">
                <Link href="/maya-torres">
                  <Button
                    size="lg"
                    className="bg-slate-900 text-white hover:bg-slate-800 rounded-full px-8 py-6 text-base font-medium shadow-lg hover:shadow-xl transition-all"
                  >
                    View an example Proof Link
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
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
