import type { HighlightPattern } from "./extract-highlight-patterns"

/**
 * TRAIT-ANCHORED, IMPACT-ONLY INLINE HIGHLIGHTS
 * Extracts 1-4 meaningful keywords per card with strict quality rules
 * GUARANTEE: Always returns at least 1 keyword that EXISTS in the text
 * Priority: Selected traits > Impactful descriptors > Impact verbs > Fallback from text
 */
export function extractKeywordsFromText(text: string, traits: string[] = []): HighlightPattern[] {
  if (!text || text.trim().length === 0) {
    return []
  }

  const keywords: HighlightPattern[] = []
  const textLower = text.toLowerCase()

  // Skip first 3 words to avoid highlighting sentence stems like "Working with Maya"
  const words = text.split(/\s+/)
  const skipFirstWords = words.slice(0, 3).join(" ").toLowerCase()

  // Exclusion list - NEVER highlight these
  const excludedWords = new Set([
    "working",
    "work",
    "with",
    "maya",
    "stephanie",
    "she",
    "he",
    "they",
    "her",
    "his",
    "their",
    "a",
    "an",
    "the",
    "to",
    "of",
    "in",
    "on",
    "at",
    "for",
    "from",
    "by",
    "about",
    "as",
    "into",
    "was",
    "is",
    "are",
    "been",
    "being",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "this",
    "that",
    "these",
    "those",
    "it",
    "its",
    "who",
    "what",
    "when",
    "where",
    "why",
    "how",
    "i",
    "me",
    "my",
    "we",
    "us",
    "our",
    "you",
    "your",
    "would",
    "could",
    "should",
    "can",
    "will",
    "just",
    "like",
    "also",
    "very",
    "really",
    "always",
    "never",
    "so",
    "but",
    "and",
    "or",
    "if",
    "then",
    "because",
    "while",
    "during",
    "before",
    "after",
    "above",
    "below",
    "between",
    "under",
    "over",
    "through",
    "again",
    "further",
    "then",
    "once",
    "here",
    "there",
    "all",
    "each",
    "few",
    "more",
    "most",
    "other",
    "some",
    "such",
    "no",
    "nor",
    "not",
    "only",
    "own",
    "same",
    "than",
    "too",
    "s",
    "t",
    "don",
    "now",
    "d",
    "ll",
    "m",
    "o",
    "re",
    "ve",
    "y",
    "ain",
    "aren",
    "couldn",
    "didn",
    "doesn",
    "hadn",
    "hasn",
    "haven",
    "isn",
    "ma",
    "mightn",
    "mustn",
    "needn",
    "shan",
    "shouldn",
    "wasn",
    "weren",
    "won",
    "wouldn",
  ])

  // Helper to check if a phrase exists in the text (word boundary match)
  const phraseExistsInText = (phrase: string): boolean => {
    const regex = new RegExp(`\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i")
    return regex.test(text)
  }

  // Helper to check if phrase is in skip zone or excluded
  const isValidKeyword = (phrase: string): boolean => {
    const phraseLower = phrase.toLowerCase()
    if (skipFirstWords.includes(phraseLower)) return false
    const phraseWords = phraseLower.split(/\s+/)
    if (phraseWords.some((w) => excludedWords.has(w))) return false
    return true
  }

  // TIER 1: Selected Traits (up to 2, must be 1-2 words AND exist in text)
  if (traits.length > 0) {
    traits.slice(0, 3).forEach((trait) => {
      const traitLower = trait.toLowerCase()
      const traitWords = traitLower.split(/\s+/)

      // Only use traits that are 1-2 words AND exist in the text
      if (traitWords.length <= 2 && phraseExistsInText(traitLower) && isValidKeyword(traitLower)) {
        keywords.push({
          phrase: traitLower,
          tier: "theme",
          frequency: 1,
        })
      }
    })
  }

  // TIER 2: Impactful descriptors (adjectives and adjective+noun phrases)
  if (keywords.length < 4) {
    // Allowed single-word adjectives with impact
    const impactfulAdjectives = [
      "calm",
      "thoughtful",
      "strategic",
      "creative",
      "genuine",
      "authentic",
      "inspiring",
      "encouraging",
      "supportive",
      "energizing",
      "grounded",
      "organized",
      "detailed",
      "thorough",
      "efficient",
      "responsive",
      "proactive",
      "collaborative",
      "flexible",
      "adaptable",
      "reliable",
      "consistent",
      "dependable",
      "clear",
      "articulate",
      "transparent",
      "innovative",
      "patient",
      "empathetic",
      "professional",
      "exceptional",
      "incredible",
      "amazing",
      "wonderful",
      "excellent",
      "outstanding",
      "fantastic",
      "brilliant",
      "talented",
      "skilled",
      "dedicated",
      "passionate",
      "driven",
      "focused",
      "motivated",
      "enthusiastic",
      "positive",
      "helpful",
      "kind",
      "generous",
      "warm",
      "friendly",
      "approachable",
      "natural",
      "intuitive",
      "smart",
      "intelligent",
      "insightful",
      "perceptive",
      "wise",
      "knowledgeable",
      "experienced",
      "capable",
      "competent",
      "effective",
      "impactful",
      "valuable",
      "essential",
      "trusted",
      "trustworthy",
      "honest",
      "sincere",
      "humble",
      "gracious",
      "respectful",
      "considerate",
      "attentive",
      "meticulous",
      "precise",
      "accurate",
      "careful",
      "diligent",
      "hardworking",
      "committed",
      "loyal",
      "fast",
      "quick",
      "prompt",
      "timely",
      "punctual",
      "prepared",
      "ready",
      "resourceful",
      "solution-oriented",
      "results-driven",
      "goal-oriented",
      "action-oriented",
      "forward-thinking",
      "visionary",
      "bold",
      "confident",
      "poised",
      "composed",
      "steady",
      "stable",
      "balanced",
      "fair",
      "objective",
      "pragmatic",
      "practical",
      "realistic",
      "sensible",
      "logical",
      "analytical",
      "systematic",
      "methodical",
      "structured",
      "disciplined",
      "self-motivated",
      "independent",
      "autonomous",
      "self-sufficient",
      "versatile",
      "dynamic",
      "agile",
      "nimble",
      "resilient",
      "persistent",
      "tenacious",
      "determined",
      "courageous",
      "fearless",
      "optimistic",
      "hopeful",
      "uplifting",
      "refreshing",
      "delightful",
      "pleasant",
      "enjoyable",
      "fun",
      "engaging",
      "captivating",
      "compelling",
      "persuasive",
      "influential",
      "charismatic",
      "magnetic",
      "inspiring",
      "transformative",
      "game-changing",
      "groundbreaking",
      "pioneering",
      "trailblazing",
      "cutting-edge",
      "state-of-the-art",
      "world-class",
      "top-notch",
      "first-rate",
      "best-in-class",
      "unparalleled",
      "unmatched",
      "extraordinary",
      "remarkable",
      "impressive",
      "stunning",
      "striking",
      "memorable",
      "unforgettable",
      "unique",
      "special",
      "rare",
      "precious",
      "gem",
      "treasure",
      "asset",
      "joy",
      "pleasure",
      "dream",
      "star",
      "rockstar",
      "superstar",
      "hero",
      "champion",
      "leader",
      "mentor",
      "guide",
      "advisor",
      "partner",
      "ally",
      "collaborator",
      "teammate",
      "colleague",
      "friend",
    ]

    // Allowed adjective+noun patterns
    const impactfulPhrases = [
      "calm confidence",
      "calm presence",
      "safe space",
      "high standards",
      "clear direction",
      "clear communicator",
      "strategic thinking",
      "level headed",
      "detail oriented",
      "detail-oriented",
      "results focused",
      "results-focused",
      "team player",
      "problem solver",
      "problem-solver",
      "go-to person",
      "trusted partner",
      "valuable asset",
      "creative ideas",
      "fresh perspective",
      "positive attitude",
      "strong work ethic",
      "work ethic",
      "attention to detail",
      "above and beyond",
      "goes above",
      "went above",
      "stand out",
      "stands out",
      "stood out",
      "top performer",
      "high performer",
      "best in class",
      "world class",
      "first class",
      "pleasure to work",
      "joy to work",
      "dream to work",
      "easy to work",
      "absolute pleasure",
      "absolute joy",
      "true professional",
      "consummate professional",
      "total professional",
      "natural leader",
      "born leader",
      "great leader",
      "strong leader",
      "thought leader",
      "subject matter expert",
      "domain expert",
      "industry expert",
      "highly recommend",
      "strongly recommend",
      "cannot recommend enough",
      "can't recommend enough",
      "without hesitation",
      "no hesitation",
      "no brainer",
      "lucky to have",
      "fortunate to have",
      "blessed to have",
      "grateful for",
      "thankful for",
      "appreciative of",
    ]

    // Check for adjective+noun phrases first (2+ words)
    impactfulPhrases.forEach((phrase) => {
      if (keywords.length >= 4) return
      if (phraseExistsInText(phrase) && isValidKeyword(phrase)) {
        keywords.push({
          phrase,
          tier: "working-style",
          frequency: 1,
        })
      }
    })

    // Then check for single impactful adjectives
    impactfulAdjectives.forEach((adjective) => {
      if (keywords.length >= 4) return
      if (phraseExistsInText(adjective) && isValidKeyword(adjective)) {
        keywords.push({
          phrase: adjective,
          tier: "working-style",
          frequency: 1,
        })
      }
    })
  }

  // TIER 3: Impact verbs (only if still need more, max 1 verb)
  if (keywords.length < 4) {
    const impactVerbs = [
      "unblocked",
      "elevated",
      "simplified",
      "delivered",
      "transformed",
      "streamlined",
      "resolved",
      "championed",
      "pioneered",
      "optimized",
      "exceeded",
      "surpassed",
      "impressed",
      "inspired",
      "motivated",
      "empowered",
      "enabled",
      "facilitated",
      "accelerated",
      "enhanced",
      "improved",
      "strengthened",
      "boosted",
      "lifted",
      "raised",
      "grew",
      "expanded",
      "scaled",
      "built",
      "created",
      "designed",
      "developed",
      "launched",
      "shipped",
      "executed",
      "implemented",
      "achieved",
      "accomplished",
      "completed",
      "finished",
      "succeeded",
      "won",
      "earned",
      "gained",
      "secured",
      "landed",
      "closed",
      "converted",
      "generated",
      "produced",
      "drove",
      "led",
      "managed",
      "coordinated",
      "organized",
      "planned",
      "strategized",
      "analyzed",
      "researched",
      "investigated",
      "discovered",
      "identified",
      "recognized",
      "acknowledged",
      "appreciated",
      "valued",
      "respected",
      "admired",
      "loved",
      "adored",
      "cherished",
      "treasured",
      "praised",
      "commended",
      "applauded",
      "celebrated",
      "honored",
      "rewarded",
      "thrilled",
      "delighted",
      "amazed",
      "astonished",
      "astounded",
      "blown away",
      "mind-blown",
      "wowed",
    ]

    for (const verb of impactVerbs) {
      if (keywords.length >= 4) break
      if (phraseExistsInText(verb) && isValidKeyword(verb)) {
        keywords.push({
          phrase: verb,
          tier: "contextual",
          frequency: 1,
        })
        break // Only add 1 verb max
      }
    }
  }

  if (keywords.length === 0) {
    // Extract all words from the text (after skip zone)
    const textWords = text.split(/\s+/).slice(3) // Skip first 3 words

    for (const word of textWords) {
      // Clean the word (remove punctuation)
      const cleanWord = word.toLowerCase().replace(/[^a-z'-]/g, "")

      // Must be at least 4 chars, not excluded, and not a name (starts with capital in original)
      if (
        cleanWord.length >= 4 &&
        !excludedWords.has(cleanWord) &&
        !/^[A-Z]/.test(word) // Skip proper nouns/names
      ) {
        keywords.push({
          phrase: cleanWord,
          tier: "contextual",
          frequency: 1,
        })
        break // Just need 1 fallback
      }
    }
  }

  // Ensure uniqueness and cap at 4
  const uniqueKeywords = keywords
    .filter((keyword, index, self) => index === self.findIndex((k) => k.phrase === keyword.phrase))
    .slice(0, 4)

  return uniqueKeywords
}
