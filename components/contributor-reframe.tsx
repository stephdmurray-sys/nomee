"use client"

import { motion } from "framer-motion"

export function ContributorReframe() {
  return (
    <section className="py-32 px-6 bg-slate-50">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-8"
        >
          <p className="text-xs uppercase tracking-widest text-slate-500 font-medium">For contributors</p>

          <h2 className="text-4xl md:text-5xl font-medium text-slate-900 leading-tight">
            This isn't feedback.
            <br />
            It's a vouch.
          </h2>

          <div className="space-y-6 text-xl text-slate-700 leading-relaxed max-w-2xl mx-auto pt-6">
            <p>When you share what it was like to work with someone, you're not filling out a form.</p>
            <p className="text-slate-900 font-medium">You're honoring the collaboration you had together.</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
