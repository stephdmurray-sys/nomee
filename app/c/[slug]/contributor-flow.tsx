"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { RELATIONSHIP_OPTIONS, DURATION_OPTIONS } from "@/lib/nomee-enums"
import { TRAIT_CATEGORIES } from "@/lib/trait-categories"
import { VoiceRecorder } from "@/components/voice-recorder"
import { Check } from "lucide-react"

type Profile = {
  id: string
  full_name: string
  slug: string
}

type TraitSelections = Record<string, string[]>

type StepName = "entry" | "relationship" | "duration" | "traits" | "message" | "identity" | "voice" | "submitted"

type ContributorFlowProps = {
  profile: Profile
}

function ProgressBar({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  const percentage = (currentStep / totalSteps) * 100

  return (
    <div className="mb-8">
      <div className="h-2 w-full bg-neutral-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-neutral-900 transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export default function ContributorFlow({ profile }: ContributorFlowProps) {
  // Step management
  const [step, setStep] = useState<StepName>("entry")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [messageSaveStatus, setMessageSaveStatus] = useState<string>("idle")
  const [saveRetryCount, setSaveRetryCount] = useState<number>(0)

  // Form data
  const [relationship, setRelationship] = useState("")
  const [relationshipContext, setRelationshipContext] = useState("") // Added state for relationship context
  const [duration, setDuration] = useState("")
  const [selectedTraits, setSelectedTraits] = useState<TraitSelections>({})
  const [message, setMessage] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [voiceBlob, setVoiceBlob] = useState<Blob | null>(null)
  const [contributionId, setContributionId] = useState<string | null>(null)
  const [draftToken, setDraftToken] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [emailValidation, setEmailValidation] = useState<string>("")

  const firstNameValue = profile.full_name?.split(" ")[0] || profile.full_name || "them"

  useEffect(() => {
    // Check if this is a fresh page load (no session marker)
    const sessionMarker = sessionStorage.getItem(`nomee-session-${profile.slug}`)
    const sessionData = sessionStorage.getItem(`nomee-draft-${profile.slug}`)

    if (sessionMarker && sessionData) {
      // User refreshed during an active session - restore their progress
      try {
        const parsed = JSON.parse(sessionData)
        console.log("[v0] Restored draft from sessionStorage:", parsed)
        if (parsed.relationship) setRelationship(parsed.relationship)
        if (parsed.relationshipContext) setRelationshipContext(parsed.relationshipContext) // Restore relationship context
        if (parsed.duration) setDuration(parsed.duration)
        if (parsed.selectedTraits) setSelectedTraits(parsed.selectedTraits)
        if (parsed.message) setMessage(parsed.message)
        if (parsed.firstName) setFirstName(parsed.firstName)
        if (parsed.lastName) setLastName(parsed.lastName)
        if (parsed.email) setEmail(parsed.email)
        if (parsed.contributionId) setContributionId(parsed.contributionId)
        if (parsed.draftToken) setDraftToken(parsed.draftToken)
        // Only restore step if not submitted
        if (parsed.step && parsed.step !== "submitted") setStep(parsed.step)
      } catch (err) {
        console.error("[v0] Failed to parse sessionStorage:", err)
      }
    } else {
      // Fresh page load - clear any stale drafts and start from beginning
      sessionStorage.removeItem(`nomee-draft-${profile.slug}`)
    }

    // Set session marker to indicate active session
    sessionStorage.setItem(`nomee-session-${profile.slug}`, "active")

    // Generate or restore draft token
    if (!draftToken) {
      const token = `draft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      setDraftToken(token)
    }

    // Clear session marker when user leaves the page
    const handleBeforeUnload = () => {
      sessionStorage.removeItem(`nomee-session-${profile.slug}`)
    }
    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [profile.slug])

  useEffect(() => {
    if (step !== "entry") {
      const draftData = {
        relationship,
        relationshipContext, // Include relationship context in draft
        duration,
        selectedTraits,
        message,
        firstName,
        lastName,
        email,
        contributionId,
        draftToken,
        step: step !== "submitted" ? step : "voice", // Don't restore to submitted
      }
      sessionStorage.setItem(`nomee-draft-${profile.slug}`, JSON.stringify(draftData))
    }
  }, [
    relationship,
    relationshipContext,
    duration,
    selectedTraits,
    message,
    firstName,
    lastName,
    email,
    contributionId,
    draftToken,
    step,
    profile.slug,
  ])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey && !loading) {
        const activeElement = document.activeElement as HTMLElement
        if (activeElement?.tagName !== "TEXTAREA" && activeElement?.tagName !== "SELECT") {
          const continueButton = document.querySelector("[data-continue-button]") as HTMLButtonElement
          if (continueButton && !continueButton.disabled) {
            continueButton.click()
          }
        }
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [loading])

  const handleRecordingComplete = (blob: Blob) => {
    console.log("[v0] Received recording blob:", blob.size, "bytes")
    setVoiceBlob(blob)
  }

  const validateEmailInline = (email: string) => {
    if (!email) {
      setEmailValidation("")
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    setEmailValidation(emailRegex.test(email) ? "valid" : "invalid")
  }

  // STEP 1: Emotional Entry
  if (step === "entry") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-12">
        <div className="w-full max-w-2xl">
          <p className="mb-6 text-center text-sm text-neutral-600">⏱️ Takes about 2 minutes</p>
          <Card className="p-12 text-center">
            <h1 className="mb-4 text-4xl font-semibold text-neutral-900">
              What's it really like to work with {profile.full_name}?
            </h1>
            <p className="mb-8 text-lg text-neutral-600">
              Your words help capture what it genuinely felt like to work together.
            </p>
            <Button onClick={() => setStep("relationship")} size="lg" className="px-8" data-continue-button>
              Start
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  // STEP 2: Working Relationship
  if (step === "relationship") {
    const contextRequiredForRelationships = [
      "manager",
      "teammate",
      "direct_report",
      "client",
      "vendor",
      "collaborator",
      "advisor",
    ]

    const isContextRequired = contextRequiredForRelationships.some((type) => relationship.toLowerCase().includes(type))

    return (
      <div className="min-h-screen bg-white py-12 px-4">
        <div className="mx-auto max-w-2xl">
          <ProgressBar currentStep={1} totalSteps={6} />
          <div className="mb-8">
            <p className="mb-4 text-sm text-neutral-600">Step 1 of 6</p>
            <h1 className="mb-2 text-3xl font-semibold text-neutral-900">How do you know {profile.full_name}?</h1>
          </div>

          <Card className="p-8">
            <Select
              value={relationship}
              onValueChange={(value) => {
                setRelationship(value)
                setValidationErrors((prev) => ({ ...prev, relationship: "" }))
              }}
            >
              <SelectTrigger className="text-base">
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
              <p className="mt-2 text-sm text-red-600">{validationErrors.relationship}</p>
            )}

            {relationship && (
              <div className="mt-6">
                <label htmlFor="relationship-context" className="block text-sm font-medium text-neutral-900 mb-2">
                  What was the context?{isContextRequired && <span className="text-red-600 ml-1">*</span>}
                </label>
                <p className="text-sm text-neutral-600 mb-3">
                  Company, project, or community (ex: Brightside Health, Nike launch, PTA)
                </p>
                <input
                  id="relationship-context"
                  type="text"
                  placeholder="Add context…"
                  value={relationshipContext}
                  onChange={(e) => {
                    setRelationshipContext(e.target.value)
                    setValidationErrors((prev) => ({ ...prev, relationshipContext: "" }))
                  }}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={100}
                />
                {validationErrors.relationshipContext && (
                  <p className="mt-2 text-sm text-red-600">{validationErrors.relationshipContext}</p>
                )}
              </div>
            )}

            <div className="mt-8 flex gap-4">
              <Button onClick={() => setStep("entry")} variant="outline" size="lg">
                Back
              </Button>
              <Button
                onClick={() => {
                  if (!relationship) {
                    setValidationErrors({ relationship: "Please select your relationship" })
                    return
                  }
                  if (isContextRequired && !relationshipContext.trim()) {
                    setValidationErrors({
                      relationshipContext: "Please provide context for this relationship type",
                    })
                    return
                  }
                  setStep("duration")
                }}
                className="flex-1"
                size="lg"
                data-continue-button
              >
                Continue
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  // STEP 3: Time Context
  if (step === "duration") {
    return (
      <div className="min-h-screen bg-white py-12 px-4">
        <div className="mx-auto max-w-2xl">
          <ProgressBar currentStep={2} totalSteps={6} />
          <div className="mb-8">
            <p className="mb-4 text-sm text-neutral-600">Step 2 of 6</p>
            <h1 className="mb-2 text-3xl font-semibold text-neutral-900">How long have you known them?</h1>
          </div>

          <Card className="p-8">
            <Select
              value={duration}
              onValueChange={(value) => {
                setDuration(value)
                setValidationErrors((prev) => ({ ...prev, duration: "" }))
              }}
            >
              <SelectTrigger className="text-base">
                <SelectValue placeholder="Select one" />
              </SelectTrigger>
              <SelectContent>
                {DURATION_OPTIONS.map((dur) => (
                  <SelectItem key={dur.value} value={dur.value}>
                    {dur.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {validationErrors.duration && <p className="mt-2 text-sm text-red-600">{validationErrors.duration}</p>}

            <div className="mt-8 flex gap-4">
              <Button onClick={() => setStep("relationship")} variant="outline" size="lg">
                Back
              </Button>
              <Button
                onClick={() => {
                  if (!duration) {
                    setValidationErrors({ duration: "Please select a duration" })
                    return
                  }
                  setStep("traits")
                }}
                className="flex-1"
                size="lg"
                data-continue-button
              >
                Continue
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  // STEP 4: Traits
  if (step === "traits") {
    const totalSelected = Object.values(selectedTraits).flat().length

    const handleTraitToggle = (category: string, traitId: string) => {
      const currentSelected = selectedTraits[category] || []

      if (currentSelected.includes(traitId)) {
        setSelectedTraits({
          ...selectedTraits,
          [category]: currentSelected.filter((id) => id !== traitId),
        })
      } else if (currentSelected.length < 2) {
        setSelectedTraits({
          ...selectedTraits,
          [category]: [...currentSelected, traitId],
        })
      }
    }

    return (
      <div className="min-h-screen bg-white py-12 px-4">
        <div className="mx-auto max-w-3xl">
          <ProgressBar currentStep={3} totalSteps={6} />
          <div className="mb-8">
            <p className="mb-4 text-sm text-neutral-600">Step 3 of 6</p>
            <h1 className="mb-2 text-3xl font-semibold text-neutral-900">
              Choose up to 2 traits per section that best reflect your experience
            </h1>
            <p className="text-neutral-600">
              {totalSelected === 0 && "Select at least 1 trait to continue."}
              {totalSelected > 0 && `${totalSelected} trait${totalSelected === 1 ? "" : "s"} selected`}
            </p>
          </div>

          <div className="space-y-8">
            {Object.entries(TRAIT_CATEGORIES).map(([categoryKey, category]) => {
              const selected = selectedTraits[categoryKey] || []
              const isMaxed = selected.length >= 2

              return (
                <Card key={categoryKey} className="p-6">
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold text-neutral-900">
                      {categoryKey === "the_vibe" ? `${firstNameValue}'s vibe` : category.title}
                    </h2>
                    {categoryKey === "the_vibe" && <p className="text-sm text-neutral-600 mt-1">Pick up to 2</p>}
                    <div className="mt-2 flex items-center justify-between">
                      <span className={`text-sm ${isMaxed ? "text-neutral-900 font-medium" : "text-neutral-600"}`}>
                        {selected.length} of 2 selected {isMaxed && "✓"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {category.traits.map((trait) => {
                      const isSelected = selected.includes(trait.id)
                      const isDisabled = !isSelected && isMaxed

                      return (
                        <button
                          key={trait.id}
                          onClick={() => !isDisabled && handleTraitToggle(categoryKey, trait.id)}
                          disabled={isDisabled}
                          className={`rounded-full px-4 py-2 text-sm transition-all ${
                            isSelected
                              ? "bg-neutral-900 text-white ring-2 ring-neutral-900 ring-offset-2"
                              : isDisabled
                                ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 cursor-pointer"
                          }`}
                        >
                          {trait.label}
                        </button>
                      )
                    })}
                  </div>
                </Card>
              )
            })}
          </div>

          {validationErrors.traits && (
            <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-800">
              {validationErrors.traits}
            </div>
          )}

          <div className="mt-8 flex gap-4">
            <Button onClick={() => setStep("duration")} variant="outline" size="lg">
              Back
            </Button>
            <Button
              onClick={() => {
                if (totalSelected < 1) {
                  setValidationErrors({ traits: "Please select at least 1 trait" })
                  return
                }
                setValidationErrors({})
                setStep("message")
              }}
              className="flex-1"
              size="lg"
              data-continue-button
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // STEP 5: Written Message
  if (step === "message") {
    const charCount = message.length
    const maxChars = 1200

    const saveMessageWithRetry = async (retryAttempt = 0): Promise<boolean> => {
      try {
        console.log("[v0] Attempting to save contribution (attempt", retryAttempt + 1, ")")
        const allSelectedTraitIds = Object.values(selectedTraits).flat()

        const response = await fetch("/api/contributions/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            profileId: profile.id,
            contributorName: "Pending",
            contributorEmail: "pending@nomee.app",
            companyOrOrg: "Unknown",
            relationship,
            relationshipContext, // Include relationship context in API call
            duration,
            message: message.trim(),
            selectedTraitIds: allSelectedTraitIds,
            draftToken, // Include draft token for future recovery
          }),
        })

        const result = await response.json()

        if (response.status === 201 && result.success && result.contributionId) {
          console.log("[v0] ✅ Contribution saved successfully:", result.contributionId)
          setContributionId(result.contributionId)
          setMessageSaveStatus("saved")
          setSaveRetryCount(0)
          return true
        }

        // Log detailed error for debugging
        console.error("[v0] Save failed:", {
          status: response.status,
          code: result.code,
          error: result.error,
          details: result.details,
        })

        // Retry logic for transient failures
        if (retryAttempt < 2 && response.status >= 500) {
          console.log("[v0] Retrying save after", (retryAttempt + 1) * 1000, "ms")
          await new Promise((resolve) => setTimeout(resolve, (retryAttempt + 1) * 1000))
          return saveMessageWithRetry(retryAttempt + 1)
        }

        return false
      } catch (err) {
        console.error("[v0] Network error on save attempt", retryAttempt + 1, ":", err)

        // Retry on network errors
        if (retryAttempt < 2) {
          console.log("[v0] Retrying save after network error")
          await new Promise((resolve) => setTimeout(resolve, (retryAttempt + 1) * 1000))
          return saveMessageWithRetry(retryAttempt + 1)
        }

        return false
      }
    }

    const handleMessageSubmit = async () => {
      if (!message.trim()) {
        setValidationErrors({ message: "Please write a message" })
        return
      }

      setLoading(true)
      setError(null)
      setValidationErrors({})
      setMessageSaveStatus("saving")

      const saved = await saveMessageWithRetry()

      if (saved) {
        // Success - proceed normally
        setLoading(false)
        setStep("identity")
      } else {
        // Save failed, but allow user to continue
        console.log("[v0] Save failed, but allowing user to continue with local backup")
        setMessageSaveStatus("failed")
        setError(null) // Clear error to not block UI
        setLoading(false)

        // Show non-blocking notice and proceed
        setStep("identity")
      }
    }

    return (
      <div className="min-h-screen bg-white py-12 px-4">
        <div className="mx-auto max-w-2xl">
          <ProgressBar currentStep={4} totalSteps={6} />
          <div className="mb-8">
            <p className="mb-4 text-sm text-neutral-600">Step 4 of 6</p>
            <h1 className="mb-2 text-3xl font-semibold text-neutral-900">
              In 1–3 sentences, what stood out about your experience with {profile.full_name}?
            </h1>
            <p className="text-neutral-600">Think of a moment, behavior, or quality that made an impression.</p>
          </div>

          <Card className="p-8">
            <Textarea
              value={message}
              onChange={(e) => {
                setMessage(e.target.value.slice(0, maxChars))
                setValidationErrors((prev) => ({ ...prev, message: "" }))
                setMessageSaveStatus("idle") // Reset status when user types
              }}
              placeholder={`Working with ${firstNameValue} felt like having someone who truly…`}
              className="min-h-[180px] text-base"
              autoFocus
            />
            <p className="mt-2 text-right text-sm text-neutral-500">
              {charCount} / {maxChars}
            </p>

            {validationErrors.message && (
              <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-800">
                {validationErrors.message}
              </div>
            )}

            {messageSaveStatus === "failed" && (
              <div className="mt-4 rounded-lg bg-blue-50 border border-blue-200 p-4">
                <p className="text-sm text-blue-800">💾 Your message is saved locally — you can continue safely</p>
              </div>
            )}

            <div className="mt-8 flex gap-4">
              <Button onClick={() => setStep("traits")} variant="outline" size="lg" disabled={loading}>
                Back
              </Button>
              <Button
                onClick={handleMessageSubmit}
                disabled={loading || !message.trim()}
                className="flex-1"
                size="lg"
                data-continue-button
              >
                {loading ? "Saving..." : "Continue"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  // STEP 6: Identity
  if (step === "identity") {
    const isValidEmail = (email: string): boolean => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    }

    const handleIdentityUpdate = async () => {
      // Validation
      const errors: Record<string, string> = {}
      if (!firstName.trim()) errors.firstName = "First name is required"
      if (!email.trim()) errors.email = "Email is required"
      else if (!isValidEmail(email.trim())) errors.email = "Please enter a valid email"

      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors)
        return
      }

      setLoading(true)
      setError(null)
      setValidationErrors({})

      try {
        let finalContributionId = contributionId

        console.log("[v0] handleIdentityUpdate - Starting with:", {
          contributionId,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim().toLowerCase(),
          relationship,
          relationshipContext,
          duration,
          messageLength: message.trim().length,
          selectedTraitsCount: Object.values(selectedTraits).flat().length,
        })

        if (!finalContributionId) {
          console.log("[v0] No contributionId - creating contribution now with identity")
          const allSelectedTraitIds = Object.values(selectedTraits).flat()

          const companyValue = relationshipContext?.trim() || null

          const requestBody = {
            profileId: profile.id,
            contributorName: `${firstName.trim()}${lastName.trim() ? ` ${lastName.trim()}` : ""}`,
            contributorEmail: email.trim().toLowerCase(),
            companyOrOrg: companyValue,
            relationship,
            relationshipContext: companyValue,
            duration,
            message: message.trim(),
            selectedTraitIds: allSelectedTraitIds,
            draftToken,
          }
          console.log("[v0] Creating contribution with body:", requestBody)

          const createResponse = await fetch("/api/contributions/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
          })

          const createResult = await createResponse.json()
          console.log("[v0] Create API response:", { status: createResponse.status, result: createResult })

          if (createResponse.status === 201 && createResult.success && createResult.contributionId) {
            console.log("[v0] ✅ Contribution created with identity:", createResult.contributionId)
            finalContributionId = createResult.contributionId
            setContributionId(finalContributionId)
            setLoading(false)
            setStep("voice")
            return
          } else {
            // Handle create errors
            let userMessage = `Couldn't save right now. Please try again.`
            if (createResponse.status === 429 || createResult.code === "RATE_LIMIT") {
              userMessage = createResult.error || "This email has reached its submission limit."
            } else if (createResponse.status === 409 || createResult.code === "DUPLICATE_SUBMISSION") {
              userMessage = createResult.error || "This email has already submitted for this person."
            } else if (createResult.error) {
              userMessage = createResult.error
            }
            console.error("[v0] Create failed:", { userMessage, code: createResult.code, fullResult: createResult })
            setError(userMessage)
            setLoading(false)
            return
          }
        }

        console.log("[v0] Updating contribution with identity info, contributionId:", finalContributionId)
        const updateBody = {
          contributionId: finalContributionId,
          contributorName: `${firstName.trim()}${lastName.trim() ? ` ${lastName.trim()}` : ""}`,
          contributorEmail: email.trim().toLowerCase(),
        }
        console.log("[v0] Update identity body:", updateBody)

        const response = await fetch("/api/contributions/update-identity", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateBody),
        })

        const result = await response.json()
        console.log("[v0] Update identity API response:", { status: response.status, result })

        if (response.ok && result.success) {
          console.log("[v0] ✅ Identity updated successfully")
          setLoading(false)
          setStep("voice")
          return
        }

        // Handle errors
        let userMessage = `Couldn't save right now. Please try again.`
        if (response.status === 429 || result.code === "RATE_LIMIT") {
          userMessage = result.error || "This email has reached its submission limit."
        } else if (response.status === 409 || result.code === "DUPLICATE_SUBMISSION") {
          userMessage = result.error || "This email has already submitted for this person."
        } else if (result.error) {
          userMessage = result.error
        }

        console.error("[v0] Update identity failed:", { userMessage, code: result.code, fullResult: result })
        setError(userMessage)
        setLoading(false)
      } catch (err) {
        console.error("[v0] handleIdentityUpdate error:", err)
        setError("Network error. Please check your connection and try again.")
        setLoading(false)
      }
    }

    return (
      <div className="min-h-screen bg-neutral-50 py-12 px-4">
        <div className="mx-auto max-w-2xl">
          <ProgressBar currentStep={5} totalSteps={6} />
          <div className="mb-8">
            <p className="mb-4 text-sm text-neutral-600">Step 5 of 6</p>
            <h1 className="mb-2 text-3xl font-semibold text-neutral-900">Who's this from?</h1>
          </div>

          <Card className="p-8">
            <div className="space-y-6">
              <div>
                <Label htmlFor="firstName" className="text-neutral-900">
                  First name
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value)
                    setValidationErrors((prev) => ({ ...prev, firstName: "" }))
                  }}
                  className="mt-2"
                  autoFocus
                />
                {validationErrors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.firstName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="lastName" className="text-neutral-900">
                  Last name <span className="text-neutral-400 font-normal">(optional)</span>
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value)
                    setValidationErrors((prev) => ({ ...prev, lastName: "" }))
                  }}
                  className="mt-2"
                />
                {validationErrors.lastName && <p className="mt-1 text-sm text-red-600">{validationErrors.lastName}</p>}
              </div>

              <div>
                <Label htmlFor="email" className="text-neutral-900">
                  Email
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setValidationErrors((prev) => ({ ...prev, email: "" }))
                      validateEmailInline(e.target.value)
                    }}
                    className="mt-2 pr-10"
                  />
                  {emailValidation === "valid" && (
                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-600 mt-1" />
                  )}
                </div>
                {validationErrors.email && <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>}
                <p className="mt-2 text-sm text-neutral-500">
                  Your email is only used to verify authenticity. It's never shown publicly.
                </p>
              </div>
            </div>

            {error && (
              <div className="mt-6 rounded-lg bg-red-50 border border-red-200 p-4">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            )}

            <div className="mt-8 flex gap-4">
              <Button onClick={() => setStep("message")} variant="outline" size="lg" disabled={loading}>
                Back
              </Button>
              <Button
                onClick={handleIdentityUpdate}
                disabled={loading || !firstName.trim() || !email.trim() || emailValidation !== "valid"}
                className="flex-1"
                size="lg"
                data-continue-button
              >
                {loading ? "Finishing..." : "Continue to voice (optional)"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  // STEP 7: Voice (Optional)
  if (step === "voice") {
    const handleSubmitWithVoice = async () => {
      if (!voiceBlob || !contributionId) {
        setStep("submitted")
        return
      }

      setLoading(true)
      setError(null)

      try {
        console.log("[v0] Uploading voice recording, blob size:", voiceBlob.size)
        const formData = new FormData()
        formData.append("file", voiceBlob, `voice-${Date.now()}.webm`)
        formData.append("contributionId", contributionId)

        const response = await fetch("/api/contributions/attach-voice", {
          method: "POST",
          body: formData,
        })

        const result = await response.json()

        if (!response.ok || !result.success) {
          console.log("[v0] Voice upload failed, but continuing anyway")
          setError("Voice upload failed, but your message was saved successfully")
        } else {
          console.log("[v0] ✅ Voice uploaded successfully")
        }
      } catch (err) {
        console.error("[v0] Voice upload error:", err)
        setError("Voice upload failed, but your message was saved successfully")
      }

      setLoading(false)
      setStep("submitted")
    }

    const handleSkipVoice = () => {
      console.log("[v0] User skipped voice recording")
      setStep("submitted")
    }

    return (
      <div className="min-h-screen bg-neutral-50 py-12 px-4">
        <div className="mx-auto max-w-2xl">
          <ProgressBar currentStep={6} totalSteps={6} />
          <div className="mb-8">
            <p className="mb-4 text-sm text-neutral-600">Step 6 of 6 (Optional)</p>
            <h1 className="mb-2 text-3xl font-semibold text-neutral-900">Want to read it in your own voice?</h1>
            <p className="text-neutral-600">Adds a personal touch — completely optional.</p>
          </div>

          <VoiceRecorder quote={message} onRecordingComplete={handleRecordingComplete} />

          {error && (
            <div className="mt-6 rounded-lg bg-amber-50 border border-amber-200 p-4">
              <p className="text-sm text-amber-800">{error}</p>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3">
            {voiceBlob ? (
              <Button size="lg" onClick={handleSubmitWithVoice} disabled={loading} data-continue-button>
                {loading ? "Submitting..." : "Submit with voice note"}
              </Button>
            ) : (
              <Button size="lg" variant="outline" onClick={handleSkipVoice} data-continue-button>
                Skip — submit without voice
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // STEP 8: Confirmation (ALWAYS SHOWS)
  if (step === "submitted") {
    sessionStorage.removeItem(`nomee-draft-${profile.slug}`)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <Card className="mx-auto max-w-2xl p-12 text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1 className="mb-4 text-3xl font-semibold text-neutral-900">Thank you — your voice matters</h1>
        <p className="mb-8 text-neutral-600">
          {profile.full_name} will see your Nomee and appreciate you taking the time to share your perspective.
        </p>

        <Button variant="outline" size="lg" onClick={() => (window.location.href = "/")}>
          Build your own Nomee
        </Button>
      </Card>
    </div>
  )
}
