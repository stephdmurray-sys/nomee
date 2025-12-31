interface SectionHeadingProps {
  title: string
  subtitle?: string
  align?: "left" | "center"
}

export function SectionHeading({ title, subtitle, align = "center" }: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center" : "text-left"

  return (
    <div className={`mb-8 ${alignClass}`}>
      <h2 className="text-[2.25rem] font-sans font-medium text-[var(--nomee-near-black)] mb-2">{title}</h2>
      {/* </CHANGE> */}
      {subtitle && <p className="text-[var(--nomee-near-black)] opacity-60 text-[1rem]">{subtitle}</p>}
    </div>
  )
}
