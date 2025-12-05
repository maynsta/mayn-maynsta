"use client"
import { supabase } from "@/lib/supabase";

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { supabaseBrowser } from "@/lib/supabase/supabaseBrowser" // ✅ Supabase Import

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwörter stimmen nicht überein")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Passwort muss mindestens 6 Zeichen lang sein")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      })
      if (error) throw error
      router.push("/auth/login")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Ein Fehler ist aufgetreten")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="border-border/50">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold text-center">Neues Passwort</CardTitle>
            <CardDescription className="text-center">Gib dein neues Passwort ein</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Neues Passwort</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-secondary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Passwort bestätigen</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-secondary"
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Wird aktualisiert..." : "Passwort aktualisieren"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

