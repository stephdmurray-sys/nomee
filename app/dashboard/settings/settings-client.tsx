"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Check, X, Loader2 } from "lucide-react"

type Profile = {
  id: string
  full_name: string | null
  slug: string | null
  plan: string | null
}

export default function SettingsClient({ profile, userEmail }: { profile: Profile; userEmail: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [checkingUsername, setCheckingUsername] = useState(false)

  const [fullName, setFullName] = useState(profile.full_name === "User" ? "" : profile.full_name || "")
  const [username, setUsername] = useState(profile.slug || "")
  const [visibility, setVisibility] = useState("public")
  const [usageContext, setUsageContext] = useState("")

  const hasChanges =
    fullName !== (profile.full_name === "User" ? "" : profile.full_name || "") || username !== (profile.slug || "")

  useEffect(() => {
    if (!username || username === profile.slug) {
      return
    }

    const timer = setTimeout(async () => {
      setCheckingUsername(true)
      const supabase = createClient()

      const { data } = await supabase
        .from("profiles")
        .select("id")
        .eq("slug", username.trim().toLowerCase())
        .neq("id", profile.id)
        .single()

      if (data) {
        setError("This username is already taken. Please choose another.")
      } else if (error.includes("already taken")) {
        setError("")
      }

      setCheckingUsername(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [username, profile.slug, profile.id, error])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    if (!fullName.trim() || !username.trim()) {
      setError("Full name and username are required")
      setLoading(false)
      return
    }

    const usernameRegex = /^[a-z0-9-]+$/
    if (!usernameRegex.test(username)) {
      setError("Username can only contain lowercase letters, numbers, and hyphens")
      setLoading(false)
      return
    }

    const supabase = createClient()

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim(),
        slug: username.trim().toLowerCase(),
      })
      .eq("id", profile.id)

    if (updateError) {
      if (updateError.code === "23505") {
        setError("This username is already taken. Please choose another.")
      } else {
        setError("Failed to update settings. Please try again.")
      }
      setLoading(false)
      return
    }

    setSuccess("Username saved!")
    setLoading(false)

    setTimeout(() => {
      router.push("/dashboard")
      router.refresh()
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b bg-white">
        <div className="mx-auto max-w-4xl px-6 py-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-12">
          <h1 className="mb-3 text-4xl font-bold text-neutral-900">Settings</h1>
          <p className="text-lg text-neutral-600 leading-relaxed">
            Manage how your Nomee appears, how people contribute, and how your Nomee page is shared.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* SECTION 1: Profile Information */}
          <Card className="p-8 rounded-2xl border border-neutral-200 shadow-sm">
            <h2 className="mb-6 text-2xl font-semibold text-neutral-900">Profile Information</h2>
            <div className="space-y-6">
              <div>
                <Label htmlFor="email" className="text-base font-medium text-neutral-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={userEmail}
                  disabled
                  className="mt-2 bg-neutral-50 border-neutral-200"
                />
                <p className="mt-2 text-sm text-neutral-500">Email is used for account access and verification.</p>
              </div>

              <div>
                <Label htmlFor="fullName" className="text-base font-medium text-neutral-700">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="mt-2 border-neutral-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
                {!fullName.trim() && (
                  <p className="mt-2 text-sm text-neutral-500">This is how your name appears on your Nomee page.</p>
                )}
              </div>

              <div>
                <Label htmlFor="username" className="text-base font-medium text-neutral-700">
                  Username
                </Label>
                <div className="relative">
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase())}
                    placeholder="your-username"
                    className="mt-2 font-mono border-neutral-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                  {checkingUsername && (
                    <Loader2 className="absolute right-3 top-5 h-4 w-4 animate-spin text-neutral-400" />
                  )}
                </div>
                <p className="mt-2 text-sm text-neutral-600">
                  This becomes your public link:{" "}
                  <span className="font-mono text-blue-600">nomee.co/{username || "username"}</span>
                </p>
              </div>
            </div>

            {error && (
              <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 flex items-start gap-3">
                <X className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800 font-medium">{error}</p>
              </div>
            )}
            {success && (
              <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 flex items-start gap-3">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-800 font-medium">{success}</p>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-neutral-200">
              <div className="flex items-center gap-4">
                <Button
                  type="submit"
                  disabled={loading || !hasChanges || checkingUsername}
                  size="lg"
                  className="px-8 bg-neutral-900 hover:bg-neutral-800"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save changes"
                  )}
                </Button>
                {hasChanges && !loading && (
                  <p className="text-sm text-amber-700 bg-amber-50 px-3 py-1.5 rounded-md border border-amber-200">
                    You have unsaved changes
                  </p>
                )}
                {!hasChanges && !loading && !success && <p className="text-sm text-neutral-500">No changes to save</p>}
              </div>
            </div>
          </Card>

          {/* SECTION 2: Nomee Visibility */}
          <Card className="p-8 rounded-2xl border border-neutral-200 shadow-sm">
            <h2 className="mb-6 text-2xl font-semibold text-neutral-900">Nomee Visibility</h2>
            <p className="text-sm text-neutral-600 mb-4">This controls who can view your Nomee page.</p>
            <RadioGroup value={visibility} onValueChange={setVisibility} className="space-y-4">
              <div className="flex items-start space-x-3 p-4 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 transition-colors">
                <RadioGroupItem value="public" id="public" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="public" className="text-base font-medium text-neutral-900 cursor-pointer">
                    Public
                  </Label>
                  <p className="mt-1 text-sm text-neutral-600">Anyone with your link can view your Nomee.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 transition-colors">
                <RadioGroupItem value="unlisted" id="unlisted" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="unlisted" className="text-base font-medium text-neutral-900 cursor-pointer">
                    Unlisted
                  </Label>
                  <p className="mt-1 text-sm text-neutral-600">Only people with the link can view your Nomee.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 rounded-lg border border-neutral-200 bg-neutral-50 opacity-60">
                <RadioGroupItem value="private" id="private" disabled className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="private" className="text-base font-medium text-neutral-700">
                    Private <span className="text-sm font-normal text-neutral-500">(Coming soon)</span>
                  </Label>
                  <p className="mt-1 text-sm text-neutral-500">Visible only to you.</p>
                </div>
              </div>
            </RadioGroup>
          </Card>

          {/* SECTION 3: Contribution Rules */}
          <Card className="p-8 rounded-2xl border border-neutral-200 shadow-sm">
            <h2 className="mb-6 text-2xl font-semibold text-neutral-900">Contribution Rules</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-base text-neutral-700">One submission per email</p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-base text-neutral-700">Email confirmation required</p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-base text-neutral-700">Contributor name and company required</p>
              </div>
              <div className="flex items-start gap-3">
                <X className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-base text-neutral-700">Anonymous submissions not allowed</p>
              </div>
            </div>
            <p className="mt-6 text-sm text-neutral-600 leading-relaxed">
              Nomee protects credibility by showing real identities and limiting each person to one perspective.
            </p>
          </Card>

          {/* SECTION 4: Featured Perspectives */}
          <Card className="p-8 rounded-2xl border border-neutral-200 shadow-sm">
            <h2 className="mb-6 text-2xl font-semibold text-neutral-900">Featured Perspectives</h2>
            {profile.plan === "Free" ? (
              <p className="text-base text-neutral-700 leading-relaxed mb-6">
                Featured perspectives are selected automatically to reflect a range of voices.
              </p>
            ) : (
              <>
                <p className="text-base text-neutral-700 leading-relaxed mb-6">
                  Choose which perspectives appear first on your public Nomee page.
                </p>
                <Button variant="outline" asChild>
                  <Link href="/dashboard">Manage featured perspectives</Link>
                </Button>
              </>
            )}
          </Card>

          {/* SECTION 5: How You're Using Nomee */}
          <Card className="p-8 rounded-2xl border border-neutral-200 shadow-sm">
            <h2 className="mb-6 text-2xl font-semibold text-neutral-900">How You're Using Nomee</h2>
            <div>
              <Label htmlFor="usageContext" className="text-base font-medium text-neutral-700">
                What brings you to Nomee? (optional)
              </Label>
              <select
                id="usageContext"
                value={usageContext}
                onChange={(e) => setUsageContext(e.target.value)}
                className="mt-2 w-full rounded-md border border-neutral-300 bg-white px-4 py-2.5 text-base text-neutral-900 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              >
                <option value="">Select an option...</option>
                <option value="exploring">Exploring new opportunities</option>
                <option value="job-searching">Actively job searching</option>
                <option value="showcasing">Showcasing work on my website</option>
                <option value="creator">Building credibility as a creator</option>
                <option value="feedback">Ongoing professional feedback</option>
                <option value="other">Other</option>
              </select>
              <p className="mt-2 text-sm text-neutral-500">
                This helps Nomee tailor your experience. Never shown publicly.
              </p>
            </div>
          </Card>

          {/* SECTION 6: Current Plan */}
          <Card className="p-8 rounded-2xl border-2 border-blue-200 bg-blue-50/30 shadow-sm">
            <h2 className="mb-4 text-2xl font-semibold text-neutral-900">Current Plan</h2>
            <div className="mb-6">
              <span className="text-4xl font-bold text-blue-900">{profile.plan || "Free"}</span>
            </div>
            {profile.plan === "Free" && (
              <>
                <ul className="mb-6 space-y-2 text-base text-neutral-700">
                  <li>• Collect unlimited perspectives</li>
                  <li>• Automatic featured selection</li>
                </ul>
                <Button asChild>
                  <Link href="/pricing">View plans</Link>
                </Button>
              </>
            )}
            {(profile.plan === "Pro" || profile.plan === "Premier") && (
              <>
                <p className="mb-2 text-base text-neutral-700">
                  Your Nomee page updates as new perspectives are added.
                </p>
                <p className="mb-4 text-sm text-neutral-600">
                  Canceling pauses updates — your saved feedback remains visible.
                </p>
                <Button variant="outline" asChild>
                  <Link href="/pricing">Manage billing</Link>
                </Button>
              </>
            )}
          </Card>

          {/* SECTION 7: Data & Privacy */}
          <Card className="p-8 rounded-2xl border border-neutral-200 shadow-sm">
            <h2 className="mb-6 text-2xl font-semibold text-neutral-900">Data & Privacy</h2>
            <p className="mb-6 text-base text-neutral-700 leading-relaxed">
              Contributor emails are used only for verification and are never displayed publicly.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="#" className="text-sm font-medium text-neutral-900 underline underline-offset-4">
                How verification works
              </Link>
              <Link href="#" className="text-sm font-medium text-neutral-900 underline underline-offset-4">
                Privacy policy
              </Link>
              <Link href="#" className="text-sm font-medium text-neutral-900 underline underline-offset-4">
                Contact support
              </Link>
            </div>
          </Card>
        </form>
      </div>
    </div>
  )
}
