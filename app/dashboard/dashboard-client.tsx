"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useState } from "react"
import { Copy, Check, Star, Upload, FileSearch, ImageIcon, Mic, MessageSquare, Eye } from "lucide-react"
import { IntimateAudioPlayer } from "@/components/intimate-audio-player"
import { extractSubmissionPhrases, getTopPhrases } from "@/lib/extract-submission-phrases"
import { highlightQuote } from "@/lib/highlight-quote"
import { extractKeywordsFromText } from "@/lib/extract-keywords-from-text"
import { UsernameOnboardingModal } from "@/components/username-onboarding-modal"

type DashboardClientProps = {
  profile: any
  confirmedCount: number
  pendingCount: number
  publicUrl: string | null
  collectionUrl: string | null
  contributions: any[]
  importedFeedback: any[]
  importedStats: {
    pending: number
    approved: number
    failed: number
    processing: number
  }
}

type FilterType = "all" | "nomee" | "imported"

export default function DashboardClient({
  profile,
  confirmedCount,
  pendingCount,
  publicUrl,
  collectionUrl,
  contributions,
  importedFeedback,
  importedStats,
}: DashboardClientProps) {
  const [copiedCollection, setCopiedCollection] = useState(false)
  const [copiedPublic, setCopiedPublic] = useState(false)
  const [copiedEmbed, setCopiedEmbed] = useState(false)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [showOnboarding, setShowOnboarding] = useState(!profile.slug)
  const [activeFilter, setActiveFilter] = useState<FilterType>("all")

  const plan = profile.plan || "free"
  const featuredLimit = plan === "free" ? 1 : plan === "starter" ? 3 : Number.POSITIVE_INFINITY
  const featuredCount = contributions.filter((c) => c.is_featured).length
  const canAddMoreFeatured = featuredCount < featuredLimit

  const confirmedContributions = contributions
  const topPhrases = getTopPhrases(confirmedContributions)

  const handleCopyCollection = async () => {
    if (!collectionUrl) return
    await navigator.clipboard.writeText(collectionUrl)
    setCopiedCollection(true)
    setTimeout(() => setCopiedCollection(false), 2000)
  }

  const handleCopyPublic = async () => {
    if (!publicUrl) return
    await navigator.clipboard.writeText(publicUrl)
    setCopiedPublic(true)
    setTimeout(() => setCopiedPublic(false), 2000)
  }

  const handleCopyEmbed = async () => {
    if (!publicUrl) return
    const embedCode = `<iframe src="${publicUrl}/embed" width="100%" height="600" frameborder="0" allowtransparency="true"></iframe>`
    await navigator.clipboard.writeText(embedCode)
    setCopiedEmbed(true)
    setTimeout(() => setCopiedEmbed(false), 2000)
  }

  const handleToggleFeatured = async (contributionId: string, currentlyFeatured: boolean) => {
    setTogglingId(contributionId)

    try {
      const response = await fetch("/api/contributions/toggle-featured", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contributionId,
          isFeatured: !currentlyFeatured,
        }),
      })

      if (response.ok) {
        window.location.reload()
      } else {
        const data = await response.json()
        alert(data.error || "Failed to update featured status")
      }
    } catch (error) {
      alert("Failed to update featured status")
    } finally {
      setTogglingId(null)
    }
  }

  const approvedImportedItems = importedFeedback.filter(
    (f) => f.approved_by_owner && f.extraction_status === "completed",
  )

  const showNomeeSection = activeFilter === "all" || activeFilter === "nomee"
  const showImportedSection = activeFilter === "all" || activeFilter === "imported"

  return (
    <>
      <UsernameOnboardingModal
        isOpen={showOnboarding}
        onComplete={() => setShowOnboarding(false)}
        userEmail={profile.email || ""}
      />

      <div className="space-y-8">
        {/* Username claim card */}
        {!profile.slug && (
          <Card className="p-6 border-2 border-blue-200 bg-blue-50/40">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Claim your Nomee link</h3>
                <p className="text-sm text-neutral-700 mb-4">
                  Set a username to unlock your collection link and public Nomee page.
                </p>
                <Button onClick={() => setShowOnboarding(true)}>Set username</Button>
              </div>
            </div>
          </Card>
        )}

        {/* Stats row - tighter spacing */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className="p-4">
              <div className="mb-1 text-2xl font-bold text-neutral-900">{confirmedCount}</div>
              <div className="text-xs font-medium text-neutral-600">Total Perspectives</div>
            </Card>
            <Card className="p-4">
              <div className="mb-1 text-2xl font-bold text-amber-600">{pendingCount}</div>
              <div className="text-xs font-medium text-neutral-600">Pending (if any)</div>
            </Card>
            <Card className="p-4 border-2 border-blue-200 bg-blue-50/30">
              <div className="mb-1 text-2xl font-bold text-blue-900">{featuredCount}</div>
              <div className="text-xs font-medium text-neutral-600">
                Featured ({featuredLimit === Number.POSITIVE_INFINITY ? "∞" : featuredLimit} max)
              </div>
            </Card>
            <Card className="p-4">
              <div className="mb-1 text-lg font-bold text-neutral-900 capitalize">{plan}</div>
              <div className="text-xs font-medium text-neutral-600">Current Plan</div>
              {plan === "free" && (
                <Button size="sm" variant="link" className="mt-1 p-0 h-auto text-blue-600 text-xs" asChild>
                  <Link href="/pricing">Upgrade</Link>
                </Button>
              )}
            </Card>
          </div>
        </section>

        <section>
          <div className="flex flex-wrap gap-3">
            {publicUrl && (
              <Button asChild>
                <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                  <Eye className="mr-2 h-4 w-4" />
                  View Public Page
                </a>
              </Button>
            )}
            {collectionUrl && (
              <Button variant="outline" onClick={handleCopyCollection}>
                {copiedCollection ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Collection Link
                  </>
                )}
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link href="/dashboard/imported-feedback/upload">
                <Upload className="mr-2 h-4 w-4" />
                Import Screenshots
              </Link>
            </Button>
            {importedStats.pending > 0 ? (
              <Button variant="ghost" className="border border-neutral-200" asChild>
                <Link href="/dashboard/imported-feedback/review">
                  <FileSearch className="mr-2 h-4 w-4" />
                  Review Imports
                  <Badge className="ml-2 bg-amber-500 text-white text-xs px-1.5 py-0">{importedStats.pending}</Badge>
                </Link>
              </Button>
            ) : (
              <Button variant="ghost" className="border border-neutral-200" asChild>
                <Link href="/dashboard/imported-feedback/review">
                  <FileSearch className="mr-2 h-4 w-4" />
                  Review Imports
                </Link>
              </Button>
            )}
          </div>
        </section>

        {/* Phrase Summary Section */}
        {confirmedCount > 0 && topPhrases.length > 0 && (
          <section>
            <Card className="p-6 border-2 border-blue-100 bg-blue-50/20">
              <h3 className="text-base font-semibold text-neutral-900 mb-1">What people consistently say</h3>
              <p className="text-xs text-neutral-500 mb-3">Based on patterns across submissions</p>
              <div className="flex flex-wrap gap-2">
                {topPhrases.map((item, idx) => (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100/50 text-blue-900 rounded-full text-sm font-medium"
                  >
                    {item.phrase}
                    <span className="text-xs text-blue-700">x{item.count}</span>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        )}

        <section>
          <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg w-fit">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeFilter === "all"
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter("nomee")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeFilter === "nomee"
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              Nomee Submissions
            </button>
            <button
              onClick={() => setActiveFilter("imported")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeFilter === "imported"
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              Imported
            </button>
          </div>
        </section>

        {showNomeeSection && (
          <section>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-neutral-900">Nomee Contributions</h2>
              <p className="text-sm text-neutral-500">
                Real people, real perspective — submitted directly to your Nomee.
              </p>
            </div>

            {contributions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {contributions.slice(0, 9).map((contribution) => {
                  const isFeatured = contribution.is_featured
                  const submissionPhrases = extractSubmissionPhrases(contribution).slice(0, 3)
                  const allTraits = [
                    ...(contribution.traits_category1 || []),
                    ...(contribution.traits_category2 || []),
                    ...(contribution.traits_category3 || []),
                    ...(contribution.traits_category4 || []),
                  ]
                  const keywords = extractKeywordsFromText(contribution.written_note, allTraits)
                  const highlightedText = highlightQuote(contribution.written_note, keywords, 4)

                  return (
                    <Card
                      key={contribution.id}
                      className={`p-4 flex flex-col h-full bg-white shadow-sm ${
                        isFeatured ? "ring-2 ring-blue-300 bg-blue-50/30" : ""
                      }`}
                    >
                      {/* Top row: badge + feature button */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs border-neutral-300 text-neutral-600 bg-white">
                            {contribution.voice_url ? (
                              <Mic className="mr-1 h-3 w-3" />
                            ) : (
                              <MessageSquare className="mr-1 h-3 w-3" />
                            )}
                            Nomee Submission
                          </Badge>
                          {isFeatured && (
                            <Badge className="bg-blue-600 text-xs px-1.5">
                              <Star className="mr-0.5 h-3 w-3 fill-current" />
                              Featured
                            </Badge>
                          )}
                        </div>

                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0"
                          onClick={() => handleToggleFeatured(contribution.id, isFeatured)}
                          disabled={togglingId === contribution.id || (!isFeatured && !canAddMoreFeatured)}
                          title={isFeatured ? "Remove from featured" : "Add to featured"}
                        >
                          {togglingId === contribution.id ? (
                            "..."
                          ) : (
                            <Star
                              className={`h-4 w-4 ${isFeatured ? "fill-blue-600 text-blue-600" : "text-neutral-300 hover:text-neutral-500"}`}
                            />
                          )}
                        </Button>
                      </div>

                      {/* Voice player as hero element */}
                      {contribution.voice_url && (
                        <div className="mb-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                          <IntimateAudioPlayer audioUrl={contribution.voice_url} />
                        </div>
                      )}

                      {/* Excerpt - quote style for text submissions */}
                      <div className="flex-1 mb-3">
                        {contribution.voice_url ? (
                          <p className="text-sm leading-relaxed text-neutral-700 line-clamp-3">{highlightedText}</p>
                        ) : (
                          <blockquote className="text-sm leading-relaxed text-neutral-700 line-clamp-4 border-l-2 border-neutral-300 pl-3 italic">
                            {highlightedText}
                          </blockquote>
                        )}
                      </div>

                      {/* Traits pills - max 2 lines with truncation */}
                      {submissionPhrases.length > 0 && (
                        <div className="mb-3 flex flex-wrap gap-1 max-h-14 overflow-hidden">
                          {submissionPhrases.map((phrase, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded text-xs font-medium"
                            >
                              {phrase}
                            </span>
                          ))}
                          {extractSubmissionPhrases(contribution).length > 3 && (
                            <span className="px-2 py-0.5 bg-neutral-50 text-neutral-400 rounded text-xs">
                              +{extractSubmissionPhrases(contribution).length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Bottom: contributor info */}
                      <div className="pt-2 border-t border-neutral-100 text-xs text-neutral-500">
                        <div className="font-medium text-neutral-800 truncate">{contribution.contributor_name}</div>
                        <div className="truncate">
                          {contribution.relationship}
                          {contribution.contributor_company && contribution.contributor_company !== "Unknown" && (
                            <span> · {contribution.contributor_company}</span>
                          )}
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <Card className="p-8 text-center bg-white">
                <p className="mb-2 text-neutral-700 font-medium">No contributions yet</p>
                <p className="text-sm text-neutral-500 mb-4">
                  Share your collection link to start gathering feedback from colleagues
                </p>
                {collectionUrl && (
                  <Button onClick={handleCopyCollection} variant="outline">
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Collection Link
                  </Button>
                )}
              </Card>
            )}

            {/* View all link */}
            {contributions.length > 9 && (
              <div className="text-center pt-3">
                <Button variant="link" className="text-neutral-600 text-sm">
                  View all {contributions.length} contributions
                </Button>
              </div>
            )}

            {/* Upsell notice */}
            {!canAddMoreFeatured && contributions.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
                <p className="text-sm text-blue-900">
                  You've reached your {featuredLimit} featured perspective limit.{" "}
                  <Link href="/pricing" className="font-medium underline">
                    Upgrade to {plan === "free" ? "Starter" : "Premier"}
                  </Link>{" "}
                  to feature more.
                </p>
              </div>
            )}
          </section>
        )}

        {showImportedSection && (
          <section className="pt-6 border-t border-neutral-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">Imported Feedback</h2>
                <p className="text-sm text-neutral-500">Pulled from screenshots. Review and publish the best parts.</p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                {importedStats.pending > 0 && (
                  <span className="px-2 py-1 bg-amber-50 text-amber-700 rounded-full font-medium">
                    {importedStats.pending} pending
                  </span>
                )}
                {importedStats.approved > 0 && (
                  <span className="px-2 py-1 bg-green-50 text-green-700 rounded-full font-medium">
                    {importedStats.approved} approved
                  </span>
                )}
              </div>
            </div>

            {/* Approved imported items grid */}
            {approvedImportedItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {approvedImportedItems.slice(0, 9).map((item) => (
                  <Card
                    key={item.id}
                    className="p-4 flex flex-col h-full bg-gradient-to-br from-slate-50 to-neutral-50 border-slate-200"
                  >
                    {/* Top row: badge with source */}
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="text-xs border-slate-300 text-slate-600 bg-white">
                        <ImageIcon className="mr-1 h-3 w-3" />
                        Imported
                      </Badge>
                      {item.source_type && (
                        <Badge className="text-xs bg-slate-200 text-slate-700 font-normal">{item.source_type}</Badge>
                      )}
                      <Badge className="ml-auto text-xs bg-green-100 text-green-700 border-0">Approved</Badge>
                    </div>

                    {/* Content row with thumbnail */}
                    <div className="flex gap-3 flex-1 mb-3">
                      {/* Thumbnail */}
                      <div className="flex-shrink-0 w-16 h-16 bg-white rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                        {item.raw_image_url ? (
                          <img
                            src={item.raw_image_url || "/placeholder.svg"}
                            alt="Screenshot"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="h-5 w-5 text-slate-300" />
                          </div>
                        )}
                      </div>

                      {/* Excerpt */}
                      <div className="flex-1 min-w-0">
                        {item.ai_extracted_excerpt && (
                          <p className="text-sm text-neutral-700 line-clamp-3 leading-relaxed">
                            "{item.ai_extracted_excerpt}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Confidence meter (compact) */}
                    {item.confidence_score && (
                      <div className="mb-3 flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${Math.round(item.confidence_score * 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500">{Math.round(item.confidence_score * 100)}%</span>
                      </div>
                    )}

                    {/* Bottom: giver info */}
                    <div className="pt-2 border-t border-slate-200 text-xs text-slate-500">
                      <div className="font-medium text-slate-800 truncate">{item.giver_name || "Unknown"}</div>
                      <div className="truncate">
                        {item.giver_role || ""}
                        {item.giver_company && <span> · {item.giver_company}</span>}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center bg-gradient-to-br from-slate-50 to-neutral-50 border-slate-200">
                <div className="rounded-full bg-slate-100 p-3 w-fit mx-auto mb-4">
                  <Upload className="h-5 w-5 text-slate-500" />
                </div>
                <p className="mb-1 text-neutral-800 font-medium">Bring your past praise in</p>
                <p className="text-sm text-neutral-500 mb-4 max-w-md mx-auto">
                  Upload a LinkedIn recommendation screenshot and we'll extract the quote, giver, and traits.
                </p>
                <Button asChild>
                  <Link href="/dashboard/imported-feedback/upload">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Screenshots
                  </Link>
                </Button>
              </Card>
            )}

            {/* View all link */}
            {approvedImportedItems.length > 9 && (
              <div className="text-center pt-3">
                <Button variant="link" asChild className="text-neutral-600 text-sm">
                  <Link href="/dashboard/imported-feedback/review">
                    View all {approvedImportedItems.length} imported items
                  </Link>
                </Button>
              </div>
            )}
          </section>
        )}

        {/* Premier Embed Code */}
        {plan === "premier" && publicUrl && (
          <section>
            <Card className="p-6 border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
              <div className="mb-2 flex items-center gap-2">
                <h3 className="text-lg font-semibold text-neutral-900">Premier Embed Code</h3>
                <Badge className="bg-purple-600">Premier Only</Badge>
              </div>
              <p className="mb-4 text-sm text-neutral-600">Embed your Nomee on your personal website or portfolio</p>
              <div className="space-y-3">
                <textarea
                  value={`<iframe src="${publicUrl}/embed" width="100%" height="600" frameborder="0" allowtransparency="true"></iframe>`}
                  readOnly
                  rows={3}
                  className="w-full rounded-lg border px-3 py-2 text-xs bg-white font-mono"
                />
                <Button onClick={handleCopyEmbed} className="w-full">
                  {copiedEmbed ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Embed Code
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </section>
        )}
      </div>
    </>
  )
}
