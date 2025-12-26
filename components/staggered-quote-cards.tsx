"use client"

import { motion } from "framer-motion"
import { Play } from "lucide-react"

interface Quote {
  text: string
  author: string
  role: string
  company: string
  hasAudio?: boolean
  color: string
}

const quotes: Quote[] = [
  {
    text: "The best worker I know very confident and easy to get a long with away there for you in need and never looks back, always forward.",
    author: "John",
    role: "Professional collaborator",
    company: "Backstreet Boys",
    hasAudio: true,
    color: "bg-amber-50",
  },
  {
    text: "Stephanie was a very motivating peer who always had great contributions to every meeting. I can tell she cares about what she does and isn't afraid to speak up.",
    author: "Katie Chen",
    role: "Professional collaborator",
    company: "Acme Group",
    color: "bg-blue-50",
  },
  {
    text: "The best worker out there easy to talk to work with, be around, never negative or unhappy just positive and empathetic all the time, really enjoyed her so fun to be around and have on the team would want to work with again and again.",
    author: "Lulu Lemon",
    role: "Professional collaborator",
    company: "Other",
    hasAudio: true,
    color: "bg-purple-50",
  },
]

export function StaggeredQuoteCards() {
  return (
    <div className="grid gap-6 max-w-5xl mx-auto">
      {quotes.map((quote, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
          className={`${quote.color} rounded-2xl p-8 md:p-10 shadow-sm ${
            idx % 3 === 0 ? "md:ml-0 md:mr-12" : idx % 3 === 1 ? "md:mx-8" : "md:ml-12 md:mr-0"
          }`}
          style={{ width: idx % 2 === 0 ? "92%" : "96%" }}
        >
          <div className="text-4xl text-slate-400 mb-4">"</div>
          <p className="text-lg md:text-xl text-slate-800 font-serif leading-relaxed mb-8">{quote.text}</p>

          {quote.hasAudio && (
            <div className="flex items-center gap-3 mb-6 text-sm text-slate-600">
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-full hover:bg-slate-700 transition-colors">
                <Play size={14} />
                <span>In their own voice</span>
              </button>
            </div>
          )}

          <div className="border-t border-slate-200 pt-4">
            <p className="font-semibold text-slate-900">{quote.author}</p>
            <p className="text-sm text-slate-600">{quote.role}</p>
            <p className="text-sm text-slate-500">{quote.company}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
