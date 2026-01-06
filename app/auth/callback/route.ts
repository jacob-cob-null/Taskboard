import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { extractSessionData } from "@/utils/auth-helpers";

const EDGE_FUNCTION_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL + "/functions/v1/store-google-refresh";

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

  // Extract all session data
  const { userId, email, fullName, avatarUrl, googleRefreshToken } =
    extractSessionData(data.session);

  // Call Edge Function to securely store token
  try {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
      console.error("SUPABASE_SERVICE_ROLE_KEY not set");
      return NextResponse.redirect(`${origin}/auth/auth-code-error`);
    }

    const response = await fetch(EDGE_FUNCTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      body: JSON.stringify({
        user_id: userId,
        google_refresh_token: googleRefreshToken,
        email,
        full_name: fullName,
        avatar_url: avatarUrl,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Edge Function call failed:", errorData);
      return NextResponse.redirect(`${origin}/auth/auth-code-error`);
    }
  } catch (error) {
    console.error("Failed to call Edge Function:", error);
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
