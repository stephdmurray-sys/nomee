export const RELATIONSHIP_OPTIONS = [
  { value: "manager", label: "Manager" },
  { value: "teammate", label: "Teammate" },
  { value: "direct_report", label: "Direct Report" },
  { value: "client", label: "Client" },
  { value: "partner", label: "Partner" },
  { value: "advisor", label: "Advisor" },
  { value: "founder", label: "Founder" },
  { value: "vendor", label: "Vendor" },
  { value: "collaborator", label: "Collaborator" },
] as const

export const DURATION_OPTIONS = [
  { value: "less_than_6_months", label: "Less than 6 months" },
  { value: "6_to_12_months", label: "6–12 months" },
  { value: "1_to_2_years", label: "1–2 years" },
  { value: "3_to_5_years", label: "3–5 years" },
  { value: "5_plus_years", label: "5+ years" },
] as const

export const RELATIONSHIP_VALUES = RELATIONSHIP_OPTIONS.map((opt) => opt.value)
export const DURATION_VALUES = DURATION_OPTIONS.map((opt) => opt.value)

export type RelationshipValue = (typeof RELATIONSHIP_OPTIONS)[number]["value"]
export type DurationValue = (typeof DURATION_OPTIONS)[number]["value"]

export function getRelationshipLabel(value: string): string {
  const option = RELATIONSHIP_OPTIONS.find((opt) => opt.value === value)
  return option?.label || value
}

export function getDurationLabel(value: string): string {
  const option = DURATION_OPTIONS.find((opt) => opt.value === value)
  return option?.label || value
}
