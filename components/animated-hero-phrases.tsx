"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function AnimatedHeroPhrases() {
  const phrases = [
    "What it's like to work with you.",
    "Told by the people who know.",
    "Your reputation, in their words.",
  ]

  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % phrases.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative h-[120px] md:h-[140px] flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.h1
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-6xl lg:text-7xl font-medium text-slate-900 text-center leading-tight absolute text-balance"
        >
          {phrases[currentIndex]}
        </motion.h1>
      </AnimatePresence>
    </div>
  )
}
