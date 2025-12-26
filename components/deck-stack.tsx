"use client"

import { RecognitionCard } from "./recognition-card"

const sampleCards = [
  {
    quote: "Stephanie makes collaboration feel effortless. Fast, clear, and always moves deals forward.",
    name: "Jordan Kim",
    title: "Partnerships Lead",
    company: "BrightBuild",
  },
  {
    quote: "The kind of partner you trust with your reputation—because she protects it.",
    name: "Marissa Nguyen",
    title: "Head of Growth",
    company: "Pine & Co",
  },
  {
    quote: "She brings calm to chaos and turns messy requirements into shipped outcomes.",
    name: "Devon Price",
    title: "Product Director",
    company: "Northline",
  },
]

export function DeckStack() {
  return (
    <div className="relative w-full max-w-md mx-auto" style={{ height: "500px" }}>
      {sampleCards.map((card, index) => (
        <div
          key={index}
          className="absolute w-full"
          style={{
            top: `${index * 20}px`,
            left: `${index * 8}px`,
            zIndex: sampleCards.length - index,
          }}
        >
          <RecognitionCard {...card} delay={index === 2 ? 180 : index === 1 ? 120 : 0} />
        </div>
      ))}
    </div>
  )
}
