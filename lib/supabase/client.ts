import { createClient } from "@supabase/supabase-js"

export const supabase = supabase
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
