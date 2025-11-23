"use client"

import { useEffect, useRef, useState } from "react"
import { Play, Pause, SkipBack, SkipForward } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePlayer } from "@/hooks/use-player"

export function Player() {
  const { currentSong } = usePlayer()
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  // Wenn sich der Song ändert, lade ihn neu und starte das Abspielen
  useEffect(() => {
    if (currentSong?.audio_url) {
      if (audioRef.current) {
        audioRef.current.pause()
      }

      const newAudio = new Audio(currentSong.audio_url)
      audioRef.current = newAudio
      newAudio.play()
      setIsPlaying(true)

      newAudio.addEventListener("ended", () => setIsPlaying(false))
    }
  }, [currentSong])

  // Play/Pause manuell steuern
  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play()
      setIsPlaying(true)
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 h-24 bg-black border-t border-neutral-800 px-4">
      <div className="flex items-center justify-between h-full max-w-screen-2xl mx-auto">
        {/* Left: Aktueller Song */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-14 h-14 bg-neutral-800 rounded-full flex items-center justify-center overflow-hidden">
            {currentSong ? (
              <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-neutral-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {currentSong ? currentSong.title : "Kein Song wird abgespielt"}
            </p>
            <p className="text-xs text-neutral-400 truncate">
              {currentSong ? "Wird abgespielt..." : "Wähle einen Song aus"}
            </p>
          </div>
        </div>

        {/* Center: Controls */}
        <div className="flex flex-col items-center gap-2 flex-1">
          <div className="flex items-center gap-4">
            <Button size="icon" variant="ghost" className="h-8 w-8 text-neutral-400 hover:text-white">
              <SkipBack className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              onClick={togglePlay}
              className="h-10 w-10 rounded-full bg-white hover:bg-white/90 text-black hover:scale-105 transition"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 fill-current" />
              ) : (
                <Play className="h-5 w-5 fill-current" />
              )}
            </Button>

            <Button size="icon" variant="ghost" className="h-8 w-8 text-neutral-400 hover:text-white">
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
          <div className="w-full max-w-md">
            <div className="h-1 bg-neutral-800 rounded-full">
              <div className="h-1 bg-white rounded-full w-0" />
            </div>
          </div>
        </div>

        {/* Right: Lautstärke */}
        <div className="flex items-center justify-end gap-2 flex-1">
          <div className="w-24 h-1 bg-neutral-800 rounded-full">
            <div className="h-1 bg-white rounded-full w-3/4" />
          </div>
        </div>
      </div>
    </div>
  )
}

