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
      const isMobile = window.innerWidth < 640;
      const annotation = annotate(nameRef.current, {
        type: "underline",
        padding: -3,
        strokeWidth: isMobile ? 2 : 3,
        color: "#2563eb",
      });
      annotation.show();
    }
  }, []);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="flex flex-col gap-2 sm:gap-4">
      <h1 className={`${instrumentSerif.className} text-2xl sm:text-5xl`}>
        Welcome back,{" "}
        <span ref={nameRef} className="text-blue-600 italic">
          {name}
        </span>
      </h1>
      <div className="flex flex-row justify-between items-center gap-2 sm:gap-3">
        <div className="flex items-center w-fit justify-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-white rounded-full border border-gray-200 shadow-sm">
          <Image
            src={avatarUrl}
            alt={`Profile of ${name}`}
            width={23}
            height={23}
            className="rounded-full sm:w-6 sm:h-6"
          />
          <span className={`${inter.className} text-xs sm:text-sm text-gray-600`}>
            {email}
          </span>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-base text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Log Out</span>
        </button>
      </div>
    </div>
  );
}

export default WelcomeMsg;
