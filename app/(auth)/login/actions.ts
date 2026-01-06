"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function handleSignInWithGoogle() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      scopes: "https://www.googleapis.com/auth/calendar.app.created",
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
      redirectTo: `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/auth/callback`,
    },
  });

  if (error) throw error;

  if (data?.url) {
    redirect(data.url);
  }
}
