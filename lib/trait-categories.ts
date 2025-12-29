export const TRAIT_CATEGORIES = {
  the_vibe: {
    title: "The vibe",
    traits: [
      { id: "energized", label: "Energized" },
      { id: "focused", label: "Focused" },
      { id: "aligned", label: "Aligned" },
      { id: "inspired", label: "Inspired" },
      { id: "empowered", label: "Empowered" },
      { id: "calm", label: "Calm" },
      { id: "supported", label: "Supported" },
      { id: "seen", label: "Seen" },
      { id: "safe", label: "Safe" },
      { id: "elevated", label: "Elevated" },
      { id: "unstuck", label: "Unstuck" },
      { id: "grounded", label: "Grounded" },
    ],
  },
  communication: {
    title: "Communication",
    traits: [
      { id: "clear_comm", label: "Clear" },
      { id: "responsive", label: "Responsive" },
      { id: "thoughtful", label: "Thoughtful" },
      { id: "direct", label: "Direct" },
      { id: "transparent", label: "Transparent" },
      { id: "good_listener", label: "Good listener" },
      { id: "constructive", label: "Constructive" },
      { id: "kind", label: "Kind" },
      { id: "proactive", label: "Proactive" },
      { id: "candid", label: "Candid" },
      { id: "diplomatic", label: "Diplomatic" },
      { id: "organized", label: "Organized" },
    ],
  },
  execution: {
    title: "Execution",
    traits: [
      { id: "reliable", label: "Reliable" },
      { id: "follow_through", label: "Follow-through" },
      { id: "high_standards", label: "High standards" },
      { id: "consistent", label: "Consistent" },
      { id: "strategic", label: "Strategic" },
      { id: "decisive", label: "Decisive" },
      { id: "resourceful", label: "Resourceful" },
      { id: "detail_oriented", label: "Detail-oriented" },
      { id: "fast_moving", label: "Fast-moving" },
      { id: "accountable", label: "Accountable" },
      { id: "problem_solver", label: "Problem-solver" },
      { id: "takes_initiative", label: "Takes initiative" },
    ],
  },
  collaboration_and_leadership: {
    title: "Collaboration & leadership style",
    traits: [
      { id: "empowering", label: "Empowering" },
      { id: "coaching", label: "Coaching" },
      { id: "team_builder", label: "Team-builder" },
      { id: "low_ego", label: "Low ego" },
      { id: "composed", label: "Composed" },
      { id: "protective", label: "Protective" },
      { id: "inclusive", label: "Inclusive" },
      { id: "adaptable", label: "Adaptable" },
      { id: "confident_leader", label: "Confident" },
      { id: "ownership_mindset", label: "Ownership mindset" },
      { id: "gives_credit", label: "Gives credit" },
      { id: "sets_direction", label: "Sets direction" },
    ],
  },
} as const

export type TraitCategoryKey = keyof typeof TRAIT_CATEGORIES
export type TraitId = string

export function mapLegacyCategory(categoryKey: string): string {
  if (categoryKey === "how_it_felt") {
    return "the_vibe"
  }
  return categoryKey
}

export function isVibeTrait(categoryKey: string): boolean {
  return categoryKey === "the_vibe" || categoryKey === "how_it_felt"
}
