"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
// Retrieve user attributes
export async function getUser() {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  return user;
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
