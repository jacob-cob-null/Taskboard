"use client";
import { handleSignInWithGoogle, useRedirectLogin } from "./actions";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useState } from "react";
import Error_msg from "@/components/login/error_msg";

export default function Page() {
  const [showError, setShowError] = useState(false);
  const redirect = useRedirectLogin();

  // Handler
  const handleSuccess = async (response: CredentialResponse) => {
    try {
      const result = await handleSignInWithGoogle(response);

      // Redirect according to result
      if (result.user) {
        redirect();
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
