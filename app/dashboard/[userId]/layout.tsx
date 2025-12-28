import Top_panel from "@/components/dashboard/top_panel";
import NewMember from "@/components/teams/button";
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
      </div>
      {children}
    </div>
  );
}
