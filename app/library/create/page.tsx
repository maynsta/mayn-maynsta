"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function CreatePlaylistPage() {
  const [name, setName] = useState("");
  const router = useRouter();

  const handleCreate = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("Bitte einloggen!");
      return;
    }

    const { data, error } = await supabase
      .from("playlists")
      .insert({ name, user_id: user.id })
      .select()
      .single();

    if (error || !data) {
      console.error(error);
      alert("Fehler beim Erstellen der Playlist");
      return;
    }

    // Zurück zur Library-Seite
    router.push("/library");
  };

  return (
    <div className="p-5 text-white flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Neue Playlist erstellen</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Playlist Name"
        className="text-black p-2 rounded border w-full"
      />
      <button
        onClick={handleCreate}
        className="bg-blue-600 p-2 rounded text-white"
      >
        Create
      </button>
    </div>
  );
}

