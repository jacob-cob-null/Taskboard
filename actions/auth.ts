"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

// Retrieve user attributes
export async function getUser() {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  return user;
}

// Verify if user is authenticated
export async function requireAuth() {
  const { data } = await getUser();
  if (!data?.user) {
    redirect("/login");
  }
  return data.user;
}
// Sign out
export async function signOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (!error) {
    redirect("/login");
  } else {
    console.error("Error signing out" + error?.cause);
  }
}
