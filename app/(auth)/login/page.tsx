"use client";
import { useEffect, useRef } from "react";
import SignInBtn from "./components/SignInButton";
import Star15 from "./components/Star";
import { RiDashboardHorizontalFill } from "react-icons/ri";
import { instrumentSerif, inter } from "@/app/fonts";
import { annotate } from "rough-notation";

export default function Page() {
  const emphasisRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (emphasisRef.current) {
      const annotation = annotate(emphasisRef.current, {
        type: "underline",
        padding: 0,
        strokeWidth: 3,
        color: "#2563eb",
      });
      annotation.show();
    }
  }, []);

  return (
    <div className="bg-stone-50 w-full h-screen grid grid-cols-3 relative">
      <div className="flex flex-col justify-between items-start gap-3 p-12">
        <div className="flex items-center justify-start gap-3 w-full">
          <RiDashboardHorizontalFill className="text-2xl mb-0.5" />
          <h1
            className={`${inter.className}
            antialiased
            text-xl
            font-light`}
          >
            TaskBoard
          </h1>
        </div>
        <div className="flex flex-col">
          <h1
            className={`${instrumentSerif.className} text-7xl font-medium mb-18`}
          >
            Where teams <br></br>get sh*t <span ref={emphasisRef}>done</span> .
          </h1>
          <SignInBtn />
        </div>
        <div className="flex w-full justify-between">
          <h1 className={`${inter.className} text-[16px] antialiased`}>
            @ 2026 Taskboard{" "}
          </h1>
          <h1 className={`${inter.className} text-[16px] antialiased`}>
            About{" "}
          </h1>
        </div>
      </div>
      <div className="bg-blue-300 col-span-2"></div>
      <div className="absolute left-1/3 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="relative animate-spin-slow">
          <Star15
            width={200}
            height={200}
            color="#2563eb"
            stroke="black"
            strokeWidth={4}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white font-bold animate-counter-spin">
            <span className={`${instrumentSerif.className} text-6xl`}>
              100%
            </span>
            <span className={`${instrumentSerif.className} text-2xl`}>
              NO BS
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
