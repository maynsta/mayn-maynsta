// lib/supabase/server.ts
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function supabase) {
  // In Next.js 16 ist cookies() jetzt asynchron
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookie = (await cookieStore).get?.(name);
          return typeof cookie === "string" ? cookie : cookie?.value;
        },
        async set() {
          // No-op — Next.js 16 Server kann keine Cookies direkt setzen
        },
        async remove() {
          // No-op
        },
      },
    }
  );
}
