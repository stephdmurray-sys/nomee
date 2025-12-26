"use client"

import { motion } from "framer-motion"
import { FileText, Heart } from "lucide-react"

export function ResumeComparison() {
  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="bg-slate-50 rounded-2xl p-8 md:p-10 border border-slate-200"
      >
        <FileText className="text-slate-400 mb-6" size={40} />
        <h3 className="text-2xl font-semibold text-slate-900 mb-4">A resume says</h3>
        <ul className="space-y-3 text-slate-700">
          <li className="flex items-start gap-3">
            <span className="text-slate-400 mt-1">•</span>
            <span>"Increased team efficiency by 40%"</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-slate-400 mt-1">•</span>
            <span>"Led cross-functional initiatives"</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-slate-400 mt-1">•</span>
            <span>"Strong communication skills"</span>
          </li>
        </ul>
        <p className="text-sm text-slate-500 mt-6 italic">Claims you write about yourself.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="bg-emerald-50 rounded-2xl p-8 md:p-10 border border-emerald-200"
      >
        <Heart className="text-emerald-600 mb-6" size={40} />
        <h3 className="text-2xl font-semibold text-slate-900 mb-4">A Nomee shows</h3>
        <ul className="space-y-3 text-slate-700">
          <li className="flex items-start gap-3">
            <span className="text-emerald-500 mt-1">•</span>
            <span>"She kept us moving when we got stuck"</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-emerald-500 mt-1">•</span>
            <span>"Always clear about next steps"</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-emerald-500 mt-1">•</span>
            <span>"Made everyone feel heard"</span>
          </li>
        </ul>
        <p className="text-sm text-emerald-700 mt-6 italic">What your collaborators actually experienced.</p>
      </motion.div>
    </div>
  )
}
