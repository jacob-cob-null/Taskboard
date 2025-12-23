"use client";
import { CredentialResponse } from "@react-oauth/google";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
// Login with google
export async function handleSignInWithGoogle(response: CredentialResponse) {
  const supabase = createClient();

  if (!response.credential) {
    throw new Error("No credential provided");
  }

  // Get nonce from JWT for Google auth
  const parts = response.credential.split(".");
  const payload = JSON.parse(atob(parts[1]));
  const googleNonce = payload.nonce;

  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: "google",
    token: response.credential,
    nonce: googleNonce,
  });

  if (error) {
    console.error(`Something went wrong ${error.message}`);
    throw error;
  }

  return data;
}
// Redirect upon success
export function useRedirectLogin() {
  const router = useRouter();
  return () => router.push("/dashboard");
}
// Retrieve user attributes
export async function getUser() {
  const supabase = createClient();
  const user = await supabase.auth.getUser();
  return user.data;
}
