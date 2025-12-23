"use server";

import { createClient } from "@/utils/supabase/server";

// Retrieve user attributes
export async function getUser() {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  return user;
}
