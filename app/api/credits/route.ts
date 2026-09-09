import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ authenticated: false, credits: 0 });
  }

  const adminSupabase = createAdminClient();
  let { data: profile } = await adminSupabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    const fullName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split("@")[0] ||
      "Builder";

    const { data: newProfile } = await adminSupabase
      .from("profiles")
      .upsert({
        id: user.id,
        email: user.email,
        full_name: fullName,
        credits: 50,
      })
      .select()
      .single();

    profile = newProfile;
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: user.id,
      email: user.email,
      full_name: profile?.full_name || user.user_metadata?.full_name || "Builder",
      avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture,
    },
    credits: profile?.credits ?? 50,
  });
}
