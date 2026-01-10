import TopPanel from "./components/TopPanel";
import NewMember from "./components/NewMember";
import SignOutBtn from "./components/SignOutBtn";
export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen w-full grid grid-rows-[70px_1fr]">
      <div className="p-3">
        <NewMember />
        <TopPanel />
        <SignOutBtn />
        {children}
      </div>
    </div>
  );
}
