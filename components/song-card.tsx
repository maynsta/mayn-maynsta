// app/components/song-card.tsx
import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase";

interface SongCardProps {
  title: string
  artist?: string
  imageUrl?: string
  audio?: string   // <-- hinzufügen
}

export function SongCard({ title, artist, imageUrl, audio }: SongCardProps) {
  // Du kannst audio z.B. für einen Player-Button oder onClick verwenden
  return (
    <div className="group relative bg-neutral-900/40 hover:bg-neutral-800/40 rounded-md p-4 transition cursor-pointer">
      <div className="relative aspect-square mb-4 rounded-md overflow-hidden bg-neutral-800">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="object-cover w-full h-full" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-16 h-16 text-neutral-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </div>
        )}
        {/* Hier kannst du optional einen Play-Button mit audio implementieren */}
      </div>
      <div>
        <p className="font-semibold text-white truncate mb-1">{title}</p>
        {artist && <p className="text-sm text-neutral-400 truncate">{artist}</p>}
      </div>
    </div>
  )
}


