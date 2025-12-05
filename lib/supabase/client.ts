// lib/supabase/client.ts
import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase Client
 * - Kann sowohl server- als auch clientseitig importiert werden
 * - Session wird nicht automatisch im Local Storage gespeichert
 */
export const supabase: SupabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

