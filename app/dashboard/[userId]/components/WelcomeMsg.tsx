"use client";

import React from "react";
import { instrumentSerif, inter } from "@/app/fonts";
import Image from "next/image";

interface WelcomeMsgProps {
  name: string;
  avatarUrl: string;
  email: string;
}

function WelcomeMsg({ name, avatarUrl, email }: WelcomeMsgProps) {
  return (
    <div className="flex flex-col justify-start items-start">
      <h1 className={`${instrumentSerif.className} text-4xl sm:text-5xl`}>
        Welcome back, <span className="text-blue-600 italic">{name}</span>
      </h1>
      <div className="flex items-center w-fit justify-center gap-2 mt-3 px-3 py-1.5 bg-white rounded-full border border-gray-200 shadow-sm">
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
    </div>
  );
}

export default WelcomeMsg;
