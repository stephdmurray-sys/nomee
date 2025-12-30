"use client"

import { useState, useEffect, useCallback } from "react"
import { Pin, X, Quote, Mic, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PinnedItem {
  id: string
  type: "quote" | "voice" | "trait"
  content: string
  contributor?: string
}

interface PinnedHighlightsProps {
  profileSlug: string
  isOwner: boolean
  onPinQuote?: (id: string, content: string, contributor: string) => void
  onPinVoice?: (id: string, content: string, contributor: string) => void
  onPinTrait?: (trait: string) => void
}

const STORAGE_KEY_PREFIX = "nomee_pins_"
const MAX_QUOTES = 3
const MAX_VOICE = 1
const MAX_TRAITS = 6

export function usePinnedHighlights(profileSlug: string) {
  const [pinnedItems, setPinnedItems] = useState<PinnedItem[]>([])
  const { toast } = useToast()

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${profileSlug}`)
      if (stored) {
        setPinnedItems(JSON.parse(stored))
      }
    } catch {
      // localStorage not available, continue with empty
    }
  }, [profileSlug])

  // Save to localStorage
  const savePins = useCallback(
    (items: PinnedItem[]) => {
      try {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}${profileSlug}`, JSON.stringify(items))
        return true
      } catch {
        return false
      }
    },
    [profileSlug],
  )

  const pinQuote = useCallback(
    (id: string, content: string, contributor: string) => {
      setPinnedItems((prev) => {
        const quotes = prev.filter((p) => p.type === "quote")
        if (quotes.length >= MAX_QUOTES) {
          toast({
            title: "Maximum quotes pinned",
            description: `You can pin up to ${MAX_QUOTES} quotes.`,
          })
          return prev
        }
        if (prev.some((p) => p.id === id)) return prev

        const newItems = [...prev, { id, type: "quote" as const, content, contributor }]
        const saved = savePins(newItems)
        if (!saved) {
          toast({
            title: "Pinned locally",
            description: "Pinned on this device only.",
          })
        }
        return newItems
      })
    },
    [savePins, toast],
  )

  const pinVoice = useCallback(
    (id: string, content: string, contributor: string) => {
      setPinnedItems((prev) => {
        const voices = prev.filter((p) => p.type === "voice")
        if (voices.length >= MAX_VOICE) {
          toast({
            title: "Maximum voice cards pinned",
            description: `You can pin up to ${MAX_VOICE} voice card.`,
          })
          return prev
        }
        if (prev.some((p) => p.id === id)) return prev

        const newItems = [...prev, { id, type: "voice" as const, content, contributor }]
        savePins(newItems)
        return newItems
      })
    },
    [savePins, toast],
  )

  const pinTrait = useCallback(
    (trait: string) => {
      setPinnedItems((prev) => {
        const traits = prev.filter((p) => p.type === "trait")
        if (traits.length >= MAX_TRAITS) {
          toast({
            title: "Maximum traits pinned",
            description: `You can pin up to ${MAX_TRAITS} traits.`,
          })
          return prev
        }
        if (prev.some((p) => p.content === trait)) return prev

        const newItems = [...prev, { id: `trait-${trait}`, type: "trait" as const, content: trait }]
        savePins(newItems)
        return newItems
      })
    },
    [savePins, toast],
  )

  const unpin = useCallback(
    (id: string) => {
      setPinnedItems((prev) => {
        const newItems = prev.filter((p) => p.id !== id)
        savePins(newItems)
        return newItems
      })
    },
    [savePins],
  )

  const isPinned = useCallback(
    (id: string) => {
      return pinnedItems.some((p) => p.id === id)
    },
    [pinnedItems],
  )

  return {
    pinnedItems,
    pinQuote,
    pinVoice,
    pinTrait,
    unpin,
    isPinned,
    pinnedQuotes: pinnedItems.filter((p) => p.type === "quote"),
    pinnedVoice: pinnedItems.filter((p) => p.type === "voice"),
    pinnedTraits: pinnedItems.filter((p) => p.type === "trait"),
  }
}

export function PinnedHighlightsDisplay({
  pinnedItems,
  onUnpin,
  isOwner,
}: {
  pinnedItems: PinnedItem[]
  onUnpin: (id: string) => void
  isOwner: boolean
}) {
  if (pinnedItems.length === 0) return null

  const quotes = pinnedItems.filter((p) => p.type === "quote")
  const voice = pinnedItems.filter((p) => p.type === "voice")
  const traits = pinnedItems.filter((p) => p.type === "trait")

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Pin className="w-4 h-4 text-amber-500" />
        <h4 className="text-sm font-semibold text-neutral-900">Pinned Highlights</h4>
      </div>

      {/* Pinned Traits */}
      {traits.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {traits.map((item) => (
            <span
              key={item.id}
              className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-amber-50 text-amber-800 border border-amber-200"
            >
              <Sparkles className="w-3 h-3" />
              {item.content}
              {isOwner && (
                <button
                  onClick={() => onUnpin(item.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3 text-amber-600" />
                </button>
              )}
            </span>
          ))}
        </div>
      )}

      {/* Pinned Quotes & Voice */}
      {(quotes.length > 0 || voice.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quotes.map((item) => (
            <div key={item.id} className="group relative bg-white border border-amber-200 rounded-lg p-4 shadow-sm">
              <Quote className="w-4 h-4 text-amber-400 mb-2" />
              <p className="text-sm text-neutral-700 line-clamp-3">{item.content}</p>
              {item.contributor && <p className="text-xs text-neutral-500 mt-2">— {item.contributor}</p>}
              {isOwner && (
                <button
                  onClick={() => onUnpin(item.id)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-amber-50 rounded"
                >
                  <X className="w-3 h-3 text-amber-600" />
                </button>
              )}
            </div>
          ))}
          {voice.map((item) => (
            <div key={item.id} className="group relative bg-white border border-blue-200 rounded-lg p-4 shadow-sm">
              <Mic className="w-4 h-4 text-blue-400 mb-2" />
              <p className="text-sm text-neutral-700 line-clamp-3">{item.content}</p>
              {item.contributor && <p className="text-xs text-neutral-500 mt-2">— {item.contributor}</p>}
              {isOwner && (
                <button
                  onClick={() => onUnpin(item.id)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-blue-50 rounded"
                >
                  <X className="w-3 h-3 text-blue-600" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Pin button component to add to cards
export function PinButton({
  id,
  isPinned,
  onPin,
  onUnpin,
  disabled = false,
}: {
  id: string
  isPinned: boolean
  onPin: () => void
  onUnpin: () => void
  disabled?: boolean
}) {
  return (
    <button
      onClick={isPinned ? onUnpin : onPin}
      disabled={disabled}
      className={`
        p-1.5 rounded-full transition-all
        ${
          isPinned
            ? "bg-amber-100 text-amber-600 hover:bg-amber-200"
            : "bg-neutral-100 text-neutral-400 hover:bg-neutral-200 hover:text-neutral-600"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
      title={isPinned ? "Unpin" : "Pin to highlights"}
    >
      <Pin className={`w-3.5 h-3.5 ${isPinned ? "fill-current" : ""}`} />
    </button>
  )
}
