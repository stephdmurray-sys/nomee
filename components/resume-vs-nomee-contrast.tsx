"use client"

import { motion } from "framer-motion"
import { AudioWaveform } from "lucide-react"

export function ResumeVsNomeeContrast() {
  return (
    <div className="max-w-6xl mx-auto px-6">
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-light text-slate-900 leading-tight">
          Resumes show results.
          <br />
          <span className="text-slate-600">Nomee shows what it's like to work with someone.</span>
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-stretch">
        {/* Resume side - static, gray, rigid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative flex flex-col"
        >
          <div className="bg-slate-100 rounded-2xl p-10 border border-slate-200 flex-1 flex flex-col justify-between min-h-[400px]">
            <div className="space-y-6 text-slate-600">
              <div className="h-3 bg-slate-300 w-3/4 rounded" />
              <div className="h-3 bg-slate-300 w-1/2 rounded" />
              <div className="space-y-3 mt-8">
                <div className="h-2 bg-slate-300 w-full rounded" />
                <div className="h-2 bg-slate-300 w-5/6 rounded" />
                <div className="h-2 bg-slate-300 w-4/6 rounded" />
              </div>
              <div className="space-y-3 mt-8">
                <div className="h-2 bg-slate-300 w-full rounded" />
                <div className="h-2 bg-slate-300 w-3/4 rounded" />
                <div className="h-2 bg-slate-300 w-2/3 rounded" />
              </div>
            </div>
          </div>
          <p className="text-center mt-6 text-sm text-slate-500 uppercase tracking-wider">Resume</p>
          <p className="text-center mt-2 text-slate-600">Measured. Self-reported. Standardized.</p>
        </motion.div>

        {/* Nomee side - warm, human, observational */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative flex flex-col"
        >
          <div className="flex-1 flex flex-col justify-between space-y-6 min-h-[400px] py-4">
            {/* First quote with voice waveform */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-amber-50/70 rounded-xl p-6 border border-slate-200/40"
            >
              <p className="text-slate-800 font-serif italic text-base leading-relaxed">
                "Sarah showed compassion when it mattered most."
              </p>
              {/* Subtle voice waveform indicator */}
              <div className="mt-3 flex items-center gap-2 opacity-30">
                <AudioWaveform className="w-3 h-3 text-slate-600" />
                <div className="flex gap-0.5 items-end h-2">
                  {[8, 5, 10, 4, 7, 5, 9, 6].map((height, i) => (
                    <motion.div
                      key={i}
                      className="w-0.5 bg-slate-500 rounded-full"
                      style={{ height: `${height}px` }}
                      animate={{
                        scaleY: [1, 0.6, 1],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: i * 0.1,
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Second quote */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-blue-50/50 rounded-xl p-6 border border-slate-200/40"
            >
              <p className="text-slate-800 font-serif italic text-base leading-relaxed">
                "Sarah's work ethic set the tone for the team."
              </p>
            </motion.div>

            {/* Third quote */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-purple-50/40 rounded-xl p-6 border border-slate-200/40"
            >
              <p className="text-slate-800 font-serif italic text-base leading-relaxed">
                "Sarah stayed positive, even under pressure."
              </p>
            </motion.div>
          </div>
          <p className="text-center mt-6 text-sm text-slate-700 uppercase tracking-wider">Nomee</p>
          <p className="text-center mt-2 text-slate-900 font-medium">Observed. Human. Remembered.</p>
        </motion.div>
      </div>
    </div>
  )
}
