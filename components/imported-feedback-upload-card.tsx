"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Info } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export function ImportedFeedbackUploadCard() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="p-6 border-2 border-dashed border-neutral-300 bg-neutral-50/50">
      <div className="flex items-start gap-4">
        <div className="rounded-full bg-blue-100 p-3">
          <Upload className="h-6 w-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="mb-2 text-xl font-semibold text-neutral-900">Import Previous Feedback</h3>
          <p className="mb-3 text-sm text-neutral-600">
            Upload screenshots from emails, DMs, or reviews. We'll extract the praise and highlight patterns.
          </p>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mb-4 flex items-center gap-2 text-xs text-neutral-500 hover:text-neutral-700 transition-colors"
          >
            <Info className="h-3 w-3" />
            {isExpanded ? "Hide details" : "How does this work?"}
          </button>

          {isExpanded && (
            <div className="mb-4 p-4 bg-white border border-neutral-200 rounded-lg space-y-2">
              <p className="text-xs text-neutral-600">
                <span className="font-semibold text-neutral-900">Clear labeling:</span> Imported feedback is labeled as
                "Uploaded by profile owner" and appears separately from verified Nomees.
              </p>
              <p className="text-xs text-neutral-600">
                <span className="font-semibold text-neutral-900">AI extraction:</span> We extract verbatim praise and
                identify patterns, but you approve everything before it goes live.
              </p>
              <p className="text-xs text-neutral-600">
                <span className="font-semibold text-neutral-900">Not a replacement:</span> New Nomees are still
                submitted directly by contributors for full verification.
              </p>
            </div>
          )}

          <Button asChild className="w-full sm:w-auto">
            <Link href="/dashboard/imported-feedback/upload">
              <Upload className="mr-2 h-4 w-4" />
              Upload Screenshots
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  )
}
