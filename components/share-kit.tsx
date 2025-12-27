"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Check, Lock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

type ShareKitProps = {
  publicUrl: string
  plan: string
}

export function ShareKit({ publicUrl, plan }: ShareKitProps) {
  const [activeTab, setActiveTab] = useState("resume")
  const [websiteMode, setWebsiteMode] = useState<"link" | "embeds">("link")
  const [copied, setCopied] = useState(false)

  const isPro = plan === "starter" || plan === "premier"

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const tabs = [
    { id: "resume", label: "Resume", free: true },
    { id: "linkedin", label: "LinkedIn", free: true },
    { id: "link-in-bio", label: "Link in bio", free: true },
    { id: "website", label: "Website", free: true },
    { id: "email", label: "Email signature", free: true },
  ]

  return (
    <Card className="p-6 border-2 border-slate-200">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-slate-900">Share Kit</h3>
        <p className="text-sm text-slate-600 mt-1">Use your Nomee anywhere to show what it's like to work with you</p>
        <p className="text-xs text-slate-500 mt-2">
          Sharing your Nomee link is free. Embeds + extra proof tools are Pro.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === "resume" && (
          <div className="space-y-3">
            <p className="text-sm text-slate-600">Add your Nomee as a clean proof link on your resume.</p>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <p className="text-sm font-mono text-slate-700">What it's like to work with me: {publicUrl}</p>
            </div>
            <Button onClick={() => handleCopy(publicUrl)} variant="default" className="w-full">
              {copied ? (
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
        )}

        {activeTab === "linkedin" && (
          <div className="space-y-3">
            <p className="text-sm text-slate-600">Add your Nomee link to your LinkedIn profile or About section.</p>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <p className="text-sm font-mono text-slate-700">See what it's like to work with me: {publicUrl}</p>
            </div>
            <Button onClick={() => handleCopy(publicUrl)} variant="default" className="w-full">
              {copied ? (
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
        )}

        {activeTab === "link-in-bio" && (
          <div className="space-y-3">
            <p className="text-sm text-slate-600">Perfect for Instagram, TikTok, or any link-in-bio tool.</p>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <p className="text-sm font-mono text-slate-700">{publicUrl}</p>
            </div>
            <Button onClick={() => handleCopy(publicUrl)} variant="default" className="w-full">
              {copied ? (
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
        )}

        {activeTab === "website" && (
          <div className="space-y-4">
            <div className="inline-flex bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setWebsiteMode("link")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  websiteMode === "link" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Link (Free)
              </button>
              <button
                onClick={() => setWebsiteMode("embeds")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  websiteMode === "embeds" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Embeds (Pro)
              </button>
            </div>

            {websiteMode === "link" ? (
              <div className="space-y-3">
                <p className="text-sm text-slate-600">Add as a clean proof link on your site.</p>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <p className="text-sm font-mono text-slate-700">What it's like to work with me: {publicUrl}</p>
                </div>
                <Button onClick={() => handleCopy(publicUrl)} variant="default" className="w-full">
                  {copied ? (
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
              <div className="space-y-3">
                <p className="text-sm text-slate-600 mb-4">Embed live quotes or traits directly on your website.</p>

                {/* Embed Quotes Option */}
                <div
                  className={`border rounded-lg p-4 ${
                    isPro ? "border-slate-200 bg-white" : "border-slate-200 bg-slate-50 opacity-60"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                        Embed Quotes
                        {!isPro && <Lock className="h-3 w-3 text-slate-400" />}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1">Show rotating quotes from your Nomee</p>
                    </div>
                    {!isPro && (
                      <Badge variant="secondary" className="bg-blue-600 text-white text-xs">
                        Pro
                      </Badge>
                    )}
                  </div>
                  {isPro ? (
                    <div className="mt-3">
                      <div className="bg-slate-50 border border-slate-200 rounded p-3 mb-2">
                        <code className="text-xs text-slate-700 break-all">
                          {`<script src="${publicUrl}/embed/quotes.js"></script>`}
                        </code>
                      </div>
                      <Button
                        onClick={() => handleCopy(`<script src="${publicUrl}/embed/quotes.js"></script>`)}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        <Copy className="mr-2 h-3 w-3" />
                        Copy Code
                      </Button>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 mt-2">Upgrade to Pro to use embeds</p>
                  )}
                </div>

                {/* Embed Traits Option */}
                <div
                  className={`border rounded-lg p-4 ${
                    isPro ? "border-slate-200 bg-white" : "border-slate-200 bg-slate-50 opacity-60"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                        Embed Trait Pills
                        {!isPro && <Lock className="h-3 w-3 text-slate-400" />}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1">Show the traits people mention most</p>
                    </div>
                    {!isPro && (
                      <Badge variant="secondary" className="bg-blue-600 text-white text-xs">
                        Pro
                      </Badge>
                    )}
                  </div>
                  {isPro ? (
                    <div className="mt-3">
                      <div className="bg-slate-50 border border-slate-200 rounded p-3 mb-2">
                        <code className="text-xs text-slate-700 break-all">
                          {`<script src="${publicUrl}/embed/traits.js"></script>`}
                        </code>
                      </div>
                      <Button
                        onClick={() => handleCopy(`<script src="${publicUrl}/embed/traits.js"></script>`)}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        <Copy className="mr-2 h-3 w-3" />
                        Copy Code
                      </Button>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 mt-2">Upgrade to Pro to use embeds</p>
                  )}
                </div>

                {!isPro && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-slate-700">
                      <Link href="/pricing" className="font-semibold text-blue-600 hover:text-blue-700">
                        Upgrade to Pro
                      </Link>{" "}
                      to embed quotes and traits on your website.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "email" && (
          <div className="space-y-3">
            <p className="text-sm text-slate-600">Add your Nomee to your email signature for instant credibility.</p>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <p className="text-sm font-mono text-slate-700">See what it's like to work with me: {publicUrl}</p>
            </div>
            <Button onClick={() => handleCopy(publicUrl)} variant="default" className="w-full">
              {copied ? (
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
        )}
      </div>
    </Card>
  )
}
