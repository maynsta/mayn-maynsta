import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="border-border/50">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold text-center">E-Mail bestätigen</CardTitle>
            <CardDescription className="text-center">Überprüfe dein Postfach</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-primary/10 p-4 text-sm text-primary">
              Wir haben dir eine E-Mail mit einem Bestätigungslink gesendet. Bitte klicke auf den Link, um dein Konto zu
              aktivieren.
            </div>
            <Link href="/auth/login">
              <Button variant="outline" className="w-full bg-transparent">
                Zur Anmeldung
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
