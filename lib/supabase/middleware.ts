import { createClient } from "@supabase/supabase-js";

// Supabase-Client für Browser oder Client-seitige Nutzung
export const supabaseBrowser = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: false, // Sitzung wird nicht automatisch im Local Storage gespeichert
    },
  }
);

