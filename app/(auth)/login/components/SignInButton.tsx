import { useState } from "react";
import { handleSignInWithGoogle } from "../actions";
import { FcGoogle } from "react-icons/fc";
import { inter } from "@/app/fonts";
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
      className="px-8 py-4 w-full font-sans hover:bg-gray-50 active:bg-gray-100 bg-white outline-1 outline-slate-300 shadow-xs text-black rounded-xl flex items-center gap-4 justify-center"
    >
      <FcGoogle className="text-2xl" />
      <span className={`${inter.className}`}>Sign in with Google</span>
    </button>
  );
}

export default SignInBtn;
