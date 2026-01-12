"use client";
import { signOut } from "@/actions/auth";
function SignOutBtn() {
  return (
    <button
      onClick={() => signOut()}
      className="h-fit w-fit p-1 px-2 m-5 bg-red-100 justify-center items-center"
    >
      Sign Out
    </button>
  );
}

export default SignOutBtn;
