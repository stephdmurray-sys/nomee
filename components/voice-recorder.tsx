"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MicIcon, StopCircleIcon, PlayIcon, PauseIcon, RefreshCwIcon } from "lucide-react"

interface VoiceRecorderProps {
  quote?: string
  onRecordingComplete?: (audioBlob: Blob) => void
  hideButtons?: boolean
  onSkip?: () => void
}

export function VoiceRecorder({ quote, onRecordingComplete, hideButtons, onSkip }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (audioUrl) URL.revokeObjectURL(audioUrl)
    }
  }, [audioUrl])

  const startRecording = async () => {
    try {
      console.log("[v0] startRecording called")
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : MediaRecorder.isTypeSupported("audio/mp4")
          ? "audio/mp4"
          : "audio/wav"

      const mediaRecorder = new MediaRecorder(stream, { mimeType })
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        console.log("[v0] mediaRecorder.onstop fired")
        const blob = new Blob(chunksRef.current, { type: mimeType })
        console.log("[v0] Created blob:", blob.size, "bytes")
        setAudioBlob(blob)
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        stream.getTracks().forEach((track) => track.stop())

        if (onRecordingComplete) {
          console.log("[v0] VoiceRecorder: calling onRecordingComplete with blob")
          onRecordingComplete(blob)
        }
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (err) {
      console.error("Microphone access error:", err)
      setError("Could not access microphone. Please check permissions.")
    }
  }

  const stopRecording = () => {
    console.log("[v0] stopRecording called")
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  const togglePlayback = () => {
    console.log("[v0] togglePlayback called")
    if (!audioUrl) return

    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl)
      audioRef.current.onended = () => setIsPlaying(false)
    }

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const resetRecording = () => {
    console.log("[v0] resetRecording called")
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }
    setAudioBlob(null)
    setAudioUrl(null)
    setIsPlaying(false)
    setRecordingTime(0)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  useEffect(() => {
    if (audioBlob && onRecordingComplete) {
      console.log("[v0] audioBlob exists:", audioBlob.size, "bytes")
    }
  }, [audioBlob, onRecordingComplete])

  return (
    <Card className="p-8">
      <div className="space-y-6">
        {quote && (
          <div className="rounded-lg bg-neutral-50 p-6 mb-6">
            <p className="text-sm font-medium text-neutral-700 mb-2">Your written message:</p>
            <p className="text-base text-neutral-900 leading-relaxed">{quote}</p>
          </div>
        )}

        {!audioBlob ? (
          <>
            <div className="flex flex-col items-center justify-center py-12">
              <div
                className={`mb-6 flex h-32 w-32 items-center justify-center rounded-full ${isRecording ? "animate-pulse bg-red-100" : "bg-neutral-100"}`}
              >
                {isRecording ? (
                  <StopCircleIcon className="h-16 w-16 text-red-600" />
                ) : (
                  <MicIcon className="h-16 w-16 text-neutral-600" />
                )}
              </div>

              {isRecording ? (
                <>
                  <p className="mb-2 text-2xl font-semibold text-neutral-900">{formatTime(recordingTime)}</p>
                  <p className="mb-6 text-neutral-600">Recording your message...</p>
                  <Button onClick={stopRecording} size="lg" variant="destructive">
                    Stop Recording
                  </Button>
                </>
              ) : (
                <>
                  <p className="mb-6 text-center text-neutral-600">
                    Read your written message aloud so they can hear your voice.
                  </p>
                  <Button onClick={startRecording} size="lg">
                    <MicIcon className="mr-2 h-5 w-5" />
                    Start Recording
                  </Button>
                </>
              )}
            </div>

            {error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800">{error}</div>}
          </>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center py-12">
              <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-blue-100">
                <PlayIcon className="h-16 w-16 text-blue-600" />
              </div>

              <p className="mb-2 text-2xl font-semibold text-neutral-900">{formatTime(recordingTime)}</p>
              <p className="mb-6 text-neutral-600">Your recording is ready</p>

              <div className="flex gap-4">
                <Button onClick={togglePlayback} size="lg" variant="outline">
                  {isPlaying ? (
                    <>
                      <PauseIcon className="mr-2 h-5 w-5" />
                      Pause
                    </>
                  ) : (
                    <>
                      <PlayIcon className="mr-2 h-5 w-5" />
                      Listen
                    </>
                  )}
                </Button>
                <Button onClick={resetRecording} size="lg" variant="outline">
                  <RefreshCwIcon className="mr-2 h-5 w-5" />
                  Re-record
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  )
}

export function useVoiceRecorderBlob() {
  return { audioBlob: null }
}
