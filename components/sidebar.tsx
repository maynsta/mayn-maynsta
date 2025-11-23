"use client"

import { Home, Search, Library, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const pathname = usePathname()

  const routes = [
    {
      label: "Home",
      icon: Home,
      href: "/home",
      active: pathname === "/home",
    },
    {
      label: "Search",
      icon: Search,
      href: "/search",
      active: pathname === "/search",
    },
    {
      label: "Library",
      icon: Library,
      href: "/library",
      active: pathname === "/library",
    },
    {
      label: "Account",
      icon: User,
      href: "/account",
      active: pathname === "/account",
    },
  ]

  return (
    <div className="flex flex-col h-full bg-black w-[240px] p-2">
      <div className="flex flex-col gap-2 flex-1">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-x-3 text-sm font-medium px-4 py-3 rounded-md transition-colors hover:bg-neutral-800",
              route.active ? "text-white bg-neutral-800" : "text-neutral-400",
            )}
          >
            <route.icon className="h-5 w-5" />
            {route.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
