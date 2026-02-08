import "./globals.css";
import { inter, instrumentSerif } from "./fonts";
import { ToasterProvider } from "../components/ui/Toast";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Taskboard",
  description: "A collaborative task management application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable}`}>
      <body>
        <ToasterProvider />
        {children}
      </body>
    </html>
  );
}
