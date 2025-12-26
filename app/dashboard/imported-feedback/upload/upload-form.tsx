"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, X, Loader2, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"

type UploadFormProps = {
  profileId: string
  currentCount: number
  limit: number
}

type UploadFile = {
  file: File
  preview: string
  status: "pending" | "uploading" | "uploaded" | "processing" | "ready_for_review" | "error_upload"
  error?: string
  id?: string
}

export default function UploadForm({ profileId, currentCount, limit }: UploadFormProps) {
  const router = useRouter()
  const [files, setFiles] = useState<UploadFile[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const remainingUploads = limit === Number.POSITIVE_INFINITY ? Number.POSITIVE_INFINITY : limit - currentCount
  const canUploadMore = limit === Number.POSITIVE_INFINITY || files.length < remainingUploads

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return

    const validFiles = Array.from(newFiles).filter((file) => {
      const isImage = file.type.startsWith("image/")
      const isPDF = file.type === "application/pdf"
      const isUnder10MB = file.size <= 10 * 1024 * 1024
      return (isImage || isPDF) && isUnder10MB
    })

    const maxToAdd = limit === Number.POSITIVE_INFINITY ? validFiles.length : remainingUploads - files.length
    const filesToAdd = validFiles.slice(0, maxToAdd).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      status: "pending" as const,
    }))

    setFiles((prev) => [...prev, ...filesToAdd])
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev]
      URL.revokeObjectURL(newFiles[index].preview)
      newFiles.splice(index, 1)
      return newFiles
    })
  }

  const retryFile = async (index: number) => {
    const fileData = files[index]
    if (!fileData) return

    // Reset status to pending and trigger upload
    setFiles((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], status: "pending", error: undefined }
      return updated
    })

    // Trigger upload for this file
    await uploadSingleFile(index)
  }

  const uploadSingleFile = async (index: number) => {
    const fileData = files[index]
    if (!fileData || fileData.status !== "pending") return

    setFiles((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], status: "uploading" }
      return updated
    })

    try {
      const formData = new FormData()
      formData.append("file", fileData.file)

      const uploadResponse = await fetch("/api/imported-feedback/upload", {
        method: "POST",
        body: formData,
      })

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json()
        throw new Error(errorData.error || "Upload failed")
      }

      const { url } = await uploadResponse.json()

      setFiles((prev) => {
        const updated = [...prev]
        updated[index] = { ...updated[index], status: "uploaded" }
        return updated
      })

      const createResponse = await fetch("/api/imported-feedback/create-record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: url,
          profileId,
        }),
      })

      if (!createResponse.ok) {
        const errorData = await createResponse.json()
        throw new Error(errorData.error || "Failed to create record")
      }

      const { id } = await createResponse.json()

      setFiles((prev) => {
        const updated = [...prev]
        updated[index] = { ...updated[index], status: "processing", id }
        return updated
      })

      fetch("/api/imported-feedback/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: url,
          profileId,
          recordId: id,
        }),
      }).catch((err) => {
        console.error("[v0] Background processing error:", err)
        // Don't fail the upload - just mark for review
      })

      setTimeout(() => {
        setFiles((prev) => {
          const updated = [...prev]
          if (updated[index]?.id === id) {
            updated[index] = { ...updated[index], status: "ready_for_review" }
          }
          return updated
        })
      }, 2000)
    } catch (error) {
      console.error("[v0] Upload error:", error)
      setFiles((prev) => {
        const updated = [...prev]
        updated[index] = {
          ...updated[index],
          status: "error_upload",
          error: error instanceof Error ? error.message : "Upload failed",
        }
        return updated
      })
    }
  }

  const handleUpload = async () => {
    for (let i = 0; i < files.length; i++) {
      if (files[i].status === "pending") {
        await uploadSingleFile(i)
      }
    }
  }

  const allProcessed =
    files.length > 0 && files.every((f) => f.status === "ready_for_review" || f.status === "processing")
  const hasErrors = files.some((f) => f.status === "error_upload")
  const isProcessing = files.some((f) => f.status === "uploading" || f.status === "uploaded")

  const remainingDisplay = limit === Number.POSITIVE_INFINITY ? "Unlimited" : `${remainingUploads} remaining`

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <Card
        className={`p-12 border-2 border-dashed transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : canUploadMore
              ? "border-neutral-300 hover:border-neutral-400"
              : "border-neutral-200 bg-neutral-100"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 rounded-full bg-blue-100 p-4">
            <Upload className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-neutral-900">
            {canUploadMore ? "Drop files here or click to browse" : "Upload limit reached for this session"}
          </h3>
          <p className="mb-4 text-sm text-neutral-600">
            {canUploadMore ? `JPG, PNG, or PDF up to 10MB each (${remainingDisplay})` : `Remove some files to add more`}
          </p>
          {canUploadMore && (
            <Button variant="outline" asChild>
              <label className="cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) => handleFiles(e.target.files)}
                  disabled={!canUploadMore}
                />
                Choose Files
              </label>
            </Button>
          )}
        </div>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-neutral-900">
            Uploaded Files ({files.length}/{remainingDisplay})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {files.map((fileData, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-start gap-4">
                  <img
                    src={fileData.preview || "/placeholder.svg"}
                    alt={fileData.file.name}
                    className="h-20 w-20 object-cover rounded border"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 truncate">{fileData.file.name}</p>
                    <p className="text-xs text-neutral-500">{(fileData.file.size / 1024 / 1024).toFixed(2)} MB</p>

                    <div className="mt-2">
                      {fileData.status === "pending" && (
                        <span className="text-xs text-neutral-600">Ready to upload</span>
                      )}
                      {fileData.status === "uploading" && (
                        <span className="flex items-center gap-2 text-xs text-blue-600">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Uploading...
                        </span>
                      )}
                      {fileData.status === "uploaded" && (
                        <span className="flex items-center gap-2 text-xs text-blue-600">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Creating record...
                        </span>
                      )}
                      {fileData.status === "processing" && (
                        <span className="flex items-center gap-2 text-xs text-blue-600">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Processing...
                        </span>
                      )}
                      {fileData.status === "ready_for_review" && (
                        <span className="flex items-center gap-2 text-xs text-green-600">
                          <CheckCircle2 className="h-3 w-3" />
                          Ready for review
                        </span>
                      )}
                      {fileData.status === "error_upload" && (
                        <div className="space-y-1">
                          <span className="flex items-center gap-2 text-xs text-red-600">
                            <AlertCircle className="h-3 w-3" />
                            {fileData.error || "Upload failed"}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 text-xs bg-transparent"
                            onClick={() => retryFile(index)}
                          >
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Retry
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {(fileData.status === "pending" || fileData.status === "error_upload") && (
                    <Button size="sm" variant="ghost" onClick={() => removeFile(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>

          <div className="flex gap-4">
            <Button onClick={handleUpload} disabled={isProcessing || allProcessed} className="flex-1">
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : allProcessed ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  All Uploaded
                </>
              ) : (
                <>Upload {files.filter((f) => f.status === "pending").length} Files</>
              )}
            </Button>

            {allProcessed && (
              <Button variant="default" onClick={() => router.push("/dashboard/imported-feedback/review")}>
                Review Extracted Feedback
              </Button>
            )}
          </div>

          {hasErrors && (
            <p className="text-sm text-red-600">
              Some files failed to upload. Click "Retry" to try again or remove them.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
