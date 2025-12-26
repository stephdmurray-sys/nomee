export const RELATIONSHIP_OPTIONS = [
  { value: "peer", label: "Peer" },
  { value: "manager", label: "Manager" },
  { value: "direct_report", label: "Direct Report" },
  { value: "client", label: "Client" },
  { value: "customer", label: "Customer" },
  { value: "vendor", label: "Vendor" },
  { value: "contractor", label: "Contractor" },
  { value: "consultant", label: "Consultant" },
  { value: "agency", label: "Agency" },
  { value: "brand_partner", label: "Brand Partner" },
  { value: "collaborator", label: "Collaborator" },
  { value: "affiliate", label: "Affiliate" },
  { value: "other", label: "Other" },
] as const

// Extract allowed values for validation
export const RELATIONSHIP_VALUES = RELATIONSHIP_OPTIONS.map((opt) => opt.value)

// Type-safe value types
export type RelationshipValue = (typeof RELATIONSHIP_OPTIONS)[number]["value"]

// Helper to get label from value
export function getRelationshipLabel(value: string): string {
  const option = RELATIONSHIP_OPTIONS.find((opt) => opt.value === value)
  return option?.label || value
}
