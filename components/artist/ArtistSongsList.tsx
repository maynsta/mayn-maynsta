"use client"

import { Play, Pause, Music, MoreVertical } from "lucide-react"
import { useRef, useState } from "react"
import { usePlayer } from "@/hooks/use-player"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

interface Song {
  id: string
  title: string
  audio_url: string
  duration?: number
}

interface ArtistSongsListProps {
  songs: Song[]
}

export default function ArtistSongsList({ songs }: ArtistSongsListProps) {
  const { currentSong, setSong } = usePlayer()
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  if (!songs || songs.length === 0) {
    return (
      <div className="text-center py-8">
        <Music className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
        <p className="text-neutral-400">Noch keine Songs hochgeladen</p>
      </div>
    )
  }

  const handlePlayPause = (song: Song) => {
    if (!audioRef.current) {
      audioRef.current = new Audio(song.audio_url)
      audioRef.current.play()
      setIsPlaying(true)
      setSong(song)
      audioRef.current.onended = () => setIsPlaying(false)
      return
    }

    if (currentSong?.id === song.id) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play()
        setIsPlaying(true)
      }
    } else {
      audioRef.current.pause()
      audioRef.current = new Audio(song.audio_url)
      audioRef.current.play()
      setSong(song)
      setIsPlaying(true)
    }
  }

  const handleAddToLibrary = (song: Song) => {
    console.log("Add to Library:", song)
    // TODO: API oder Zustand hinzufügen, um Song in die Bibliothek zu speichern
  }

  const handleAddToPlaylist = (song: Song) => {
    console.log("Add to Playlist:", song)
    // TODO: Dialog öffnen zum Auswählen oder Erstellen einer Playlist
  }

  return (
    <div className="space-y-3">
      {songs.map((song) => (
        <div
          key={song.id}
          className="flex items-center justify-between p-3 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition"
        >
          <div>
            <p className="text-white font-medium">{song.title}</p>
            <p className="text-sm text-neutral-400">
              {song.duration ? `${song.duration}s` : "Unbekannte Länge"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Play/Pause Button */}
            <button
              onClick={() => handlePlayPause(song)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
            >
              {currentSong?.id === song.id && isPlaying ? (
                <Pause className="w-5 h-5 text-white" />
              ) : (
                <Play className="w-5 h-5 text-white" />
              )}
            </button>

            {/* 3-Punkte-Menü */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition">
                  <MoreVertical className="w-5 h-5 text-white" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40 bg-neutral-800 border border-neutral-700 text-white">
                <DropdownMenuItem
                  onClick={() => handleAddToLibrary(song)}
                  className="hover:bg-neutral-700 cursor-pointer"
                >
                  Add to Library
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleAddToPlaylist(song)}
                  className="hover:bg-neutral-700 cursor-pointer"
                >
                  Add to Playlist
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  )
}

