"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function CreateArtistAccountPage() {
  const [artistName, setArtistName] = useState("")
  const [bio, setBio] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    
const supabase = supabaseBrowser
    setIsLoading(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Nicht angemeldet")

      const { error } = await supabase.from("artist_accounts").insert({
        user_id: user.id,
        artist_name: artistName,
        bio: bio || null,
      })

      if (error) throw error

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
        <Link href="/account">
          <Button variant="ghost" className="mb-6 text-white hover:bg-neutral-800">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück
          </Button>
        </Link>

        <Card className="bg-neutral-900/40 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-3xl text-white">Künstlerkonto erstellen</CardTitle>
            <CardDescription className="text-neutral-400">
              Erstelle dein Künstlerkonto, um Musik zu veröffentlichen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="artistName" className="text-white">
                  Künstlername *
                </Label>
                <Input
                  id="artistName"
                  type="text"
                  required
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                  className="bg-neutral-800 text-white"
                  placeholder="Dein Künstlername"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-white">
                  Bio (optional)
                </Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="bg-neutral-800 text-white min-h-[120px]"
                  placeholder="Erzähle etwas über dich..."
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Wird erstellt..." : "Künstlerkonto erstellen"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
