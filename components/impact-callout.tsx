"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare } from "lucide-react"
import { extractImpactHeadline } from "@/lib/extract-impact-headline"
import type { Contribution } from "@/types"

interface ImpactCalloutProps {
  contributions: Contribution[]
}

export function ImpactCallout({ contributions }: ImpactCalloutProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (contributions.length === 0) return null

  // Show first impact as featured, second as secondary (if exists)
  const featured = contributions[0]
  const secondary = contributions.length > 1 ? contributions[1] : null
  const remaining = contributions.length - (secondary ? 2 : 1)

  const featuredHeadline = extractImpactHeadline(featured.written_content || "")
  const secondaryHeadline = secondary ? extractImpactHeadline(secondary.written_content || "") : null

  return (
    <div className="space-y-8">
      {/* Featured Impact */}
      <div className="px-6 md:px-10 py-8 md:py-12 rounded-xl" style={{ backgroundColor: "rgba(59, 130, 246, 0.06)" }}>
        {featuredHeadline && (
          <h4 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900 leading-tight mb-6 max-w-3xl">
            {featuredHeadline}
          </h4>
        )}

        <p className="text-base md:text-lg text-neutral-700 leading-relaxed mb-6 max-w-[72ch]">
          {featured.written_content}
        </p>

        <div className="flex items-center justify-between">
          <div className="text-sm text-neutral-500">
            <span className="font-medium text-neutral-700">{featured.contributor_name}</span>
            {featured.relationship && <span className="mx-1.5">·</span>}
            {featured.relationship && <span>{featured.relationship}</span>}
            {featured.contributor_company && <span className="mx-1.5">·</span>}
            {featured.contributor_company && <span>{featured.contributor_company}</span>}
          </div>

          <button className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors flex items-center gap-1">
            <MessageSquare className="w-3 h-3" />
            Report
          </button>
        </div>
      </div>

      {/* Secondary Impact (if exists) */}
      {secondary && (
        <div className="px-6 md:px-8 py-6 md:py-8 border border-neutral-200 rounded-lg bg-white">
          {secondaryHeadline && (
            <h5 className="text-xl md:text-2xl font-semibold text-neutral-900 leading-tight mb-4 max-w-2xl">
              {secondaryHeadline}
            </h5>
          )}

          <p className="text-sm md:text-base text-neutral-600 leading-relaxed mb-4 max-w-[72ch]">
            {secondary.written_content}
          </p>

          <div className="text-sm text-neutral-500">
            <span className="font-medium text-neutral-700">{secondary.contributor_name}</span>
            {secondary.relationship && <span className="mx-1.5">·</span>}
            {secondary.relationship && <span>{secondary.relationship}</span>}
            {secondary.contributor_company && <span className="mx-1.5">·</span>}
            {secondary.contributor_company && <span>{secondary.contributor_company}</span>}
          </div>
        </div>
      )}

      {/* View More Button */}
      {remaining > 0 && (
        <div className="text-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors underline underline-offset-4"
          >
            {isExpanded ? "Show less" : `View more impact (${remaining})`}
          </button>
        </div>
      )}

      {/* Expanded Additional Impacts */}
      <AnimatePresence>
        {isExpanded && remaining > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 overflow-hidden"
          >
            {contributions.slice(2).map((contribution) => {
              const headline = extractImpactHeadline(contribution.written_content || "")

              return (
                <div key={contribution.id} className="px-6 md:px-8 py-6 border border-neutral-200 rounded-lg bg-white">
                  {headline && (
                    <h5 className="text-lg md:text-xl font-semibold text-neutral-900 leading-tight mb-3 max-w-2xl">
                      {headline}
                    </h5>
                  )}

                  <p className="text-sm md:text-base text-neutral-600 leading-relaxed mb-3 max-w-[72ch]">
                    {contribution.written_content}
                  </p>

                  <div className="text-sm text-neutral-500">
                    <span className="font-medium text-neutral-700">{contribution.contributor_name}</span>
                    {contribution.relationship && <span className="mx-1.5">·</span>}
                    {contribution.relationship && <span>{contribution.relationship}</span>}
                    {contribution.contributor_company && <span className="mx-1.5">·</span>}
                    {contribution.contributor_company && <span>{contribution.contributor_company}</span>}
                  </div>
                </div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
