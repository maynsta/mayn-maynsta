mkdir -p lib/supabase
cat > lib/supabase/supabaseBrowser.ts << 'EOF'
import { createBrowserClient } from "@supabase/ssr"

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
EOF

