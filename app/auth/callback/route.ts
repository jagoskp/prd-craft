import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/wizard";

  if (code) {
    const supabase = await createClient();
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data?.user) {
      const user = data.user;
      try {
        const adminSupabase = createAdminClient();

        // Check if user profile already exists
        const { data: profile, error: profileFetchError } = await adminSupabase
          .from("profiles")
          .select("id, credits")
          .eq("id", user.id)
          .single();

        if (profileFetchError || !profile) {
          // Initialize profile with 50 default credits
          const fullName =
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email?.split("@")[0] ||
            "Builder";

          await adminSupabase.from("profiles").upsert(
            {
              id: user.id,
              email: user.email,
              full_name: fullName,
              credits: 50,
            },
            { onConflict: "id" }
          );
        }
      } catch (err) {
        console.error("Error verifying or creating user profile:", err);
      }

      return NextResponse.redirect(`${requestUrl.origin}${next}`);
    }
  }

  // If code exchange failed or no code present, redirect to home
  return NextResponse.redirect(`${requestUrl.origin}/?auth_error=true`);
}
