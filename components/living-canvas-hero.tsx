"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const humanFragments = [
  { text: "always forward", size: "large", voice: true },
  { text: "kept us moving when we got stuck", size: "medium", voice: false },
  { text: "clear about next steps", size: "small", voice: false },
  { text: "made everyone feel heard", size: "large", voice: true },
  { text: "thoughtful support", size: "small", voice: false },
  { text: "never looked back", size: "medium", voice: true },
]

export function LivingCanvasHero() {
  const [currentFragment, setCurrentFragment] = useState(0)
  const [backgroundFragments, setBackgroundFragments] = useState<number[]>([])

  useEffect(() => {
    // Rotate main fragment every 4 seconds
    const mainInterval = setInterval(() => {
      setCurrentFragment((prev) => (prev + 1) % humanFragments.length)
    }, 4000)

    // Add background fragments randomly
    const bgInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * humanFragments.length)
      if (!backgroundFragments.includes(randomIndex) && randomIndex !== currentFragment) {
        setBackgroundFragments((prev) => {
          const newFragments = [...prev, randomIndex]
          if (newFragments.length > 3) newFragments.shift()
          return newFragments
        })
      }
    }, 6000)

    return () => {
      clearInterval(mainInterval)
      clearInterval(bgInterval)
    }
  }, [currentFragment, backgroundFragments])

  const getSizeClasses = (size: string) => {
    switch (size) {
      case "large":
        return "text-5xl md:text-7xl lg:text-8xl"
      case "medium":
        return "text-3xl md:text-5xl lg:text-6xl"
      case "small":
        return "text-xl md:text-3xl lg:text-4xl"
      default:
        return "text-3xl md:text-5xl"
    }
  }

  return (
    <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden px-6">
      {/* Background fragments - very subtle */}
      <div className="absolute inset-0 pointer-events-none">
        {backgroundFragments.map((fragIndex, idx) => {
          const fragment = humanFragments[fragIndex]
          const positions = [
            { top: "15%", left: "10%" },
            { top: "70%", right: "15%" },
            { top: "40%", left: "5%" },
          ]
          const pos = positions[idx] || positions[0]

          return (
            <motion.div
              key={`bg-${fragIndex}-${idx}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.06 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2 }}
              className="absolute text-slate-400"
              style={pos}
            >
              <p className={`${getSizeClasses("small")} font-medium`}>{fragment.text}</p>
              {fragment.voice && (
                <div className="flex gap-1 mt-2">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-slate-300 rounded-full"
                      style={{ height: `${Math.random() * 20 + 8}px` }}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Main rotating fragment */}
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentFragment}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <h1
              className={`${getSizeClasses(humanFragments[currentFragment].size)} font-medium text-slate-900 leading-tight text-balance`}
            >
              "{humanFragments[currentFragment].text}"
            </h1>

            {/* Silent waveform for voice fragments */}
            {humanFragments[currentFragment].voice && (
              <motion.div
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 0.3, scaleY: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="flex gap-1.5 justify-center items-end h-12"
              >
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 bg-slate-400 rounded-full"
                    style={{ height: `${Math.random() * 48 + 12}px` }}
                    animate={{
                      scaleY: [1, Math.random() * 0.5 + 0.5, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.1,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
