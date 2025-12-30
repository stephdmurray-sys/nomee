"use client"

import type React from "react"

interface PillProps {
  children: React.ReactNode
  variant?: "trait" | "topSignal" | "vibe" | "imported" | "direct"
  tier?: "Core" | "Strong" | "Emerging"
  count?: number
  size?: "sm" | "md" | "lg"
  onClick?: () => void
  isSelected?: boolean
  style?: React.CSSProperties
}

export function Pill({
  children,
  variant = "trait",
  tier = "Emerging",
  count,
  size = "md",
  onClick,
  isSelected = false,
  style,
}: PillProps) {
  const sizeStyles = {
    sm: "px-2.5 py-1 text-xs",
    md: "px-3 py-1.5 text-xs",
    lg: "px-4 py-2 text-sm font-semibold",
  }

  const baseStyles = `inline-flex items-center gap-1.5 rounded-[var(--pill-radius)] border shadow-[var(--pill-shadow)] transition-all ${sizeStyles[size]}`

  const variantStyles = {
    trait:
      tier === "Core"
        ? "bg-blue-100 text-blue-900 border-blue-200 font-semibold"
        : tier === "Strong"
          ? "bg-blue-50 text-blue-700 border-blue-100 font-medium"
          : "bg-slate-50 text-slate-600 border-slate-100",
    topSignal: "bg-blue-100 text-blue-900 border-blue-200 font-semibold",
    vibe: "bg-gradient-to-br from-purple-50 to-blue-50 text-slate-900 border-purple-100 font-medium",
    imported: "bg-amber-50 text-amber-900 border-amber-200 font-medium",
    direct: "bg-blue-50 text-blue-900 border-blue-100 font-medium",
  }

  const selectedStyles = isSelected ? "ring-2 ring-blue-400 ring-offset-1" : ""
  const interactiveStyles = onClick ? "cursor-pointer hover:shadow-md hover:border-current" : ""

  return (
    <span
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${selectedStyles} ${interactiveStyles}`}
      style={style}
    >
      {children}
      {count !== undefined && (
        <>
          <span className="opacity-50">·</span>
          <span className="font-semibold">{count}</span>
        </>
      )}
    </span>
  )
}
