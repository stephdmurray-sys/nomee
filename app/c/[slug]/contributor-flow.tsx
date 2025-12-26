"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { RELATIONSHIP_OPTIONS, RELATIONSHIP_VALUES } from "@/lib/nomee-enums"

const TRAIT_OPTIONS = {
  how_they_work: [
    { label: "Fast", sort_order: 1 },
    { label: "Thorough", sort_order: 2 },
    { label: "Organized", sort_order: 3 },
    { label: "Reliable", sort_order: 4 },
    { label: "Proactive", sort_order: 5 },
    { label: "Takes ownership", sort_order: 6 },
    { label: "Crisp communicator", sort_order: 7 },
    { label: "Clear expectations", sort_order: 8 },
    { label: "Calm under pressure", sort_order: 9 },
    { label: "Action-oriented", sort_order: 10 },
    { label: "Flexible", sort_order: 11 },
    { label: "Follow-through", sort_order: 12 },
  ],
  what_it_feels_like: [
    { label: "Easy", sort_order: 1 },
    { label: "Energizing", sort_order: 2 },
    { label: "Supportive", sort_order: 3 },
    { label: "Collaborative", sort_order: 4 },
    { label: "Safe", sort_order: 5 },
    { label: "Fun", sort_order: 6 },
    { label: "Motivating", sort_order: 7 },
    { label: "Efficient", sort_order: 8 },
    { label: "Respectful", sort_order: 9 },
    { label: "Low-stress", sort_order: 10 },
    { label: "Inspiring", sort_order: 11 },
    { label: "Trustworthy", sort_order: 12 },
  ],
  how_they_think: [
    { label: "Strategic", sort_order: 1 },
    { label: "Creative", sort_order: 2 },
    { label: "Analytical", sort_order: 3 },
    { label: "Practical", sort_order: 4 },
    { label: "Big-picture", sort_order: 5 },
    { label: "Detail-minded", sort_order: 6 },
    { label: "Problem-solver", sort_order: 7 },
    { label: "Customer-first", sort_order: 8 },
    { label: "Data-driven", sort_order: 9 },
    { label: "Decisive", sort_order: 10 },
    { label: "Thoughtful", sort_order: 11 },
    { label: "Curious", sort_order: 12 },
  ],
  how_they_show_up: [
    { label: "Empathetic", sort_order: 1 },
    { label: "Encouraging", sort_order: 2 },
    { label: "Direct (in a good way)", sort_order: 3 },
    { label: "Advocates for others", sort_order: 4 },
    { label: "Gives credit", sort_order: 5 },
    { label: "Coaches others", sort_order: 6 },
    { label: "Inclusive", sort_order: 7 },
    { label: "Patient", sort_order: 8 },
    { label: "Honest feedback", sort_order: 9 },
    { label: "Shows gratitude", sort_order: 10 },
    { label: "Leads by example", sort_order: 11 },
    { label: "Makes time", sort_order: 12 },
  ],
}

type ProfileData = {
  id: string
  full_name: string
  username: string
}

type Trait = {
  id: string
  label: string
  category: string
  sort_order: number
}

type ValidationErrors = {
  contributorName?: string
  contributorEmail?: string
  relationship?: string
  company?: string
  traits?: string
  quote?: string
}

type ContributorFlowProps = {
  profile: ProfileData
  initialTraits?: Record<string, string[]>
}

export default function ContributorFlow({ profile, initialTraits }: ContributorFlowProps) {
  const [step, setStep] = useState<"context" | "traits" | "quote" | "attribution" | "submitted">("context")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errorDetails, setErrorDetails] = useState<string | null>(null)
  const [showErrorDetails, setShowErrorDetails] = useState(false)
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [traits, setTraits] = useState<Trait[]>([])
  const [traitsByCategory, setTraitsByCategory] = useState<Record<string, Trait[]>>({})
  const [voiceBlob, setVoiceBlob] = useState<Blob | null>(null)
  const [clickedButton, setClickedButton] = useState<"skip" | "continue" | null>(null)
  const [clickTest, setClickTest] = useState("")
  const [testClicks, setTestClicks] = useState(0)
  const [contributionId, setContributionId] = useState<string | null>(null)
  const [selectedTraits, setSelectedTraits] = useState<Record<string, string[]>>(initialTraits || {})
  const [traitError, setTraitError] = useState("")
  const [quote, setQuote] = useState("")
  const [contributorName, setContributorName] = useState("")
  const [contributorEmail, setContributorEmail] = useState("")
  const [company, setCompany] = useState("")
  const [relationship, setRelationship] = useState("")
  const [usingFallback, setUsingFallback] = useState(false)

  useEffect(() => {
    const fetchTraits = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("trait_library")
        .select("id, label, category, sort_order")
        .order("category")
        .order("sort_order")

      if (data && !error && data.length > 0) {
        setTraits(data)
        const grouped = data.reduce((acc: Record<string, Trait[]>, trait) => {
          if (!acc[trait.category]) acc[trait.category] = []
          acc[trait.category].push(trait)
          return acc
        }, {})
        setTraitsByCategory(grouped)
        setUsingFallback(false)
      } else {
        const fallbackTraits = Object.entries(TRAIT_OPTIONS).flatMap(([category, options]) =>
          options.map((opt, idx) => ({
            id: `${category}-${idx}`,
            label: opt.label,
            category,
            sort_order: opt.sort_order,
          })),
        )
        setTraits(fallbackTraits)
        const grouped = fallbackTraits.reduce((acc: Record<string, Trait[]>, trait) => {
          if (!acc[trait.category]) acc[trait.category] = []
          acc[trait.category].push(trait)
          return acc
        }, {})
        setTraitsByCategory(grouped)
        setUsingFallback(true)
      }
    }
    fetchTraits()
  }, [])

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateAttributionStep = (): boolean => {
    const errors: ValidationErrors = {}

    if (!contributorName.trim()) {
      errors.contributorName = "Your name is required"
    }

    if (!contributorEmail.trim()) {
      errors.contributorEmail = "Your email is required"
    } else if (!isValidEmail(contributorEmail.trim())) {
      errors.contributorEmail = "Please enter a valid email"
    }

    if (!relationship) {
      errors.relationship = "Please select your relationship"
    } else if (!RELATIONSHIP_VALUES.includes(relationship as any)) {
      errors.relationship = "Please select a valid option"
    }

    if (!company.trim()) {
      errors.company = "Company or organization is required"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validateSubmission = (): boolean => {
    const totalTraits = Object.values(selectedTraits).flat().length
    const quoteLength = quote.trim().length

    if (totalTraits === 0 && quoteLength < 20) {
      setValidationErrors({
        traits: "Select at least 1 trait or write at least 20 characters",
        quote: "Select at least 1 trait or write at least 20 characters",
      })
      return false
    }

    return true
  }

  const handleTraitToggle = (category: string, traitId: string) => {
    const currentSelected = selectedTraits[category] || []

    if (currentSelected.includes(traitId)) {
      setSelectedTraits({
        ...selectedTraits,
        [category]: currentSelected.filter((id) => id !== traitId),
      })
      setTraitError("")
      setValidationErrors((prev) => ({ ...prev, traits: undefined }))
    } else if (currentSelected.length < 2) {
      setSelectedTraits({
        ...selectedTraits,
        [category]: [...currentSelected, traitId],
      })
      setTraitError("")
      setValidationErrors((prev) => ({ ...prev, traits: undefined }))
    } else {
      setTraitError("You've already selected 2 in this section.")
      setTimeout(() => setTraitError(""), 3000)
    }
  }

  const submitCoreContribution = async (): Promise<boolean> => {
    if (!profile) {
      console.log("[v0] No profile found")
      return false
    }

    try {
      console.log("[v0] Starting core contribution submission (Step 3)")

      if (!validateSubmission()) {
        console.log("[v0] Validation failed")
        return false
      }

      setLoading(true)
      setError(null)
      setErrorDetails(null)

      const allSelectedTraitIds = Object.values(selectedTraits).flat()

      console.log("[v0] Submitting core contribution (NO voice)")

      const response = await fetch("/api/contributions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId: profile.id,
          contributorName: contributorName.trim(),
          contributorEmail: contributorEmail.trim().toLowerCase(),
          companyOrOrg: company.trim(),
          relationship,
          message: quote.trim(),
          selectedTraitIds: allSelectedTraitIds,
        }),
      })

      const result = await response.json()

      console.log("[v0] Response:", response.status, result)

      if (response.status === 201 && result.success && result.contributionId) {
        console.log("[v0] ✅ Core submission successful! ID:", result.contributionId)
        setContributionId(result.contributionId)
        setLoading(false)
        return true
      }

      let userMessage = "Couldn't submit right now. Please try again."
      const details = result.error || result.details || `HTTP ${response.status}`

      if (response.status === 429 || result.code === "RATE_LIMIT") {
        userMessage =
          result.error ||
          `The email "${contributorEmail.trim().toLowerCase()}" has reached its submission limit. Try again later or use a different email.`
      } else if (response.status === 409 || result.code === "DUPLICATE_SUBMISSION") {
        userMessage =
          result.error ||
          `You've already submitted with "${contributorEmail.trim().toLowerCase()}" for ${profile.full_name}. Each email can only contribute once.`
      } else if (response.status === 500 || result.code === "DB_INSERT_ERROR") {
        if (
          details &&
          typeof details === "string" &&
          (details.includes("duplicate") || details.includes("unique constraint") || details.includes("email_hash"))
        ) {
          userMessage = `The email "${contributorEmail.trim().toLowerCase()}" has already been used for ${profile.full_name}. Each email can only submit once.`
        } else {
          userMessage = "Database error occurred. Please try again or contact support if this persists."
        }
      } else if (response.status === 400) {
        userMessage = result.error || "Invalid submission data. Please check your information."
      }

      setError(userMessage)
      setErrorDetails(details)
      console.error("[v0] ❌ Submission error:", response.status, result)
      setLoading(false)
      return false
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error"
      console.error("[v0] ❌ Submission error:", error)
      setError("Network error. Please check your connection and try again.")
      setErrorDetails(errorMsg)
      setLoading(false)
      return false
    }
  }

  const attachVoiceToContribution = async () => {
    if (!voiceBlob || !contributionId) {
      console.log("[v0] No voice or no contribution ID, skipping voice attachment")
      return
    }

    console.log("[v0] Uploading voice in background (non-blocking)...")

    try {
      const formData = new FormData()
      formData.append("file", voiceBlob, `voice-${Date.now()}.webm`)
      formData.append("contributionId", contributionId)

      const response = await fetch("/api/contributions/attach-voice", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (response.ok && result.success) {
        console.log("[v0] ✅ Voice attached successfully")
      } else {
        console.warn("[v0] ⚠️ Voice upload failed (non-blocking):", result.error)
      }
    } catch (error) {
      console.warn("[v0] ⚠️ Voice upload error (non-blocking):", error)
    }
  }

  const handleAttributionSubmit = async () => {
    console.log("[v0] Starting attribution submission")

    if (!validateAttributionStep()) {
      return
    }

    const success = await submitCoreContribution()
    if (success) {
      setContributionId(null)
      setStep("submitted")
    }
  }

  const handleAttributionContinue = () => {
    if (validateAttributionStep()) {
      setStep("voice")
    }
  }

  if (step === "context") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-12">
        <div className="w-full max-w-2xl">
          <Card className="p-12 text-center">
            <h1 className="mb-4 text-4xl font-semibold text-neutral-900">
              You're helping capture what it's actually like to work with {profile.full_name}
            </h1>
            <p className="mb-8 text-lg text-neutral-600">This takes about 2 minutes. Your insights matter.</p>
            <Button onClick={() => setStep("traits")} size="lg" className="px-8">
              Get started
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  if (step === "traits") {
    const totalSelected = Object.values(selectedTraits).flat().length
    const canContinue = true

    const CATEGORY_CONFIG = {
      how_they_work: {
        title: "How They Work",
        subtitle: "Their approach to getting things done",
      },
      what_it_feels_like: {
        title: "What Working With Them Feels Like",
        subtitle: "The day-to-day experience of collaborating",
      },
      how_they_think: {
        title: "How They Think",
        subtitle: "Their approach to solving problems",
      },
      how_they_show_up: {
        title: "How They Show Up for Others",
        subtitle: "The way they support the people around them",
      },
    }

    return (
      <div className="min-h-screen bg-white py-12 px-4">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <p className="mb-4 text-sm text-neutral-600">Step 1 of 4</p>
            <h1 className="mb-2 text-3xl font-semibold text-neutral-900">
              Pick up to 2 words per section that feel true
            </h1>
            <p className="text-neutral-600">You can skip sections if nothing fits.</p>
          </div>

          {usingFallback && (
            <div className="mb-6 rounded-lg bg-blue-50 border border-blue-200 p-4 text-sm text-blue-900">
              Using default trait options
            </div>
          )}

          <div className="space-y-8">
            {Object.entries(CATEGORY_CONFIG).map(([categoryKey, config]) => {
              const categoryTraits = traitsByCategory[categoryKey] || []
              const selected = selectedTraits[categoryKey] || []

              return (
                <Card key={categoryKey} className="p-6">
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold text-neutral-900">{config.title}</h2>
                    <p className="text-sm text-neutral-600">{config.subtitle}</p>
                  </div>
                  <div className="mb-4 flex items-center justify-between">
                    <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-sm text-neutral-700">
                      {selected.length} of 2 selected
                    </span>
                  </div>

                  {categoryTraits.length === 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-9 w-24 animate-pulse rounded-full bg-neutral-200" />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {categoryTraits.map((trait) => {
                        const isSelected = selected.includes(trait.id)
                        return (
                          <button
                            key={trait.id}
                            onClick={() => handleTraitToggle(categoryKey, trait.id)}
                            className={`rounded-full px-4 py-2 text-sm transition-all ${
                              isSelected
                                ? "bg-neutral-900 text-white ring-2 ring-neutral-900 ring-offset-2"
                                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                            }`}
                          >
                            {trait.label}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </Card>
              )
            })}
          </div>

          {traitError && (
            <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900">
              {traitError}
            </div>
          )}
          {validationErrors.traits && (
            <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-800">{validationErrors.traits}</div>
          )}

          <div className="mt-8 flex gap-4">
            <Button onClick={() => setStep("context")} variant="outline" size="lg">
              Back
            </Button>
            <Button onClick={() => setStep("quote")} className="flex-1" size="lg">
              Continue
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (step === "quote") {
    const charCount = quote.length
    const maxChars = 1200
    const totalTraits = Object.values(selectedTraits).flat().length
    const canContinue = totalTraits >= 1 || quote.trim().length >= 20

    return (
      <div className="min-h-screen bg-white py-12 px-4">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8">
            <p className="mb-4 text-sm text-neutral-600">Step 2 of 4</p>
            <h1 className="mb-2 text-3xl font-semibold text-neutral-900">
              In 1-2 sentences, what's it like working with {profile.full_name.split(" ")[0]}?
            </h1>
            <p className="text-neutral-600">Think of a specific moment or quality that stands out.</p>
          </div>

          <Card className="p-8">
            <Textarea
              value={quote}
              onChange={(e) => {
                setQuote(e.target.value.slice(0, maxChars))
                setValidationErrors((prev) => ({ ...prev, quote: undefined }))
              }}
              placeholder="E.g., 'She has this way of making complex problems feel solvable' or 'He always knows when the team needs a reset'"
              className="min-h-[180px] text-base"
            />
            <p className="mt-2 text-right text-sm text-neutral-500">
              {charCount} / {maxChars}
            </p>

            {validationErrors.quote && (
              <div className="mt-4 rounded-lg bg-amber-50 p-4 text-sm text-amber-800">{validationErrors.quote}</div>
            )}

            <div className="mt-8 flex gap-4">
              <Button onClick={() => setStep("traits")} variant="outline" size="lg">
                Back
              </Button>
              <Button
                onClick={() => setStep("attribution")}
                disabled={!canContinue}
                className="flex-1 disabled:cursor-not-allowed disabled:opacity-50"
                size="lg"
              >
                Continue
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  if (step === "attribution") {
    const canContinue = contributorName.trim() && contributorEmail.trim() && company.trim() && relationship

    return (
      <div className="min-h-screen bg-neutral-50 py-12 px-4">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8">
            <p className="mb-4 text-sm text-neutral-600">Step 3 of 4</p>
            <h1 className="mb-2 text-3xl font-semibold text-neutral-900">A little about you</h1>
            <p className="text-neutral-600">So {profile.full_name.split(" ")[0]} knows who this is from.</p>
          </div>

          <Card className="p-8">
            <div className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-neutral-900">
                  Your name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={contributorName}
                  onChange={(e) => {
                    setContributorName(e.target.value)
                    setValidationErrors((prev) => ({ ...prev, contributorName: undefined }))
                  }}
                  placeholder="Full name"
                  className="mt-2"
                />
                {validationErrors.contributorName && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.contributorName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="relationship" className="text-neutral-900">
                  Working relationship <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={relationship}
                  onValueChange={(value) => {
                    setRelationship(value)
                    setValidationErrors((prev) => ({ ...prev, relationship: undefined }))
                  }}
                >
                  <SelectTrigger id="relationship" className="mt-2">
                    <SelectValue placeholder="Select one" />
                  </SelectTrigger>
                  <SelectContent>
                    {RELATIONSHIP_OPTIONS.map((rel) => (
                      <SelectItem key={rel.value} value={rel.value}>
                        {rel.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {validationErrors.relationship && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.relationship}</p>
                )}
              </div>

              <div>
                <Label htmlFor="company" className="text-neutral-900">
                  Company or organization
                </Label>
                <Input
                  id="company"
                  type="text"
                  value={company}
                  onChange={(e) => {
                    setCompany(e.target.value)
                    setValidationErrors((prev) => ({ ...prev, company: undefined }))
                  }}
                  placeholder='E.g., "Acme Corp" or "Independent"'
                  className="mt-2"
                />
                {validationErrors.company && <p className="mt-1 text-sm text-red-600">{validationErrors.company}</p>}
              </div>

              <div>
                <Label htmlFor="email" className="text-neutral-900">
                  Your email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={contributorEmail}
                  onChange={(e) => {
                    setContributorEmail(e.target.value)
                    setValidationErrors((prev) => ({ ...prev, contributorEmail: undefined }))
                  }}
                  placeholder="your@email.com"
                  className="mt-2"
                />
                {validationErrors.contributorEmail && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.contributorEmail}</p>
                )}
                <p className="mt-2 text-sm text-neutral-500">To confirm your submission. Never shown publicly.</p>
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                <p className="text-sm font-medium text-red-800">{error}</p>
                {errorDetails && (
                  <div className="mt-2">
                    <button
                      onClick={() => setShowErrorDetails(!showErrorDetails)}
                      className="text-xs text-red-700 hover:text-red-900 underline"
                    >
                      {showErrorDetails ? "Hide details" : "Show details"}
                    </button>
                    {showErrorDetails && (
                      <pre className="mt-2 text-xs text-red-700 bg-red-100 p-2 rounded overflow-auto">
                        {errorDetails}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="mt-8 flex gap-4">
              <Button onClick={() => setStep("quote")} variant="outline" size="lg">
                Back
              </Button>
              <Button onClick={handleAttributionSubmit} disabled={!canContinue || loading} className="flex-1" size="lg">
                {loading ? "Submitting..." : "Continue"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <Card className="mx-auto max-w-2xl p-12 text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>

        <h1 className="mb-4 text-3xl font-semibold text-neutral-900">Check your email to confirm</h1>
        <p className="mb-2 text-neutral-600">
          We sent a confirmation link to <span className="font-medium">{contributorEmail}</span>
        </p>
        <p className="mb-8 text-neutral-600">
          Once you click the link, your perspective will appear on {profile.full_name}'s Nomee.
        </p>

        <div className="text-sm text-neutral-500">
          <p>Why do we need confirmation?</p>
          <p>It helps keep Nomee authentic and prevents spam.</p>
        </div>
      </Card>
    </div>
  )
}
