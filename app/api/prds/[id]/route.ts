import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const adminSupabase = createAdminClient();

  const { data: prd, error } = await adminSupabase
    .from("prds")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !prd) {
    return NextResponse.json(
      { success: false, error: "PRD not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, prd });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

  const adminSupabase = createAdminClient();
  const { error } = await adminSupabase
    .from("prds")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete PRD" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
