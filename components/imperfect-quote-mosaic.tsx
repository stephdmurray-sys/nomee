"use client"

import { motion } from "framer-motion"

interface Quote {
  text: string
  author: string
  role: string
  color: string
  rotation: number
  width: string
  hasVoice?: boolean
}

const quotes: Quote[] = [
  {
    text: "The best worker I know very confident and easy to get a long with away there for you in need and never looks back, always forward.",
    author: "— John",
    role: "Backstreet Boys",
    color: "bg-amber-50",
    rotation: -1.5,
    width: "w-full md:w-[45%]",
    hasVoice: true,
  },
  {
    text: "She kept us moving when we got stuck. Always clear about next steps.",
    author: "— Katie",
    role: "Acme Group",
    color: "bg-blue-50",
    rotation: 2,
    width: "w-full md:w-[42%]",
  },
  {
    text: "Thoughtful and supportive—someone who brings decisive action. Projects feel well-structured.",
    author: "— Lulu",
    role: "Other",
    color: "bg-purple-50",
    rotation: -2.5,
    width: "w-full md:w-[48%]",
    hasVoice: true,
  },
  {
    text: "Made everyone feel heard. Never negative, just positive and empathetic all the time.",
    author: "— Bob",
    role: "Roofing Company",
    color: "bg-pink-50",
    rotation: 1,
    width: "w-full md:w-[44%]",
  },
  {
    text: "A very motivating peer who always had great contributions to every meeting. Cares about what she does.",
    author: "— Jenny",
    role: "Humble Beginnings",
    color: "bg-green-50",
    rotation: -1,
    width: "w-full md:w-[46%]",
  },
]

export function ImperfectQuoteMosaic() {
  return (
    <div className="max-w-6xl mx-auto px-6">
      {/* Irregular flex layout, not a grid */}
      <div className="flex flex-wrap gap-6 md:gap-8 justify-center items-start">
        {quotes.map((quote, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40, rotate: 0 }}
            whileInView={{ opacity: 1, y: 0, rotate: quote.rotation }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              duration: 0.8,
              delay: idx * 0.12,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={`${quote.color} ${quote.width} rounded-3xl p-8 md:p-10 shadow-sm hover:shadow-md transition-shadow`}
            style={{
              marginTop: idx % 2 === 0 ? "0" : "2rem",
            }}
          >
            <div className="text-5xl text-slate-300 mb-3 font-serif">"</div>
            <p className="text-lg md:text-xl text-slate-800 font-serif leading-relaxed mb-6">{quote.text}</p>

            {/* Silent waveform indicator for voice */}
            {quote.hasVoice && (
              <div className="flex gap-1 items-end h-6 mb-4 opacity-30">
                {[...Array(16)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-slate-500 rounded-full"
                    style={{ height: `${Math.random() * 24 + 4}px` }}
                  />
                ))}
              </div>
            )}

            <div className="text-sm text-slate-600 space-y-0.5">
              <p className="font-medium text-slate-900">{quote.author}</p>
              <p className="text-slate-500">{quote.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
