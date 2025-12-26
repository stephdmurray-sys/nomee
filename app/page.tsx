"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ModalSignup } from "@/components/modal-signup"
import { motion } from "framer-motion"
import { SiteHeader } from "@/components/site-header"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

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

        {/* Hero Section */}
        <section className="pt-32 pb-24 px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <p className="text-sm text-slate-600 font-medium">
                Resumes, bios, and recommendations don't show how you actually work.
              </p>

              <h1 className="text-5xl md:text-7xl font-bold text-slate-900 leading-tight tracking-tight">
                What it's really like to work with you.
              </h1>

              <p className="text-xl md:text-2xl text-slate-700 leading-relaxed max-w-3xl mx-auto">
                Nomee collects real feedback from people you've worked with and turns it into a clear, trustworthy
                profile.
              </p>

              <p className="text-lg text-slate-600 max-w-2xl mx-auto">Not ratings. Not reviews. Real perspectives.</p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button
                  onClick={() => openModal("deck")}
                  size="lg"
                  className="bg-slate-900 text-white hover:bg-slate-800 rounded-full px-8 py-6 text-base font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  Create your Nomee
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                <Link href="/maya-torres" className="text-slate-600 hover:text-slate-900 font-medium text-base">
                  See an example →
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-20 px-6 bg-slate-50">
          <div className="max-w-5xl mx-auto space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-4"
            >
              <h2 className="text-3xl md:text-4xl font-semibold text-slate-900">
                A real Nomee — shaped by collaborators
              </h2>

              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                This profile isn't written or curated by the person shown.
                <br />
                It's built from what multiple people independently say about working with her.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl border-2 border-slate-200 p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <Link href="/maya-torres" className="block space-y-6 group">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-slate-900 group-hover:text-slate-700 transition-colors">
                    Maya Torres
                  </h3>
                  <p className="text-slate-600">Product Strategy & Operations</p>
                </div>

                <div className="space-y-4">
                  <p className="text-lg text-slate-700 leading-relaxed">
                    "Working with Maya was a masterclass in collaboration. She made space for everyone's ideas while
                    keeping us focused on what mattered."
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">Strategic</span>
                    <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                      Calm under pressure
                    </span>
                    <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">Thoughtful</span>
                    <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                      Clear communicator
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">13 perspectives • 8 collaborators</p>
                </div>

                <div className="pt-4">
                  <span className="text-slate-900 font-medium group-hover:underline">View full profile →</span>
                </div>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center space-y-4"
            >
              <p className="text-sm font-medium text-slate-500">What to notice:</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-start text-left max-w-3xl mx-auto">
                <div className="flex-1 space-y-1">
                  <p className="text-sm text-slate-700">
                    • "Strategic," "calm under pressure," and "thoughtful" each appear 4+ times
                  </p>
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm text-slate-700">
                    • Phrases like "asks questions" repeat across different people
                  </p>
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm text-slate-700">
                    • Working style emerges as a clear pattern, not just outcomes
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Not another review site */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-4xl mx-auto space-y-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-semibold text-slate-900 text-center"
            >
              Not another review site
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid md:grid-cols-2 gap-8"
            >
              <div className="space-y-4 p-6 bg-slate-50 rounded-xl">
                <h3 className="text-xl font-semibold text-slate-900">Traditional reviews</h3>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400">•</span>
                    <span>Built for products and services</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400">•</span>
                    <span>Anonymous or one-off comments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400">•</span>
                    <span>Focus on selling or promoting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400">•</span>
                    <span>Ratings and scores</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4 p-6 bg-slate-900 text-white rounded-xl">
                <h3 className="text-xl font-semibold">Nomee</h3>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-slate-500">•</span>
                    <span>Built for people and relationships</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-500">•</span>
                    <span>Named collaborators with context</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-500">•</span>
                    <span>Focus on trust and truth</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-500">•</span>
                    <span>Patterns from real experience</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-24 px-6 bg-slate-50">
          <div className="max-w-4xl mx-auto space-y-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-semibold text-slate-900 text-center"
            >
              How it works
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
                <h3 className="text-xl font-semibold text-slate-900">Invite</h3>
                <p className="text-slate-600 leading-relaxed">
                  Share your Nomee link with people you've worked with directly.
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
                <h3 className="text-xl font-semibold text-slate-900">Patterns</h3>
                <p className="text-slate-600 leading-relaxed">
                  As people share their perspectives, common themes and traits emerge.
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
                <h3 className="text-xl font-semibold text-slate-900">Share</h3>
                <p className="text-slate-600 leading-relaxed">
                  Use your Nomee profile anywhere your reputation matters.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Who it's for */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-4xl mx-auto space-y-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-semibold text-slate-900 text-center"
            >
              Who it's for
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid md:grid-cols-3 gap-8"
            >
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-slate-900">Creators building in public</h3>
                <p className="text-slate-600 leading-relaxed">
                  Show what it's like to collaborate with you, beyond your portfolio.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-slate-900">People exploring new roles</h3>
                <p className="text-slate-600 leading-relaxed">
                  Stand out in hiring processes with authentic perspectives from your network.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-slate-900">Hiring managers making decisions</h3>
                <p className="text-slate-600 leading-relaxed">
                  Get context beyond resumes to understand how someone actually works.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Why it matters now */}
        <section className="py-24 px-6 bg-slate-50">
          <div className="max-w-3xl mx-auto space-y-8 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-semibold text-slate-900"
            >
              Why it matters now
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-slate-700 leading-relaxed"
            >
              Work is more distributed than ever. We collaborate across companies, time zones, and projects. Traditional
              references and LinkedIn recommendations don't capture the full picture anymore. Nomee gives you a way to
              collect and share genuine human feedback that builds trust over time.
            </motion.p>
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
              Create your Nomee
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-slate-300"
            >
              It's free to start. Takes 2 minutes to set up.
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
