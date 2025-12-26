"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRef } from "react"

const PHRASES = [
  "Sarah showed compassion under pressure.",
  "People trusted her judgment.",
  "She made hard things feel lighter.",
]

export function TheMoment() {
  const [stage, setStage] = useState<"intro" | "phrases" | "reveal">("intro")
  const [currentPhrase, setCurrentPhrase] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (hasStarted) return

    const handleScroll = () => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()

      // Start sequence when section is in middle of viewport
      if (rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.5) {
        setHasStarted(true)
        setTimeout(() => setStage("phrases"), 1500)
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Check on mount
    return () => window.removeEventListener("scroll", handleScroll)
  }, [hasStarted])

  useEffect(() => {
    if (stage !== "phrases") return

    const interval = setInterval(() => {
      setCurrentPhrase((prev) => {
        if (prev < PHRASES.length - 1) {
          return prev + 1
        } else {
          clearInterval(interval)
          setTimeout(() => setStage("reveal"), 2000)
          return prev
        }
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [stage])

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center px-6 py-32 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <AnimatePresence mode="wait">
          {stage === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-20"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-slate-900 leading-tight">
                This is what people remember.
              </h2>
            </motion.div>
          )}

          {stage === "phrases" && (
            <motion.div
              key={`phrase-${currentPhrase}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-20"
            >
              <p className="text-3xl md:text-4xl lg:text-5xl font-light text-slate-700 leading-relaxed italic">
                "{PHRASES[currentPhrase]}"
              </p>
            </motion.div>
          )}

          {stage === "reveal" && (
            <motion.div
              key="reveal"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-20"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium text-slate-900 leading-tight">
                This is a Nomee.
              </h2>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
