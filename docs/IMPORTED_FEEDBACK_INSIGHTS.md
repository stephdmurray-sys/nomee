# Imported Feedback AI Insights Integration

## Overview

Imported feedback contributes to aggregated trait insights with weighted values to maintain trust and accuracy. This document explains how the weighting system works.

## Weighting Rules

### Verified Nomees (Weight: 1.0)
- Full weight contribution to insights
- These are contributor-submitted, verified feedback
- Always prioritized in aggregations

### Imported Feedback (Weight: 0.5 or 0.3)
- **Base weight: 0.5** - For high-confidence extractions (confidence >= 0.7)
- **Low confidence weight: 0.3** - For extractions with confidence < 0.7
- Never dominates insights alone
- Requires at least one verified Nomee for hero embeds

## How It Works

### Trait Frequency Calculation

```typescript
// Example calculation
const traitFrequency = {
  "Clear Communicator": {
    count: 5,           // Total mentions (3 Nomees + 2 imported)
    weight: 4.0,        // Weighted total (3 × 1.0 + 2 × 0.5)
    examples: [...]
  }
}
```

### Trait Ranking

Traits are sorted by **weighted count**, not raw count:
- 3 verified Nomees mentioning a trait = weight of 3.0
- 5 imported feedback items mentioning a trait (high confidence) = weight of 2.5
- Therefore, the verified Nomee trait ranks higher despite fewer mentions

### Display Rules

1. **Hero sections**: Verified Nomees only by default
2. **Trait heatmaps**: Include weighted imported feedback contributions
3. **AI summaries**: Weighted aggregation across both sources
4. **"Known for..." patterns**: Imported feedback contributes but never dominates alone

## Integration Points

### Public Profile Page
- `app/[username]/page.tsx` - Calculates weighted trait frequencies
- Imported feedback traits are included in aggregation
- Display order respects weighted counts

### Dashboard
- Upload interface with clear labeling
- Review screen showing confidence scores
- Visibility controls (public/private)

### Future Embed Support

When embeds are implemented:

**Quote Embed**
- Default: Verified Nomees only
- Optional toggle: Include uploaded feedback (clearly labeled)

**Carousel / Wall Embed**
- Verified first
- Imported feedback visually distinct (dashed borders, upload icon)

**Insight-Only Embed**
- Traits + summaries only
- No raw quotes
- Source-agnostic weighted aggregation

## Safety Checks

1. Imported feedback never counts toward "X people shared..." statistics
2. Must be approved by owner before contributing to insights
3. Low confidence items get reduced weighting
4. Clear visual distinction from verified Nomees
5. Never appears without proper "Uploaded by profile owner" labeling

## Example Weighting Scenarios

### Scenario 1: Balanced Mix
- 4 verified Nomees mention "Strategic Thinker" → weight 4.0
- 3 imported feedback items mention "Strategic Thinker" (high confidence) → weight 1.5
- Total weighted count: 5.5
- "Strategic Thinker" ranks highly in aggregated insights

### Scenario 2: Low Confidence Imported
- 2 verified Nomees mention "Creative" → weight 2.0
- 5 imported feedback items mention "Creative" (low confidence < 0.7) → weight 1.5
- Total weighted count: 3.5
- Verified contributions still have stronger influence per-item

### Scenario 3: Imported Only (Edge Case)
- 0 verified Nomees
- 10 imported feedback items mention "Reliable" → weight 5.0
- Trait appears in insights but marked as preliminary
- Hero embeds will not feature this trait without verified backing

## Code References

- **Weighting logic**: `lib/imported-feedback-traits.ts`
- **Trait aggregation**: `app/[username]/page.tsx`
- **Public display**: `app/[username]/premier-profile-client.tsx`
- **Dashboard management**: `app/dashboard/imported-feedback/`
