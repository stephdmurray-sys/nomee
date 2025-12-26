"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { CheckCircle2, AlertCircle, Trash2, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { LOCKED_TRAITS, SOURCE_TYPES, type ImportedFeedback } from "@/lib/imported-feedback-traits"
import { useToast } from "@/hooks/use-toast"

type ReviewListProps = {
  pending: ImportedFeedback[]
  approved: ImportedFeedback[]
  profileId: string
}

export default function ReviewList({ pending, approved, profileId }: ReviewListProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [processingId, setProcessingId] = useState<string | null>(null)

  const [editForm, setEditForm] = useState<{
    excerpt: string
    giverName: string
    giverCompany: string
    giverRole: string
    sourceType: string
    approxDate: string
    traits: string[]
    visibility: "public" | "private"
  }>({
    excerpt: "",
    giverName: "",
    giverCompany: "",
    giverRole: "",
    sourceType: "",
    approxDate: "",
    traits: [],
    visibility: "public",
  })

  const handleEdit = (feedback: ImportedFeedback) => {
    setEditingId(feedback.id)
    setEditForm({
      excerpt: feedback.ai_extracted_excerpt || "",
      giverName: feedback.giver_name,
      giverCompany: feedback.giver_company || "",
      giverRole: feedback.giver_role || "",
      sourceType: feedback.source_type || "",
      approxDate: feedback.approx_date || "",
      traits: feedback.traits || [],
      visibility: feedback.visibility,
    })
  }

  const handleTraitToggle = (trait: string) => {
    setEditForm((prev) => ({
      ...prev,
      traits: prev.traits.includes(trait)
        ? prev.traits.filter((t) => t !== trait)
        : [...prev.traits, trait].slice(0, 3),
    }))
  }

  const handleApprove = async (feedbackId: string) => {
    setProcessingId(feedbackId)
    try {
      const response = await fetch("/api/imported-feedback/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          feedbackId,
          updates: editingId === feedbackId ? editForm : undefined,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        toast({
          variant: "destructive",
          title: "Couldn't save feedback",
          description: data.error || "Please try again or refresh the page if your session expired.",
        })
        return
      }

      toast({
        title: "Feedback approved",
        description: "Your feedback is now published on your profile.",
      })

      router.refresh()
      setEditingId(null)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Network error",
        description: "Please check your connection and try again.",
      })
    } finally {
      setProcessingId(null)
    }
  }

  const handleDelete = async (feedbackId: string) => {
    if (!confirm("Are you sure you want to delete this imported feedback? This cannot be undone.")) {
      return
    }

    setProcessingId(feedbackId)
    try {
      const response = await fetch("/api/imported-feedback/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ feedbackId }),
      })

      if (!response.ok) {
        const data = await response.json()
        toast({
          variant: "destructive",
          title: "Couldn't delete feedback",
          description: data.error || "Please try again.",
        })
        return
      }

      toast({
        title: "Feedback deleted",
        description: "The imported feedback has been removed.",
      })

      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Network error",
        description: "Please check your connection and try again.",
      })
    } finally {
      setProcessingId(null)
    }
  }

  const handleToggleVisibility = async (feedbackId: string, currentVisibility: "public" | "private") => {
    setProcessingId(feedbackId)
    try {
      const response = await fetch("/api/imported-feedback/update-visibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          feedbackId,
          visibility: currentVisibility === "public" ? "private" : "public",
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        toast({
          variant: "destructive",
          title: "Couldn't update visibility",
          description: data.error || "Please try again.",
        })
        return
      }

      toast({
        title: "Visibility updated",
        description: `Feedback is now ${currentVisibility === "public" ? "private" : "public"}.`,
      })

      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Network error",
        description: "Please check your connection and try again.",
      })
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <div className="space-y-12">
      {/* Pending Review Section */}
      {pending.length > 0 && (
        <div>
          <h2 className="mb-6 text-2xl font-semibold text-neutral-900">Pending Review ({pending.length})</h2>

          <div className="space-y-6">
            {pending.map((feedback) => {
              const isEditing = editingId === feedback.id
              const isProcessing = processingId === feedback.id
              const requiresReview = (feedback.confidence_score || 0) < 0.6

              return (
                <Card key={feedback.id} className={`p-6 ${requiresReview ? "border-amber-300 bg-amber-50/30" : ""}`}>
                  {requiresReview && (
                    <div className="mb-4 flex items-center gap-2 text-sm text-amber-700">
                      <AlertCircle className="h-4 w-4" />
                      Low confidence extraction - please review carefully
                    </div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left: Screenshot */}
                    <div>
                      <Label className="mb-2 block text-sm font-medium">Screenshot</Label>
                      <img
                        src={feedback.raw_image_url || "/placeholder.svg"}
                        alt="Feedback screenshot"
                        className="w-full rounded-lg border shadow-sm"
                      />
                      <div className="mt-2 text-xs text-neutral-500">
                        Confidence: {((feedback.confidence_score || 0) * 100).toFixed(0)}%
                      </div>
                    </div>

                    {/* Right: Extracted Data */}
                    <div className="space-y-4">
                      {!isEditing ? (
                        <>
                          <div>
                            <Label className="mb-1 block text-sm font-medium">Extracted Excerpt</Label>
                            <p className="text-sm text-neutral-700 italic">
                              "{feedback.ai_extracted_excerpt || "No positive excerpt found"}"
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="mb-1 block text-sm font-medium">Giver Name</Label>
                              <p className="text-sm text-neutral-700">{feedback.giver_name}</p>
                            </div>
                            <div>
                              <Label className="mb-1 block text-sm font-medium">Company</Label>
                              <p className="text-sm text-neutral-700">{feedback.giver_company || "—"}</p>
                            </div>
                            <div>
                              <Label className="mb-1 block text-sm font-medium">Role</Label>
                              <p className="text-sm text-neutral-700">{feedback.giver_role || "—"}</p>
                            </div>
                            <div>
                              <Label className="mb-1 block text-sm font-medium">Source</Label>
                              <p className="text-sm text-neutral-700">{feedback.source_type || "—"}</p>
                            </div>
                          </div>

                          <div>
                            <Label className="mb-2 block text-sm font-medium">Traits</Label>
                            <div className="flex flex-wrap gap-2">
                              {feedback.traits && feedback.traits.length > 0 ? (
                                feedback.traits.map((trait) => (
                                  <Badge key={trait} variant="secondary">
                                    {trait}
                                  </Badge>
                                ))
                              ) : (
                                <p className="text-sm text-neutral-500">No traits extracted</p>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-2 pt-4">
                            <Button onClick={() => handleEdit(feedback)} variant="outline" className="flex-1">
                              Edit Details
                            </Button>
                            <Button
                              onClick={() => handleApprove(feedback.id)}
                              disabled={isProcessing}
                              className="flex-1"
                            >
                              {isProcessing ? (
                                "Approving..."
                              ) : (
                                <>
                                  <CheckCircle2 className="mr-2 h-4 w-4" />
                                  Approve & Publish
                                </>
                              )}
                            </Button>
                            <Button
                              onClick={() => handleDelete(feedback.id)}
                              disabled={isProcessing}
                              variant="destructive"
                              size="icon"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <Label htmlFor="excerpt" className="mb-1 block text-sm font-medium">
                              Excerpt (editable)
                            </Label>
                            <Textarea
                              id="excerpt"
                              value={editForm.excerpt}
                              onChange={(e) => setEditForm({ ...editForm, excerpt: e.target.value })}
                              rows={3}
                              className="text-sm"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="giverName" className="mb-1 block text-sm font-medium">
                                Giver Name
                              </Label>
                              <Input
                                id="giverName"
                                value={editForm.giverName}
                                onChange={(e) => setEditForm({ ...editForm, giverName: e.target.value })}
                                className="text-sm"
                              />
                            </div>
                            <div>
                              <Label htmlFor="giverCompany" className="mb-1 block text-sm font-medium">
                                Company
                              </Label>
                              <Input
                                id="giverCompany"
                                value={editForm.giverCompany}
                                onChange={(e) => setEditForm({ ...editForm, giverCompany: e.target.value })}
                                className="text-sm"
                              />
                            </div>
                            <div>
                              <Label htmlFor="giverRole" className="mb-1 block text-sm font-medium">
                                Role
                              </Label>
                              <Input
                                id="giverRole"
                                value={editForm.giverRole}
                                onChange={(e) => setEditForm({ ...editForm, giverRole: e.target.value })}
                                className="text-sm"
                              />
                            </div>
                            <div>
                              <Label htmlFor="sourceType" className="mb-1 block text-sm font-medium">
                                Source Type
                              </Label>
                              <Select
                                value={editForm.sourceType}
                                onValueChange={(v) => setEditForm({ ...editForm, sourceType: v })}
                              >
                                <SelectTrigger className="text-sm">
                                  <SelectValue placeholder="Select source" />
                                </SelectTrigger>
                                <SelectContent>
                                  {SOURCE_TYPES.map((type) => (
                                    <SelectItem key={type} value={type}>
                                      {type}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div>
                            <Label className="mb-2 block text-sm font-medium">Traits (max 3, toggle on/off)</Label>
                            <div className="flex flex-wrap gap-2">
                              {LOCKED_TRAITS.map((trait) => (
                                <Badge
                                  key={trait}
                                  variant={editForm.traits.includes(trait) ? "default" : "outline"}
                                  className="cursor-pointer"
                                  onClick={() => handleTraitToggle(trait)}
                                >
                                  {trait}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="visibility" className="mb-1 block text-sm font-medium">
                              Visibility
                            </Label>
                            <Select
                              value={editForm.visibility}
                              onValueChange={(v: "public" | "private") => setEditForm({ ...editForm, visibility: v })}
                            >
                              <SelectTrigger className="text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="public">Public</SelectItem>
                                <SelectItem value="private">Private</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex gap-2 pt-4">
                            <Button onClick={() => setEditingId(null)} variant="outline" className="flex-1">
                              Cancel
                            </Button>
                            <Button
                              onClick={() => handleApprove(feedback.id)}
                              disabled={isProcessing}
                              className="flex-1"
                            >
                              {isProcessing ? (
                                "Saving..."
                              ) : (
                                <>
                                  <CheckCircle2 className="mr-2 h-4 w-4" />
                                  Save & Approve
                                </>
                              )}
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Approved Section */}
      {approved.length > 0 && (
        <div>
          <h2 className="mb-6 text-2xl font-semibold text-neutral-900">Approved ({approved.length})</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {approved.map((feedback) => {
              const isProcessing = processingId === feedback.id

              return (
                <Card key={feedback.id} className="p-4">
                  <div className="mb-3">
                    <Badge variant={feedback.visibility === "public" ? "default" : "secondary"} className="mb-2">
                      {feedback.visibility === "public" ? (
                        <>
                          <Eye className="mr-1 h-3 w-3" />
                          Public
                        </>
                      ) : (
                        <>
                          <EyeOff className="mr-1 h-3 w-3" />
                          Private
                        </>
                      )}
                    </Badge>
                  </div>

                  <img
                    src={feedback.raw_image_url || "/placeholder.svg"}
                    alt="Feedback screenshot"
                    className="mb-3 w-full h-32 object-cover rounded border"
                  />

                  <p className="mb-2 text-sm text-neutral-700 italic line-clamp-3">"{feedback.ai_extracted_excerpt}"</p>

                  <p className="mb-3 text-xs text-neutral-600">
                    — {feedback.giver_name}
                    {feedback.giver_company && `, ${feedback.giver_company}`}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {feedback.traits?.slice(0, 3).map((trait) => (
                      <Badge key={trait} variant="secondary" className="text-xs">
                        {trait}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => handleToggleVisibility(feedback.id, feedback.visibility)}
                      disabled={isProcessing}
                    >
                      {feedback.visibility === "public" ? "Make Private" : "Make Public"}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(feedback.id)} disabled={isProcessing}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {pending.length === 0 && approved.length === 0 && (
        <Card className="p-12 text-center">
          <p className="mb-4 text-neutral-600">No imported feedback yet</p>
          <Button asChild>
            <a href="/dashboard/imported-feedback/upload">Upload Screenshots</a>
          </Button>
        </Card>
      )}
    </div>
  )
}
