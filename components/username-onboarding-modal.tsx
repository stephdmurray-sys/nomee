"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Check, Sparkles } from "lucide-react"

type UsernameOnboardingModalProps = {
  isOpen: boolean
  onComplete: () => void
  userEmail: string
}

export function UsernameOnboardingModal({ isOpen, onComplete, userEmail }: UsernameOnboardingModalProps) {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [isChecking, setIsChecking] = useState(false)
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Auto-suggest username from email
  useEffect(() => {
    if (userEmail && !username) {
      const suggestedUsername = userEmail
        .split("@")[0]
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "-")
      setUsername(suggestedUsername)
    }
  }, [userEmail, username])

  // Check username availability with debounce
  useEffect(() => {
    if (!username || username.length < 3) {
      setIsAvailable(null)
      return
    }

    const timeoutId = setTimeout(async () => {
      setIsChecking(true)
      setError(null)

      try {
        const response = await fetch(`/api/profile/check-username?username=${encodeURIComponent(username)}`)
        const data = await response.json()

        if (response.ok) {
          setIsAvailable(data.available)
          if (!data.available) {
            setError("This username is already taken")
          }
        } else {
          setError(data.error || "Failed to check username")
        }
      } catch (err) {
        setError("Failed to check username availability")
      } finally {
        setIsChecking(false)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [username])

  const handleSave = async () => {
    if (!username || !isAvailable) return

    setIsSaving(true)
    setError(null)

    try {
      const response = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: username }),
      })

      if (response.ok) {
        onComplete()
        router.refresh()
      } else {
        const data = await response.json()
        setError(data.error || "Failed to save username")
      }
    } catch (err) {
      setError("Failed to save username")
    } finally {
      setIsSaving(false)
    }
  }

  const publicUrl = username ? `nomee.co/${username}` : "nomee.co/your-username"

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-lg" showCloseButton={false}>
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <DialogTitle className="text-2xl">Welcome to Nomee!</DialogTitle>
          </div>
          <DialogDescription className="text-base leading-relaxed">
            Choose your username to create your personal Nomee page and start collecting feedback.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Username Input */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-base font-medium">
              Your Username
            </Label>
            <div className="relative">
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                placeholder="your-name"
                className="pr-10 text-base"
                autoFocus
                disabled={isSaving}
              />
              {isChecking && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              {!isChecking && isAvailable === true && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
              )}
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            {isAvailable === true && !error && (
              <p className="text-sm text-green-600 flex items-center gap-1">
                <Check className="w-4 h-4" />
                This username is available!
              </p>
            )}
          </div>

          {/* Preview */}
          <div className="rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 p-4 border border-blue-200">
            <p className="text-xs font-medium text-neutral-600 mb-1">Your public URL</p>
            <p className="text-base font-semibold text-blue-900 break-all">{publicUrl}</p>
          </div>

          {/* Benefits */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-neutral-900">You'll be able to:</p>
            <ul className="space-y-2 text-sm text-neutral-700">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Share a collection link to gather feedback from colleagues</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Display featured perspectives on your public profile</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Build your professional reputation with real feedback</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={handleSave}
            disabled={!username || !isAvailable || isChecking || isSaving}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-base h-11"
          >
            {isSaving ? "Creating your Nomee..." : "Claim my username"}
          </Button>
          <Button onClick={onComplete} variant="ghost" className="w-full text-neutral-600" disabled={isSaving}>
            I'll do this later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
