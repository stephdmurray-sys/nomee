"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useAnimation } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { IntimateAudioPlayer } from "@/components/intimate-audio-player"

interface StreamItem {
  id: string
  contributor_name: string
  relationship: string
  excerpt: string
  audio_url: string
  traits: Array<{ label: string; category: string }>
}

const RELATIONSHIP_LABELS: Record<string, string> = {
  manager: "Manager",
  peer: "Peer",
  direct_report: "Direct report",
  client: "Client",
  partner: "Partner",
  vendor: "Vendor",
  other: "Collaborator",
}

const CATEGORY_COLORS = {
  leadership: "bg-soft-sky/60",
  execution: "bg-pale-sage/60",
  collaboration: "bg-light-blush/60",
  eq: "bg-warm-sand/60",
}

export function EvidenceStream({
  contributions,
  onTraitHover,
}: {
  contributions: any[]
  onTraitHover: (trait: string | null) => void
}) {
  const [isPaused, setIsPaused] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const controls = useAnimation()
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Transform contributions into stream items
  const streamItems: StreamItem[] = contributions.map((c) => ({
    id: c.id,
    contributor_name: c.contributor_name,
    relationship: RELATIONSHIP_LABELS[c.relationship] || c.relationship,
    excerpt: c.message.length > 120 ? c.message.slice(0, 120) + "..." : c.message,
    audio_url: c.audio_url,
    traits: c.contribution_traits
      .slice(0, 3)
      .map((ct: any) => ({
        label: ct.trait_library?.label,
        category: ct.trait_library?.category,
      }))
      .filter((t: any) => t.label),
  }))

  // Double the array for seamless looping
  const loopedItems = [...streamItems, ...streamItems]

  useEffect(() => {
    if (isMobile || isPaused) return

    const itemHeight = 180
    const totalHeight = streamItems.length * itemHeight

    controls.start({
      y: [-totalHeight, 0],
      transition: {
        duration: streamItems.length * 7,
        ease: "linear",
        repeat: Number.POSITIVE_INFINITY,
      },
    })

    return () => {
      controls.stop()
    }
  }, [isMobile, isPaused, streamItems.length, controls])

  const handleMouseEnter = (index: number, traits: Array<{ label: string }>) => {
    setIsPaused(true)
    setHoveredIndex(index)
    controls.stop()

    if (traits.length > 0) {
      onTraitHover(traits[0].label)
    }
  }

  const handleMouseLeave = () => {
    setHoveredIndex(null)
    onTraitHover(null)

    setTimeout(() => {
      setIsPaused(false)
    }, 400)
  }

  if (streamItems.length === 0) return null

  return (
    <section className="pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mb-10"
      >
        <h3 className="text-2xl font-semibold text-near-black mb-3">Evidence Stream</h3>
        <p className="text-base text-soft-gray-text">{isMobile ? "Swipe to explore" : "Hover to pause and explore"}</p>
      </motion.div>

      <div
        ref={containerRef}
        className="relative h-[600px] overflow-hidden rounded-2xl bg-gradient-to-b from-neutral-50/50 via-white to-neutral-50/50"
      >
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />

        <motion.div animate={controls} className={`py-16 space-y-6 ${isMobile ? "overflow-y-auto h-full" : ""}`}>
          {loopedItems.map((item, index) => {
            const isHovered = hoveredIndex === index
            const isDimmed = hoveredIndex !== null && !isHovered

            return (
              <motion.div
                key={`${item.id}-${index}`}
                onMouseEnter={() => handleMouseEnter(index, item.traits)}
                onMouseLeave={handleMouseLeave}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: isDimmed ? 0.7 : 1,
                  y: isHovered ? -8 : 0,
                }}
                transition={{
                  opacity: { duration: 0.3 },
                  y: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                }}
                className={`
                  mx-auto max-w-2xl bg-white rounded-xl p-8 border border-neutral-100
                  transition-shadow duration-300
                  ${isHovered ? "shadow-[0px_20px_56px_rgba(0,0,0,0.14)]" : "shadow-[0px_4px_16px_rgba(0,0,0,0.04)]"}
                  ${isMobile ? "" : "cursor-pointer"}
                `}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline" className="text-xs font-medium text-soft-gray-text border-neutral-200">
                    {item.relationship}
                  </Badge>
                  <span className="text-sm text-soft-gray-text">{item.contributor_name}</span>
                </div>

                <p className="text-base text-near-black leading-relaxed mb-5 line-clamp-3">"{item.excerpt}"</p>

                {item.audio_url && (
                  <div className="mb-5">
                    <IntimateAudioPlayer audioUrl={item.audio_url} />
                  </div>
                )}

                {item.traits.length > 0 && (
                  <div className="flex flex-wrap gap-2.5">
                    {item.traits.map((trait, traitIndex) => (
                      <Badge
                        key={traitIndex}
                        className={`
                          ${CATEGORY_COLORS[trait.category as keyof typeof CATEGORY_COLORS]}
                          text-near-black text-xs font-medium
                          transition-all duration-300
                          ${isHovered ? "scale-110" : ""}
                        `}
                      >
                        {trait.label}
                      </Badge>
                    ))}
                  </div>
                )}
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
