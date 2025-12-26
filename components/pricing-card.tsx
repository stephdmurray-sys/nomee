"use client"

import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

interface PricingCardProps {
  title: string
  price: string
  period?: string
  features: string[]
  buttonText: string
  onButtonClick: () => void
  highlighted?: boolean
}

export function PricingCard({
  title,
  price,
  period,
  features,
  buttonText,
  onButtonClick,
  highlighted = false,
}: PricingCardProps) {
  return (
    <div
      className={`fade-in-observer opacity-0 rounded-3xl p-8 transition-all duration-300 hover:shadow-xl ${
        highlighted ? "bg-charcoal text-white border-2 border-charcoal" : "bg-white border-2 border-neutral-200"
      }`}
    >
      <h3 className={`text-2xl font-bold mb-2 ${highlighted ? "text-white" : "text-charcoal"}`}>{title}</h3>
      <div className="mb-6">
        <span className={`text-5xl font-bold ${highlighted ? "text-white" : "text-charcoal"}`}>{price}</span>
        {period && <span className={`text-lg ${highlighted ? "text-neutral-300" : "text-neutral-600"}`}>{period}</span>}
      </div>
      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <Check
              className={`w-5 h-5 flex-shrink-0 mt-0.5 ${highlighted ? "text-green-400" : "text-green-600"}`}
              strokeWidth={3}
            />
            <span className={`text-sm leading-relaxed ${highlighted ? "text-neutral-100" : "text-neutral-700"}`}>
              {feature}
            </span>
          </li>
        ))}
      </ul>
      <Button
        onClick={onButtonClick}
        className={`w-full rounded-full ${
          highlighted
            ? "bg-white text-charcoal hover:bg-neutral-100"
            : "bg-primary-blue text-white hover:bg-primary-blue/90"
        }`}
        size="lg"
      >
        {buttonText}
      </Button>
    </div>
  )
}
