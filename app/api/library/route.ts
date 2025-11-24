import { NextRequest, NextResponse } from "next/server";


const supabase = supabase
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name } = body;

  const { data, error } = await supabase
    .from("playlists") // Tabelle, wo Library gespeichert wird
    .insert([{ name, user_id: "81b1d427-6ff4-4a6b-8c7b-8dd0dcd726d0" }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}

