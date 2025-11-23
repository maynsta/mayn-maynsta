"use client"

import { useEffect, useRef } from "react"
import { usePlayer } from "@/hooks/use-player"

export default function PlayerBar() {
  const { currentSong } = usePlayer()
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (currentSong?.audio_url) {
      if (!audioRef.current) return
      audioRef.current.src = currentSong.audio_url
      audioRef.current.play().catch(console.error)
    }
  }, [currentSong])

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-800 p-4">
      {currentSong ? (
        <div className="text-white flex items-center justify-between">
          <p>{currentSong.title}</p>
          <audio ref={audioRef} controls className="w-full max-w-md" />
        </div>
      ) : (
        <p className="text-neutral-400 text-center">Kein Song ausgewählt</p>
      )}
    </div>
  )
}

