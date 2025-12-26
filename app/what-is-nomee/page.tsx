"use client"

import { motion } from "framer-motion"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { ModalSignup } from "@/components/modal-signup"

export default function WhatIsNomeePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const traits = [
    "Follows through",
    "Calm under pressure",
    "Easy to work with",
    "Communicates clearly",
    "Takes ownership",
    "Builds trust",
  ]

  return (
    <>
      <div className="min-h-screen bg-white">
        <SiteHeader onCreateClick={() => setIsModalOpen(true)} />

        {/* Hero Section */}
        <section className="pt-32 pb-16 px-6">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h1 className="text-5xl md:text-7xl font-bold text-slate-900 leading-tight tracking-tight">
                What is Nomee?
              </h1>

              <p className="text-xl md:text-2xl text-slate-700 leading-relaxed max-w-3xl mx-auto">
                A Nomee shows how people experience working with you — shared by real people, over time.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Pattern Recognition */}
        <section className="py-16 px-6 bg-slate-50">
          <div className="max-w-4xl mx-auto space-y-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-semibold text-slate-900 text-center"
            >
              What stands out, consistently
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap justify-center gap-4"
            >
              {traits.map((trait, idx) => (
                <motion.div
                  key={trait}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + idx * 0.1 }}
                  className="px-6 py-3 bg-white text-slate-800 rounded-full text-base font-medium border-2 border-slate-200 shadow-sm"
                >
                  {trait}
                </motion.div>
              ))}
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-center text-sm text-slate-500 pt-4"
            >
              Patterns emerge as more people share how you show up.
            </motion.p>
          </div>
        </section>

        {/* Built for Credibility */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-3xl mx-auto space-y-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-semibold text-slate-900 text-center"
            >
              Built for credibility
            </motion.h2>

            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4 text-lg text-slate-700"
            >
              <li className="flex items-start gap-3">
                <span className="text-slate-400 mt-1">•</span>
                <span>Identity-backed submissions</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-slate-400 mt-1">•</span>
                <span>One perspective per person</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-slate-400 mt-1">•</span>
                <span>Names, companies, and relationships shown</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-slate-400 mt-1">•</span>
                <span>Presentation control without changing truth</span>
              </li>
            </motion.ul>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center text-slate-600 pt-6 font-medium"
            >
              No ratings. No anonymous feedback. No reviews.
            </motion.p>
          </div>
        </section>

        {/* What Nomee is NOT */}
        <section className="py-20 px-6 bg-slate-50">
          <div className="max-w-3xl mx-auto space-y-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-semibold text-slate-900 text-center"
            >
              What Nomee is NOT
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Not a rating system</h3>
                <p className="text-slate-600 leading-relaxed">
                  No stars, scores, or rankings. Nomee captures how people experience working with you, not a numeric
                  evaluation.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Not anonymous</h3>
                <p className="text-slate-600 leading-relaxed">
                  Every submission is identity-backed with names, companies, and working relationships shown publicly
                  for transparency.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Not gamified</h3>
                <p className="text-slate-600 leading-relaxed">
                  No leaderboards, badges, or point systems. The focus is on authentic collaboration patterns, not
                  competition.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Who It's For */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-3xl mx-auto space-y-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-semibold text-slate-900 text-center"
            >
              Who Nomee is for
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6 text-center"
            >
              <p className="text-lg text-slate-700 leading-relaxed">
                Nomee works for anyone whose reputation matters — whether you're exploring new opportunities, building
                partnerships, or sharing your work publicly.
              </p>

              <div className="flex flex-wrap justify-center gap-3 pt-4">
                {["Professionals", "Job seekers", "Creators", "Consultants", "Founders"].map((role) => (
                  <span key={role} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                    {role}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 bg-slate-900">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold text-white"
            >
              Ready to create your Nomee?
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button
                onClick={() => setIsModalOpen(true)}
                size="lg"
                className="bg-white text-slate-900 hover:bg-slate-100 rounded-full px-8 py-6 text-base font-medium shadow-lg hover:shadow-xl transition-all"
              >
                Create your Nomee
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <Link href="/maya-torres" className="text-slate-300 hover:text-white font-medium text-base">
                See an example →
              </Link>
            </motion.div>
          </div>
        </section>
      </div>

      <ModalSignup isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialType="deck" />
    </>
  )
}
