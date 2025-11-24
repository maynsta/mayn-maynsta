import type React from "react"
import { Sidebar } from "@/components/sidebar"
import { Player } from "@/components/player"

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col bg-black">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto pb-24">{children}</main>
      </div>
      <Player />
    </div>
  )
}
