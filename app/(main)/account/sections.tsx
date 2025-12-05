"use client"
import { supabase } from "@/lib/supabase";

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ProfileSection } from "@/components/profile-section"
import { ParentalControlsSection } from "@/components/parental-controls-section"
import { ArtistAccountSection } from "@/components/artist-account-section"

// 🔥 Lucide-Icons importieren
import { Settings, Baby, Palette } from "lucide-react"

export default function AccountSections({ user, profile, parentalControls, hasArtistAccount }: any) {
  const [activeSection, setActiveSection] = useState("settings")

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex gap-3 mb-6">
        {/* Einstellungen */}
        <Button
          variant={activeSection === "settings" ? "default" : "secondary"}
          onClick={() => setActiveSection("settings")}
          className="flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          {/* Optional: Text weglassen oder Tooltip verwenden */}
        </Button>

        {/* Jugendschutz */}
        <Button
          variant={activeSection === "jugendschutz" ? "default" : "secondary"}
          onClick={() => setActiveSection("jugendschutz")}
          className="flex items-center gap-2"
        >
          <Baby className="h-4 w-4" />
        </Button>

        {/* Künstlerkonto */}
        <Button
          variant={activeSection === "artist" ? "default" : "secondary"}
          onClick={() => setActiveSection("artist")}
          className="flex items-center gap-2"
        >
          <Palette className="h-4 w-4" />
        </Button>
      </div>

      {activeSection === "settings" && <ProfileSection user={user} profile={profile} />}
      {activeSection === "jugendschutz" && (
        <ParentalControlsSection userId={user.id} parentalControls={parentalControls} />
      )}
      {activeSection === "artist" && <ArtistAccountSection hasArtistAccount={hasArtistAccount} />}
    </div>
  )
}

