"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useState } from "react"
import { Copy, Check, Star, ExternalLink, Upload, FileSearch, ImageIcon, Mic, MessageSquare } from "lucide-react"
import { IntimateAudioPlayer } from "@/components/intimate-audio-player"
import { extractSubmissionPhrases, calculatePhraseFrequencies, getTopPhrases } from "@/lib/extract-submission-phrases"
import { highlightQuote } from "@/lib/highlight-quote"
import { extractKeywordsFromText } from "@/lib/extract-keywords-from-text"
import { ShareKit } from "@/components/share-kit"
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

  const plan = profile.plan || "free"
  const featuredLimit = plan === "free" ? 1 : plan === "starter" ? 3 : Number.POSITIVE_INFINITY
  const featuredCount = contributions.filter((c) => c.is_featured).length
  const canAddMoreFeatured = featuredCount < featuredLimit

  const confirmedContributions = contributions
  const phraseFrequencies = calculatePhraseFrequencies(confirmedContributions)
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

  const latestImportedItems = importedFeedback.filter((f) => f.extraction_status === "completed").slice(0, 6)

  return (
    <>
      <UsernameOnboardingModal
        isOpen={showOnboarding}
        onComplete={() => setShowOnboarding(false)}
        userEmail={profile.email || ""}
      />

      <div className="space-y-10">
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

        {/* Stats row */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-6">
              <div className="mb-2 text-3xl font-bold text-neutral-900">{confirmedCount}</div>
              <div className="text-sm font-medium text-neutral-600">Total Perspectives</div>
            </Card>
            <Card className="p-6">
              <div className="mb-2 text-3xl font-bold text-amber-600">{pendingCount}</div>
              <div className="text-sm font-medium text-neutral-600">Pending (if any)</div>
            </Card>
            <Card className="p-6 border-2 border-blue-200 bg-blue-50/30">
              <div className="mb-2 text-3xl font-bold text-blue-900">{featuredCount}</div>
              <div className="text-sm font-medium text-neutral-600">
                Featured ({featuredLimit === Number.POSITIVE_INFINITY ? "∞" : featuredLimit} max)
              </div>
            </Card>
            <Card className="p-6">
              <div className="mb-2 text-lg font-bold text-neutral-900 capitalize">{plan}</div>
              <div className="text-sm font-medium text-neutral-600">Current Plan</div>
              {plan === "free" && (
                <Button size="sm" variant="link" className="mt-2 p-0 h-auto text-blue-600" asChild>
                  <Link href="/pricing">Upgrade</Link>
                </Button>
              )}
            </Card>
          </div>
        </section>

        {/* Share Kit section */}
        {publicUrl && (
          <section>
            <ShareKit publicUrl={publicUrl} plan={plan} />
          </section>
        )}

        {/* Phrase Summary Section */}
        {confirmedCount > 0 && topPhrases.length > 0 && (
          <section>
            <Card className="p-8 border-2 border-blue-100 bg-blue-50/20">
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">What people consistently say</h3>
              <p className="text-sm text-neutral-500 mb-4">Based on patterns across submissions</p>
              <div className="flex flex-wrap gap-2">
                {topPhrases.map((item, idx) => (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100/50 text-blue-900 rounded-full text-sm font-medium"
                  >
                    {item.phrase}
                    <span className="text-xs text-blue-700">x{item.count}</span>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        )}

        {/* Collection & Public Links */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="mb-2 text-xl font-semibold text-neutral-900">Collection Link</h3>
              <p className="mb-4 text-sm text-neutral-600">Share this to collect perspectives from colleagues</p>
              {collectionUrl ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={collectionUrl}
                    readOnly
                    className="w-full rounded-lg border px-3 py-2 text-sm bg-neutral-100"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleCopyCollection} className="flex-1" variant="default">
                      {copiedCollection ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Link
                        </>
                      )}
                    </Button>
                    <Button variant="outline" asChild>
                      <a href={collectionUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-neutral-700">Set a username to activate your collection link.</p>
                  <Button variant="default" onClick={() => setShowOnboarding(true)} className="w-full">
                    Set username
                  </Button>
                </div>
              )}
            </Card>

            <Card className="p-6">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-neutral-900">Public Nomee Page</h3>
                <Badge variant="default" className="bg-green-600">
                  Public
                </Badge>
              </div>
              <p className="mb-4 text-sm text-neutral-600">Your public page showing featured perspectives</p>
              {publicUrl ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={publicUrl}
                    readOnly
                    className="w-full rounded-lg border px-3 py-2 text-sm bg-neutral-100"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleCopyPublic} className="flex-1 bg-transparent" variant="outline">
                      {copiedPublic ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy
                        </>
                      )}
                    </Button>
                    <Button className="flex-1" variant="default" asChild>
                      <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                        View Page
                      </a>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-neutral-700">Set a username to activate your public page.</p>
                  <Button variant="default" asChild className="w-full">
                    <Link href="/dashboard/settings">Set username</Link>
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </section>

        {/* Premier Embed Code */}
        {plan === "premier" && publicUrl && (
          <section>
            <Card className="p-6 border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
              <div className="mb-2 flex items-center gap-2">
                <h3 className="text-xl font-semibold text-neutral-900">Premier Embed Code</h3>
                <Badge variant="default" className="bg-purple-600">
                  Premier Only
                </Badge>
              </div>
              <p className="mb-4 text-sm text-neutral-600">Embed your Nomee on your personal website or portfolio</p>
              <div className="space-y-3">
                <textarea
                  value={`<iframe src="${publicUrl}/embed" width="100%" height="600" frameborder="0" allowtransparency="true"></iframe>`}
                  readOnly
                  rows={3}
                  className="w-full rounded-lg border px-3 py-2 text-xs bg-white font-mono"
                />
                <Button onClick={handleCopyEmbed} className="w-full" variant="default">
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

        <section>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">Nomee Contributions</h2>
            <p className="text-sm text-neutral-600 mt-1">
              Voice and direct submissions collected through your Nomee link
            </p>
          </div>

          {contributions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {contributions.map((contribution) => {
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
                    className={`p-5 flex flex-col h-full ${isFeatured ? "border-2 border-blue-300 bg-blue-50/40" : ""}`}
                  >
                    {/* Top row: type icon + feature button */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {contribution.voice_url ? (
                          <div className="p-1.5 rounded-md bg-purple-100">
                            <Mic className="h-4 w-4 text-purple-600" />
                          </div>
                        ) : (
                          <div className="p-1.5 rounded-md bg-neutral-100">
                            <MessageSquare className="h-4 w-4 text-neutral-600" />
                          </div>
                        )}
                        {isFeatured && (
                          <Badge variant="default" className="bg-blue-600 text-xs">
                            <Star className="mr-1 h-3 w-3 fill-current" />
                            Featured
                          </Badge>
                        )}
                      </div>

                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 px-2"
                        onClick={() => handleToggleFeatured(contribution.id, isFeatured)}
                        disabled={togglingId === contribution.id || (!isFeatured && !canAddMoreFeatured)}
                      >
                        {togglingId === contribution.id ? (
                          "..."
                        ) : (
                          <Star
                            className={`h-4 w-4 ${isFeatured ? "fill-blue-600 text-blue-600" : "text-neutral-400"}`}
                          />
                        )}
                      </Button>
                    </div>

                    {/* Voice player (compact) */}
                    {contribution.voice_url && (
                      <div className="mb-3 pb-3 border-b border-neutral-200">
                        <IntimateAudioPlayer audioUrl={contribution.voice_url} />
                      </div>
                    )}

                    {/* Excerpt (clamped) */}
                    <div className="flex-1 mb-3">
                      <p className="text-sm leading-relaxed text-neutral-800 line-clamp-4">{highlightedText}</p>
                    </div>

                    {/* Traits pills */}
                    {submissionPhrases.length > 0 && (
                      <div className="mb-3 flex flex-wrap gap-1.5">
                        {submissionPhrases.map((phrase, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded text-xs font-medium"
                          >
                            {phrase}
                          </span>
                        ))}
                        {extractSubmissionPhrases(contribution).length > 3 && (
                          <span className="px-2 py-0.5 bg-neutral-50 text-neutral-500 rounded text-xs">
                            +{extractSubmissionPhrases(contribution).length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Bottom: contributor info */}
                    <div className="pt-3 border-t border-neutral-100 text-xs text-neutral-600">
                      <div className="font-medium text-neutral-900 truncate">{contribution.contributor_name}</div>
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
            <Card className="p-12 text-center">
              <p className="mb-4 text-neutral-600">No contributions yet</p>
              <p className="text-sm text-neutral-500 mb-6">
                Share your collection link to start gathering feedback from colleagues
              </p>
              {collectionUrl && (
                <Button onClick={handleCopyCollection} variant="default">
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Collection Link
                </Button>
              )}
            </Card>
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

        <section className="pt-6 border-t-2 border-neutral-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900">Imported Feedback</h2>
              <p className="text-sm text-neutral-600 mt-1">Uploaded screenshots from LinkedIn or other sources</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild>
                <Link href="/dashboard/imported-feedback/upload">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Screenshots
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard/imported-feedback/review">
                  <FileSearch className="mr-2 h-4 w-4" />
                  Review Imports
                </Link>
              </Button>
            </div>
          </div>

          {/* Status chips */}
          {(importedStats.pending > 0 ||
            importedStats.approved > 0 ||
            importedStats.failed > 0 ||
            importedStats.processing > 0) && (
            <div className="flex flex-wrap gap-2 mb-6">
              {importedStats.pending > 0 && (
                <Badge variant="outline" className="border-amber-300 text-amber-700 bg-amber-50">
                  {importedStats.pending} Pending Review
                </Badge>
              )}
              {importedStats.approved > 0 && (
                <Badge variant="outline" className="border-green-300 text-green-700 bg-green-50">
                  {importedStats.approved} Approved
                </Badge>
              )}
              {importedStats.failed > 0 && (
                <Badge variant="outline" className="border-red-300 text-red-700 bg-red-50">
                  {importedStats.failed} Failed
                </Badge>
              )}
              {importedStats.processing > 0 && (
                <Badge variant="outline" className="border-blue-300 text-blue-700 bg-blue-50">
                  {importedStats.processing} Processing
                </Badge>
              )}
            </div>
          )}

          {/* Imported items grid */}
          {latestImportedItems.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {latestImportedItems.map((item) => (
                  <Card key={item.id} className="p-4 flex flex-col h-full">
                    <div className="flex items-start gap-3 mb-3">
                      {/* Thumbnail */}
                      <div className="flex-shrink-0 w-14 h-14 bg-neutral-100 rounded-lg overflow-hidden">
                        {item.raw_image_url ? (
                          <img
                            src={item.raw_image_url || "/placeholder.svg"}
                            alt="Screenshot"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="h-5 w-5 text-neutral-400" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-medium text-sm text-neutral-900 truncate">
                            {item.giver_name || "Unknown"}
                          </span>
                          {item.approved_by_owner ? (
                            <Badge
                              variant="outline"
                              className="border-green-300 text-green-700 bg-green-50 text-xs px-1.5 py-0"
                            >
                              Approved
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="border-amber-300 text-amber-700 bg-amber-50 text-xs px-1.5 py-0"
                            >
                              Pending
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-neutral-600 truncate">
                          {item.giver_company || item.giver_role || "No details"}
                        </div>
                      </div>
                    </div>

                    {/* Excerpt */}
                    {item.ai_extracted_excerpt && (
                      <p className="text-xs text-neutral-600 line-clamp-2 flex-1 mb-3">"{item.ai_extracted_excerpt}"</p>
                    )}

                    {/* Review button */}
                    <Button variant="outline" size="sm" className="w-full mt-auto bg-transparent" asChild>
                      <Link href="/dashboard/imported-feedback/review">Review</Link>
                    </Button>
                  </Card>
                ))}
              </div>

              {importedFeedback.length > 6 && (
                <div className="text-center pt-4">
                  <Button variant="link" asChild className="text-neutral-600">
                    <Link href="/dashboard/imported-feedback/review">
                      View all {importedFeedback.length} imported items
                    </Link>
                  </Button>
                </div>
              )}
            </>
          ) : (
            <Card className="p-8 text-center border-2 border-dashed border-neutral-300 bg-neutral-50/50">
              <div className="rounded-full bg-blue-100 p-3 w-fit mx-auto mb-4">
                <Upload className="h-6 w-6 text-blue-600" />
              </div>
              <p className="mb-2 text-neutral-700 font-medium">No imported feedback yet</p>
              <p className="text-sm text-neutral-500 mb-4">
                Upload screenshots from LinkedIn, emails, or reviews to extract and showcase past praise
              </p>
              <Button asChild>
                <Link href="/dashboard/imported-feedback/upload">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Screenshots
                </Link>
              </Button>
            </Card>
          )}
        </section>
      </div>
    </>
  )
}
