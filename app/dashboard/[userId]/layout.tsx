import SignOutBtn from "./components/SignOutBtn";
export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-stone-50 overflow-hidden">
      {/* <SignOutBtn /> */}
      {children}
    </div>
  );
}
