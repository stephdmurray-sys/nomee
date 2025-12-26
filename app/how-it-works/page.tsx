"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ModalSignup } from "@/components/modal-signup"
import { motion } from "framer-motion"
import { SiteHeader } from "@/components/site-header"
import { ArrowRight, CheckCircle2 } from "lucide-react"

export default function HowItWorksPage() {
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

        <section className="pt-32 pb-16 px-6">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <h1 className="text-5xl md:text-7xl font-bold text-slate-900 leading-tight tracking-tight">
                How Nomee works
              </h1>

              <p className="text-xl md:text-2xl text-slate-700 leading-relaxed max-w-3xl mx-auto">
                A simple way to gather and share how people experience working with you.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-16 px-6 bg-white">
          <div className="max-w-5xl mx-auto space-y-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-semibold text-slate-900 text-center"
            >
              Three steps to build your Nomee
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center text-xl font-bold">
                  1
                </div>
                <h3 className="text-2xl font-semibold text-slate-900">Share your link</h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                  Send one link to people you've worked with directly — colleagues, clients, partners, or managers.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-4"
              >
                <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center text-xl font-bold">
                  2
                </div>
                <h3 className="text-2xl font-semibold text-slate-900">They add their perspective</h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                  Contributors share what it was like working with you — in their own words, with their name attached.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-4"
              >
                <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center text-xl font-bold">
                  3
                </div>
                <h3 className="text-2xl font-semibold text-slate-900">Patterns emerge</h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                  As more people contribute, traits and themes surface — showing how you consistently show up.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-slate-50">
          <div className="max-w-4xl mx-auto space-y-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-semibold text-slate-900 text-center"
            >
              What makes Nomee different
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white p-8 rounded-2xl shadow-sm space-y-4"
              >
                <CheckCircle2 className="w-8 h-8 text-slate-900" />
                <h3 className="text-xl font-semibold text-slate-900">Identity-backed</h3>
                <p className="text-slate-600 leading-relaxed">
                  Every perspective comes from a real person with a verified identity. No anonymous feedback, no fake
                  reviews.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm space-y-4"
              >
                <CheckCircle2 className="w-8 h-8 text-slate-900" />
                <h3 className="text-xl font-semibold text-slate-900">One perspective per person</h3>
                <p className="text-slate-600 leading-relaxed">
                  Each contributor can only submit once, ensuring quality over quantity and preventing spam.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white p-8 rounded-2xl shadow-sm space-y-4"
              >
                <CheckCircle2 className="w-8 h-8 text-slate-900" />
                <h3 className="text-xl font-semibold text-slate-900">Full transparency</h3>
                <p className="text-slate-600 leading-relaxed">
                  Names, companies, and relationships are shown. Your reputation is built on trust, not anonymity.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white p-8 rounded-2xl shadow-sm space-y-4"
              >
                <CheckCircle2 className="w-8 h-8 text-slate-900" />
                <h3 className="text-xl font-semibold text-slate-900">You control presentation</h3>
                <p className="text-slate-600 leading-relaxed">
                  Choose which perspectives to feature and how to present them — without changing what was said.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-white">
          <div className="max-w-4xl mx-auto space-y-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-semibold text-slate-900 text-center"
            >
              What you won't find on Nomee
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4 text-lg text-slate-700"
            >
              <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-xl">
                <span className="text-2xl">🚫</span>
                <div>
                  <strong className="text-slate-900">No star ratings.</strong> People aren't products to be scored.
                  Context matters.
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-xl">
                <span className="text-2xl">🚫</span>
                <div>
                  <strong className="text-slate-900">No anonymous feedback.</strong> Every perspective is tied to a real
                  person you've worked with.
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-xl">
                <span className="text-2xl">🚫</span>
                <div>
                  <strong className="text-slate-900">No gamification.</strong> This isn't about badges, leaderboards, or
                  vanity metrics.
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-20 px-6 bg-slate-50">
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
                {["Professionals", "Job seekers", "Creators", "Consultants", "Founders", "Freelancers"].map((role) => (
                  <span key={role} className="px-5 py-2 bg-white text-slate-700 rounded-full text-sm font-medium">
                    {role}
                  </span>
                ))}
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
              Ready to start?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-slate-300"
            >
              Create your Nomee in under 2 minutes. Let it grow over time.
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
