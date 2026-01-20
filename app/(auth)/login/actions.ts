"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

// Google Account sign in
export async function handleSignInWithGoogle() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      scopes: "https://www.googleapis.com/auth/calendar",
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
// SIgn out
export async function signOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (!error) {
    redirect("/login");
  } else {
    console.error("Error signing out" + error?.cause);
  }
}
