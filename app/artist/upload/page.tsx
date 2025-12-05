"use client"
import { supabase } from "@/lib/supabase";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/supabaseBrowser";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { ArrowLeft, Upload } from "lucide-react";

export default function UploadSongPage() {
  const [title, setTitle] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [disnocUrl, setDisnocUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Supabase-Client initialisieren
  const supabase = supabaseBrowser();

  // Aktuellen User checken (Debug)
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      console.log("🧠 Aktuell angemeldeter User:", user);
      console.log("❌ Fehler:", error);
    };
    checkUser();
  }, [supabase]);

  // Datei-Upload
  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Nicht angemeldet");

      // Artist-Account holen
      let { data: artistAccount, error: artistError } = await supabase
        .from("artist_accounts")
        .select("id, user_id")
        .eq("user_id", user.id)
        .single();

      if (artistError && artistError.code !== "PGRST116") throw artistError;

      // Falls kein Account, neu erstellen
      if (!artistAccount) {
        const { data: newArtist, error: newArtistError } = await supabase
          .from("artist_accounts")
          .insert({
            user_id: user.id,
            artist_name: "Neuer Künstler",
            bio: "",
            profile_image_url: "",
          })
          .select()
          .single();
        if (newArtistError) throw newArtistError;
        artistAccount = newArtist;
      }

      if (!audioFile) throw new Error("Bitte wähle eine Audiodatei aus");

      // Non-null assertion für TypeScript
      const fileName = `${artistAccount!.id}-${Date.now()}-${audioFile.name}`;
      const { error: uploadError } = await supabase.storage.from("songs").upload(fileName, audioFile);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from("songs").getPublicUrl(fileName);

      const { error: insertError } = await supabase.from("songs").insert({
        artist_id: artistAccount!.id,
        user_id: user.id,
        title,
        audio_url: publicUrl,
        duration: 0,
        is_published: true,
      });
      if (insertError) throw insertError;

      router.push("/artist");
      router.refresh();
    } catch (error) {
      console.error("🚨 Upload-Fehler:", error);
      setError(error instanceof Error ? error.message : "Fehler beim Hochladen");
    } finally {
      setIsLoading(false);
    }
  };

  // Disnoc Import
  const handleDisnocImport = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Nicht angemeldet");

      let { data: artistAccount, error: artistError } = await supabase
        .from("artist_accounts")
        .select("id, user_id")
        .eq("user_id", user.id)
        .single();

      if (artistError && artistError.code !== "PGRST116") throw artistError;

      if (!artistAccount) {
        const { data: newArtist, error: newArtistError } = await supabase
          .from("artist_accounts")
          .insert({
            user_id: user.id,
            artist_name: "Neuer Künstler",
            bio: "",
            profile_image_url: "",
          })
          .select()
          .single();
        if (newArtistError) throw newArtistError;
        artistAccount = newArtist;
      }

      const response = await fetch(disnocUrl);
      if (!response.ok) throw new Error("Fehler beim Abrufen von disnoc.maynsta.com");

      const { error: insertError } = await supabase.from("songs").insert({
        artist_id: artistAccount!.id,
        user_id: user.id,
        title,
        audio_url: disnocUrl,
        duration: 0,
        is_published: true,
      });
      if (insertError) throw insertError;

      router.push("/artist");
      router.refresh();
    } catch (error) {
      console.error("🚨 Disnoc-Fehler:", error);
      setError(error instanceof Error ? error.message : "Fehler beim Importieren");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-black p-6 text-white">
      <div className="max-w-2xl mx-auto">
        <Link href="/artist" className="flex items-center mb-6 text-gray-400 hover:text-white">
          <ArrowLeft className="w-4 h-4 mr-2" /> Zurück
        </Link>

        <Card className="bg-neutral-800/50 border-neutral-700">
          <CardHeader>
            <CardTitle>Song hochladen</CardTitle>
            <CardDescription>Lade einen neuen Song hoch oder importiere von Disnoc.</CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="upload">
              <TabsList className="mb-4">
                <TabsTrigger value="upload">Upload</TabsTrigger>
                <TabsTrigger value="disnoc">Disnoc</TabsTrigger>
              </TabsList>

              {/* Upload Tab */}
              <TabsContent value="upload">
                <form onSubmit={handleFileUpload} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Titel</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Songtitel eingeben"
                      className="bg-neutral-900 border-neutral-700 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="audio">Audiodatei</Label>
                    <Input
                      id="audio"
                      type="file"
                      accept="audio/*"
                      onChange={(e) => setAudioFile(e.target.files?.[0] ?? null)}
                      className="bg-neutral-900 border-neutral-700 text-white"
                    />
                  </div>

                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <Button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700">
                    {isLoading ? "Wird hochgeladen..." : <><Upload className="mr-2 w-4 h-4" /> Hochladen</>}
                  </Button>
                </form>
              </TabsContent>

              {/* Disnoc Tab */}
              <TabsContent value="disnoc">
                <form onSubmit={handleDisnocImport} className="space-y-4">
                  <div>
                    <Label htmlFor="disnocUrl">Disnoc-Link</Label>
                    <Input
                      id="disnocUrl"
                      value={disnocUrl}
                      onChange={(e) => setDisnocUrl(e.target.value)}
                      placeholder="https://disnoc.maynsta.com/song/..."
                      className="bg-neutral-900 border-neutral-700 text-white"
                    />
                  </div>

                  <Button type="submit" disabled={isLoading} className="w-full bg-green-600 hover:bg-green-700">
                    {isLoading ? "Importiert..." : "Von Disnoc importieren"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

