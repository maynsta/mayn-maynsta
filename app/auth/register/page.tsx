"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

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
    if (pwd.length === 8 && !hasNumber && !hasSpecial && !hasUpper) return "mittel"
    return "stark"
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = supabase)
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
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/home`,
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
    const supabase = supabase)
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/home`,
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
            <Button
              type="button"
              variant="outline"
              className="w-full bg-transparent"
              onClick={handleGoogleRegister}
              disabled={isLoading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Mit Google registrieren
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Oder</span>
              </div>
            </div>

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
    className="bg-secondary pr-10" // Platz für das Auge
  />
  {/* Auge-Button */}
  <button
    type="button"
    onClick={() => setShowPassword((s) => !s)}
    aria-label={showPassword ? "Passwort verbergen" : "Passwort anzeigen"}
    className={`absolute right-3 top-[60%] -translate-y-1/2 inline-flex items-center justify-center p-1 rounded focus:outline-none 
      ${showPassword ? "text-blue-500" : "text-gray-400"}`}
  >
    {/* Wenn sichtbar: normales Auge (blau). Wenn versteckt: durchgestrichenes Auge (grau). */}
    {showPassword ? (
      // Eye (visible)
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ) : (
      // Eye Off (crossed)
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.962 9.962 0 012.223-3.638M6.6 6.6A9.955 9.955 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.05 10.05 0 01-1.326 2.59M3 3l18 18" />
      </svg>
    )}
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
    {showConfirmPassword ? (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.962 9.962 0 012.223-3.638M6.6 6.6A9.955 9.955 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.05 10.05 0 01-1.326 2.59M3 3l18 18" />
      </svg>
    )}
  </button>
</div>


              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || passwordStrength === "einfach"}
              >
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

