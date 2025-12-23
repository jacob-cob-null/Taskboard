"use client";
import { handleSignInWithGoogle } from "./actions";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useState } from "react";
import Error_msg from "@/components/login/error_msg";
import { getUser } from "@/actions/auth";
import { useRouter } from "next/navigation";

export default function Page() {
  const [showError, setShowError] = useState(false);
  const router = useRouter();
  // Handler
  const handleSuccess = async (response: CredentialResponse) => {
    try {
      const result = await handleSignInWithGoogle(response);

      // Redirect according to result
      if (result.user) {
        const { data, error } = await getUser();

        if (error || !data?.user) {
          return;
        }
        router.push(`/dashboard/${data.user.id}`);
      }
    } catch (error) {
      setShowError(true);
    }
  };

  return (
    <>
      {showError && <Error_msg onClose={() => setShowError(false)} />}
      <GoogleLogin onSuccess={handleSuccess} />
    </>
  );
}
