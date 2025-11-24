"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase/supabaseBrowser"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function ProfileSection({ user, profile }: { user: any; profile: any }) {
  const [fullName, setFullName] = useState(profile?.full_name || "")
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  // 🔒 Dateinamen bereinigen
  const sanitizeFileName = (name: string) => {
    return name.replace(/[^a-zA-Z0-9._-]/g, "_")
  }

  // 📸 Profilbild-Upload
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const fileName = sanitizeFileName(file.name)
      const filePath = `avatars/${user.id}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true })

      if (uploadError) {
        setMessage("Fehler beim Hochladen des Profilbildes")
        console.error("Supabase Upload Error:", uploadError)
        return
      }

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath)
      setAvatarUrl(data.publicUrl)
      setMessage("Profilbild erfolgreich hochgeladen!")
    } catch (err: any) {
      setMessage("Fehler beim Hochladen des Profilbildes")
      console.error("Upload Exception:", err)
    }
  }

  // 💾 Profil speichern (Name + Avatar)
  const handleSave = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("profiles")
        .upsert(
          { 
            id: user.id,
            full_name: fullName,
            avatar_url: avatarUrl
          },
          { onConflict: "id" } // Wenn Profil existiert, update es
        )

      if (error) {
        setMessage("Fehler beim Speichern")
        console.error("Supabase Save Error:", error)
        console.log("Supabase Save Response:", data)
      } else {
        setMessage("Profil gespeichert!")
      }
    } catch (err: any) {
      setMessage("Fehler beim Speichern")
      console.error("Save Exception:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-neutral-800 rounded-xl p-6 space-y-4">
      <h2 className="text-xl font-semibold text-white">Profil</h2>

      <div className="flex items-center space-x-4">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Avatar"
            className="w-20 h-20 rounded-full object-cover"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-neutral-700" />
        )}
        <div>
          <input type="file" accept="image/*" onChange={handleAvatarUpload} />
        </div>
      </div>

      <div>
        <label className="text-white text-sm">Name</label>
        <Input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="mt-1 bg-neutral-900 text-white border-neutral-700"
        />
      </div>

      <Button onClick={handleSave} disabled={loading}>
        {loading ? "Speichern..." : "Speichern"}
      </Button>

      {message && <p className="text-sm text-neutral-400 mt-2">{message}</p>}
    </div>
  )
}

