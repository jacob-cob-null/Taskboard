"use client";

import { useEffect, useRef } from "react";
import { instrumentSerif, inter } from "@/app/fonts";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";
import { annotate } from "rough-notation";

interface TeamHeaderProps {
  teamName: string;
}

export function TeamHeader({ teamName }: TeamHeaderProps) {
  const teamNameRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (teamNameRef.current) {
      const isMobile = window.innerWidth < 640;
      const annotation = annotate(teamNameRef.current, {
        type: "underline",
        padding: -3,
        strokeWidth: isMobile ? 2 : 3,
        color: "#2563eb",
      });
      annotation.show();
    }
  }, []);

  return (
    <div className="flex flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
      <div>
        <h1
          className={`${instrumentSerif.className} font-bold text-2xl sm:text-5xl`}
        >
          Team{" "}
          <span ref={teamNameRef} className="text-blue-600 italic">
            {teamName}
          </span>
        </h1>
      </div>
      <Button asChild size="sm">
        <Link href={`/dashboard`}>
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <p className={`${inter.className} hidden sm:block`}>Back</p>
        </Link>
      </Button>
    </div>
  );
}
