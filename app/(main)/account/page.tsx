import { supabaseServer } from "@/lib/supabase/supabaseServer";
import AccountSections from "./sections";

export default async function AccountPage() {
  const supabase = supabaseServer();

  // User abrufen
  const { data: userData, error: userError } = await supabase.auth.getUser();
  const user = userData?.user;

  if (userError || !user) {
    console.error("User konnte nicht abgerufen werden:", userError);
    return null;
  }

  // Profile abrufen
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("Profile konnte nicht abgerufen werden:", profileError);
  }

  // Parental Controls abrufen
  const { data: parentalControls, error: parentalError } = await supabase
    .from("parental_controls")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (parentalError) {
    console.error("Parental Controls konnten nicht abgerufen werden:", parentalError);
  }

  // Artist Account abrufen
  const { data: artistAccount, error: artistError } = await supabase
    .from("artist_accounts")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (artistError) {
    console.error("Artist Account konnte nicht abgerufen werden:", artistError);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-black p-6 text-white">
      <h1 className="text-4xl font-bold mb-8">Account</h1>
      <AccountSections
        user={user}
        profile={profile || null}
        parentalControls={parentalControls || null}
        hasArtistAccount={!!artistAccount}
      />
    </div>
  );
}

