import "./globals.css";
import { inter, instrumentSerif } from "./fonts";
import { ToasterProvider } from "../components/ui/Toast";
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
