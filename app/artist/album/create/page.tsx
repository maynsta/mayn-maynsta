"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function CreateAlbumPage() {
  const [title, setTitle] = useState("")
  const [releaseDate, setReleaseDate] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = supabase)
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Nicht angemeldet")

      // Get artist account
      const { data: artistAccount } = await supabase
        .from("artist_accounts")
        .select("id")
        .eq("user_id", user.id)
        .single()

      if (!artistAccount) throw new Error("Kein Künstlerkonto gefunden")

      const { error: insertError } = await supabase.from("albums").insert({
        artist_id: artistAccount.id,
        title: title,
        release_date: releaseDate || null,
      })

      if (insertError) throw insertError

      router.push("/artist")
      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Fehler beim Erstellen")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-black p-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/artist">
          <Button variant="ghost" className="mb-6 text-white hover:bg-neutral-800">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück
          </Button>
        </Link>

        <Card className="bg-neutral-900/40 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-3xl text-white">Album erstellen</CardTitle>
            <CardDescription className="text-neutral-400">Erstelle ein neues Album für deine Songs</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-white">
                  Album-Titel *
                </Label>
                <Input
                  id="title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-neutral-800 text-white"
                  placeholder="Mein neues Album"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="releaseDate" className="text-white">
                  Veröffentlichungsdatum (optional)
                </Label>
                <Input
                  id="releaseDate"
                  type="date"
                  value={releaseDate}
                  onChange={(e) => setReleaseDate(e.target.value)}
                  className="bg-neutral-800 text-white"
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Wird erstellt..." : "Album erstellen"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
