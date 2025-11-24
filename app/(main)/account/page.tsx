import { supabaseServer } from "@/lib/supabase/supabaseServer"
import AccountSections from "./sections"

export default async function AccountPage() {
  const supabase = supabaseServer()

  // User abrufen
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Profile abrufen
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  // Parental Controls abrufen
  const { data: parentalControls } = await supabase
    .from("parental_controls")
    .select("*")
    .eq("user_id", user.id)
    .single()

  // Artist Account abrufen
  const { data: artistAccount } = await supabase
    .from("artist_accounts")
    .select("id")
    .eq("user_id", user.id)
    .single()

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-black p-6 text-white">
      <h1 className="text-4xl font-bold mb-8">Account</h1>
      <AccountSections
        user={user}
        profile={profile}
        parentalControls={parentalControls}
        hasArtistAccount={!!artistAccount}
      />
    </div>
  )
}

