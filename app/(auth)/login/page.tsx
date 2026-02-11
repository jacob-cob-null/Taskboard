"use client";
import { useEffect, useRef } from "react";
import SignInBtn from "./components/SignInButton";
import Star15 from "./components/Star";
import { instrumentSerif, inter } from "@/app/fonts";
import { annotate } from "rough-notation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
export default function Page() {
  const emphasisRef = useRef<HTMLSpanElement>(null);

  // Underline effect
  useEffect(() => {
    if (emphasisRef.current) {
      const annotation = annotate(emphasisRef.current, {
        type: "underline",
        padding: -3,
        strokeWidth: 3,
        color: "#2563eb",
      });
      annotation.show();
    }
  }, []);

  return (
    <div className="bg-stone-50 w-full min-h-screen flex flex-col lg:grid lg:grid-cols-3 relative overflow-hidden">
      {/*Main Content*/}
      <div className="flex flex-col justify-between items-start gap-6 p-6 sm:p-8 lg:p-12 flex-1 lg:flex-none z-10">
        <div className="flex items-center justify-start gap-2 w-full">
          <Image
            src="/clipboard.png"
            width={24}
            height={24}
            alt="TaskBoard Logo"
            className="w-5 h-5 sm:w-6 sm:h-6 mb-1.5"
          />
          <h1
            className={`${instrumentSerif.className} text-lg sm:text-xl tracking-tight`}
          >
            TaskBoard
          </h1>
        </div>
        <div className="flex items-start justify-center flex-col w-full gap-4 lg:gap-6">
          <h1
            className={`${instrumentSerif.className} text-[65px] leading-14 sm:leading-none sm:text-5xl lg:leading-none lg:text-7xl font-medium sm:mb-6 mb-10`}
          >
            Where teams <br />
            get sh*t <span ref={emphasisRef}>done</span> .
          </h1>
          <div className="w-full sm:w-auto">
            <SignInBtn />
          </div>
          <p
            className={`${inter.className} text-[10px] sm:text-xs text-gray-500`}
          >
            By logging into TaskBoard, you agree to the{" "}
            <Link
              href="/terms"
              className="underline hover:text-blue-600 transition-colors"
            >
              Terms and Conditions
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline hover:text-blue-600 transition-colors"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
        <div className="flex w-full items-center justify-between">
          <p
            className={`${inter.className} text-[12px] sm:text-[16px] antialiased`}
          >
            @2026 Taskboard
          </p>
          <div className="flex gap-2">
            <Button size="sm" asChild>
              <Link href="/terms">Terms</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/privacy">Privacy</Link>
            </Button>
          </div>
        </div>
      </div>
      {/*Splash Image - bottom on mobile, right side on desktop */}
      <div className="bg-blue-500 h-28 sm:h-64 lg:h-auto lg:col-span-2 relative overflow-hidden">
        <Image
          src="/bg.svg"
          fill={true}
          alt="Background Doodle"
          className="object-cover mix-blend-multiply opacity-60 scale-105 grayscale"
          quality={75}
          priority
        />
      </div>
      {/* Star - hidden on mobile, center-left on desktop */}
      <div className="absolute hidden sm:block lg:block sm:bottom-72 lg:bottom-auto lg:right-auto lg:left-1/3 lg:top-1/2 transform lg:-translate-x-1/2 lg:-translate-y-1/2 z-20">
        <div className="relative animate-spin-slow">
          <div className="block sm:hidden">
            <Star15
              width={100}
              height={100}
              color="#2563eb"
              stroke="black"
              strokeWidth={3}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white font-bold animate-counter-spin">
              <span className={`${instrumentSerif.className} text-2xl`}>
                100%
              </span>
              <span className={`${instrumentSerif.className} text-sm`}>
                NO BS
              </span>
            </div>
          </div>
          <div className="hidden sm:block lg:hidden">
            <Star15
              width={140}
              height={140}
              color="#2563eb"
              stroke="black"
              strokeWidth={4}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white font-bold animate-counter-spin">
              <span className={`${instrumentSerif.className} text-4xl`}>
                100%
              </span>
              <span className={`${instrumentSerif.className} text-lg`}>
                NO BS
              </span>
            </div>
          </div>
          <div className="hidden lg:block">
            <Star15
              width={220}
              height={220}
              color="#2563eb"
              stroke="black"
              strokeWidth={4}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white font-bold animate-counter-spin">
              <span className={`${instrumentSerif.className} text-7xl`}>
                100%
              </span>
              <span className={`${instrumentSerif.className} text-2xl`}>
                NO BS
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
