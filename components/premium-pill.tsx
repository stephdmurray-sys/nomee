"use client"

import { cn } from "@/lib/utils"
import { type ButtonHTMLAttributes, forwardRef } from "react"

export interface PremiumPillProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "vibe" | "trait" | "neutral"
  isActive?: boolean
  count?: number
  showIndicator?: boolean
}

export const PremiumPill = forwardRef<HTMLButtonElement, PremiumPillProps>(
  ({ className, variant = "neutral", isActive = false, count, showIndicator = false, children, ...props }, ref) => {
    const variantClasses = {
      vibe: isActive
        ? "bg-vibe-tint border-vibe-border-active text-neutral-900 shadow-sm"
        : "bg-white border-border hover:bg-vibe-tint/40 hover:border-border-hover focus-visible:ring-vibe-ring",
      trait: isActive
        ? "bg-trait-tint border-trait-border-active text-neutral-900 shadow-sm"
        : "bg-white border-border hover:bg-trait-tint/40 hover:border-border-hover focus-visible:ring-trait-ring",
      neutral: isActive
        ? "bg-neutral-900 border-neutral-900 text-white shadow-sm"
        : "bg-white border-border hover:bg-neutral-50 hover:border-border-hover focus-visible:ring-neutral-400",
    }

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center gap-2 h-9 px-3.5 rounded-full",
          "border text-sm font-semibold text-text",
          "transition-all duration-200 ease-out",
          "hover:-translate-y-px hover:shadow-sm",
          "active:translate-y-0 active:shadow-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none disabled:transform-none",
          variantClasses[variant],
          className,
        )}
        {...props}
      >
        {isActive && showIndicator && (
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full",
              variant === "vibe"
                ? "bg-vibe-border-active"
                : variant === "trait"
                  ? "bg-trait-border-active"
                  : "bg-white",
            )}
            aria-hidden="true"
          />
        )}
        <span>{children}</span>
        {count !== undefined && (
          <span
            className={cn(
              "text-xs font-semibold px-2 py-0.5 rounded-full",
              isActive
                ? variant === "neutral"
                  ? "bg-white/20 text-white"
                  : "bg-neutral-900/10 text-neutral-700"
                : "bg-neutral-100 text-muted-text",
            )}
          >
            ×{count}
          </span>
        )}
      </button>
    )
  },
)

PremiumPill.displayName = "PremiumPill"
