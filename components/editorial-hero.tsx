"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const HERO_LINES = ["What It's Actually Like to Work With You.", "Your Work Has a Feeling."]

const ATMOSPHERIC_PHRASES = [
  "Calm in the chaos",
  "Easy to work with",
  "Clear when it mattered",
  "Trusted under pressure",
  "Made things feel lighter",
]

export function EditorialHero({ onCreateClick }: { onCreateClick: () => void }) {
  const [stage, setStage] = useState<"first" | "second" | "reveal">("first")
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [phraseIndex, setPhraseIndex] = useState(0)

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setCurrentLineIndex(1)
      setStage("second")
    }, 3000)

    const timer2 = setTimeout(() => {
      setStage("reveal")
    }, 5500)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  useEffect(() => {
    if (stage !== "reveal") return

    const interval = setInterval(() => {
      setCurrentLineIndex((prev) => (prev + 1) % HERO_LINES.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [stage])

  useEffect(() => {
    if (stage === "first") return

    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % ATMOSPHERIC_PHRASES.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [stage])

  return (
    <section className="relative min-h-[90vh] flex items-center px-6 lg:px-8 py-20">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-5 gap-16 lg:gap-32 items-center">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-3 space-y-12">
            <div className="relative h-[200px] md:h-[260px]">
              <AnimatePresence mode="wait">
                <motion.h1
                  key={currentLineIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 text-5xl md:text-7xl font-medium text-slate-900 leading-[1.05] tracking-tight"
                >
                  {HERO_LINES[currentLineIndex]}
                </motion.h1>
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {stage === "reveal" && (
                <>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="text-xl md:text-2xl text-slate-600 leading-relaxed max-w-2xl"
                  >
                    Not just what you do — but how you show up while doing it, captured by the people who worked with
                    you.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col sm:flex-row gap-4 pt-8"
                  >
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={onCreateClick}
                        size="lg"
                        className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-8 h-14 text-lg font-medium shadow-lg hover:shadow-xl transition-all"
                      >
                        Create Your Nomee
                      </Button>
                      <p className="text-sm text-slate-500 text-center px-2">
                        Show what it's actually like to work with you
                      </p>
                    </div>
                    <Button
                      asChild
                      size="lg"
                      variant="ghost"
                      className="text-slate-700 hover:text-slate-900 rounded-full px-8 h-14 text-lg font-medium transition-colors"
                    >
                      <Link href="/maya-torres">See an Example</Link>
                    </Button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT COLUMN - Atmospheric presence only */}
          <div className="lg:col-span-2 relative min-h-[400px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              {stage !== "first" && (
                <motion.div
                  key={phraseIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl lg:text-5xl text-slate-400 font-light italic leading-relaxed">
                    "{ATMOSPHERIC_PHRASES[phraseIndex]}"
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
