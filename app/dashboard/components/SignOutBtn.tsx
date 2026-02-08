"use client";
import { signOut } from "@/actions/auth";
import { LuDoorOpen } from "react-icons/lu";
function SignOutBtn() {
  return (
    <button
      onClick={() => signOut()}
      className="h-fit w-fit flex justify-center items-center pointer-fine:"
    >
      <LuDoorOpen />
    </button>
  );
}

export default SignOutBtn;
