'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { ListMusic, Plus } from "lucide-react";
import CreatePlaylistButton from "@/components/CreatePlaylistButton";

export default function LibraryPage() {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [showCreate, setShowCreate] = useState(false); // Toggle Input-Feld
  const [playlistName, setPlaylistName] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter(); // ← hinzugefügt

  // 🔑 Aktuellen User holen
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    fetchUser();
  }, []);

  // 📂 Playlists laden
  const loadPlaylists = async (id: string) => {
    const { data } = await supabase
      .from("playlists")
      .select("*")
      .eq("user_id", id)
      .order("created_at", { ascending: false });
    setPlaylists(data || []);
  };

  useEffect(() => {
    if (userId) loadPlaylists(userId);
  }, [userId]);

  return (
    <div className="p-6 min-h-screen bg-neutral-900 text-white">
      <h1 className="text-2xl font-bold mb-4">Library</h1>

      {/* ➕ Toggle Button für Create-Feld */}
      {userId && (
        <div className="mb-6">
          {!showCreate ? (
            <button
              onClick={() => setShowCreate(true)}
              className="w-10 h-10 flex items-center justify-center bg-white text-black rounded-full"
            >
              <Plus />
            </button>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Neue Playlist"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                className="border p-2 rounded-full w-full text-white bg-neutral-800"
              />
              <CreatePlaylistButton
                playlistName={playlistName}
                userId={userId}
                onCreated={() => {
                  setPlaylistName("");
                  setShowCreate(false); // Input ausblenden nach Create
                  loadPlaylists(userId);
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* 📂 Playlists anzeigen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {playlists.length > 0 ? (
          playlists.map((pl) => (
            <Card
              key={pl.id}
              className="bg-neutral-800 hover:bg-neutral-700 transition cursor-pointer"
              onClick={() => router.push(`/library/${pl.id}`)} // ← klickbar
            >
              <CardContent className="flex items-center gap-2">
                <ListMusic className="w-6 h-6" />
                <p className="font-semibold text-white">{pl.name}</p> {/* ← Name weiß */}
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-neutral-400">Keine Playlists vorhanden.</p>
        )}
      </div>
    </div>
  );
}

