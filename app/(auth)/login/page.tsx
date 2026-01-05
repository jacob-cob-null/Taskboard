"use client";
import { handleSignInWithGoogle } from "./actions";
import Error_msg from "@/components/login/error_msg";
import { useState } from "react";

export default function Page() {
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    try {
      setIsLoading(true);
      await handleSignInWithGoogle();
    } catch (error) {
      console.error("Auth error:", error);
      setShowError(true);
      setIsLoading(false);
    }
  };

  return (
    <>
      {showError && <Error_msg onClose={() => setShowError(false)} />}
      <button
        onClick={handleClick}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {isLoading ? "Signing in..." : "Sign in with Google"}
      </button>
    </>
  );
}
