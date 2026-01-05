import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { extractSessionData, updateRefreshToken } from "@/actions/auth";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.session) {
    console.error("OAuth exchange failed:", error?.message);
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }
  // TODO:: Check for stale token and refresh

  // Extract all session data
  const { userId, email, fullName, avatarUrl, googleRefreshToken } =
    extractSessionData(data.session);

  // Update profile with all data
  if (googleRefreshToken) {
    const { success } = await updateRefreshToken(userId, googleRefreshToken);

    if (!success) {
      console.error("Profile update failed");
      return NextResponse.redirect(`${origin}/auth/auth-code-error`);
    }
  } else {
    console.warn("No Google refresh token received", { userId });
  }

  // Redirect to dashboard
  const forwardedHost = request.headers.get("x-forwarded-host");
  const isProduction = process.env.NODE_ENV === "production";
  const dashboardUrl = `/dashboard/${userId}`;

  if (isProduction && forwardedHost) {
    return NextResponse.redirect(`https://${forwardedHost}${dashboardUrl}`);
  }

  return NextResponse.redirect(`${origin}${dashboardUrl}`);
}
