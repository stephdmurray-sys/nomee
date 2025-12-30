"use client"

import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"

export type StrengthTier = "Core" | "Strong" | "Emerging"

interface HeatPillProps {
  label: string
  count: number
  tier: StrengthTier
  isSelected?: boolean
  onClick?: () => void
  showTierBadge?: boolean
  size?: "sm" | "md"
}

// Get pill styles based on strength tier - heat shading
function getHeatStyles(tier: StrengthTier, isSelected: boolean) {
  if (isSelected) {
    return "bg-blue-100 border-blue-300 text-blue-800 font-semibold"
  }

  switch (tier) {
    case "Core":
      // Strongest - darker background, bolder text
      return "bg-neutral-100 border-neutral-300 text-neutral-900 font-semibold"
    case "Strong":
      // Medium - medium background
      return "bg-neutral-50 border-neutral-200 text-neutral-700 font-medium"
    case "Emerging":
      // Lightest - subtle
      return "bg-white border-neutral-200 text-neutral-500 font-normal"
  }
}

// Get tier badge styles
function getTierBadgeStyles(tier: StrengthTier) {
  switch (tier) {
    case "Core":
      return "bg-emerald-100 text-emerald-700"
    case "Strong":
      return "bg-amber-100 text-amber-700"
    case "Emerging":
      return "bg-neutral-100 text-neutral-500"
  }
}

export function HeatPill({
  label,
  count,
  tier,
  isSelected = false,
  onClick,
  showTierBadge = false,
  size = "md",
}: HeatPillProps) {
  const baseStyles = getHeatStyles(tier, isSelected)
  const sizeStyles = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1.5 text-sm"

  const content = (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border transition-all ${baseStyles} ${sizeStyles} ${onClick ? "cursor-pointer hover:shadow-sm" : "cursor-default"}`}
    >
      {label}
      <span className="text-neutral-400">×{count}</span>
      {showTierBadge && (
        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${getTierBadgeStyles(tier)}`}>{tier}</span>
      )}
    </span>
  )

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent>
          <p className="font-medium">{tier} signal</p>
          <p className="text-xs text-neutral-400">
            Mentioned by {count} {count === 1 ? "person" : "people"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Utility function to determine tier from count
export function getStrengthTier(count: number, maxCount?: number): StrengthTier {
  // If maxCount provided, use relative distribution
  if (maxCount && maxCount > 3) {
    if (count >= maxCount * 0.6) return "Core"
    if (count >= maxCount * 0.3) return "Strong"
    return "Emerging"
  }

  // Otherwise use absolute thresholds
  if (count >= 3) return "Core"
  if (count >= 2) return "Strong"
  return "Emerging"
}
