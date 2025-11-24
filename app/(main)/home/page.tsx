"use client"

import { useEffect, useState } from "react"

import { SongCard } from "@/components/song-card"

interface Song {
  id: string
  title: string
  artist_id?: string | null
  cover_image_url?: string | null
  audio_url?: string | null
}

export default function HomePage() {
  const [recentSongs, setRecentSongs] = useState<Song[]>([])
  const [loadingRecent, setLoadingRecent] = useState(true)

  useEffect(() => {
    const loadRecent = async () => {
      try {
        // Aktuellen User holen
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) return

        // Zuletzt gespielte Songs laden (die letzten 5)
        const { data, error } = await supabase
          .from("recently_played")
          .select(`
            songs (
              id,
              title,
              artist_id,
              cover_image_url,
              audio_url
            )
          `)
          .eq("user_id", user.id)
          .order("played_at", { ascending: false })
          .limit(5)

        if (error) throw error

        // Songs extrahieren
        const extracted = data?.map((item: any) => item.songs).filter((s: any) => s !== null)
        setRecentSongs(extracted || [])
      } catch (err: any) {
        console.error("Fehler beim Laden der zuletzt gespielten Songs:", err)
      } finally {
        setLoadingRecent(false)
      }
    }

    loadRecent()
  }, [])

  return (
    <div className="h-full">
      <div className="bg-gradient-to-b from-neutral-900 to-black p-6 space-y-8">
        <h1 className="text-4xl font-bold text-white">Home</h1>

        {/* Neu Section */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">Neu</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            <SongCard title="Song 1" />
            <SongCard title="Song 2" />
          </div>
        </section>

        {/* Zuletzt gehört Section */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">Zuletzt gehört</h2>
          {loadingRecent ? (
            <p className="text-white">Lade zuletzt gespielte Songs...</p>
          ) : recentSongs.length === 0 ? (
            <p className="text-white">Keine zuletzt gespielten Songs.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {recentSongs.map((song) => (
                <SongCard
                  key={song.id}
                  title={song.title}
                  cover={song.cover_image_url}
                  artist={song.artist_id} // optional
                  audio={song.audio_url} // optional
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

