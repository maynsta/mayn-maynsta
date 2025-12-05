"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Music2 } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase";

interface ArtistAccountSectionProps {
  hasArtistAccount: boolean
}

export function ArtistAccountSection({ hasArtistAccount }: ArtistAccountSectionProps) {
  return (
    <Card className="bg-neutral-900/40 border-neutral-800">
      <CardHeader>
        <CardTitle className="text-white">Künstlerkonto</CardTitle>
        <CardDescription className="text-neutral-400">
          {hasArtistAccount
            ? "Verwalte dein Künstlerkonto und veröffentliche Musik"
            : "Erstelle ein Künstlerkonto, um deine eigene Musik zu veröffentlichen"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasArtistAccount ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-neutral-800 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Music2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-white font-medium">Künstlerkonto aktiv</p>
                <p className="text-sm text-neutral-400">Du kannst jetzt Musik veröffentlichen</p>
              </div>
            </div>
            <Link href="/artist">
              <Button className="w-full">Zum Künstler-Dashboard</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-neutral-800 rounded-lg">
              <Music2 className="w-12 h-12 text-neutral-400" />
              <div>
                <p className="text-white font-medium">Kein Künstlerkonto</p>
                <p className="text-sm text-neutral-400">Erstelle ein Konto, um loszulegen</p>
              </div>
            </div>
            <Link href="/artist/create">
              <Button className="w-full">Künstlerkonto erstellen</Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
