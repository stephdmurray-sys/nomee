export function extractImpactHeadline(text: string): string | null {
  // Extract the first strong outcome phrase as headline
  const impactPatterns = [
    // Numeric outcomes
    /\b(\d+x|doubled|tripled|quadrupled|increased|grew|scaled|boosted|drove)\s+[^.!?]{10,60}/gi,
    // Percentage outcomes
    /\b(\d+%|percent)\s+[^.!?]{10,60}/gi,
    // Result phrases
    /\b(resulted in|led to|achieved|delivered|created)\s+[^.!?]{10,60}/gi,
    // Revenue/conversion outcomes
    /\b(revenue|conversion|engagement|retention|sales|roi)\s+[^.!?]{10,60}/gi,
  ]

  for (const pattern of impactPatterns) {
    const match = text.match(pattern)
    if (match) {
      let headline = match[0].trim()
      // Capitalize first letter
      headline = headline.charAt(0).toUpperCase() + headline.slice(1)
      // Remove trailing punctuation
      headline = headline.replace(/[,;:]$/, "")
      return headline
    }
  }

  // Fallback: use first sentence if it's reasonably short
  const firstSentence = text.split(/[.!?]/)[0]
  if (firstSentence && firstSentence.length <= 80) {
    return firstSentence.trim()
  }

  return null
}
