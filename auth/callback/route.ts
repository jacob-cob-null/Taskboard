import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.session) {
      // Extract the Google provider refresh token
      const googleRefreshToken = data.session.provider_refresh_token;
      const userId = data.session.user.id;

      // Save the Google refresh token to profiles table for offline calendar access
      if (googleRefreshToken) {
        await supabase
          .from("profiles")
          .update({ google_refresh_token: googleRefreshToken })
          .eq("id", userId);
      }

      // Redirect to dashboard
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";
      const dashboardUrl = `/dashboard/${userId}`;

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${dashboardUrl}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${dashboardUrl}`);
      } else {
        return NextResponse.redirect(`${origin}${dashboardUrl}`);
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
