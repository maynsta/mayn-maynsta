"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { supabase } from "@/lib/supabase/supabaseBrowser"
import { useRouter } from "next/navigation"

interface ParentalControlsSectionProps {
  userId: string
  parentalControls: {
    pin_code: string
    block_videos: boolean
    block_explicit: boolean
  } | null
}

export function ParentalControlsSection({ userId, parentalControls }: ParentalControlsSectionProps) {
  const [pinCode, setPinCode] = useState(parentalControls?.pin_code || "")
  const [blockVideos, setBlockVideos] = useState(parentalControls?.block_videos || false)
  const [blockExplicit, setBlockExplicit] = useState(parentalControls?.block_explicit || false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const router = useRouter()

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    if (pinCode && pinCode.length !== 4) {
      setMessage({ type: "error", text: "PIN muss 4 Ziffern haben" })
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.from("parental_controls").upsert({
        user_id: userId,
        pin_code: pinCode,
        block_videos: blockVideos,
        block_explicit: blockExplicit,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error

      setMessage({ type: "success", text: "Jugendschutz erfolgreich aktualisiert" })
      router.refresh()
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Fehler beim Aktualisieren",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="bg-neutral-900/40 border-neutral-800">
      <CardHeader>
        <CardTitle className="text-white">Jugendschutz</CardTitle>
        <CardDescription className="text-neutral-400">
          Richte einen PIN-Code ein und verwalte Inhaltseinschränkungen
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="pinCode" className="text-white">
              PIN-Code (4 Ziffern)
            </Label>
            <Input
              id="pinCode"
              type="password"
              maxLength={4}
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ""))}
              className="bg-neutral-800 text-white"
              placeholder="1234"
            />
            <p className="text-xs text-neutral-400">Dieser PIN wird benötigt, um Einstellungen zu ändern</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="blockVideos" className="text-white">
                  Videos blockieren
                </Label>
                <p className="text-sm text-neutral-400">Verhindert das Abspielen von Videoinhalten</p>
              </div>
              <Switch id="blockVideos" checked={blockVideos} onCheckedChange={setBlockVideos} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="blockExplicit" className="text-white">
                  Explizite Inhalte blockieren
                </Label>
                <p className="text-sm text-neutral-400">Filtert Songs mit expliziten Inhalten</p>
              </div>
              <Switch id="blockExplicit" checked={blockExplicit} onCheckedChange={setBlockExplicit} />
            </div>
          </div>

          {message && (
            <p className={`text-sm ${message.type === "success" ? "text-primary" : "text-destructive"}`}>
              {message.text}
            </p>
          )}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Wird gespeichert..." : "Speichern"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
