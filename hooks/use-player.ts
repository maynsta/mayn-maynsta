import { create } from "zustand"

interface Song {
  id: string
  title: string
  audio_url: string
  duration?: number
}

interface PlayerState {
  currentSong?: Song
  setSong: (song: Song) => void
}

export const usePlayer = create<PlayerState>((set) => ({
  currentSong: undefined,
  setSong: (song) => set({ currentSong: song }),
}))

