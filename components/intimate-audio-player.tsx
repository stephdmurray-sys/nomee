"use client"

import { useEffect, useRef, useState } from "react"
import { PlayIcon, PauseIcon } from "lucide-react"

// Global audio state to ensure only one plays at a time
let globalAudio: HTMLAudioElement | null = null
const globalCallbacks: Set<() => void> = new Set()

export function IntimateAudioPlayer({ audioUrl }: { audioUrl: string }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [hasError, setHasError] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Initialize audio element
    audioRef.current = new Audio(audioUrl)

    audioRef.current.onerror = () => {
      console.log("[v0] Audio file not available (demo placeholder):", audioUrl)
      setHasError(true)
      setIsPlaying(false)
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
    }

    // Register this player in global callbacks
    const stopCallback = () => {
      setIsPlaying(false)
      if (audioRef.current) {
        audioRef.current.currentTime = 0
      }
    }
    globalCallbacks.add(stopCallback)

    return () => {
      audioRef.current?.pause()
      globalCallbacks.delete(stopCallback)
    }
  }, [audioUrl])

  const togglePlay = () => {
    if (!audioRef.current || hasError) return

    if (isPlaying) {
      // Pause this audio
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      // Stop any currently playing audio globally
      if (globalAudio && globalAudio !== audioRef.current) {
        globalAudio.pause()
        globalAudio.currentTime = 0
        // Notify all other players to update their state
        globalCallbacks.forEach((cb) => cb())
      }

      // Play this audio
      audioRef.current.play().catch(() => {
        setHasError(true)
      })
      setIsPlaying(true)
      globalAudio = audioRef.current
    }
  }

  const progress = duration > 0 ? currentTime / duration : 0

  return (
    <div className="space-y-2">
      <div
        onClick={togglePlay}
        className={`flex items-center gap-3 ${hasError ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
        title={hasError ? "Audio demo placeholder" : undefined}
      >
        <button
          className="flex-shrink-0 w-9 h-9 rounded-full bg-neutral-800 text-white flex items-center justify-center hover:bg-neutral-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={isPlaying ? "Pause" : "Play"}
          disabled={hasError}
        >
          {isPlaying ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4 ml-0.5" />}
        </button>

        <div className="flex items-center gap-0.5 h-6 flex-1">
          {[8, 14, 10, 16, 12, 18, 14, 20, 16, 14, 10, 16, 12, 18, 14, 12].map((height, i) => {
            const barProgress = i / 16
            const isActive = isPlaying && barProgress <= progress

            return (
              <div
                key={i}
                className={`w-0.5 rounded-full transition-all duration-200 ${
                  isActive ? "bg-neutral-800" : "bg-neutral-300"
                }`}
                style={{
                  height: `${height}px`,
                }}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
