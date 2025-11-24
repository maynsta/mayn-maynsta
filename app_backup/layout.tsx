import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

// 🧩 Toast Provider importieren
import { Toaster } from "sonner"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Maynsta",
  description: "Deine Musik-Streaming-App",
  generator: "maynsta",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de" className="light">
      <body className={`font-sans antialiased bg-black text-white`}>
        {/* App-Inhalt */}
        {children}

        {/* 🔹 Globale Komponenten */}
        <Analytics />

        {/* 🔹 Toast-Komponente für Banner / Meldungen */}
        <Toaster
          position="bottom-center"
          theme="dark"
          expand
          toastOptions={{
            style: {
              background: "#18181b",
              color: "white",
              border: "1px solid #27272a",
              borderRadius: "0.5rem",
            },
          }}
        />
      </body>
    </html>
  )
}

