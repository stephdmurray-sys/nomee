export function extractAnchorQuote(contributions: any[]): string | null {
  if (!contributions || contributions.length === 0) return null

  // Find the longest, most substantive quote
  const quotes = contributions
    .filter((c) => c.written_note && c.written_note.length > 50)
    .map((c) => ({
      text: c.written_note,
      length: c.written_note.length,
      // Prefer quotes with emotional language or strong descriptors
      weight: (c.written_note.match(/amazing|incredible|outstanding|exceptional|brilliant|wonderful/gi) || []).length,
    }))
    .sort((a, b) => b.weight - a.weight || b.length - a.length)

  if (quotes.length === 0) return null

  // Return the strongest quote, trimmed to a reasonable length
  const quote = quotes[0].text

  // Find a natural breaking point if quote is too long
  if (quote.length > 200) {
    const sentences = quote.match(/[^.!?]+[.!?]+/g) || []
    if (sentences.length > 0) {
      return sentences[0].trim()
    }
  }

  return quote
}
