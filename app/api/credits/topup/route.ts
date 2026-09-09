import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  let body = { amount: 100 };
  try {
    body = await request.json();
  } catch {
    // Default 100 credits
  }

  const amount = Math.min(Math.max(body.amount || 100, 50), 1000);

  const adminSupabase = createAdminClient();
  const { data: profile } = await adminSupabase
    .from("profiles")
    .select("credits")
    .eq("id", user.id)
    .single();

  const currentCredits = profile?.credits ?? 0;
  const newCredits = currentCredits + amount;

  const { error: updateError } = await adminSupabase
    .from("profiles")
    .update({ credits: newCredits })
    .eq("id", user.id);

  if (updateError) {
    return NextResponse.json(
      { success: false, error: "Failed to top up credits" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    credits: newCredits,
    added: amount,
  });
}
