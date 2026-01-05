import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { extractSessionData, updateUserProfile } from "@/actions/auth";

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

  // Extract all session data and update
  const { userId, email, fullName, avatarUrl, googleRefreshToken } =
    extractSessionData(data.session);

  const credentials = { email, fullName, avatarUrl, googleRefreshToken };
  const { success } = await updateUserProfile(userId, credentials);

  // Failed update
  if (!success) {
    console.error("Profile update failed", { userId });
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  // Failed refresh of token, limited calendar privilege
  if (!googleRefreshToken) {
    console.warn(
      "No Google refresh token received - calendar features limited",
      { userId }
    );
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
