interface SectionHeadingProps {
  title: string
  subtitle?: string
  align?: "left" | "center"
}

export function SectionHeading({ title, subtitle, align = "center" }: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center" : "text-left"

  return (
    <div className={`mb-8 ${alignClass}`}>
      <h2 className="text-[2rem] font-serif text-[var(--nomee-near-black)] mb-2">{title}</h2>
      {subtitle && <p className="text-[var(--nomee-near-black)] opacity-60 text-[1rem]">{subtitle}</p>}
    </div>
  )
}
