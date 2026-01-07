"use client";
import Top_panel from "./components/top_panel";
import NewMember from "./components/new_member";
import { signOut } from "@/app/(auth)/login/actions";
export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen w-full grid grid-rows-[70px_1fr]">
      <div className="p-3">
        <NewMember />
        <Top_panel />
        <button
          onClick={() => signOut()}
          className="h-fit w-fit p-1 px-2 m-5 bg-red-100 justify-center items-center"
        >
          Sign Out
        </button>
        {children}
      </div>
    </div>
  );
}
