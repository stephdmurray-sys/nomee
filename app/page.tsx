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

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<"deck" | "recognition">("deck")

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
                <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight tracking-tight">
                  What it's actually like to work with you.
                </h1>

                <p className="text-lg text-slate-500 font-medium">Real experiences. Highlighted patterns. Over time.</p>

                <p className="text-xl md:text-2xl text-slate-700 leading-relaxed">
                  One link that shows how people experience working with you — from real people, over time.
                </p>

                <br />

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

        {/* Why Nomee Exists section */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-12"
            >
              {/* Anchor line */}
              <div className="bg-blue-50/40 rounded-lg px-8 py-6 border border-blue-100/50">
                <p className="text-xl md:text-2xl text-slate-700 text-center leading-relaxed font-medium">
                  People don't struggle to describe their work — they struggle to show what they're like.
                </p>
              </div>

              {/* Three outcome blocks */}
              <div className="space-y-10">
                {/* Block 1: Jobs */}
                <div className="flex gap-4 items-start">
                  <div className="w-1.5 h-6 bg-blue-400 rounded-full flex-shrink-0 mt-0.5" />
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-slate-900">Get hired without over-explaining yourself</h3>
                    <p className="text-base text-slate-600 leading-relaxed">
                      Hiring managers don't struggle to assess skills — they struggle to understand what it's actually
                      like to work with someone. Nomee gives them that answer before the interview.
                    </p>
                  </div>
                </div>

                {/* Block 2: Deals & partnerships */}
                <div className="flex gap-4 items-start">
                  <div className="w-1.5 h-6 bg-blue-400 rounded-full flex-shrink-0 mt-0.5" />
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-slate-900">Win trust before the first call</h3>
                    <p className="text-base text-slate-600 leading-relaxed">
                      Brands, partners, and collaborators choose people who feel reliable and easy to work with. Nomee
                      lets them hear that directly — from people you've already worked with.
                    </p>
                  </div>
                </div>

                {/* Block 3: Reputation over time */}
                <div className="flex gap-4 items-start">
                  <div className="w-1.5 h-6 bg-blue-400 rounded-full flex-shrink-0 mt-0.5" />
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-slate-900">Keep the praise that usually disappears</h3>
                    <p className="text-base text-slate-600 leading-relaxed">
                      Positive feedback gets buried in emails, DMs, and past jobs. Nomee saves it, organizes it, and
                      lets it compound as your work and relationships grow.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* What a Nomee shows interpretive framing block */}
        <section className="py-20 px-6 bg-white relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Circle 1: "How it feels" - shifted left, lighter opacity */}
            <div className="absolute w-[280px] h-[280px] rounded-full bg-blue-200/[0.06] -translate-x-32 -translate-y-16" />

            {/* Circle 2: "What stands out" - shifted right, light opacity */}
            <div className="absolute w-[260px] h-[260px] rounded-full bg-blue-200/[0.08] translate-x-28 -translate-y-20" />

            {/* Circle 3: "What's consistent" - dominant circle, larger and higher opacity */}
            <div className="absolute w-[340px] h-[340px] rounded-full bg-blue-200/[0.11] translate-x-2 -translate-y-8" />
          </div>

          <div className="max-w-3xl mx-auto space-y-8 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">What a Nomee shows</h2>

              <p className="text-lg text-slate-700 leading-relaxed">
                A Nomee isn't written by the person.
                <br />
                It's built from the people who've worked with them.
              </p>

              <div className="space-y-4 text-left max-w-2xl mx-auto pt-4">
                <p className="text-base text-slate-700 flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-blue-300/60 mt-2 flex-shrink-0" />
                  <span>
                    <span className="font-bold">How it feels</span> — Short reflections capture the experience of
                    working together
                  </span>
                </p>
                <p className="text-base text-slate-700 flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-blue-300/60 mt-2 flex-shrink-0" />
                  <span>
                    <span className="font-bold">What stands out</span> — Key traits are highlighted directly from each
                    contribution
                  </span>
                </p>
                <p className="text-base text-slate-700 flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-blue-300/60 mt-2 flex-shrink-0" />
                  <span>
                    <span className="font-bold">What's consistent</span> — Patterns emerge as more people share over
                    time
                  </span>
                </p>
              </div>
            </motion.div>
          </div>
        </section>

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
              <p className="text-sm text-slate-500 font-medium">
                Each contribution highlights the traits and moments that stood out.
              </p>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Real perspectives from collaborators, clients, and team members.
              </p>
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
                These traits appear repeatedly as more people share their experience.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4"
            >
              {/* Top row: Highest frequency (×5-×6) - Larger size */}
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  { trait: "Strategic", count: 6 },
                  { trait: "Clear communicator", count: 6 },
                  { trait: "Collaborative", count: 6 },
                  { trait: "Thoughtful", count: 5 },
                  { trait: "Detail-oriented", count: 5 },
                  { trait: "Reliable", count: 5 },
                  { trait: "Calm under pressure", count: 5 },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-full text-base font-semibold transition-colors"
                  >
                    {item.trait} ×{item.count}
                  </button>
                ))}
              </div>

              {/* Bottom row: Lower frequency (×3-×4) - Smaller size */}
              <div className="flex flex-wrap justify-center gap-2.5">
                {[
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
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-24 px-6 bg-slate-50">
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
                Create your Nomee
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </div>
        </section>
      </div>

      <ModalSignup isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialType={modalType} />
    </>
  )
}
