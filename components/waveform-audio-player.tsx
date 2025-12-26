"use client"

import { useEffect, useRef, useState } from "react"
import { PlayIcon, PauseIcon } from "lucide-react"

// Global audio state
let globalAudio: HTMLAudioElement | null = null
const globalCallbacks: Set<() => void> = new Set()

interface WaveformAudioPlayerProps {
  audioUrl: string
  transcript: string
}

export function WaveformAudioPlayer({ audioUrl, transcript }: WaveformAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    audioRef.current = new Audio(audioUrl)

    const updateProgress = () => {
      if (audioRef.current) {
        const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100
        setProgress(currentProgress)
        animationRef.current = requestAnimationFrame(updateProgress)
      }
    }

    audioRef.current.onplay = () => {
      updateProgress()
    }

    audioRef.current.onpause = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }

    audioRef.current.onended = () => {
      setIsPlaying(false)
      setProgress(0)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }

    const stopCallback = () => setIsPlaying(false)
    globalCallbacks.add(stopCallback)

    return () => {
      audioRef.current?.pause()
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      globalCallbacks.delete(stopCallback)
    }
  }, [audioUrl])

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      if (globalAudio && globalAudio !== audioRef.current) {
        globalAudio.pause()
        globalAudio.currentTime = 0
        globalCallbacks.forEach((cb) => cb())
      }

      audioRef.current.play()
      setIsPlaying(true)
      globalAudio = audioRef.current
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          className="flex-shrink-0 w-12 h-12 rounded-full bg-[var(--quiet-indigo)] text-white flex items-center justify-center hover:bg-[var(--quiet-indigo)]/90 transition-all duration-200 shadow-lg"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5 ml-0.5" />}
        </button>

        <div className="flex-1 flex items-center gap-1 h-16">
          {Array.from({ length: 40 }).map((_, i) => {
            const height = 10 + Math.random() * 50
            const isPast = (i / 40) * 100 <= progress
            return (
              <div
                key={i}
                className="flex-1 rounded-full transition-all duration-150"
                style={{
                  height: `${height}px`,
                  backgroundColor: isPast ? "rgba(79, 70, 229, 0.8)" : "rgba(0, 0, 0, 0.15)",
                  transform: isPlaying && isPast ? "scaleY(1.1)" : "scaleY(1)",
                }}
              />
            )
          })}
        </div>
      </div>

      {transcript && (
        <div className="pl-16">
          <p className="text-sm leading-relaxed text-[var(--near-black)]/70 font-serif italic">{transcript}</p>
        </div>
      )}
    </div>
  )
}
