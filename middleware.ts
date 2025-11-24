import { supabase } from "@/lib/supabase/middleware";
import type { NextRequest, NextResponse } from "next/server";

// Beispiel Middleware, nur Supabase Client exportiert
export function middleware(req: NextRequest) {
  return NextResponse.next();
}
