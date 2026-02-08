"use client";

import { useEffect, useRef } from "react";
import { instrumentSerif, inter } from "@/app/fonts";
import Image from "next/image";
import { signOut } from "@/actions/auth";
import { LogOut } from "lucide-react";
import { annotate } from "rough-notation";

interface WelcomeMsgProps {
  name: string;
  avatarUrl: string;
  email: string;
}

function WelcomeMsg({ name, avatarUrl, email }: WelcomeMsgProps) {
  const nameRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (nameRef.current) {
      const annotation = annotate(nameRef.current, {
        type: "underline",
        padding: -3,
        strokeWidth: 3,
        color: "#2563eb",
      });
      annotation.show();
    }
  }, []);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className={`${instrumentSerif.className} text-4xl sm:text-5xl`}>
        Welcome back,{" "}
        <span ref={nameRef} className="text-blue-600 italic">
          {name}
        </span>
      </h1>
      <div className="flex flex-row justify-between items-center gap-3">
        <div className="flex items-center w-fit justify-center gap-2 px-3 py-1.5 bg-white rounded-full border border-gray-200 shadow-sm">
          <Image
            src={avatarUrl}
            alt={`Profile of ${name}`}
            width={24}
            height={24}
            className="rounded-full"
          />
          <span className={`${inter.className} text-sm text-gray-600`}>
            {email}
          </span>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Log Out</span>
        </button>
      </div>
    </div>
  );
}

export default WelcomeMsg;
