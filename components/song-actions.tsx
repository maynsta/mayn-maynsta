"use client"

import { useState } from "react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { MoreVertical } from "lucide-react"


export default function SongActions({ song }: { song: any }) {
  const [loading, setLoading] = useState(false)

  const handleAddToLibrary = async () => {
    setLoading(true)
    const supabase = supabase)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return alert("Bitte einloggen!")

    const { error } = await supabase.from("library").upsert({
      user_id: user.id,
      song_id: song.id,
    })

    if (error) alert("Es gab leider ein Fehler beim hinzufügen!")
    else alert("Song wurde zur Library hinzugefügt!")

    setLoading(false)
  }

  const handleCreatePlaylist = async () => {
    const name = prompt("Name der neuen Playlist:")
    if (!name) return
    const supabase = supabase)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return alert("Bitte einloggen!")

    const { error } = await supabase.from("playlists").insert({
      user_id: user.id,
      name,
    })

    if (error) alert("Es gab leider ein Fehler beim erstellen!")
    else alert(`Playlist "${name}" erstellt!`)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 transition">
          <MoreVertical className="w-5 h-5 text-white" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-neutral-900 text-white">
        <DropdownMenuItem onClick={handleAddToLibrary}>
          {loading ? "Wird hinzugefügt..." : "Add to Library"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCreatePlaylist}>
          Create Playlist
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          Add to Playlist (coming soon)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

