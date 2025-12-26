"use client"

import { useEffect, useRef, useState } from "react"
import { PlayIcon, PauseIcon } from "lucide-react"

// Global audio state to ensure only one plays at a time
let globalAudio: HTMLAudioElement | null = null
const globalCallbacks: Set<() => void> = new Set()

export function IntimateAudioPlayer({ audioUrl }: { audioUrl: string }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Initialize audio element
    audioRef.current = new Audio(audioUrl)
    audioRef.current.onended = () => setIsPlaying(false)

    // Register this player in global callbacks
    const stopCallback = () => setIsPlaying(false)
    globalCallbacks.add(stopCallback)

    return () => {
      audioRef.current?.pause()
      globalCallbacks.delete(stopCallback)
    }
  }, [audioUrl])

  const togglePlay = () => {
    if (!audioRef.current) return

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
      audioRef.current.play()
      setIsPlaying(true)
      globalAudio = audioRef.current
    }
  }

  return (
    <div onClick={togglePlay} className="flex items-center gap-3 cursor-pointer group">
      <button
        className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center hover:bg-slate-700 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4 ml-0.5" />}
      </button>

      <div className="flex items-center gap-1 h-4">
        {[10, 14, 12, 16, 14, 18, 12, 16].map((height, i) => (
          <div
            key={i}
            className="w-0.5 rounded-full bg-slate-400 group-hover:bg-slate-500 transition-colors duration-200"
            style={{
              height: `${height}px`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
