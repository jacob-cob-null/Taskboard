import React from "react";
import { useState } from "react";
import { handleSignInWithGoogle } from "@/app/(auth)/login/actions";
import { FcGoogle } from "react-icons/fc";

function SignInBtn() {
  // const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    await handleSignInWithGoogle();
    setIsLoading(false);
  };
  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className="px-4 py-2 bg-white outline-1 outline-slate-300 shadow-2xs text-black rounded flex items-center gap-4 justify-between"
    >
      <FcGoogle className="text-2xl" />
      <h1>Sign in with Google</h1>
    </button>
  );
}

export default SignInBtn;
