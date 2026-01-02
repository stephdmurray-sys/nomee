"use client"

import { motion } from "framer-motion"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useState } from "react"
import { ModalSignup } from "@/components/modal-signup"

export default function WhatIsNomeePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className="min-h-screen bg-white">
        <SiteHeader onCreateClick={() => setIsModalOpen(true)} />

        {/* 1. Opening Definition */}
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-7xl font-bold text-slate-900 leading-tight tracking-tight"
            >
              What is Nomee?
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-2xl md:text-3xl text-slate-900 leading-relaxed max-w-3xl mx-auto font-medium"
            >
              Nomee is a personal record of how people experience working with you.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-slate-600 max-w-2xl mx-auto"
            >
              Built from real workplace praise and feedback, captured over time.
            </motion.p>
          </div>
        </section>

        {/* 2. Visual First: Where Praise Lives Today */}
        <section className="py-20 px-6 bg-slate-50">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Email snippet */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                      JK
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">Jordan K.</p>
                      <p className="text-xs text-slate-500">Re: Project Update</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Your ability to see three steps ahead is exactly what we needed on this.
                  </p>
                </div>
              </motion.div>

              {/* Slack message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <div className="w-6 h-6 rounded bg-purple-600" />
                    <span className="text-sm font-medium text-slate-900">#team-wins</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded bg-teal-500 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                      AS
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-500 mb-1">Alex S. 2:14 PM</p>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        How you handled their questions was the kind of thinking we need more of.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* LinkedIn message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                      in
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">Sam Chen</p>
                      <p className="text-xs text-slate-500">Product Lead at TechCo</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Working with you changed how I think about collaboration.
                  </p>
                </div>
              </motion.div>

              {/* Peer recognition */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Recognition</span>
                    <div className="w-6 h-6 rounded bg-amber-400 flex items-center justify-center text-xs">⭐</div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                      MR
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-500 mb-1">Morgan R.</p>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        You stayed calm when everything felt like it was falling apart.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-center text-lg text-slate-600 pt-4"
            >
              Most meaningful praise lives scattered across tools you don't own.
            </motion.p>
          </div>
        </section>

        {/* 3. The Problem Nomee Solves */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-3xl mx-auto space-y-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-semibold text-slate-900 text-center"
            >
              The problem
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4 text-lg text-slate-700 leading-relaxed"
            >
              <p>Praise is easy to give, hard to keep</p>
              <p>Recognition disappears when roles or companies change</p>
              <p>Annual reviews rely on memory, not evidence</p>
              <p>Hiring decisions lack real signal about working style</p>
            </motion.div>
          </div>
        </section>

        {/* 4. Visual: From Moments to Signal */}
        <section className="py-20 px-6 bg-slate-50">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left: Raw praise */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm"
              >
                <p className="text-base text-slate-700 leading-relaxed">
                  You have been so great to work with! Thanks for being amazing and so creative with the work you've
                  done. Your organizational skills and gift for seeing the big picture while managing details made this
                  project actually enjoyable. You helped me think more clearly about what we were trying to accomplish.
                </p>
              </motion.div>

              {/* Right: Highlighted version */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm"
              >
                <p className="text-base text-slate-700 leading-relaxed">
                  You have been so <span className="nomee-highlight-marker">great to work with</span>! Thanks for being
                  amazing and so creative with the work you've done. Your{" "}
                  <span className="nomee-highlight-marker">organizational skills</span> and{" "}
                  <span className="nomee-highlight-marker">gift for seeing the big picture</span> while managing details
                  made this project actually enjoyable. You{" "}
                  <span className="nomee-highlight-marker">helped me think more clearly</span> about what we were trying
                  to accomplish.
                </p>
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center text-lg text-slate-600"
            >
              Nomee turns moments into signal.
            </motion.p>
          </div>
        </section>

        {/* 5. How Nomee Is Different */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-5xl mx-auto space-y-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-semibold text-slate-900 text-center"
            >
              How Nomee is different
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid md:grid-cols-2 gap-12"
            >
              {/* Left column */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-slate-900 pb-4 border-b border-slate-200">
                  What exists today
                </h3>
                <div className="space-y-4 text-base text-slate-700 leading-relaxed">
                  <p>Company-owned recognition tools</p>
                  <p>Performance reviews</p>
                  <p>Testimonials</p>
                  <p>References</p>
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-slate-900 pb-4 border-b border-slate-200">Nomee</h3>
                <div className="space-y-4 text-base text-slate-700 leading-relaxed">
                  <p>Personal ownership</p>
                  <p>Spans roles and time</p>
                  <p>Focuses on how it feels to work with someone</p>
                  <p>Surfaces patterns, not ratings</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 6. When People Use Nomee */}
        <section className="py-20 px-6 bg-slate-50">
          <div className="max-w-4xl mx-auto space-y-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-semibold text-slate-900 text-center"
            >
              When people use Nomee
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid md:grid-cols-2 gap-6"
            >
              {[
                "Preparing for an annual review",
                "Supporting a promotion conversation",
                "Reflecting during burnout or transition",
                "Giving hiring managers real signal",
                "Differentiating as a contractor or independent contributor",
              ].map((moment, idx) => (
                <motion.div
                  key={moment}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + idx * 0.1 }}
                  className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm"
                >
                  <p className="text-base text-slate-700">{moment}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* 7. For Hiring Professionals */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-3xl mx-auto space-y-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-semibold text-slate-900 text-center"
            >
              For hiring professionals
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4 text-lg text-slate-700 leading-relaxed"
            >
              <p>Adds signal beyond resumes and interviews</p>
              <p>Shows patterns across multiple collaborators</p>
              <p>Surfaces working style, communication, and impact</p>
              <p>Reduces reliance on single-manager perspectives</p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center text-lg text-slate-900 font-medium pt-8"
            >
              Nomee doesn't replace interviews. It adds signal where interviews fall short.
            </motion.p>
          </div>
        </section>

        {/* 8. How Nomee Uses AI */}
        <section className="py-20 px-6 bg-slate-50">
          <div className="max-w-3xl mx-auto space-y-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-semibold text-slate-900 text-center"
            >
              How Nomee uses AI
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4 text-lg text-slate-700 leading-relaxed"
            >
              <p>Highlights traits and patterns</p>
              <p>Preserves original wording</p>
              <p>Synthesizes over time</p>
              <p>Never generates praise</p>
            </motion.div>
          </div>
        </section>

        {/* 9. What Nomee Is Not */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-3xl mx-auto space-y-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-semibold text-slate-900 text-center"
            >
              What Nomee is not
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4 text-lg text-slate-700 leading-relaxed"
            >
              <p>Not a peer recognition platform</p>
              <p>Not a performance review tool</p>
              <p>Not testimonials</p>
              <p>Not self-promotion</p>
            </motion.div>
          </div>
        </section>

        {/* 10. Closing Thought + CTA */}
        <section className="py-24 px-6 bg-slate-900">
          <div className="max-w-3xl mx-auto text-center space-y-10">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-2xl md:text-3xl text-white leading-relaxed font-medium"
            >
              Your work speaks through other people. Nomee makes sure you don't lose that record.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Button
                onClick={() => setIsModalOpen(true)}
                size="lg"
                className="bg-white text-slate-900 hover:bg-slate-100 rounded-full px-8 py-6 text-base font-medium shadow-lg hover:shadow-xl transition-all"
              >
                Start your Nomee
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </div>
        </section>
      </div>

      <ModalSignup isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialType="deck" />
    </>
  )
}
