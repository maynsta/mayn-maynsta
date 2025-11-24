import { supabaseServer } from "@/lib/supabase/supabaseServer"
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data, error } = await supabaseServer().from("library").insert(body);
  if (error) return NextResponse.json({ error }, { status: 400 });
  return NextResponse.json({ data });
}
