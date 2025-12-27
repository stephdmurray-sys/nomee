"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ModalSignup } from "@/components/modal-signup"
import { motion } from "framer-motion"
import { SiteHeader } from "@/components/site-header"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { DemoCard } from "@/components/demo-card"

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
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: Product-first copy */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight tracking-tight">
                  This is a Nomee.
                </h1>

                <p className="text-lg text-slate-500 font-medium">Real experiences. Highlighted patterns. Over time.</p>

                <p className="text-xl md:text-2xl text-slate-700 leading-relaxed">
                  A Nomee shows what it's really like to work with you — from real people, over time.
                </p>

                <p className="text-lg text-slate-600">Takes ~2 minutes to contribute.</p>

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

              {/* Right: Demo cards with inline highlights */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="grid gap-4"
              >
                <DemoCard
                  quote="Maya asks questions that make you think differently about the problem. Her thoughtful approach to complex challenges helped us uncover insights we never would have found otherwise."
                  name="Quinn Davis"
                  company="ResearchLab"
                  relationship="Other"
                  traits={["Thoughtful", "Curious", "Analytical"]}
                />
                <DemoCard
                  quote="In high-pressure situations, Maya is the person you want in the room. She stays calm, asks the right questions, and helps everyone think more clearly."
                  name="Morgan Lee"
                  company="Enterprise Inc"
                  relationship="Manager"
                  hasVoice
                  voiceDuration="38s"
                  traits={["Calm under pressure", "Level-headed", "Clear communicator"]}
                />
                <DemoCard
                  quote="Maya creates such a safe space for creative exploration. She encouraged us to think bigger while keeping us grounded in what was actually possible."
                  name="Casey Wong"
                  company="Creative Co"
                  relationship="Client"
                  traits={["Encouraging", "Supportive", "Collaborative"]}
                />
              </motion.div>
            </div>
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
                Highlights are pulled directly from each contribution.
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
                These traits weren't selected — they emerged as more people shared their experience.
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
