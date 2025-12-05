"use client"
import { supabase } from "@/lib/supabase";

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

import { supabaseBrowser } from "@/lib/supabase/supabaseBrowser" // ✅ Wichtig: supabase importieren

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState<"einfach" | "mittel" | "stark" | "">("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const checkPasswordStrength = (pwd: string) => {
    if (!pwd) return ""

    const hasNumber = /\d/.test(pwd)
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
    const hasUpper = /[A-Z]/.test(pwd)

    if (pwd.length < 8) return "einfach"
    if (pwd.length >= 8 && (!hasNumber || !hasSpecial || !hasUpper)) return "mittel"
    return "stark"
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwörter stimmen nicht überein")
      setIsLoading(false)
      return
    }

    if (password.length < 8) {
      setError("Passwort muss mindestens 8 Zeichen lang sein!")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/home`,
          data: {
            display_name: displayName || email.split("@")[0],
          },
        },
      })
      if (error) throw error
      router.push("/auth/verify-email")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Ein Fehler ist aufgetreten")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleRegister = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/home`,
        },
      })
      if (error) throw error
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Ein Fehler ist aufgetreten")
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="border-border/50">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold text-center">Registrieren</CardTitle>
            <CardDescription className="text-center">Erstelle ein Konto, um loszulegen</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Google Login */}
            <Button
              type="button"
              variant="outline"
              className="w-full bg-transparent"
              onClick={handleGoogleRegister}
              disabled={isLoading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                {/* ...SVG-Pfade bleiben gleich */}
              </svg>
              Mit Google registrieren
            </Button>

            {/* Separator */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Oder</span>
              </div>
            </div>

            {/* E-Mail Registrierung */}
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Anzeigename (optional)</Label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder="Dein Name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="bg-secondary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-Mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@beispiel.de"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-secondary"
                />
              </div>

              {/* Passwort */}
              <div className="space-y-2 relative">
                <Label htmlFor="password">Passwort</Label>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => {
                    const val = e.target.value
                    setPassword(val)
                    setPasswordStrength(checkPasswordStrength(val))
                  }}
                  className="bg-secondary pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Passwort verbergen" : "Passwort anzeigen"}
                  className={`absolute right-3 top-[60%] -translate-y-1/2 inline-flex items-center justify-center p-1 rounded focus:outline-none 
                    ${showPassword ? "text-blue-500" : "text-gray-400"}`}
                >
                  {/* Eye SVG */}
                </button>
                {passwordStrength && (
                  <p
                    className={`text-sm ${
                      passwordStrength === "stark"
                        ? "text-green-600"
                        : passwordStrength === "mittel"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    Passwortstärke: {passwordStrength}
                  </p>
                )}
              </div>

              {/* Bestätigungs-Passwort */}
              <div className="space-y-2 relative">
                <Label htmlFor="confirmPassword">Passwort bestätigen</Label>
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-secondary pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((s) => !s)}
                  aria-label={showConfirmPassword ? "Bestätigung verbergen" : "Bestätigung anzeigen"}
                  className={`absolute right-3 top-[60%] -translate-y-1/2 inline-flex items-center justify-center p-1 rounded focus:outline-none 
                    ${showConfirmPassword ? "text-blue-500" : "text-gray-400"}`}
                >
                  {/* Eye SVG */}
                </button>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button type="submit" className="w-full" disabled={isLoading || passwordStrength === "einfach"}>
                {isLoading ? "Wird registriert..." : "Registrieren"}
              </Button>
            </form>

            <div className="text-center text-sm">
              Bereits ein Konto?{" "}
              <Link href="/auth/login" className="text-primary hover:underline font-semibold">
                Anmelden
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

