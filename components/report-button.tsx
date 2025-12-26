"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Flag } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const REPORT_REASONS = [
  { value: "spam", label: "Spam or misleading" },
  { value: "inappropriate", label: "Inappropriate content" },
  { value: "false_information", label: "False or inaccurate information" },
  { value: "other", label: "Other" },
]

export function ReportButton({ contributionId }: { contributionId: string }) {
  const [open, setOpen] = useState(false)
  const [selectedReason, setSelectedReason] = useState("")
  const [details, setDetails] = useState("")
  const [reporterEmail, setReporterEmail] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedReason) return

    setSubmitting(true)

    try {
      const response = await fetch("/api/contributions/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contributionId,
          reporterEmail: reporterEmail || null,
          reason: selectedReason,
          details,
        }),
      })

      if (response.ok) {
        setSubmitted(true)
        setTimeout(() => {
          setOpen(false)
          setSubmitted(false)
          setSelectedReason("")
          setDetails("")
          setReporterEmail("")
        }, 2000)
      } else {
        const data = await response.json()
        alert(data.error || "Failed to submit report")
      }
    } catch (error) {
      alert("Failed to submit report")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-neutral-500 hover:text-neutral-900">
          <Flag className="h-4 w-4 mr-1" />
          Report
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report this perspective</DialogTitle>
          <DialogDescription>
            Help us maintain quality by reporting content that violates our community guidelines.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="py-8 text-center">
            <p className="text-green-600 font-medium">Thank you for your report!</p>
            <p className="text-sm text-neutral-600 mt-2">We'll review it shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Reason for reporting</Label>
              <div className="mt-2 space-y-2">
                {REPORT_REASONS.map((reason) => (
                  <label key={reason.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="reason"
                      value={reason.value}
                      checked={selectedReason === reason.value}
                      onChange={(e) => setSelectedReason(e.target.value)}
                      className="h-4 w-4"
                    />
                    <span className="text-sm">{reason.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="details">Additional details (optional)</Label>
              <Textarea
                id="details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Provide more context about why you're reporting this..."
                rows={3}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email">Your email (optional)</Label>
              <input
                id="email"
                type="email"
                value={reporterEmail}
                onChange={(e) => setReporterEmail(e.target.value)}
                placeholder="your@email.com"
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
              />
              <p className="text-xs text-neutral-500 mt-1">We'll only use this to follow up if needed</p>
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={!selectedReason || submitting} className="flex-1">
                {submitting ? "Submitting..." : "Submit Report"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
