import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import ArtistSongsList from "@/components/artist/ArtistSongsList"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Music, Plus, ArrowLeft } from "lucide-react"

export default async function ArtistDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user has artist account
  const { data: artistAccount } = await supabase
    .from("artist_accounts")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (!artistAccount) {
    redirect("/artist/create")
  }

  // Fetch artist's songs
  const { data: songs } = await supabase
    .from("songs")
    .select("*")
    .eq("artist_id", artistAccount.id)
    .order("created_at", { ascending: false })

  // Fetch artist's albums
  const { data: albums } = await supabase
    .from("albums")
    .select("*")
    .eq("artist_id", artistAccount.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header mit Zurück-Button */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Künstler-Dashboard</h1>
            <p className="text-neutral-400">Willkommen zurück, {artistAccount.artist_name}</p>
          </div>
          <Link href="/account">
            <Button variant="outline" className="bg-transparent text-neutral-300 hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück zum Account
            </Button>
          </Link>
        </div>

        {/* Übersichtskarten */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card className="bg-neutral-900/40 border-neutral-800">
            <CardHeader>
              <CardTitle className="text-white">Songs</CardTitle>
              <CardDescription className="text-neutral-400">Veröffentlichte Songs</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-white">{songs?.length || 0}</p>
            </CardContent>
          </Card>

          <Card className="bg-neutral-900/40 border-neutral-800">
            <CardHeader>
              <CardTitle className="text-white">Alben</CardTitle>
              <CardDescription className="text-neutral-400">Veröffentlichte Alben</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-white">{albums?.length || 0}</p>
            </CardContent>
          </Card>
        </div>

        {/* Songs & Alben Verwaltung */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Songs */}
          <Card className="bg-neutral-900/40 border-neutral-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white">Deine Songs</CardTitle>
                <CardDescription className="text-neutral-400">Verwalte deine veröffentlichten Songs</CardDescription>
              </div>
              <Link href="/artist/upload">
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Song hochladen
                </Button>
              </Link>
            </CardHeader>
<CardContent>
  <ArtistSongsList songs={songs || []} />
</CardContent>
          </Card>

          {/* Alben */}
          <Card className="bg-neutral-900/40 border-neutral-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white">Deine Alben</CardTitle>
                <CardDescription className="text-neutral-400">Verwalte deine veröffentlichten Alben</CardDescription>
              </div>
              <Link href="/artist/album/create">
                <Button size="sm" variant="outline" className="bg-transparent">
                  <Plus className="mr-2 h-4 w-4" />
                  Album erstellen
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {albums && albums.length > 0 ? (
                <div className="space-y-3">
                  {albums.map((album) => (
                    <div key={album.id} className="flex items-center gap-3 p-3 bg-neutral-800 rounded-lg">
                      <div className="w-12 h-12 bg-neutral-700 rounded flex items-center justify-center">
                        <Music className="w-6 h-6 text-neutral-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{album.title}</p>
                        <p className="text-sm text-neutral-400">
                          {album.release_date ? new Date(album.release_date).getFullYear() : "—"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Music className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                  <p className="text-neutral-400">Noch keine Alben erstellt</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

