"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { SearchIcon, Play, MoreVertical } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { usePlayer } from "@/hooks/use-player";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [songs, setSongs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const { setSong } = usePlayer();
  const router = useRouter();

  // 🔍 Songs laden
  useEffect(() => {
    const fetchSongs = async () => {
      if (!searchQuery.trim()) {
        setSongs([]);
        return;
      }

      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      let query = supabase.from("songs").select("*").ilike("title", `%${searchQuery}%`);
      query = user
        ? query.or(`is_published.eq.true,artist_id.eq.${user.id}`)
        : query.eq("is_published", true);

      const { data, error } = await query;
      if (error) toast.error("Fehler beim Laden der Songs");
      else setSongs(data || []);

      setIsLoading(false);
    };

    const t = setTimeout(fetchSongs, 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // 📂 Playlists laden
  useEffect(() => {
    const loadPlaylists = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("playlists").select("*").eq("user_id", user.id);
      setPlaylists(data || []);
    };
    loadPlaylists();
  }, []);

  // 🎵 Add to Library
  const handleAddToLibrary = async (song: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return toast.error("Bitte einloggen!");

    const { error } = await supabase.from("library").upsert({
      user_id: user.id,
      song_id: song.id,
    });

    if (error) toast.error("Fehler beim Hinzufügen zur Library");
    else toast.success("Song zur Library hinzugefügt 🎧");
  };

  // ➕ Add to Playlist
  const handleAddToPlaylist = async (song: any, playlistId: string) => {
    const { error } = await supabase.from("playlist_songs").upsert({
      playlist_id: playlistId,
      song_id: song.id,
    });
    if (error) toast.error("Fehler beim Hinzufügen zur Playlist");
    else toast.success("Song zur Playlist hinzugefügt");
  };

  // 🆕 Neue Playlist erstellen
  const handleCreatePlaylist = () => {
    router.push("/library/create");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-black p-6">
      <h1 className="text-4xl font-bold text-white mb-6">Search</h1>

      <div className="relative max-w-md">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
        <Input
          type="text"
          placeholder="Was möchtest du hören?"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-neutral-800 border-none text-white placeholder:text-neutral-400 h-12"
        />
      </div>

      <div className="mt-8 space-y-4">
        {isLoading ? (
          <p className="text-neutral-400">Lade Songs...</p>
        ) : songs.length > 0 ? (
          songs.map((song) => (
            <Card
              key={song.id}
              className="bg-neutral-900/40 border-neutral-800 hover:bg-neutral-800 transition"
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold">{song.title}</p>
                  <p className="text-neutral-400 text-sm">
                    {song.is_published ? "Veröffentlicht" : "Unveröffentlicht"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSong(song)}
                    className="p-2 rounded-full bg-green-600 hover:bg-green-500 transition"
                  >
                    <Play className="w-5 h-5 text-white" />
                  </button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition">
                        <MoreVertical className="w-5 h-5 text-white" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-neutral-800 border border-neutral-700 text-white w-52">
                      <DropdownMenuItem
                        className="hover:bg-neutral-700 cursor-pointer"
                        onClick={() => handleAddToLibrary(song)}
                      >
                        Add to Library
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        className="hover:bg-neutral-700 cursor-pointer"
                        onClick={handleCreatePlaylist}
                      >
                        Create Playlist
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      {playlists.length > 0 ? (
                        playlists.map((pl) => (
                          <DropdownMenuItem
                            key={pl.id}
                            className="hover:bg-neutral-700 cursor-pointer"
                            onClick={() => handleAddToPlaylist(song, pl.id)}
                          >
                            {pl.name}
                          </DropdownMenuItem>
                        ))
                      ) : (
                        <DropdownMenuItem disabled>No playlists yet</DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))
        ) : searchQuery ? (
          <p className="text-neutral-400">Keine Songs gefunden.</p>
        ) : (
          <p className="text-neutral-400">Suche nach Songs, Künstlern oder Alben</p>
        )}
      </div>
    </div>
  );
}

