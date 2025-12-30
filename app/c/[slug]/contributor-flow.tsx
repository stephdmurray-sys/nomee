"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { RELATIONSHIP_OPTIONS, DURATION_OPTIONS } from "@/lib/nomee-enums"
import { TRAIT_CATEGORIES } from "@/lib/trait-categories"
import { VoiceRecorder } from "@/components/voice-recorder"
import { Label } from "@/components/ui/label"
import { Check, Copy } from "lucide-react"

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

const CONTRIBUTION_STORAGE_KEY = "nomee:contributionId"

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
  const [isSaving, setIsSaving] = useState(false)

  // Form data
  const [relationship, setRelationship] = useState("")
  const [relationshipContext, setRelationshipContext] = useState("")
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

  const [copiedMessage, setCopiedMessage] = useState(false)

  const handleCopyMessage = async () => {
    const typedMessage =
      sessionStorage.getItem(`nomee_draft_message_${contributionId}`) ||
      sessionStorage.getItem(`nomee_draft_message_${profile.slug}`) ||
      ""

    if (!typedMessage) return
    await navigator.clipboard.writeText(typedMessage)
    setCopiedMessage(true)
    setTimeout(() => setCopiedMessage(false), 2000)
  }

  useEffect(() => {
    const storedContributionId = sessionStorage.getItem(CONTRIBUTION_STORAGE_KEY)
    if (storedContributionId && !contributionId) {
      console.log("[COLLECTION] Recovered contributionId from sessionStorage:", storedContributionId)
      setContributionId(storedContributionId)
    }
  }, [])

  useEffect(() => {
    if (contributionId) {
      sessionStorage.setItem(CONTRIBUTION_STORAGE_KEY, contributionId)
      console.log("[COLLECTION] Stored contributionId to sessionStorage:", contributionId)
    }
  }, [contributionId])

  useEffect(() => {
    // Check if this is a fresh page load (no session marker)
    const sessionMarker = sessionStorage.getItem(`nomee-session-${profile.slug}`)
    const sessionData = sessionStorage.getItem(`nomee-draft-${profile.slug}`)

    if (sessionMarker && sessionData) {
      // User refreshed during an active session - restore their progress
      try {
        const parsed = JSON.parse(sessionData)
        if (parsed.relationship) setRelationship(parsed.relationship)
        if (parsed.relationshipContext) setRelationshipContext(parsed.relationshipContext)
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
        console.error("[COLLECTION] Failed to parse sessionStorage:", err)
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
        relationshipContext,
        duration,
        selectedTraits,
        message,
        firstName,
        lastName,
        email,
        contributionId,
        draftToken,
        step: step !== "submitted" ? step : "voice",
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
    setVoiceBlob(blob)
  }

  const validateEmailInline = (email: string) => {
    if (!email) {
      setEmailValidation("")
      return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const isValid = emailRegex.test(email)
    setEmailValidation(isValid ? "valid" : "invalid")
    return isValid
  }

  const handleSaveMessage = async () => {
    console.log("[COLLECTION] Step 4: handleSaveMessage called", {
      contributionId,
      hasContributionId: !!contributionId,
      messageLength: message.length,
    })

    setLoading(true)
    setError(null)

    try {
      const allSelectedTraitIds = Object.values(selectedTraits).flat()

      const requestBody = {
        profileId: profile.id,
        contributionId: contributionId || undefined,
        contributorName: null,
        contributorEmail: null,
        companyOrOrg: relationshipContext?.trim() || null,
        relationship,
        duration,
        message: message.trim(),
        selectedTraitIds: allSelectedTraitIds,
        draftToken,
      }

      console.log("[COLLECTION] step4 calling /api/contributions/create", {
        isUpdate: !!contributionId,
        contributionId: contributionId,
      })

      const response = await fetch("/api/contributions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      })

      const result = await response.json()

      console.log("[COLLECTION] step4 create response", {
        status: response.status,
        ok: response.ok,
        body: result,
      })

      if ((response.status === 201 || response.status === 200) && result.success && result.contributionId) {
        setContributionId(result.contributionId)
        sessionStorage.setItem(CONTRIBUTION_STORAGE_KEY, result.contributionId)
        console.log("[COLLECTION] step4 stored contributionId", {
          id: result.contributionId,
          wasUpdate: response.status === 200,
          wasInsert: response.status === 201,
        })

        setMessageSaveStatus("saved")
        setLoading(false)
        setIsSaving(false)

        sessionStorage.setItem(`nomee_draft_message_${result.contributionId}`, message)
        sessionStorage.setItem(`nomee_draft_message_${profile.slug}`, message)
        console.log("[COLLECTION] Step 4: Message saved to sessionStorage")

        setStep("identity")
        return
      }

      // Handle errors with real messages
      const errorMsg = result.error || result.message || `Error ${response.status}: Unknown error`
      console.error("[COLLECTION] step4 create failed:", errorMsg)
      setError(errorMsg)
      setMessageSaveStatus("failed")
    } catch (err) {
      console.error("[COLLECTION] step4 network error:", err)
      setError("Network error. Please check your connection and try again.")
      setMessageSaveStatus("failed")
    } finally {
      setLoading(false)
      setIsSaving(false)
    }
  }

  const handleIdentityUpdate = async () => {
    // Validation
    const errors: Record<string, string> = {}
    if (!firstName.trim()) errors.firstName = "First name is required"
    if (!email.trim()) errors.email = "Email is required"
    else if (!validateEmailInline(email.trim())) errors.email = "Please enter a valid email"

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }

    if (isSaving) return
    setIsSaving(true)

    setLoading(true)
    setError(null)
    setValidationErrors({})

    const stateContributionId = contributionId
    const sessionContributionId = sessionStorage.getItem(CONTRIBUTION_STORAGE_KEY)

    console.log("[COLLECTION] step5 submit start", {
      stateContributionId,
      sessionContributionId,
    })

    const finalContributionId = stateContributionId || sessionContributionId

    console.log("[COLLECTION] step5 resolved contributionId", { id: finalContributionId })

    if (!finalContributionId) {
      console.error("[COLLECTION] step5 NO contributionId found - showing recovery error")
      setError("We lost your draft. Please go back one step and click Continue again.")
      setLoading(false)
      setIsSaving(false)
      return
    }

    try {
      const updateBody = {
        contributionId: finalContributionId,
        contributorName: `${firstName.trim()}${lastName.trim() ? ` ${lastName.trim()}` : ""}`,
        contributorEmail: email.trim().toLowerCase(),
      }

      console.log("[COLLECTION] step5 calling /api/contributions/update-identity")

      const response = await fetch("/api/contributions/update-identity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateBody),
      })

      const result = await response.json()

      console.log("[COLLECTION] step5 update-identity response", {
        status: response.status,
        ok: response.ok,
        body: result,
      })

      if (response.ok && result.success) {
        console.log("[COLLECTION] step5 SUCCESS - navigating to voice step")
        // Clear sessionStorage on success
        sessionStorage.removeItem(CONTRIBUTION_STORAGE_KEY)
        setLoading(false)
        setIsSaving(false)
        setStep("voice")
        return
      }

      const errorMsg = `Error ${response.status}: ${result.error || result.message || "Unknown error"}`
      console.error("[COLLECTION] step5 update-identity failed:", {
        status: response.status,
        code: result.code,
        error: result.error,
        fullResult: result,
      })
      setError(errorMsg)
    } catch (err) {
      console.error("[COLLECTION] step5 network error:", err)
      setError("Network error. Please check your connection and try again.")
    } finally {
      setLoading(false)
      setIsSaving(false)
    }
  }

  const handleSubmitWithVoice = async () => {
    setLoading(true)
    setError(null)

    console.log("[VOICE] Step 6: handleSubmitWithVoice called", {
      contributionId,
      hasVoiceBlob: !!voiceBlob,
      voiceBlobSize: voiceBlob?.size,
    })

    try {
      if (voiceBlob && contributionId) {
        const formData = new FormData()
        formData.append("file", voiceBlob, "recording.webm")
        formData.append("contributionId", contributionId)

        console.log("[VOICE] Step 6: Uploading voice to /api/contributions/attach-voice")

        const response = await fetch("/api/contributions/attach-voice", {
          method: "POST",
          body: formData,
        })

        const responseData = await response.json()

        console.log("[VOICE] Step 6: Voice upload response", {
          ok: response.ok,
          status: response.status,
          data: responseData,
        })

        if (!response.ok) {
          console.error("[VOICE] Step 6: Voice upload failed", responseData)
          setError(responseData.error || "Failed to upload voice note. Please try again.")
          return
        }

        console.log("[VOICE] Step 6: ✅ Voice attached successfully", {
          voiceUrl: responseData.voiceUrl,
        })
      }

      sessionStorage.removeItem(`nomee-draft-${profile.slug}`)
      sessionStorage.removeItem(`nomee-session-${profile.slug}`)
      sessionStorage.removeItem(CONTRIBUTION_STORAGE_KEY)
      sessionStorage.removeItem(`nomee_draft_message_${contributionId}`)
      sessionStorage.removeItem(`nomee_draft_message_${profile.slug}`)

      console.log("[VOICE] Step 6: Cleaned up sessionStorage, moving to submitted")
      setStep("submitted")
    } catch (err) {
      console.error("[VOICE] Step 6: Error submitting:", err)
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSkipVoice = async () => {
    console.log("[VOICE] Step 6: Skipping voice, moving to submitted")
    setLoading(true)
    try {
      sessionStorage.removeItem(`nomee-draft-${profile.slug}`)
      sessionStorage.removeItem(`nomee-session-${profile.slug}`)
      sessionStorage.removeItem(CONTRIBUTION_STORAGE_KEY)
      sessionStorage.removeItem(`nomee_draft_message_${contributionId}`)
      sessionStorage.removeItem(`nomee_draft_message_${profile.slug}`)
      setStep("submitted")
    } finally {
      setLoading(false)
    }
  }

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

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-800">{error}</div>
          )}

          <div className="mt-8 flex gap-4">
            <Button onClick={() => setStep("duration")} variant="outline" size="lg" disabled={loading || isSaving}>
              Back
            </Button>
            <Button
              onClick={() => {
                if (Object.values(selectedTraits).flat().length < 1) {
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

  // STEP 4: Written Message - This step NOW creates the contribution
  if (step === "message") {
    const charCount = message.length
    const maxChars = 1200

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
                setMessageSaveStatus("idle")
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

            {error && (
              <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-800">{error}</div>
            )}

            <div className="mt-8 flex gap-4">
              <Button onClick={() => setStep("traits")} variant="outline" size="lg" disabled={loading || isSaving}>
                Back
              </Button>
              <Button
                onClick={handleSaveMessage}
                disabled={loading || isSaving || !message.trim()}
                className="flex-1"
                size="lg"
                data-continue-button
              >
                {loading || isSaving ? "Saving..." : "Continue"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  // STEP 5: Identity - This step ONLY calls update-identity, NEVER create
  if (step === "identity") {
    const firstNameValid = firstName.trim().length > 0
    const emailValid = emailValidation === "valid"
    const hasContributionId = !!(contributionId || sessionStorage.getItem(CONTRIBUTION_STORAGE_KEY))
    const canContinue = firstNameValid && emailValid && hasContributionId && !isSaving

    console.log("[IDENTITY] canContinue check", {
      firstNameLength: firstName.trim().length,
      emailValid,
      contributionId: contributionId || sessionStorage.getItem(CONTRIBUTION_STORAGE_KEY),
      isSaving,
      canContinue,
    })

    return (
      <div className="min-h-screen bg-white py-12 px-4">
        <div className="mx-auto max-w-2xl">
          <ProgressBar currentStep={5} totalSteps={6} />
          <div className="mb-8">
            <p className="mb-4 text-sm text-neutral-600">Step 5 of 6</p>
            <h1 className="mb-2 text-3xl font-semibold text-neutral-900">Who's this from?</h1>
          </div>

          <Card className="p-8">
            <div className="space-y-6">
              <div>
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value)
                    setValidationErrors((prev) => ({ ...prev, firstName: "" }))
                  }}
                  placeholder="Joe"
                  className={validationErrors.firstName ? "border-red-500" : ""}
                />
                {validationErrors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.firstName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="lastName">
                  Last name <span className="text-neutral-500">(optional)</span>
                </Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Rowe"
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    const newEmail = e.target.value
                    setEmail(newEmail)
                    validateEmailInline(newEmail)
                    setValidationErrors((prev) => ({ ...prev, email: "" }))
                  }}
                  placeholder="joe@example.com"
                  className={validationErrors.email ? "border-red-500" : ""}
                />
                {validationErrors.email && <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>}
                {!validationErrors.email && emailValidation === "valid" && (
                  <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Valid email
                  </p>
                )}
                <p className="mt-2 text-sm text-neutral-600">
                  Your email is only used to verify authenticity. It's never shown publicly.
                </p>
              </div>
            </div>

            {!hasContributionId && (
              <div className="mt-6 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-800">
                We lost your draft. Please go back one step and click Continue again.
              </div>
            )}

            {error && (
              <div className="mt-6 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-800">{error}</div>
            )}

            <div className="mt-8 flex gap-4">
              <Button onClick={() => setStep("message")} variant="outline" size="lg" disabled={isSaving}>
                Back
              </Button>
              <Button
                onClick={handleIdentityUpdate}
                disabled={!canContinue}
                className="flex-1"
                size="lg"
                data-continue-button
              >
                {isSaving ? "Saving..." : "Continue to voice (optional)"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  // STEP 6: Voice Recording (Optional)
  if (step === "voice") {
    const typedMessage =
      sessionStorage.getItem(`nomee_draft_message_${contributionId}`) ||
      sessionStorage.getItem(`nomee_draft_message_${profile.slug}`) ||
      ""

    console.log("[VOICE] Step 6: Loaded typed message from sessionStorage", {
      contributionId,
      hasMessage: !!typedMessage,
      messageLength: typedMessage.length,
    })

    return (
      <div className="min-h-screen bg-white py-12 px-4">
        <div className="mx-auto max-w-2xl">
          <ProgressBar currentStep={6} totalSteps={6} />
          <div className="mb-8">
            <p className="mb-4 text-sm text-neutral-600">Step 6 of 6 (optional)</p>
            <h1 className="mb-2 text-3xl font-semibold text-neutral-900">Add a voice note</h1>
            <p className="text-neutral-600">
              A short recording adds a personal touch. 30 seconds to 2 minutes works great.
            </p>
          </div>

          {typedMessage && (
            <Card className="mb-6 p-6 bg-blue-50/30 border-blue-200">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-semibold text-neutral-900">Read what you wrote (optional)</h3>
                <Button size="sm" variant="ghost" onClick={handleCopyMessage} className="h-8 px-2 text-xs">
                  {copiedMessage ? (
                    <>
                      <Check className="mr-1 h-3 w-3" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="mr-1 h-3 w-3" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <p className="text-sm text-neutral-700 leading-relaxed">{typedMessage}</p>
            </Card>
          )}

          <Card className="p-8">
            <VoiceRecorder onRecordingComplete={handleRecordingComplete} maxDuration={120} />

            {error && (
              <div className="mt-6 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-800">{error}</div>
            )}

            <div className="mt-8 flex gap-4">
              <Button onClick={() => setStep("identity")} variant="outline" size="lg" disabled={loading}>
                Back
              </Button>
              {voiceBlob ? (
                <Button onClick={handleSubmitWithVoice} disabled={loading} className="flex-1" size="lg">
                  {loading ? "Submitting..." : "Submit with voice"}
                </Button>
              ) : (
                <Button onClick={handleSkipVoice} disabled={loading} className="flex-1" size="lg">
                  {loading ? "Submitting..." : "Skip & Submit"}
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    )
  }

  // STEP 7: Submitted
  if (step === "submitted") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-12">
        <div className="w-full max-w-2xl">
          <Card className="p-12 text-center">
            <div className="mb-6 text-6xl">🎉</div>
            <h1 className="mb-4 text-4xl font-semibold text-neutral-900">Thank you!</h1>
            <p className="mb-8 text-lg text-neutral-600">
              Your recognition has been shared with {profile.full_name}. They'll be thrilled to see it!
            </p>
            <div className="flex flex-col items-center gap-3">
              <Button
                onClick={() => (window.location.href = `/${profile.slug}`)}
                size="lg"
                className="w-full max-w-xs px-8"
              >
                View {profile.full_name}'s Nomee
              </Button>
              <Button
                onClick={() => (window.location.href = "/signup")}
                variant="outline"
                size="lg"
                className="w-full max-w-xs px-8 border-amber-500 text-amber-600 hover:bg-amber-50 hover:text-amber-700"
              >
                Create Your Own Nomee
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return null
}
