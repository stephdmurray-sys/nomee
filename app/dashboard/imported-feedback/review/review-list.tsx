"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { CheckCircle2, AlertCircle, Trash2, Eye, EyeOff, RefreshCw, Loader2, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { SOURCE_TYPES, type ImportedFeedback } from "@/lib/imported-feedback-traits"
import { useToast } from "@/hooks/use-toast"

type ReviewListProps = {
  initialPending: ImportedFeedback[]
  initialApproved: ImportedFeedback[]
}

export default function ReviewList({ initialPending, initialApproved }: ReviewListProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [retryingId, setRetryingId] = useState<string | null>(null)

  const [pending, setPending] = useState(initialPending)
  const [approved, setApproved] = useState(initialApproved)

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

  const handleEdit = (feedbackId: string) => {
    setEditingId(feedbackId)
    const feedback = pending.find((f) => f.id === feedbackId) || approved.find((f) => f.id === feedbackId)
    if (feedback) {
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
  }

  const handleTraitToggle = (trait: string) => {
    // Traits are AI-generated and read-only for uploads
    return
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

      const updatedPending = pending.filter((f) => f.id !== feedbackId)
      const updatedApproved = [...approved, { ...pending.find((f) => f.id === feedbackId), visibility: "public" }]
      setPending(updatedPending)
      setApproved(updatedApproved)
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

      const updatedPending = pending.filter((f) => f.id !== feedbackId)
      const updatedApproved = approved.filter((f) => f.id !== feedbackId)
      setPending(updatedPending)
      setApproved(updatedApproved)
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

      const updatedPending = pending.map((f) =>
        f.id === feedbackId ? { ...f, visibility: currentVisibility === "public" ? "private" : "public" } : f,
      )
      const updatedApproved = approved.map((f) =>
        f.id === feedbackId ? { ...f, visibility: currentVisibility === "public" ? "private" : "public" } : f,
      )
      setPending(updatedPending)
      setApproved(updatedApproved)
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

  const handleRetryExtraction = async (feedbackId: string) => {
    setRetryingId(feedbackId)

    try {
      const response = await fetch("/api/imported-feedback/retry-extraction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recordId: feedbackId,
          profileId:
            pending.find((f) => f.id === feedbackId)?.profile_id ||
            approved.find((f) => f.id === feedbackId)?.profile_id,
        }),
      })

      if (!response.ok) {
        throw new Error("Retry failed")
      }

      // Refresh the page to show updated data
      window.location.reload()
    } catch (error) {
      console.error("Retry extraction failed:", error)
      alert("Failed to retry extraction. Please try again.")
    } finally {
      setRetryingId(null)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Pending Review Section */}
      {pending.length > 0 && (
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold text-neutral-900">Pending Review ({pending.length})</h2>

          <div className="space-y-6">
            {pending.map((feedback) => {
              const isEditing = editingId === feedback.id
              const isProcessing = processingId === feedback.id
              const isRetrying = retryingId === feedback.id
              const confidencePercent = Math.round((feedback.confidence_score || 0) * 100)

              return (
                <Card key={feedback.id} className={feedback.extraction_status === "failed" ? "border-red-200" : ""}>
                  <div className="p-6">
                    {feedback.extraction_status === "failed" && (
                      <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="mt-0.5 h-4 w-4 text-red-600" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-red-900">Extraction failed</p>
                            <p className="mt-1 text-sm text-red-700">{feedback.extraction_error}</p>
                            <details className="mt-2">
                              <summary className="cursor-pointer text-xs text-red-600 underline">View details</summary>
                              <pre className="mt-2 text-xs text-red-800 whitespace-pre-wrap">
                                {feedback.raw_transcription_text || "No transcription available"}
                              </pre>
                            </details>
                          </div>
                        </div>
                      </div>
                    )}

                    {feedback.extraction_status === "processing" && (
                      <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                          <p className="text-sm text-blue-900">Extracting data from screenshot...</p>
                        </div>
                      </div>
                    )}

                    {feedback.extraction_status === "success" && (feedback.confidence_score || 0) < 0.7 && (
                      <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="mt-0.5 h-4 w-4 text-amber-600" />
                          <p className="text-sm text-amber-900">Low confidence extraction - please review carefully</p>
                        </div>
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Screenshot */}
                      <div>
                        <h3 className="mb-3 text-sm font-medium text-neutral-900">Screenshot</h3>
                        <img
                          src={feedback.raw_image_url || "/placeholder.svg"}
                          alt="Feedback screenshot"
                          className="w-full h-auto rounded-lg border"
                        />
                        <p className="mt-2 text-xs text-neutral-500">Confidence: {confidencePercent}%</p>

                        {/* Retry Button */}
                        {(feedback.extraction_status === "failed" || feedback.extraction_status === "success") && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-3 w-full bg-transparent"
                            onClick={() => handleRetryExtraction(feedback.id)}
                            disabled={isRetrying || isProcessing}
                          >
                            {isRetrying ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Retrying...
                              </>
                            ) : (
                              <>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Retry Extraction
                              </>
                            )}
                          </Button>
                        )}
                      </div>

                      {/* Extracted Data */}
                      <div className="space-y-4">
                        {!isEditing ? (
                          <>
                            <div>
                              <Label className="mb-2 block text-sm font-medium">Extracted Excerpt</Label>
                              {feedback.extraction_status === "processing" ? (
                                <div className="space-y-2">
                                  <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-200" />
                                  <div className="h-4 w-full animate-pulse rounded bg-neutral-200" />
                                  <div className="h-4 w-2/3 animate-pulse rounded bg-neutral-200" />
                                </div>
                              ) : (
                                <p className="text-sm text-neutral-700">
                                  {feedback.ai_extracted_excerpt || "No excerpt extracted"}
                                </p>
                              )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="mb-1 block text-sm font-medium">Giver Name</Label>
                                {feedback.giver_name === "Review needed" ||
                                feedback.giver_name === "Unknown" ||
                                !feedback.giver_name ? (
                                  <p className="text-sm text-amber-600 font-medium">Needs input</p>
                                ) : (
                                  <p className="text-sm text-neutral-700">{feedback.giver_name}</p>
                                )}
                              </div>
                              <div>
                                <Label className="mb-1 block text-sm font-medium">Company</Label>
                                {!feedback.giver_company ? (
                                  <p className="text-sm text-amber-600 font-medium">Needs input</p>
                                ) : (
                                  <p className="text-sm text-neutral-700">{feedback.giver_company}</p>
                                )}
                              </div>
                              <div>
                                <Label className="mb-1 block text-sm font-medium">Role</Label>
                                {!feedback.giver_role ? (
                                  <p className="text-sm text-amber-600 font-medium">Needs input</p>
                                ) : (
                                  <p className="text-sm text-neutral-700">{feedback.giver_role}</p>
                                )}
                              </div>
                              <div>
                                <Label className="mb-1 block text-sm font-medium">Source</Label>
                                <div className="flex items-center gap-2">
                                  {feedback.source_type ? (
                                    <Badge variant="secondary" className="text-xs">
                                      {feedback.source_type}
                                    </Badge>
                                  ) : (
                                    <p className="text-sm text-neutral-500">Not detected</p>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div>
                              <Label className="mb-2 block text-sm font-medium">AI Traits</Label>
                              <div className="flex flex-wrap gap-2">
                                {feedback.traits && feedback.traits.length > 0 ? (
                                  feedback.traits.map((trait) => (
                                    <Badge key={trait} variant="secondary" className="cursor-default">
                                      {trait}
                                    </Badge>
                                  ))
                                ) : (
                                  <p className="text-sm text-neutral-500">No traits extracted</p>
                                )}
                              </div>
                              <p className="mt-1 text-xs text-neutral-500">
                                AI-generated traits based on feedback content
                              </p>
                            </div>

                            <div className="flex gap-2 pt-4">
                              {(feedback.extraction_status === "failed" ||
                                (feedback.extraction_status === "success" &&
                                  (feedback.confidence_score || 0) < 0.7)) && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRetryExtraction(feedback.id)}
                                  disabled={retryingId === feedback.id}
                                >
                                  {retryingId === feedback.id ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Retrying...
                                    </>
                                  ) : (
                                    <>
                                      <RefreshCw className="mr-2 h-4 w-4" />
                                      Retry Extraction
                                    </>
                                  )}
                                </Button>
                              )}
                              <Button variant="outline" size="sm" onClick={() => handleEdit(feedback.id)}>
                                Edit Details
                              </Button>
                              <Button size="sm" onClick={() => handleApprove(feedback.id)}>
                                <Check className="mr-2 h-4 w-4" />
                                Approve & Publish
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
                                  className={`text-sm ${!editForm.giverName || editForm.giverName === "Review needed" || editForm.giverName === "Unknown" ? "border-amber-400 bg-amber-50" : ""}`}
                                  placeholder="Enter name"
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
                                  className={`text-sm ${!editForm.giverCompany ? "border-amber-400 bg-amber-50" : ""}`}
                                  placeholder="Enter company"
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
                                  className={`text-sm ${!editForm.giverRole ? "border-amber-400 bg-amber-50" : ""}`}
                                  placeholder="Enter role"
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
                              <Label className="mb-2 block text-sm font-medium">AI-Extracted Traits</Label>
                              <div className="flex flex-wrap gap-2">
                                {editForm.traits && editForm.traits.length > 0 ? (
                                  editForm.traits.map((trait) => (
                                    <Badge key={trait} variant="default">
                                      {trait}
                                    </Badge>
                                  ))
                                ) : (
                                  <p className="text-sm text-neutral-500">No traits extracted</p>
                                )}
                              </div>
                              <p className="mt-1 text-xs text-neutral-500">
                                Traits are AI-generated and cannot be edited
                              </p>
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
