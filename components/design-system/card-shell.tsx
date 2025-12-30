import type { ReactNode } from "react"

interface CardShellProps {
  children: ReactNode
  className?: string
  variant?: "default" | "direct" | "imported"
}

export function CardShell({ children, className = "", variant = "default" }: CardShellProps) {
  const variantStyles = {
    default: "bg-white border-[var(--nomee-neutral-border)]",
    direct: "bg-white border-blue-100",
    imported: "bg-white border-amber-100",
  }

  return (
    <div
      className={`rounded-[var(--card-radius)] border p-[var(--space-card)] shadow-[var(--card-shadow)] hover:shadow-md transition-shadow ${variantStyles[variant]} ${className}`}
    >
      {children}
    </div>
  )
}
