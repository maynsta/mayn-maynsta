// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

// Supabase URL und Anon Key aus Umgebungsvariablen
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Prüfen, ob die Variablen gesetzt sind
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local");
}

// Supabase Client erstellen
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

