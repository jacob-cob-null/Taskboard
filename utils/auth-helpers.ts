import type { Session } from "@supabase/supabase-js";

// Extract all session data - this is a pure utility function, not a server action
export function extractSessionData(session: Session) {
  return {
    userId: session.user.id,
    email: session.user.email || "",
    fullName: session.user.user_metadata?.full_name || "",
    avatarUrl: session.user.user_metadata?.avatar_url || null,
    googleRefreshToken: session.provider_refresh_token || null,
  };
}
