// middleware.ts
import { updateSession } from "@/lib/supabase/middleware";
import type { NextRequest } from "next/server";

// Diese Middleware sorgt für Supabase Session Sync (Cookie <-> Local Storage)
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

// Nur auf "geschützten" Routen prüfen (z. B. /dashboard, /account)
export const config = {
  matcher: ["/dashboard/:path*", "/account/:path*"],
};
