'use client';

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

interface Props {
  playlistName: string;
  userId: string;
  onCreated?: () => void; // optionaler Callback nach Erstellung
}

export default function CreatePlaylistButton({ playlistName, userId, onCreated }: Props) {
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!playlistName.trim()) return;
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("playlists")
        .insert([{ name: playlistName, user_id: userId }])
        .select()
        .single();

      if (error) throw error;

      // Callback aufrufen, damit Library sofort aktualisiert
      if (onCreated) onCreated();

    } catch (err) {
      console.error("Fehler beim Erstellen der Playlist:", err);
      alert("Fehler beim Erstellen");
    } finally {
      setLoading(false);
    }
  };

return (
  <button
    onClick={handleCreate}
    disabled={loading || !playlistName.trim()}
    className="bg-blue-600 text-white px-4 py-2 rounded-full disabled:opacity-50"
  >
    {loading ? "Erstelle..." : "Create"}
  </button>
);
}

