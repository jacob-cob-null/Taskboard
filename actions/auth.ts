"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import type { Session } from "@supabase/supabase-js";

// Retrieve user attributes
export async function getUser() {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  return user;
}

// Extract all session data
export function extractSessionData(session: Session) {
  return {
    userId: session.user.id,
    email: session.user.email || "",
    fullName: session.user.user_metadata?.full_name || "",
    avatarUrl: session.user.user_metadata?.avatar_url || null,
    googleRefreshToken: session.provider_refresh_token || null,
  };
}

// Update Refresh token// actions/auth.ts
export async function updateUserProfile(
  userId: string,
  data: {
    email: string;
    fullName: string;
    avatarUrl: string | null;
    googleRefreshToken: string | null;
  }
) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("profiles")
      .update({
        email: data.email,
        full_name: data.fullName,
        avatar_url: data.avatarUrl,
        google_refresh_token: data.googleRefreshToken,
      })
      .eq("id", userId);

    if (error) return { success: false };
    return { success: true };
  } catch {
    return { success: false };
  }
}

// Verify if slug matches retrieved user id to be redirected
export async function verifyUserAccess(slug: string) {
  const { data } = await getUser();
  if (!data?.user) {
    redirect("/login");
  }
  const id = data.user.id;
  if (id !== slug) {
    redirect("/404");
  }
  return data.user;
}
