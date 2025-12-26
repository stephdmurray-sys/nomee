"use client"

import { motion } from "framer-motion"

const STEPS = [
  {
    label: "Invite",
    description: "Invite someone who's experienced how you work — up close.",
  },
  {
    label: "They Reflect",
    description: "They share what it was like to collaborate with you — beyond tasks, titles, or outcomes.",
    emphasized: true,
  },
  {
    label: "It Comes Together",
    description: "Your Nomee becomes a living portrait of how you work and who you are in the process.",
  },
]

export const HowItWorks = () => {
  return (
    <section className="py-32 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-24"
        >
          <h2 className="text-4xl md:text-5xl font-normal text-slate-900 leading-tight">
            It's not just your work.
            <br />
            It's how it feels to work with you.
          </h2>
        </motion.div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-16 md:gap-20">
          {STEPS.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.9,
                delay: idx * 0.3,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={`
                text-center space-y-3 px-4
                ${step.emphasized ? "md:scale-105 md:-mt-4" : ""} 
              `}
              style={{ maxWidth: "280px", margin: "0 auto" }}
            >
              <div
                className={`
                text-3xl md:text-4xl font-normal text-slate-900
                ${step.emphasized ? "font-medium text-slate-950" : ""}
              `}
              >
                {step.label}
              </div>

              <p
                className={`
                text-base leading-relaxed
                ${step.emphasized ? "text-slate-700" : "text-slate-600"}
              `}
              >
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mt-24"
        >
          <p className="text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto font-light">
            Because people remember how you made the work feel — long after the work is done.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
