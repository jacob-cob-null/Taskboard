import { google } from "googleapis";

/**
 * Initializes and returns a Google OAuth2 client with project configurations.
 */
export function getOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    process.env.SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
  );
}
