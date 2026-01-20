import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { extractSessionData } from "@/utils/auth-helpers";

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

  // Store user data directly using Prisma
  try {
    // Dynamic import to avoid type issues if prisma isn't set up for edge runtime
    // defaulting to node runtime for this route is safer with prisma
    const prisma = (await import("@/utils/prisma/prisma")).default;

    await prisma.profiles.upsert({
      where: { id: userId },
      update: {
        email,
        full_name: fullName,
        avatar_url: avatarUrl,
        // Only update refresh token if we got a new one
        ...(googleRefreshToken && { google_refresh_token: googleRefreshToken }),
      },
      create: {
        id: userId,
        email,
        full_name: fullName,
        avatar_url: avatarUrl,
        google_refresh_token: googleRefreshToken,
      },
    });
  } catch (error) {
    console.error("Failed to update profile:", error);
    // Continue even if profile update fails, user is signed in
  }

  // Failed refresh of token, limited calendar privilege
  if (!googleRefreshToken) {
    console.warn(
      "No Google refresh token received - calendar features limited",
      { userId },
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
