"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Play, Pause } from "lucide-react"

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

  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || hasError || duration === 0) return

    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const clickRatio = clickX / rect.width
    const newTime = clickRatio * duration

    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  const progress = duration > 0 ? currentTime / duration : 0

  return (
    <div className={`flex items-center gap-3 ${hasError ? "opacity-40 cursor-not-allowed" : ""}`}>
      <button
        onClick={togglePlay}
        className="flex-shrink-0 w-12 h-12 min-h-[48px] min-w-[48px] rounded-full bg-blue-600 text-white flex items-center justify-center transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50 touch-manipulation"
        disabled={hasError}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
      </button>

      <div className="flex-1 relative">
        <div
          onClick={handleWaveformClick}
          className="flex items-center gap-0.5 h-10 cursor-pointer overflow-hidden"
          role="slider"
          aria-valuemin={0}
          aria-valuemax={duration}
          aria-valuenow={currentTime}
          aria-label="Audio progress"
        >
          {[8, 14, 10, 18, 12, 22, 16, 24, 18, 16, 12, 16, 12, 18, 14, 12].map((height, i) => {
            const barProgress = i / 16
            const isActive = barProgress <= progress

            return (
              <div
                key={i}
                className={`flex-1 max-w-[6px] rounded-full transition-colors ${
                  isActive ? "bg-blue-600" : "bg-gray-300"
                }`}
                style={{ height: `${height}px` }}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
