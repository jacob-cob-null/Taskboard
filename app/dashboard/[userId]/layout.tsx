import Top_panel from "@/components/dashboard/top_panel";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen w-full grid grid-rows-[70px_1fr]">
      <div className="p-3">
        <Top_panel />
      </div>
      {children}
    </div>
  );
}
