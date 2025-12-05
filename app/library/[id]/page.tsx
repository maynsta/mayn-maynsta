"use client"
import { supabase } from "@/lib/supabase";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";


interface Song {
  id: string;
  title: string;
  cover_image_url?: string | null;
  audio_url?: string | null;
}

export default function PlaylistDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [playlistName, setPlaylistName] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPlaylist = async () => {
      try {
        console.log("▶ Playlist ID:", id);

        if (!id) throw new Error("Keine Playlist-ID erhalten");

        // 1️⃣ Playlist holen
        const {
          data: playlist,
          error: playlistError,
        } = await supabase
          .from("playlists")
          .select("name")
          .eq("id", id)
          .single();

        if (playlistError) throw playlistError;
        if (!playlist) throw new Error("Playlist nicht gefunden");

        setPlaylistName(playlist.name);

        // 2️⃣ Songs holen
        const { data: playlistSongs, error: songsError } = await supabase
          .from("playlist_songs")
          .select(`
            songs (
              id,
              title,
              cover_image_url,
              audio_url
            )
          `)
          .eq("playlist_id", id);

        if (songsError) throw songsError;

        const extracted = playlistSongs
          .map((item: any) => item.songs)
          .filter((s: any) => s !== null);

        setSongs(extracted);
      } catch (err: any) {
        console.error("Fehler beim Laden:", err, "err.message:", err?.message);
        setError(
          err?.message || (err ? JSON.stringify(err) : "Unbekannter Fehler")
        );
      } finally {
        setLoading(false);
      }
    };

    loadPlaylist();
  }, [id]);

  if (loading) return <p>Lade Playlist...</p>;
  if (error) return <p>Fehler: {error}</p>;

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold mb-4">{playlistName}</h1>

      {songs.length === 0 ? (
        <p>Keine Songs in dieser Playlist.</p>
      ) : (
        <ul>
          {songs.map((song) => (
            <li key={song.id} className="mb-3">
              <div className="flex items-center gap-4">
                {song.cover_image_url ? (
                  <img
                    src={song.cover_image_url}
                    alt={song.title}
                    className="w-12 h-12 object-imageUrl rounded"
                  />
                ) : (
                  <div className="w-12 h-12 rounded bg-gray-300 flex items-center justify-center">
                    🎵
                  </div>
                )}

                <div>
                  <p className="font-semibold">{song.title}</p>
                  {/* Artist-ID wurde entfernt */}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

