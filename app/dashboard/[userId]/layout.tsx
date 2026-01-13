import SignOutBtn from "./components/SignOutBtn";
export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-stone-50 p-20">
      {/* <SignOutBtn /> */}
      {children}
    </div>
  );
}
