"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useState } from "react"
import { Copy, Check, Star } from "lucide-react"
import { IntimateAudioPlayer } from "@/components/intimate-audio-player"
import { ImportedFeedbackUploadCard } from "@/components/imported-feedback-upload-card"
import { extractSubmissionPhrases, calculatePhraseFrequencies, getTopPhrases } from "@/lib/extract-submission-phrases"
import { highlightQuote } from "@/lib/highlight-quote"
import { extractKeywordsFromText } from "@/lib/extract-keywords-from-text"
import { ShareKit } from "@/components/share-kit"

type DashboardClientProps = {
  profile: any
  confirmedCount: number
  pendingCount: number
  publicUrl: string | null
  collectionUrl: string | null
  contributions: any[]
}

export default function DashboardClient({
  profile,
  confirmedCount,
  pendingCount,
  publicUrl,
  collectionUrl,
  contributions,
}: DashboardClientProps) {
  const [copiedCollection, setCopiedCollection] = useState(false)
  const [copiedPublic, setCopiedPublic] = useState(false)
  const [copiedEmbed, setCopiedEmbed] = useState(false)
  const [togglingId, setTogglingId] = useState<string | null>(null)

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

  return (
    <>
      {/* Stats */}
      <div className="mb-12 grid grid-cols-1 md:grid-cols-4 gap-6">
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

      {publicUrl && (
        <div className="mb-12">
          <ShareKit publicUrl={publicUrl} plan={plan} />
        </div>
      )}

      {/* Phrase Summary Section */}
      {confirmedCount > 0 && topPhrases.length > 0 && (
        <Card className="mb-12 p-8 border-2 border-blue-100 bg-blue-50/20">
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">What people consistently say</h3>
          <p className="text-sm text-neutral-500 mb-4">Based on patterns across submissions</p>
          <div className="flex flex-wrap gap-2">
            {topPhrases.map((item, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100/50 text-blue-900 rounded-full text-sm font-medium"
              >
                {item.phrase}
                <span className="text-xs text-blue-700">×{item.count}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Collection & Public Links */}
      <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <Button onClick={handleCopyCollection} className="w-full" variant="default">
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
            </div>
          ) : (
            <p className="text-sm text-amber-600">Set up your username in settings to get your collection link</p>
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
            <p className="text-sm text-amber-600">Set up your username in settings</p>
          )}
        </Card>
      </div>

      {plan === "premier" && publicUrl && (
        <Card className="p-6 mb-12 border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
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
      )}

      {/* Contributions List */}
      <div>
        <h2 className="mb-6 text-2xl font-semibold text-neutral-900">Your Perspectives</h2>

        <div className="mb-8">
          <ImportedFeedbackUploadCard />
        </div>

        {contributions.length > 0 ? (
          <div className="space-y-4">
            {contributions.map((contribution) => {
              const isFeatured = contribution.is_featured
              const submissionPhrases = extractSubmissionPhrases(contribution)

              return (
                <Card
                  key={contribution.id}
                  className={`p-6 ${isFeatured ? "border-2 border-blue-300 bg-blue-50/40" : ""}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      {isFeatured && (
                        <Badge variant="default" className="bg-blue-600">
                          <Star className="mr-1 h-3 w-3 fill-current" />
                          Featured
                        </Badge>
                      )}
                    </div>

                    <Button
                      size="sm"
                      variant={isFeatured ? "outline" : "default"}
                      onClick={() => handleToggleFeatured(contribution.id, isFeatured)}
                      disabled={togglingId === contribution.id || (!isFeatured && !canAddMoreFeatured)}
                    >
                      {togglingId === contribution.id ? (
                        "..."
                      ) : isFeatured ? (
                        <>
                          <Star className="mr-1 h-3 w-3 fill-current" />
                          Unfeature
                        </>
                      ) : (
                        <>
                          <Star className="mr-1 h-3 w-3" />
                          Feature
                        </>
                      )}
                    </Button>
                  </div>

                  {contribution.voice_url && (
                    <div className="mb-4 pb-4 border-b border-neutral-200">
                      <IntimateAudioPlayer audioUrl={contribution.voice_url} />
                    </div>
                  )}

                  {(() => {
                    const allTraits = [
                      ...(contribution.traits_category1 || []),
                      ...(contribution.traits_category2 || []),
                      ...(contribution.traits_category3 || []),
                      ...(contribution.traits_category4 || []),
                    ]
                    const keywords = extractKeywordsFromText(contribution.written_note, allTraits)
                    const highlightedText = highlightQuote(contribution.written_note, keywords, 4)

                    return <p className="mb-4 text-base leading-relaxed text-neutral-900">{highlightedText}</p>
                  })()}

                  {/* Phrase Highlights */}
                  {submissionPhrases.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {submissionPhrases.map((phrase, idx) => {
                        const frequency = phraseFrequencies.get(phrase) || 1
                        return (
                          <div
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 text-neutral-700 rounded-md text-sm"
                          >
                            <span className="font-medium">{phrase}</span>
                            {frequency > 1 && <span className="text-xs text-neutral-500">×{frequency}</span>}
                          </div>
                        )
                      })}
                    </div>
                  )}

                  <div className="border-t pt-4 text-sm text-neutral-600">
                    <div className="font-medium text-neutral-900">{contribution.contributor_name}</div>
                    <div>
                      {contribution.relationship} · {contribution.contributor_company}
                    </div>
                    {contribution.contributor_email && (
                      <div className="text-xs text-neutral-500 mt-1">{contribution.contributor_email}</div>
                    )}
                  </div>

                  {!isFeatured && !canAddMoreFeatured && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-900">
                        You've reached your {featuredLimit} featured perspective limit.{" "}
                        <Link href="/pricing" className="font-medium underline">
                          Upgrade to {plan === "free" ? "Starter" : "Premier"}
                        </Link>{" "}
                        to feature more.
                      </p>
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="mb-4 text-neutral-600">No perspectives yet</p>
            <p className="text-sm text-neutral-500">
              Share your collection link to start gathering feedback from colleagues
            </p>
          </Card>
        )}
      </div>
    </>
  )
}
