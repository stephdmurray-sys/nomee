"use client"

import { useEffect, useRef, useState } from "react"
import { Play, Pause } from "lucide-react"

// Global audio state to ensure only one plays at a time
let globalAudio: HTMLAudioElement | null = null
const globalCallbacks: Set<() => void> = new Set()

export function IntimateAudioPlayer({
  audioUrl,
  onPlayingChange,
}: {
  audioUrl: string
  onPlayingChange?: (isPlaying: boolean) => void
}) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [hasError, setHasError] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    audioRef.current = new Audio(audioUrl)

    audioRef.current.onerror = () => {
      console.log("[v0] Audio file not available (demo placeholder):", audioUrl)
      setHasError(true)
      setIsPlaying(false)
      onPlayingChange?.(false)
    }

    audioRef.current.onloadedmetadata = () => {
      setDuration(audioRef.current?.duration || 0)
    }

    audioRef.current.ontimeupdate = () => {
      setCurrentTime(audioRef.current?.currentTime || 0)
    }

    audioRef.current.onended = () => {
      setIsPlaying(false)
      setCurrentTime(0)
      onPlayingChange?.(false)
    }

    const stopCallback = () => {
      setIsPlaying(false)
      onPlayingChange?.(false)
      if (audioRef.current) {
        audioRef.current.currentTime = 0
      }
    }
    globalCallbacks.add(stopCallback)

    return () => {
      audioRef.current?.pause()
      globalCallbacks.delete(stopCallback)
    }
  }, [audioUrl, onPlayingChange])

  const togglePlay = () => {
    if (!audioRef.current || hasError) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
      onPlayingChange?.(false)
    } else {
      if (globalAudio && globalAudio !== audioRef.current) {
        globalAudio.pause()
        globalAudio.currentTime = 0
        globalCallbacks.forEach((cb) => cb())
      }

      audioRef.current.play().catch(() => {
        setHasError(true)
      })
      setIsPlaying(true)
      onPlayingChange?.(true)
      globalAudio = audioRef.current
    }
  }

  const progress = duration > 0 ? currentTime / duration : 0

  return (
    <div className="space-y-2">
      <div
        onClick={togglePlay}
        className={`flex items-center gap-4 ${hasError ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
        role="button"
        tabIndex={hasError ? -1 : 0}
        aria-label={isPlaying ? "Pause audio" : "Play audio"}
      >
        <button
          className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center transition-all duration-150 hover:scale-105 hover:bg-blue-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={hasError}
          aria-hidden="true"
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
        </button>

        <div className="flex items-center gap-0.5 h-8 flex-1">
          {[10, 16, 12, 20, 14, 22, 16, 24, 18, 16, 12, 18, 14, 20, 16, 14].map((height, i) => {
            const barProgress = i / 16
            const isActive = isPlaying && barProgress <= progress

            return (
              <div
                key={i}
                className={`w-0.5 rounded-full transition-all duration-100 ${isActive ? "bg-blue-500" : "bg-neutral-300"}`}
                style={{
                  height: `${height}px`,
                  transform: isActive && isPlaying ? "scaleY(1.15)" : "scaleY(1)",
                }}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
